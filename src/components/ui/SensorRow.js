"use client";

import React from "react";
import PropTypes from "prop-types";

/**
 * Simple Sensor Row
 * - No gauge
 * - No popup
 * - No charts
 * - Direct value display
 */

function SensorRowInner({ label, value, unit = "" }) {
  const displayValue =
    value === null || value === undefined ? "--" : `${value}${unit}`;

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/20 m-2  px-4 py-2 transition-all duration-300 hover:bg-white/10">
      {/* Label */}
      <span className="text-sm sm:text-base font-medium text-white">
        {label}
      </span>

      {/* Value */}
      <div className="rounded-lg bg-emerald-500/20 px-4 py-1.5">
        <span className="text-sm sm:text-base font-bold text-white">
          {displayValue}
        </span>
      </div>
    </div>
  );
}

SensorRowInner.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  unit: PropTypes.string,
};

const SensorRow = React.memo(SensorRowInner);

SensorRow.displayName = "SensorRow";

export default SensorRow;
