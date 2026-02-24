"use client";

export default function GradientButton({
  children,
  onClick,
  disabled = false,
  className = "",
}) {
  // base classes are deterministic and identical on server & client
  const base =
    "rounded-full px-8 py-3 text-sm sm:text-base font-medium bg-gradient-to-r from-green-800 to-green-500 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer";

  // ensure result is a single trimmed string (no accidental newline mismatch)
  const combined = `${base} ${className}`.trim();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={combined}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
