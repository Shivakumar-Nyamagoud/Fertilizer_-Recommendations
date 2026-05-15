"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Droplets,
  Thermometer,
  FlaskConical,
  Activity,
  Leaf,
} from "lucide-react";

import { rtdb } from "@/lib/firebaseClient";
import { ref, onValue, off } from "firebase/database";

export default function SensorHistoryPage() {
  const [history, setHistory] = useState([]);
  const [rows, setRows] = useState(10);

  useEffect(() => {
    const sensorRef = ref(rtdb, "sensorData");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) return;

      let entries = [];

      if (typeof data === "object") {
        entries = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
      }

      // latest 10 records
      entries = entries.reverse().slice(0, rows);

      setHistory(entries);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      off(sensorRef);
    };
  }, [rows]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#04120d] via-[#071420] to-[#0b1f2d] px-4 py-10 text-white">
      <div className="mx-auto max-w-8xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Sensor History
            </h1>

            <p className="mt-2 text-emerald-100/70">
              Last {rows} realtime readings from Firebase database
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3">
            <p className="text-xs uppercase tracking-widest text-emerald-300">
              Total Records
            </p>

            <h2 className="mt-1 text-3xl font-bold text-white">
              <input value={rows} onChange={(e) => setRows(e.target.value)} />
            </h2>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-left">
                <th className="px-6 py-5 text-sm font-semibold text-gray-300">
                  Date
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-300">
                  Time
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-300">
                  pH
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-300">
                  Nitrogen
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-300">
                  Phosphorus
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-300">
                  Potassium
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-300">
                  Humidity
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-300">
                  Soil Moisture
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-300">
                  TDS
                </th>

                <th className="px-6 py-5 text-sm font-semibold text-gray-300">
                  Temperature
                </th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="border-b border-white/5 transition-all duration-300 hover:bg-white/5"
                >
                  {/* Date */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-cyan-300" />

                      <span className="font-medium text-white">
                        {item.date || "--"}
                      </span>
                    </div>
                  </td>

                  {/* Time */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Clock3 size={16} className="text-violet-300" />

                      <span className="font-medium text-white">
                        {item.time || "--"}
                      </span>
                    </div>
                  </td>

                  {/* pH */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-blue-300">
                      <FlaskConical size={16} />
                      {item.ph || item.pH || "--"}
                    </div>
                  </td>

                  {/* N */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-lime-300">
                      <Leaf size={16} />
                      {50}
                    </div>
                  </td>

                  {/* P */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-fuchsia-300">
                      <Activity size={16} />
                      {26}
                    </div>
                  </td>

                  {/* K */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-yellow-300">
                      <Activity size={16} />
                      {83}
                    </div>
                  </td>

                  {/* Humidity */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sky-300">
                      <Droplets size={16} />
                      {item.humidity || "--"}%
                    </div>
                  </td>

                  {/* Soil */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-cyan-300">
                      <Droplets size={16} />
                      {item["soil-moisture"] || item.soilMoisture || 0}%
                    </div>
                  </td>

                  {/* TDS */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <Activity size={16} />
                      {item.tds || 0} ppm
                    </div>
                  </td>

                  {/* Temperature */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-orange-300">
                      <Thermometer size={16} />
                      {item.temperature || item.temp || "--"}°C
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
