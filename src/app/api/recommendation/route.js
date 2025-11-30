// src/app/api/recommendation/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

/**
 * Helper: parse range like "6.0 - 7.5" or "6.0–7.5" or "6 - 7"
 * Returns { low: number, high: number } or null
 */
function parseRange(str) {
  if (!str && str !== 0) return null;
  const s = String(str).replace(/\u2013|\u2014/g, "-"); // normalize dashes
  const parts = s.split("-").map((p) => p && p.trim());
  if (parts.length >= 2) {
    const low = parseFloat(parts[0]);
    const high = parseFloat(parts[1]);
    if (!Number.isNaN(low) && !Number.isNaN(high)) return { low, high };
  }
  return null;
}

/**
 * Find header key by matching substrings (case-insensitive)
 */
function findKey(obj, candidates) {
  const keys = Object.keys(obj || {});
  const lower = keys.map((k) => k.toLowerCase());
  for (const cand of candidates) {
    const t = cand.toLowerCase();
    const idx = lower.findIndex((k) => k.includes(t));
    if (idx !== -1) return keys[idx];
  }
  return null;
}

/**
 * Adjust NPK values using simple, explainable rules:
 * - If pH is lower than optimal.low => increase N by 10% and P by 5%
 * - If pH is higher than optimal.high => decrease N by 10%
 * - If moisture lower than optimal.low => increase N by 5%
 * - If moisture higher than optimal.high => decrease N by 5%
 * (These rules are conservative and illustrative — adapt for agronomic accuracy)
 */
function computeAdjusted(baseN, baseP, baseK, latest, optimal) {
  let N = Number(baseN) || 0;
  let P = Number(baseP) || 0;
  let K = Number(baseK) || 0;

  const ph =
    latest.ph != null
      ? Number(String(latest.ph).replace(/[^\d.-]/g, ""))
      : null;
  const moisture =
    latest.moisture != null
      ? Number(String(latest.moisture).replace(/[^\d.-]/g, ""))
      : null;

  // apply pH adjustments
  if (ph != null && optimal && optimal.ph) {
    if (ph < optimal.ph.low) {
      N *= 1.1; // +10%
      P *= 1.05; // +5%
    } else if (ph > optimal.ph.high) {
      N *= 0.9; // -10%
    }
  }

  // apply moisture adjustments
  if (moisture != null && optimal && optimal.moisture) {
    if (moisture < optimal.moisture.low) {
      N *= 1.05; // +5% when dry
    } else if (moisture > optimal.moisture.high) {
      N *= 0.95; // -5% when very wet
    }
  }

  // round to sensible integer (kg/ha)
  return {
    n: Math.round(N),
    p: Math.round(P),
    k: Math.round(K),
    adjustments: {
      ph,
      moisture,
    },
  };
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const cropQuery = (body.crop || "").trim();
    const stage = (body.stage || "").trim();
    const latest = body.readings || {}; // expected: { ph, moisture, temperature, ... }

    if (!cropQuery) {
      return NextResponse.json(
        { error: "missing crop in request" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "public", "data", "crops.xlsx");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "crops.xlsx not found" },
        { status: 404 }
      );
    }

    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: "buffer" });

    if (!workbook?.SheetNames || workbook.SheetNames.length === 0) {
      return NextResponse.json(
        { error: "no sheets found in workbook" },
        { status: 500 }
      );
    }

    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    // parse sheet rows as objects by header row
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: "no crop rows found in workbook" },
        { status: 500 }
      );
    }

    // find the row for this crop (case-insensitive match on crop name)
    const row = rows.find((r) => {
      // try common header keys for crop name
      const cropKey = findKey(r, ["crop name", "crop", "name", "crop_name"]);
      if (!cropKey) return false;
      const val = String(r[cropKey] ?? "")
        .trim()
        .toLowerCase();
      return val === cropQuery.trim().toLowerCase();
    });

    if (!row) {
      return NextResponse.json(
        { error: "crop not found in Excel" },
        { status: 404 }
      );
    }

    // locate N,P,K columns by common candidate headers
    const nKey = findKey(row, [
      "n (kg/ha)",
      "n (kg/ha)",
      "n(kg/ha)",
      "n",
      "nitrogen",
    ]);
    const pKey = findKey(row, [
      "p (kg/ha)",
      "p (kg/ha)",
      "p(kg/ha)",
      "p",
      "phosphorus",
    ]);
    const kKey = findKey(row, ["k (kg/ha)", "k(kg/ha)", "k", "potassium"]);

    const baseN = nKey ? row[nKey] : null;
    const baseP = pKey ? row[pKey] : null;
    const baseK = kKey ? row[kKey] : null;

    // parse optimal temp, moisture, ph from sheet
    const tempKey = findKey(row, [
      "temperature range",
      "temperature range (in °c)",
      "temperature",
      "opt temp",
      "optimal temp",
    ]);
    const optTempKey = findKey(row, [
      "optimal temp",
      "optimal temperature",
      "optimal temp range",
    ]);
    const moistureKey = findKey(row, [
      "soil moisture",
      "soil moisture (in %)",
      "moisture",
    ]);
    const phKey = findKey(row, ["soil ph", "soil ph", "ph"]);

    const opt = {
      ph: parseRange(row[phKey]),
      moisture: parseRange(row[moistureKey]),
      temperature: parseRange(row[tempKey] || row[optTempKey]),
    };

    // compute adjusted recommendation
    const adjusted = computeAdjusted(baseN, baseP, baseK, latest, opt);

    const response = {
      crop: cropQuery,
      stage: stage || null,
      base: {
        n: baseN,
        p: baseP,
        k: baseK,
      },
      optimal: opt,
      adjusted,
      note: "Values are adjusted conservatively using sensor pH and soil moisture relative to optimal ranges from the crop sheet. Tune algorithm for local agronomy.",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("API /api/recommendation error:", err);
    return NextResponse.json(
      { error: "failed to compute recommendation", details: String(err) },
      { status: 500 }
    );
  }
}
