// src/app/recommendations/page.js
"use client";

import { useEffect, useState } from "react";
import GradientButton from "../../components/ui/GradientButton";
import PlantSearchInput from "../../components/ui/PlantSearchInput";
import PlantStageSelect from "../../components/ui/PlantStageSelect";
import RealtimeReadingsCard from "../../components/ui/RealtimeReadingsCard";
import { rtdb } from "@/lib/firebaseClient";
import { ref, onValue } from "firebase/database";

const STAGE_OPTIONS = [
  { value: "", label: "Select" },
  { value: "seedling", label: "Seedling" },
  { value: "vegetative", label: "Vegetative" },
  { value: "flowering", label: "Flowering" },
  { value: "fruiting", label: "Fruiting" },
];

export default function RecommendationsPage() {
  const [crop, setCrop] = useState("");
  const [stage, setStage] = useState("");

  // latest sensor readings (keeps stable default shape for SSR)
  const [readings, setReadings] = useState({
    ph: "--",
    humidity: "--",
    soilMoisture: "--",
    tds: "--",
    temperature: "--",
    date: "--",
    time: "--",
  });

  const [lastSeenMs, setLastSeenMs] = useState(null);
  const [sensorOnline, setSensorOnline] = useState(false);

  // recommendation state
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // subscribe to RTDB sensorData node and pick latest child
  useEffect(() => {
    const sensorRef = ref(rtdb, "sensorData");
    const unsub = onValue(
      sensorRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setReadings({
            ph: "--",
            humidity: "--",
            soilMoisture: "--",
            tds: "--",
            temperature: "--",
            date: "--",
            time: "--",
          });
          setLastSeenMs(null);
          return;
        }

        let latest = data;
        if (typeof data === "object" && !Array.isArray(data)) {
          const keys = Object.keys(data);
          const lastKey = keys[keys.length - 1];
          latest = data[lastKey] ?? data;
        }

        const phVal = latest.ph ?? latest.pH ?? "--";
        const humidityVal = latest.humidity ?? latest.hum ?? "--";
        const soilMoistureVal =
          latest["soil-moisture"] ?? latest.soilMoisture ?? latest.soil ?? "--";
        const tdsVal = latest.tds ?? latest.TDS ?? "--";
        const tempVal = latest.temperature ?? latest.temp ?? "--";
        const dateVal = latest.date ?? latest.dateString ?? "--";
        const timeVal = latest.time ?? latest.timestampString ?? "--";

        setReadings({
          ph: String(phVal),
          humidity: String(humidityVal),
          soilMoisture: String(soilMoistureVal),
          tds: String(tdsVal),
          temperature: String(tempVal),
          date: String(dateVal),
          time: String(timeVal),
        });

        // set lastSeenMs from timestamp fields if present, otherwise now
        const tstamp =
          latest.timestamp ?? latest.updatedAt ?? latest.ts ?? null;
        if (tstamp) {
          const t = Number(tstamp);
          const dateObj = t > 1e12 ? new Date(t) : new Date(t * 1000);
          setLastSeenMs(dateObj.getTime());
        } else {
          setLastSeenMs(Date.now());
        }
      },
      (err) => {
        console.error("RTDB read error:", err);
      }
    );

    return () => unsub && typeof unsub === "function" && unsub();
  }, []);

  // compute sensorOnline from lastSeenMs
  useEffect(() => {
    const CHECK_INTERVAL = 2000;
    const OFFLINE_THRESHOLD = 15 * 1000; // 15s

    const id = setInterval(() => {
      if (!lastSeenMs) {
        setSensorOnline(false);
        return;
      }
      setSensorOnline(Date.now() - lastSeenMs <= OFFLINE_THRESHOLD);
    }, CHECK_INTERVAL);

    return () => clearInterval(id);
  }, [lastSeenMs]);

  async function handleGetRecommendations() {
    setLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const payload = {
        crop,
        stage,
        readings: {
          // normalise names expected by API
          ph: readings.ph,
          moisture:
            readings.humidity !== "--"
              ? readings.humidity
              : readings.soilMoisture,
          temperature: readings.temperature,
        },
      };

      const res = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to fetch recommendation");
      }

      const json = await res.json();
      setRecommendation(json);
    } catch (e) {
      console.error("Recommendation error:", e);
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  // deterministic secondary button classes
  const secondaryBtnClasses =
    "rounded-full px-6 py-3 text-sm sm:text-base font-medium border border-emerald-200/70 text-emerald-50 bg-white/5 hover:bg-white/10 transition-colors";

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 flex justify-center bg-gradient-to-b from-[#02301b] via-[#044625] to-green-200 ">
      <div className="w-full max-w-6xl space-y-10">
        {/* Top controls – single line */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 px-6 py-5 shadow-lg">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_auto] items-end">
            <PlantSearchInput
              value={crop}
              onChange={setCrop}
              onBack={() => {}}
              onClear={() => setCrop("")}
            />

            <PlantStageSelect
              value={stage}
              onChange={setStage}
              options={STAGE_OPTIONS}
            />

            <GradientButton
              onClick={handleGetRecommendations}
              disabled={loading || !crop}
              className="px-8 py-3 text-sm sm:text-base whitespace-nowrap bg-gradient-to-r from-emerald-500 to-green-500"
            >
              {loading ? "Calculating..." : "Get Recommendations"}
            </GradientButton>
          </div>
        </div>

        {/* Middle row – realtime + actions */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_auto] items-start">
          <div className="flex flex-col gap-4">
            <RealtimeReadingsCard
              readings={readings}
              lastUpdated={
                lastSeenMs ? new Date(lastSeenMs).toLocaleString() : null
              }
            />

            <div className="flex gap-3 items-center">
              <button
                className={secondaryBtnClasses}
                onClick={() => {
                  // allow quick refresh of recommendation UI when user wants to re-run
                  handleGetRecommendations();
                }}
              >
                Recalculate
              </button>

              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  sensorOnline
                    ? "bg-emerald-700/10 text-emerald-200"
                    : "bg-red-600/10 text-red-200"
                }`}
              >
                {sensorOnline ? "Live" : "Offline"}
                <span
                  className={`h-2 w-2 rounded-full ${
                    sensorOnline ? "bg-lime-300" : "bg-red-400"
                  }`}
                />
                <span className="ml-2 text-[11px] text-emerald-100/80">
                  {sensorOnline
                    ? `Last seen ${
                        lastSeenMs
                          ? new Date(lastSeenMs).toLocaleTimeString()
                          : "—"
                      }`
                    : lastSeenMs
                    ? `Last: ${new Date(lastSeenMs).toLocaleString()}`
                    : "No data"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <GradientButton
              disabled
              className="px-8 py-3 text-sm bg-gradient-to-r from-emerald-300 to-green-300 opacity-70 cursor-not-allowed"
            >
              Add To Dashboard
            </GradientButton>
            <p className="text-xs text-green-50 max-w-[220px] text-center">
              Soon you will be able to pin this crop&apos;s recommendations to a
              personalized dashboard.
            </p>
          </div>
        </div>

        {/* Recommendation panel */}
        <div className="w-full max-w-3xl bg-white/95 rounded-3xl shadow-2xl px-6 sm:px-8 py-6 space-y-4 border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-800">
            Recommendation Summary
          </h2>

          {!recommendation ? (
            <p className="text-gray-600 text-sm sm:text-base">
              Select a crop and plant stage above, then click{" "}
              <span className="font-semibold text-green-700">
                Get Recommendations
              </span>{" "}
              to view fertilizer suggestions based on your realtime sensor
              readings.
            </p>
          ) : (
            <>
              <p className="text-gray-700 text-sm sm:text-base text-bold">
                Recommended NPK dose for{" "}
                <span className="font-semibold text-green-700">
                  {recommendation.crop}
                </span>{" "}
                at{" "}
                <span className="font-semibold text-green-700">
                  {STAGE_OPTIONS.find((s) => s.value === stage)?.label}
                </span>{" "}
                stage:
              </p>

              <div className="grid sm:grid-cols-3 gap-4 text-sm sm:text-base">
                <div className="rounded-2xl bg-[#ecfff4] px-4 py-3">
                  <p className="text-xs text-gray-500">Nitrogen (N)</p>
                  <p className="font-semibold text-green-800 mt-1">
                    {recommendation.adjusted?.n ??
                      recommendation.base?.n ??
                      "—"}{" "}
                    kg/ha
                  </p>
                </div>
                <div className="rounded-2xl bg-[#ecfff4] px-4 py-3">
                  <p className="text-xs text-gray-500">Phosphorus (P)</p>
                  <p className="font-semibold text-green-800 mt-1">
                    {recommendation.adjusted?.p ??
                      recommendation.base?.p ??
                      "—"}{" "}
                    kg/ha
                  </p>
                </div>
                <div className="rounded-2xl bg-[#ecfff4] px-4 py-3">
                  <p className="text-xs text-gray-500">Potassium (K)</p>
                  <p className="font-semibold text-green-800 mt-1">
                    {recommendation.adjusted?.k ??
                      recommendation.base?.k ??
                      "—"}{" "}
                    kg/ha
                  </p>
                </div>
              </div>

              <p className="text-gray-700 text-sm sm:text-base mt-2 decoration-solid bg-gradient-to-r from-green-300 to-green-100 p-3 rounded">
                {recommendation.note}
              </p>

              <div className="mt-4 text-xs text-gray-600 bg-gradient-to-r from-green-300 to-green-100 p-3 rounded decoration-solid">
                <div>
                  <strong>Why adjusted:</strong>
                </div>
                <div className="mt-1">
                  pH optimal range:{" "}
                  {recommendation.optimal?.ph
                    ? `${recommendation.optimal.ph.low} - ${recommendation.optimal.ph.high}`
                    : "N/A"}
                  {" • "}
                  moisture optimal range:{" "}
                  {recommendation.optimal?.moisture
                    ? `${recommendation.optimal.moisture.low} - ${recommendation.optimal.moisture.high}`
                    : "N/A"}
                </div>
                <div className="mt-2">
                  Sensor values used: pH ={" "}
                  {String(
                    recommendation.adjusted?.adjustments?.ph ??
                      payloadSafe(readings.ph)
                  )}
                  {" • "} moisture ={" "}
                  {String(
                    recommendation.adjusted?.adjustments?.moisture ??
                      payloadSafe(readings.humidity ?? readings.soilMoisture)
                  )}
                </div>
              </div>
            </>
          )}

          {error && <div className="text-sm text-red-600">Error: {error}</div>}
        </div>
      </div>
    </main>
  );
}

/**
 * small helper to show fallback strings without blowing up UI
 */
function payloadSafe(v) {
  if (v == null) return "—";
  return String(v);
}
