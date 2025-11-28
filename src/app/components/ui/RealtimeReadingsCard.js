"use client";

import { ChevronRight } from "lucide-react";

function SensorRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-t border-white/50">
      <span className="text-sm sm:text-base">{label}</span>
      <div className="flex items-center gap-3 text-sm">
        <span>{value ?? "--"}</span>
        <ChevronRight size={18} />
      </div>
    </div>
  );
}

export default function RealtimeReadingsCard({ readings }) {
  return (
    <div className="w-full max-w-sm rounded-[30px] bg-green-500 text-white px-6 py-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-1">Realtime Readings</h2>
      <p className="text-xs mb-4 opacity-90">Sensors Showing</p>

      <SensorRow label="pH" value={readings?.ph} />
      <SensorRow label="Moisture" value={readings?.moisture} />
      <SensorRow label="Temperature" value={readings?.temperature} />
    </div>
  );
}
