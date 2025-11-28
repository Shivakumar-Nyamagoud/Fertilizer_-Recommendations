"use client";

import { useEffect, useState } from "react";
import { Wifi, MapPin, Activity, AlertTriangle } from "lucide-react";
import RealtimeReadingsCard from "../components/ui/RealtimeReadingsCard";

export default function SensorReadingPage() {
  const [readings, setReadings] = useState({
    ph: "6.5",
    moisture: "45%",
    temperature: "28°C",
  });

  // JS version – no type annotation
  const [lastUpdated, setLastUpdated] = useState(null);

  // Simulate realtime updates – replace with your API / WebSocket later
  useEffect(() => {
    const update = () => {
      const ph = (6.3 + Math.random() * 0.5).toFixed(1);
      const moisture = (40 + Math.random() * 15).toFixed(0) + "%";
      const temp = (26 + Math.random() * 4).toFixed(0) + "°C";

      setReadings({
        ph,
        moisture,
        temperature: temp,
      });
      setLastUpdated(new Date().toLocaleTimeString());
    };

    update();
    const id = setInterval(update, 2000); // every 7 seconds
    // return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 flex justify-center bg-gradient-to-b from-[#021c12] via-[#044e2b] to-[#e9fff3]">
      <div className="w-full max-w-6xl space-y-10">
        {/* Header */}
        <section className="text-center text-emerald-50 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-1 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-300" />
            </span>
            Live Sensor Stream
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Realtime Sensor Readings
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-emerald-100/80">
            Monitor what is happening in your field right now. These values are
            captured from soil and environment sensors and help the system give
            accurate fertilizer and irrigation recommendations.
          </p>
        </section>

        {/* Main content row */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-start">
          {/* Realtime card (reused component) */}
          <div className="flex justify-center lg:justify-start">
            <RealtimeReadingsCard readings={readings} />
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
                      Online · Stable
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

            <div className="rounded-2xl bg-white/90 backdrop-blur-md shadow-xl px-5 py-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Field & Crop
                  </p>
                  <p className="text-sm font-semibold text-emerald-800">
                    Plot A · Tomato (Fruiting Stage)
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Values shown here represent the average around the installed
                sensor unit. Use multiple nodes for large fields to capture
                variations in soil conditions.
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-900/40 border border-emerald-500/40 px-5 py-4 text-emerald-50 space-y-2">
              <div className="flex items-center gap-2">
                <Activity size={18} />
                <p className="text-sm font-semibold">
                  How to read these values
                </p>
              </div>
              <ul className="text-xs sm:text-sm space-y-1 list-disc list-inside">
                <li>
                  <span className="font-semibold">pH:</span> Ideal range for
                  most crops is 6.0 – 7.0. Values outside this range may reduce
                  nutrient uptake.
                </li>
                <li>
                  <span className="font-semibold">Moisture:</span> Keep soil
                  moist but not waterlogged. Sudden drops may indicate the need
                  for irrigation.
                </li>
                <li>
                  <span className="font-semibold">Temperature:</span> Extreme
                  highs or lows can stress plants; combine this with weather
                  forecasts for better planning.
                </li>
              </ul>
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
