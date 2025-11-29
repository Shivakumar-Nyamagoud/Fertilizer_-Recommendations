"use client";

import { ArrowLeft, X } from "lucide-react";

export default function PlantSearchInput({ value, onChange, onBack, onClear }) {
  return (
    <div className="w-full max-w-md rounded-3xl bg-[#f4ecff] px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3 border-b border-green-400 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="text-green-500 hover:text-green-600"
        >
          <ArrowLeft size={20} />
        </button>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter crop name (e.g. Tomato)"
          className="flex-1 bg-transparent outline-none text-sm sm:text-base text-green-900 placeholder:text-gray-400"
        />

        {value && (
          <button
            type="button"
            onClick={onClear}
            className="text-green-500 hover:text-green-600"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
