"use client";

import { useEffect, useState } from "react";
import { Wifi, MapPin, Activity, AlertTriangle, XCircle } from "lucide-react";
import RealtimeReadingsCard from "../../components/ui/RealtimeReadingsCard";
import { rtdb } from "@/lib/firebaseClient";
import { ref, onValue, off } from "firebase/database";
import PlantSearchInput from "../../components/ui/PlantSearchInput";
import PlantStageSelect from "../../components/ui/PlantStageSelect";

const STAGE_OPTIONS = [
  { value: "seedling", label: "Seedling" },
  { value: "vegetative", label: "Vegetative" },
  { value: "flowering", label: "Flowering" },
  { value: "fruiting", label: "Fruiting" },
];

export default function SensorReadingPage() {
  const [readings, setReadings] = useState({
    ph: "--",
    humidity: "--",
    soilMoisture: "--",
    tds: "--",
    temperature: "--",
    date: "--",
    time: "--",
  });
  const [crop, setCrop] = useState("");
  const [stage, setStage] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // track last time we actually received an update (ms since epoch)
  const [lastSeenMs, setLastSeenMs] = useState(null);
  const [sensorOnline, setSensorOnline] = useState(false);

  useEffect(() => {
    // listen to the 'sensorData' node and pick the latest child
    const sensorRef = ref(rtdb, "sensorData");

    // onValue returns an unsubscribe function
    const unsubscribe = onValue(
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
          setLastUpdated(null);
          setLastSeenMs(null);
          return;
        }

        // If sensorData is a map of push-ids -> objects, pick the latest child
        let latest = data;
        if (typeof data === "object" && !Array.isArray(data)) {
          const keys = Object.keys(data);
          const lastKey = keys[keys.length - 1];
          latest = data[lastKey] ?? data;
        }

        // handle keys with different names (hyphenated or camelCase)
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

        // try to use timestamp numeric fields if available
        const tstamp =
          latest.timestamp ?? latest.updatedAt ?? latest.ts ?? null;
        if (tstamp) {
          const t = Number(tstamp);
          // convert seconds -> ms when necessary
          const dateObj = t > 1e12 ? new Date(t) : new Date(t * 1000);
          setLastUpdated(dateObj.toLocaleString());
        } else {
          setLastUpdated(new Date().toLocaleTimeString());
        }

        // mark we just received data (used to show online badge)
        setLastSeenMs(Date.now());
      },
      (error) => {
        console.error("RTDB onValue error:", error);
      }
    );

    // cleanup
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      off(sensorRef);
    };
  }, []);

  // check online status every 2s based on lastSeenMs
  useEffect(() => {
    const CHECK_INTERVAL = 2000; // ms
    const OFFLINE_THRESHOLD = 15 * 1000; // 15 seconds -> consider offline

    const id = setInterval(() => {
      if (!lastSeenMs) {
        setSensorOnline(false);
        return;
      }
      const age = Date.now() - lastSeenMs;
      setSensorOnline(age <= OFFLINE_THRESHOLD);
    }, CHECK_INTERVAL);

    return () => clearInterval(id);
  }, [lastSeenMs]);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 flex justify-center bg-gradient-to-b from-[#021c12] via-[#044e2b] to-[#e9fff3]">
      <div className="w-full max-w-6xl space-y-10">
        {/* Header */}
        <section className="text-center space-y-4">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-medium
              ${
                sensorOnline
                  ? "bg-emerald-500/15 text-emerald-200"
                  : "bg-red-200/15 text-red-300"
              }
            `}
          >
            {/* show ping when online, red X when offline */}
            {sensorOnline ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-300" />
                </span>
                <span>Live Sensor Stream</span>
                <span className="ml-2 text-[11px] opacity-80">
                  {lastUpdated ? `Updated: ${lastUpdated}` : ""}
                </span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-300" />
                </span>
                <span>Sensor Offline</span>
                <span className="ml-2 text-[11px] opacity-80">
                  {lastSeenMs
                    ? `Last seen: ${new Date(lastSeenMs).toLocaleString()}`
                    : "No data"}
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-50">
            Realtime Sensor Readings
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-emerald-100/80">
            Monitor what is happening in your field right now. These values are
            captured from soil and environment sensors and help the system give
            accurate fertilizer and irrigation recommendations.
          </p>
        </section>

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
          </div>
        </div>

        {/* Main content row */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-start">
          {/* Realtime card (reused component) */}
          <div className="flex justify-center lg:justify-start">
            <RealtimeReadingsCard
              readings={readings}
              lastUpdated={lastUpdated}
            />
          </div>

          {/* Sensor + field info */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/95 backdrop-blur-md shadow-xl px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <Wifi size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Connection
                    </p>
                    <p className="text-sm font-semibold text-emerald-700">
                      {sensorOnline ? "Online · Stable" : "Offline / Unstable"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-gray-500 uppercase">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium text-emerald-700">
                    {lastUpdated || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/95 backdrop-blur-md shadow-xl px-5 py-5 space-y-3 border border-emerald-100">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <MapPin size={20} />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                    Field & Crop Information
                  </p>

                  {/* Crop & Stage Dynamic Content */}
                  <p className="mt-1 text-sm font-semibold text-emerald-800">
                    {crop ? (
                      <>
                        Plot A ·{" "}
                        <span className="text-emerald-700 font-bold">
                          {crop}
                        </span>{" "}
                        <span className="text-gray-600">
                          ({stage ? `${stage} Stage` : "Stage not selected"})
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-600">No crop selected</span>
                    )}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                These readings represent the live values captured from your
                installed sensor unit. For larger fields, consider adding
                multiple nodes to get more accurate coverage of soil variations.
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-900/50 border border-emerald-500/40 px-5 py-5 text-emerald-50 space-y-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700/40">
                  <Activity size={18} className="text-lime-300" />
                </div>
                <p className="text-sm font-semibold tracking-wide">
                  How to Interpret These Sensor Values
                </p>
              </div>

              <ul className="text-xs sm:text-sm space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <span className="font-semibold">pH:</span> Healthy soil
                  typically falls between{" "}
                  <span className="font-semibold text-lime-300">6.0 – 7.0</span>
                  . Higher pH makes nutrients less available, while lower pH
                  increases acidity and affects root growth.
                </li>

                <li>
                  <span className="font-semibold">Humidity:</span> Reflects the
                  moisture in the air. Values below 40% may increase crop water
                  demand, while higher humidity may promote fungal growth.
                </li>

                <li>
                  <span className="font-semibold">Soil Moisture:</span>{" "}
                  Indicates water content in soil. Aim for steady, moderate
                  levels. Sudden drops mean irrigation is needed; very high
                  values may cause root rot.
                </li>

                <li>
                  <span className="font-semibold">TDS:</span> Stands for Total
                  Dissolved Solids. High TDS indicates salt buildup which
                  affects plant growth. Ideal TDS varies by crop, but keep it
                  relatively low for most vegetables.
                </li>

                <li>
                  <span className="font-semibold">Temperature:</span> Soil temp
                  affects nutrient absorption. Ideal is often between{" "}
                  <span className="font-semibold text-lime-300">
                    20°C – 30°C
                  </span>
                  . Extreme heat or cold stresses plants.
                </li>
              </ul>

              <p className="text-[11px] sm:text-xs text-emerald-100/70 pt-2 border-t border-emerald-600/40">
                Tip: Combine sensor readings with weather forecasts for
                optimized watering and fertilizer efficiency.
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-3 flex items-start gap-2 text-xs sm:text-sm text-amber-800">
              <AlertTriangle size={16} className="mt-0.5" />
              <p>
                If sensor values look unrealistic or do not change over a long
                time, check power, wiring and field placement. Regular
                calibration keeps recommendations reliable.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
