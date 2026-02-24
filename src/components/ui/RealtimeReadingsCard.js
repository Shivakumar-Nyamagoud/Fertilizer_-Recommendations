"use client";

import React, { useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import SensorRow from "./SensorRow";

// Lazy-load popup/chart (client-side only). Keep bundle small.
const PopupChart = dynamic(() => import("./Popupchart"), { ssr: false });

export default function RealtimeReadingsCard({ readings = {} }) {
  // Helper to present numeric or placeholder
  const safe = (v) => (v === null || v === undefined ? "--" : v);

  // onOpen callback — receives label so parent knows which sensor opened
  const handleOpen = useCallback((label) => {
    // telemetry, analytics, or UI side-effects can go here
    // Example: console.debug("Opened popup for", label);
    // Keep this lightweight so it can be passed to many rows
    try {
      console.debug?.("Popup opened for", label);
    } catch (e) {}
  }, []);

  // Define sensors once; this makes the markup compact and easy to maintain
  const sensors = useMemo(
    () => [
      { key: "ph", label: "pH", max: 14 },
      { key: "humidity", label: "Humidity", max: 100 },
      { key: "soilMoisture", label: "Soil Moisture", max: 100 },
      { key: "tds", label: "TDS", max: 2000 },
      { key: "temperature", label: "Temperature", max: 60 },
    ],
    []
  );

  // Render rows from sensors list (memoized)
  const rows = useMemo(
    () =>
      sensors.map(({ key, label, max }) => (
        <SensorRow
          key={key}
          label={label}
          value={readings?.[key]}
          max={max}
          PopupComponent={PopupChart}
          onOpen={() => handleOpen(label)}
        />
      )),
    [sensors, readings, handleOpen]
  );

  return (
    <section
      className="w-full max-w-sm rounded-[30px] bg-gradient-to-r from-green-800 to-green-400 text-white px-6 py-6 shadow-lg"
      aria-label="Realtime sensor readings"
    >
      <header>
        <h2 className="text-xl font-semibold mb-1">Realtime Readings</h2>
        <p className="text-xs mb-4 opacity-90">Sensors Showing</p>
      </header>

      <div>{rows}</div>

      {/* Metadata rows */}
      <div className="mt-3 pt-3 border-t border-white/20">
        <div className="text-xs text-white/90">Metadata</div>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Date</span>
            <span>{safe(readings?.date)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Time</span>
            <span>{safe(readings?.time)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
