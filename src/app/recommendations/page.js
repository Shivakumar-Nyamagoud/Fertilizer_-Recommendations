// src/app/recommendations/page.js
"use client";

import { Wifi, MapPin, Activity, AlertTriangle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import GradientButton from "../../components/ui/GradientButton";
import PlantSearchInput from "../../components/ui/PlantSearchInput";
import RealtimeReadingsCard from "../../components/ui/RealtimeReadingsCard";
import SoilTypeSelect from "@/components/ui/SoilTypeSelect";
import { rtdb } from "@/lib/firebaseClient";
import { ref, onValue } from "firebase/database";

const SOIL_OPTIONS = [
  { value: "", label: "Select" },
  { value: "Sandy", label: "Sandy" },
  { value: "Loamy", label: "Loamy" },
  { value: "Black", label: "Black" },
  { value: "Red", label: "Red" },
  { value: "Clayey", label: "Clayey" },
];

export default function RecommendationsPage() {
  const [crop, setCrop] = useState("");
  const [Soil, setSoil] = useState("");

  // latest sensor readings (keeps stable default shape for SSR)
  const [readings, setReadings] = useState({
    ph: "--",
    humidity: "--",
    soilMoisture: "--",
    tds: "--",
    temperature: "--",

    nitrogen: "--",
    phosphorus: "--",
    potassium: "--",

    date: "--",
    time: "--",
  });

  const [lastSeenMs, setLastSeenMs] = useState(null);
  const [sensorOnline, setSensorOnline] = useState(false);

  // recommendation state
  const [recommendation, setRecommendation] = useState(null);
  const [fertilizer, setFertilizerData] = useState(null);
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

            nitrogen: "--",
            phosphorus: "--",
            potassium: "--",

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
          nitrogen: "50",
          phosphorus: "26",
          potassium: "83",
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
      },
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
        readings: {
          // normalise names expected by API
          ph: readings.ph,
          moisture: readings.soilMoisture,
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
      console.log(recommendation);
    } catch (e) {
      console.error("Recommendation error:", e);
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function handleGetFertilizer() {
    setLoading(true);
    setError(null);
    setFertilizerData(null);

    try {
      const payload = {
        Temparature: readings.temperature,
        Humidity: readings.humidity,
        Moisture: readings.soilMoisture,
        SoilType: Soil,
        Nitrogen: recommendation?.adjusted?.n ?? recommendation?.base?.n,
        Potassium: recommendation?.adjusted?.p ?? recommendation?.base?.p,
        phosphorus: recommendation?.adjusted?.k ?? recommendation?.base?.k,
      };

      if (!Soil) {
        throw new Error(" Please Select Soil Type !");
      }

      const res = await fetch("http://localhost:8001/predict-fertilizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to fetch fertilizer");
      }

      const json = await res.json();

      // json = { fertilizer: "...", confidence: 87.34 }
      setFertilizerData(json.best_prediction);
      console.log(fertilizer);
    } catch (e) {
      console.error("Recommendation error:", e);
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setFertilizerData(null);
  }, [Soil]);

  useEffect(() => {
    setRecommendation(null);
    setFertilizerData(null);
  }, [crop]);

  // deterministic secondary button classes
  const secondaryBtnClasses =
    "rounded-full px-6 py-3 text-sm sm:text-base font-large border border-emerald-200/70 text-emerald-50 bg-gradient-to-r from-green-500 to-green-100 hover:bg-white/10 transition-colors cursor-pointer text-green-700";

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 flex justify-center bg-gradient-to-b from-[#02301b] via-[#044625] to-green-200 ">
      <div className="w-full max-w-7xl space-y-10">
        {/* Top controls – single line */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 px-6 py-5 shadow-lg">
          <div className="grid gap-6  lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_auto] items-end">
            <div className="mb-4">
              <PlantSearchInput
                value={crop}
                onChange={setCrop}
                onBack={() => {}}
                onClear={() => setCrop("")}
                className=""
              />
            </div>
            <SoilTypeSelect
              value={Soil}
              onChange={setSoil}
              options={SOIL_OPTIONS}
            />

            <GradientButton
              onClick={handleGetRecommendations}
              disabled={loading || !crop}
              className="px-8 py-3 mb-5 text-sm sm:text-base whitespace-nowrap bg-gradient-to-r from-emerald-500 to-green-500"
            >
              {loading ? "Calculating..." : "Get Recommendations"}
            </GradientButton>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 ">
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
          </div>

          {/* Recommendation panel */}
          <div className="w-full max-w-3xl bg-white/95 rounded-3xl shadow-2xl px-6 sm:px-8 py-6 space-y-4 border-l-4 border-green-500">
            <h2 className="text-xl font-semibold text-green-800">
              Recommendation Summary
            </h2>

            {!recommendation ? (
              <ul className="text-gray-600 mt-6 text-sm sm:text-base list-disc list-inside space-y-2">
                <li>
                  Select the appropriate{" "}
                  <span className="font-semibold">Crop</span> and{" "}
                  <span className="font-semibold">Soil Type</span> from the
                  options above.
                </li>
                <li>
                  Click on{" "}
                  <span className="font-semibold text-green-700">
                    Get Recommendations
                  </span>{" "}
                  to start the analysis.
                </li>
                <li>
                  The system uses{" "}
                  <span className="font-semibold">real-time sensor data</span>{" "}
                  such as soil nutrients, moisture, and environmental
                  conditions.
                </li>
                <li>
                  Based on the data, it suggests the most suitable{" "}
                  <span className="font-semibold">fertilizers</span> for your
                  crop.
                </li>
                <li>
                  Helps improve{" "}
                  <span className="font-semibold">crop yield</span>, maintain{" "}
                  <span className="font-semibold">soil health</span>, and
                  support efficient farming.
                </li>
              </ul>
            ) : (
              <>
                <p className="text-gray-700 text-sm sm:text-base text-bold">
                  Recommended NPK dose for{" "}
                  <span className="font-semibold text-green-700">
                    {recommendation.crop}
                  </span>{" "}
                  in{" "}
                  <span className="font-semibold text-green-700">
                    {SOIL_OPTIONS.find((s) => s.value === Soil)?.label}
                  </span>{" "}
                  Soil:
                </p>
                <div className="grid sm:grid-cols-3 gap-4 text-sm sm:text-base">
                  <div className="rounded-2xl bg-green-200 px-4 py-3">
                    <p className="text-xs text-gray-500">Nitrogen (N)</p>
                    <p className="font-semibold text-green-800 mt-1">
                      {recommendation.adjusted?.n ??
                        recommendation.base?.n ??
                        "—"}{" "}
                      kg/ha
                    </p>
                  </div>
                  <div className="rounded-2xl bg-green-200 px-4 py-3">
                    <p className="text-xs text-gray-500">Phosphorus (P)</p>
                    <p className="font-semibold text-green-800 mt-1">
                      {recommendation.adjusted?.p ??
                        recommendation.base?.p ??
                        "—"}{" "}
                      kg/ha
                    </p>
                  </div>
                  <div className="rounded-2xl bg-green-200 px-4 py-3">
                    <p className="text-xs text-gray-500">Potassium (K)</p>
                    <p className="font-semibold text-green-800 mt-1">
                      {recommendation.adjusted?.k ??
                        recommendation.base?.k ??
                        "—"}{" "}
                      kg/ha
                    </p>
                  </div>
                  <button
                    className={secondaryBtnClasses}
                    onClick={() => {
                      // allow quick refresh of recommendation UI when user wants to re-run
                      handleGetRecommendations();
                    }}
                  >
                    {loading
                      ? " Calculating ..."
                      : recommendation
                        ? "Recalculate"
                        : "Get Recommendations"}
                  </button>
                </div>

                <p className="text-gray-700 text-sm sm:text-base mt-2 decoration-solid bg-gradient-to-r from-green-300 to-green-100 p-3 rounded">
                  {recommendation.note}
                </p>
                <Divider />
                <div className="rounded-2xl bg-[#ecfff4] px-4 py-3">
                  <div className="bg-green-200 p-2 rounded-xl">
                    <p className="text-gray-700 text-sm sm:text-base text-bold">
                      Top Recommended Fertilizers for{" "}
                      <span className="font-semibold text-green-700">
                        {recommendation.crop}
                      </span>{" "}
                      in{" "}
                      <span className="font-semibold text-green-700">
                        {SOIL_OPTIONS.find((s) => s.value === Soil)?.label}
                      </span>{" "}
                      Soil:
                    </p>
                    {fertilizer?.map((item, index) => (
                      <p
                        key={index}
                        className="font-semibold text-green-800 mt-2 bg-green-100 p-2 rounded-full"
                      >
                        {item.fertilizer}
                        {item.fertilizer?.toLowerCase() === "urea" && (
                          <span className="ml-4 inline-flex items-center gap-1 font-normal border border-red-200 text-red-600 bg-red-100 px-4 py-1 rounded-full animate-pulse">
                            <AlertTriangle className="w-4 h-4 " />
                            Use only -- other fertilizers not available
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                  {!fertilizer && (
                    <div className="mt-4 grid sm:grid-cols-3 gap-4 ">
                      <button
                        className={`${secondaryBtnClasses}`}
                        onClick={() => {
                          // allow quick refresh of recommendation UI when user wants to re-run
                          handleGetFertilizer();
                        }}
                      >
                        {loading ? "Loading ..." : "Predict Fertilizer"}
                      </button>
                    </div>
                  )}
                </div>
                <Divider />
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
                        payloadSafe(readings.ph),
                    )}
                    {" • "} moisture ={" "}
                    {String(
                      recommendation.adjusted?.adjustments?.moisture ??
                        payloadSafe(readings.humidity ?? readings.soilMoisture),
                    )}
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="text-sm text-red-600">Error: {error}</div>
            )}
          </div>
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

function Divider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
  );
}
