"use client";

export default function PlantStageSelect({ value, onChange, options }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs sm:text-sm text-green-600 font-medium">
        Select Plant Stage
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[180px] rounded-full border border-green-400 px-4 py-2 text-sm sm:text-base text-green-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-300 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
