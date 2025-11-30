"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, X } from "lucide-react";

/**
 * PlantSearchInput
 * Props:
 * - value (string)
 * - onChange (fn) -> called with selected value (only on select)
 * - onBack (fn)
 * - onClear (fn)
 */
export default function PlantSearchInput({ value, onChange, onBack, onClear }) {
  const [query, setQuery] = useState(value || "");
  const [crops, setCrops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Debounce timer ref
  const debounceRef = useRef(null);

  // Load crops once
  useEffect(() => {
    let mounted = true;
    fetch("/api/crops")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        if (json && Array.isArray(json.crops)) setCrops(json.crops);
      })
      .catch((e) => {
        console.error("Failed to load crops:", e);
        setCrops([]);
      });
    return () => (mounted = false);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Keep local query in sync with value from parent
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Debounced filtering
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = (query || "").trim();
      if (!q) {
        setFiltered([]);
        setOpen(false);
        setHighlight(0);
        return;
      }
      const matches = crops.filter((c) =>
        String(c).toLowerCase().includes(q.toLowerCase())
      );
      const slice = matches.slice(0, 10);
      setFiltered(slice);
      setOpen(slice.length > 0);
      setHighlight(0);
    }, 160); // 120-200ms is a good debounce for typeahead
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, crops]);

  // scroll to item when highlight changes
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-item]");
    if (!items || items.length === 0) return;
    const idx = Math.max(0, Math.min(highlight, items.length - 1));
    const item = items[idx];
    if (item) item.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  function selectCrop(name, keepFocus = false) {
    setQuery(name);
    setOpen(false);
    setFiltered([]);
    setHighlight(0);
    if (typeof onChange === "function") onChange(name);
    // keep or blur focus depending on preference:
    if (keepFocus) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }

  // keyboard navigation
  function onKeyDown(e) {
    // open list on first arrow when results exist
    if (
      !open &&
      filtered.length > 0 &&
      (e.key === "ArrowDown" || e.key === "ArrowUp")
    ) {
      setOpen(true);
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlight]) selectCrop(filtered[highlight], false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-md relative rounded-3xl bg-[#f4ecff] px-4 py-3 shadow-sm"
    >
      <div className="flex items-center gap-3 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="text-green-500 hover:text-green-600"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter crop name (select from list)"
          className="flex-1 bg-transparent outline-none text-sm sm:text-base text-green-900 placeholder:text-gray-400"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="croplistbox"
          aria-activedescendant={open ? `crop-item-${highlight}` : undefined}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFiltered([]);
              setOpen(false);
              setHighlight(0);
              if (typeof onClear === "function") onClear();
              inputRef.current?.focus();
            }}
            className="text-green-500 hover:text-green-600"
            aria-label="Clear"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      <div
        ref={listRef}
        id="croplistbox"
        role="listbox"
        className={`absolute z-30 left-4 right-4 mt-1 max-h-60 overflow-auto rounded-xl bg-white shadow-lg border border-gray-100 ${
          open ? "block" : "hidden"
        }`}
      >
        {filtered.length === 0 ? (
          <div className="p-3 text-xs text-gray-500">No matches</div>
        ) : (
          filtered.map((c, i) => (
            <div
              key={c + "-" + i}
              data-item
              id={`crop-item-${i}`}
              role="option"
              aria-selected={highlight === i}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => {
                // onMouseDown to select before input blur
                e.preventDefault();
                selectCrop(c, false);
              }}
              className={`cursor-pointer px-4 py-2 text-sm ${
                highlight === i
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-gray-800"
              }`}
            >
              {c}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
