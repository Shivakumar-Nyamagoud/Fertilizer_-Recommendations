export default function AgroSenseLogo({ size = 42, textSize = "text-2xl" }) {
  return (
    <div className="flex items-center gap-2 select-none">
      {/* LOGO ICON */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Outer Circle */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="#062E1A"
          stroke="#1A8F4B"
          strokeWidth="2"
        />

        {/* Leaf */}
        <path
          d="M32 44C27 39 23 32 23 26C23 20 27 16 32 16C37 16 41 20 41 26C41 32 37 39 32 44Z"
          fill="#1A8F4B"
          stroke="#A5F28A"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* IoT Waves */}
        <path
          d="M32 22C35 22 38 25 38 28"
          stroke="#A5F28A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M32 18C38 18 44 24 44 30"
          stroke="#A5F28A"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M32 14C41 14 50 23 50 32"
          stroke="#A5F28A"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {/* TEXT */}
      <span className={`${textSize} font-bold tracking-wide text-emerald-300`}>
        <span className="text-lime-400">Agro</span>Sense
      </span>
    </div>
  );
}
