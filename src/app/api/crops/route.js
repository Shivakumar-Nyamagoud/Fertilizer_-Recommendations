// src/app/api/crops/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

export async function GET() {
  try {
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
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const names = [];
    let startIndex = 0;
    if (rows.length > 0 && rows[0] && rows[0].length > 0) {
      const headerCell = String(rows[0][0] ?? "").trim();
      if (/^(name|crop|crop name|crop_name)$/i.test(headerCell)) {
        startIndex = 1;
      }
    }

    for (let i = startIndex; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length === 0) continue;
      const cell = String(r[0] ?? "").trim();
      if (cell) names.push(cell);
    }

    const unique = Array.from(new Set(names))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    return NextResponse.json({ crops: unique }, { status: 200 });
  } catch (err) {
    console.error("API /api/crops error:", err);
    return NextResponse.json(
      { error: "failed to read crops", details: String(err) },
      { status: 500 }
    );
  }
}
