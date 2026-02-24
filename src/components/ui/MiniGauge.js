"use client";

import React, { useMemo, useId } from "react";
import PropTypes from "prop-types";

/**
 * arcPath
 * Creates an SVG path for a filled sector (pie slice) starting at -90deg (top),
 * sweeping clockwise by `pct` percent of a full circle.
 *
 * Returns a path string for 0 < pct < 100.
 */
function arcPath(cx, cy, r, pct) {
  if (!pct || pct <= 0) return "";
  // clamp pct for safety (but we expect caller to pass 0..100)
  const p = Math.min(100, Math.max(0, pct));

  // special-case full circle: caller should handle pct === 100 separately
  if (p >= 100) {
    // return empty so caller can render a circle instead
    return "";
  }

  const startAngle = -Math.PI / 2; // -90deg, top
  const endAngle = startAngle + (p / 100) * Math.PI * 2;

  const sx = cx + r * Math.cos(startAngle);
  const sy = cy + r * Math.sin(startAngle);

  const ex = cx + r * Math.cos(endAngle);
  const ey = cy + r * Math.sin(endAngle);

  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  // Path: Move to center, line to start on circumference, arc to end, close path
  return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${largeArcFlag} 1 ${ex} ${ey} Z`;
}

/**
 * MiniGauge filled-donut component
 */
function MiniGaugeInner({
  value = 0,
  max = 100,
  size = 48,
  className = "",
  ariaLabel,
  title,
  style,
  // gradient colors can be customized if you want
  startColor = "#063016ff",
  endColor = "#3de578ff",
  bgColor = "#addfc4ff",
}) {
  // numeric sanitization
  const safeValue = useMemo(() => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }, [value]);

  const safeMax = useMemo(() => {
    const m = Number(max);
    return Number.isFinite(m) && m > 0 ? m : 100;
  }, [max]);

  const pct = useMemo(() => {
    const raw = (safeValue / safeMax) * 100;
    if (!Number.isFinite(raw)) return 0;
    return Math.min(100, Math.max(0, raw));
  }, [safeValue, safeMax]);

  // geometry
  const { strokeWidth, r, circumference } = useMemo(() => {
    const sw = Math.max(4, Math.round(size * 0.12)); // stroke thickness used to compute hole
    const radius = Math.max(6, size / 2 - sw);
    const circ = 2 * Math.PI * radius;
    return { strokeWidth: sw, r: radius, circumference: circ };
  }, [size]);

  const id = useId();
  const gradId = `miniGaugeGrad-${id}`;
  const holeMaskId = `miniGaugeHoleMask-${id}`;

  const computedAria =
    ariaLabel ??
    `${Math.round(pct)}% (${Math.round(safeValue)} of ${Math.round(safeMax)})`;

  // path for pct (only for 0 < pct < 100)
  const sectorPath = useMemo(
    () => arcPath(size / 2, size / 2, r, pct),
    [size, r, pct]
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={style}
      role="img"
      aria-label={computedAria}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}

      <defs>
        <linearGradient id={gradId} x1="0" x2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>

        {/* mask that cuts the center hole of the donut */}
        <mask id={holeMaskId}>
          {/* white = visible, black = hidden */}
          <rect width={size} height={size} fill="white" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={Math.max(0, r - strokeWidth)}
            fill="black"
          />
        </mask>
      </defs>

      {/* background donut (fills the whole sector area but masked to donut shape) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill={bgColor}
        mask={`url(#${holeMaskId})`}
      />

      {pct >= 100 ? (
        // fully filled donut (use circle fill masked)
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill={`url(#${gradId})`}
          mask={`url(#${holeMaskId})`}
        />
      ) : pct <= 0 ? null : ( // nothing (you can add a tiny accent if you prefer)
        // sector path filled with gradient, masked to donut hole
        <path
          d={sectorPath}
          fill={`url(#${gradId})`}
          mask={`url(#${holeMaskId})`}
          style={{ transition: "all 0.4s ease-out" }}
        />
      )}

      {/* center text */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={Math.max(10, Math.round(size * 0.18))}
        fill="#15b66bff"
        fontWeight="700"
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

MiniGaugeInner.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  size: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.object,
  startColor: PropTypes.string,
  endColor: PropTypes.string,
  bgColor: PropTypes.string,
};

const MiniGauge = React.memo(MiniGaugeInner);
MiniGauge.displayName = "MiniGauge";

export default MiniGauge;
