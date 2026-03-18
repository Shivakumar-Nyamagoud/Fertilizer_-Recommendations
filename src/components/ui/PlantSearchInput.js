"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, X } from "lucide-react";

export default function PlantSearchInput({ value, onChange, onBack, onClear }) {
  const [query, setQuery] = useState(value || "");
  const [crops, setCrops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Load crops
  useEffect(() => {
    fetch("/api/crops")
      .then((r) => r.json())
      .then((json) => {
        if (json?.crops) setCrops(json.crops);
      })
      .catch(() => setCrops([]));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Close modal on ESC
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") setShowModal(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Sync value
  // useEffect(() => {
  //   setQuery(value || "");
  // }, [value]);

  // Debounce filter
  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const q = query.trim().toLowerCase();

      if (!q) {
        setFiltered([]);
        setOpen(false);
        return;
      }

      const matches = crops.filter((c) => c.toLowerCase().includes(q));

      const sliced = matches.slice(0, 10);

      setFiltered(sliced);
      setOpen(sliced.length > 0);
      setHighlight(0);
    }, 150);

    return () => clearTimeout(debounceRef.current);
  }, [query, crops]);

  // Select crop (✅ closes dropdown)
  function selectCrop(name) {
    setQuery(name);
    setFiltered([]);
    setOpen(false);
    setHighlight(0);

    if (onChange) onChange(name);
  }

  // Keyboard navigation
  function onKeyDown(e) {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlight]) selectCrop(filtered[highlight]);
    }
  }

  return (
    <>
      {/* Search Box */}
      <div
        ref={containerRef}
        className="w-full max-w-md relative rounded-3xl bg-[#f4ecff] px-4 py-3 shadow-sm"
      >
        <div className="flex items-center gap-3 pb-2">
          <button onClick={onBack} className="text-green-500">
            <ArrowLeft size={20} />
          </button>

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Enter crop name"
            className="flex-1 bg-transparent outline-none text-green-900"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setFiltered([]);
                setOpen(false);
                setHighlight(0);
                onClear?.();
              }}
              className="text-green-500"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        <div
          ref={listRef}
          className={`absolute z-30 left-4 right-4 mt-1 max-h-60 overflow-auto rounded-xl bg-white shadow-lg border ${
            open ? "block" : "hidden"
          }`}
        >
          {filtered.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No matches</div>
          ) : (
            filtered.map((c, i) => (
              <div
                key={i}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectCrop(c);
                }}
                className={`px-4 py-2 cursor-pointer ${
                  highlight === i
                    ? "bg-green-100 text-green-800"
                    : "text-gray-800"
                }`}
              >
                {c}
              </div>
            ))
          )}

          {/* Footer */}
          <div className="border-t text-center p-2">
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-green-600 hover:underline"
            >
              View all plants →
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative bg-white w-[90%] max-w-md rounded-xl p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ❌ Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <h2 className="font-semibold text-lg mb-3 text-black">
              All Plants
            </h2>

            {/* List */}
            <div className="max-h-60 overflow-y-auto">
              {crops.map((c, i) => (
                <div
                  key={i}
                  onClick={() => {
                    selectCrop(c);
                    setShowModal(false);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-green-100 rounded-md text-black"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
