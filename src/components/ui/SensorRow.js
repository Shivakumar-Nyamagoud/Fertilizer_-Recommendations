"use client";

import React, { useMemo, useCallback } from "react";
import MiniGauge from "./MiniGauge";
import PropTypes from "prop-types";

/**
 * SensorRow
 * - label (string)
 * - value (number | string)
 * - max (number) optional
 * - PopupComponent (React component) optional — lazy-loaded popup with chart
 * - onOpen (fn) optional (receives label)
 * - gaugeSize (number) optional -> size for popup gauge
 */
function SensorRowInner({
  label,
  value,
  max = 100,
  PopupComponent,
  onOpen,
  gaugeSize = 140, // popup gauge size
}) {
  const displayValue = value === null || value === undefined ? "--" : value;

  // non-interactive trigger node (span) — safe to pass as child of a button
  const triggerNode = useMemo(
    () => (
      <span
        className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 select-none"
        aria-hidden="true"
      >
        {displayValue}
      </span>
    ),
    [displayValue]
  );

  // local onOpen wrapper to provide label context
  const handleOpen = useCallback(() => {
    if (typeof onOpen === "function") {
      try {
        onOpen(label);
      } catch (e) {
        // ignore user callback errors
      }
    }
  }, [onOpen, label]);

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/20">
      <span className="text-sm sm:text-base">{label}</span>

      <div className="flex items-center gap-4">
        {/* Inline mini gauge (compact) */}
        {/* <MiniGauge
          value={value}
          max={max}
          size={48}
          className="shrink-0"
          ariaLabel={`${label} ${displayValue}`}
        /> */}

        {/* Popup trigger (or fallback static value) */}
        {PopupComponent ? (
          <PopupComponent
            val={value}
            maxVal={max}
            title={`${label} Level`}
            trigger={triggerNode}
            onOpen={handleOpen}
            gaugeSize={gaugeSize}
          />
        ) : (
          <div className="px-3 py-1 bg-white/10 text-white rounded select-none">
            {displayValue}
          </div>
        )}
      </div>
    </div>
  );
}

SensorRowInner.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.number,
  PopupComponent: PropTypes.any,
  onOpen: PropTypes.func,
  gaugeSize: PropTypes.number,
};

const SensorRow = React.memo(SensorRowInner);
SensorRow.displayName = "SensorRow";

export default SensorRow;
