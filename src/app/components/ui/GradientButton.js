"use client";

export default function GradientButton({
  children,
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-8 py-3 text-sm sm:text-base font-medium
      bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md
      disabled:opacity-50 disabled:cursor-not-allowed
      hover:scale-[1.02] active:scale-[0.98] transition-transform
      ${className}`}
    >
      {children}
    </button>
  );
}
