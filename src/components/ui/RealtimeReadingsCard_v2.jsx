"use client";

import {
  Droplets,
  FlaskConical,
  Thermometer,
  Activity,
  Leaf,
  Clock3,
  CalendarDays,
  Wifi,
  CircleArrowOutUpRight,
} from "lucide-react";

export default function RealtimeReadingsCard({ readings, sensorOnline }) {
  // Dynamic Status Functions
  const getSoilMoistureStatus = (value) => {
    if (value < 20) return "Dry";
    if (value < 60) return "Optimal";
    return "Wet";
  };

  const getPhStatus = (value) => {
    if (value < 6) return "Acidic";
    if (value <= 7.5) return "Balanced";
    return "Alkaline";
  };

  const getTemperatureStatus = (value) => {
    if (value < 18) return "Cold";
    if (value <= 32) return "Normal";
    return "Hot";
  };

  const getNitrogenStatus = (value) => {
    if (value < 30) return "Low";
    if (value <= 70) return "Good";
    return "High";
  };

  const getPhosphorusStatus = (value) => {
    if (value < 20) return "Low";
    if (value <= 50) return "Moderate";
    return "High";
  };

  const getPotassiumStatus = (value) => {
    if (value < 40) return "Low";
    if (value <= 80) return "Healthy";
    return "High";
  };

  const getHumidityStatus = (value) => {
    if (value < 30) return "Dry";
    if (value <= 70) return "Good";
    return "Humid";
  };

  const getTDSStatus = (value) => {
    if (value < 300) return "Normal";
    if (value <= 700) return "Moderate";
    return "High";
  };

  // Cards
  const cards = [
    {
      title: "Soil Moisture",
      value: `${readings.soilMoisture}%`,
      status: getSoilMoistureStatus(Number(readings.soilMoisture)),
      icon: Droplets,
      color: "text-cyan-400",
      glow: "shadow-cyan-500/20",
    },

    {
      title: "pH",
      value: readings.ph,
      status: getPhStatus(Number(readings.ph)),
      icon: FlaskConical,
      color: "text-violet-400",
      glow: "shadow-violet-500/20",
    },

    {
      title: "Temperature",
      value: `${readings.temperature}°C`,
      status: getTemperatureStatus(Number(readings.temperature)),
      icon: Thermometer,
      color: "text-orange-400",
      glow: "shadow-orange-500/20",
    },

    {
      title: "Nitrogen (N)",
      value: readings.nitrogen,
      status: getNitrogenStatus(Number(readings.nitrogen)),
      icon: Leaf,
      color: "text-lime-400",
      glow: "shadow-lime-500/20",
    },

    {
      title: "Phosphorus (P)",
      value: readings.phosphorus,
      status: getPhosphorusStatus(Number(readings.phosphorus)),
      icon: Activity,
      color: "text-fuchsia-400",
      glow: "shadow-fuchsia-500/20",
    },

    {
      title: "Potassium (K)",
      value: readings.potassium,
      status: getPotassiumStatus(Number(readings.potassium)),
      icon: Activity,
      color: "text-yellow-400",
      glow: "shadow-yellow-500/20",
    },

    {
      title: "Humidity",
      value: `${readings.humidity}%`,
      status: getHumidityStatus(Number(readings.humidity)),
      icon: Droplets,
      color: "text-sky-400",
      glow: "shadow-sky-500/20",
    },

    {
      title: "TDS",
      value: `${readings.tds} ppm`,
      status: getTDSStatus(Number(readings.tds)),
      icon: CircleArrowOutUpRight,
      color: "text-emerald-400",
      glow: "shadow-emerald-500/20",
    },
  ];

  return (
    <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-[#071420]/95 backdrop-blur-xl p-5 shadow-2xl">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div>
          <h2 className="text-white text-2xl font-bold tracking-wide">
            Overview
          </h2>

          <p className="mt-1 text-sm text-emerald-100/70">
            Realtime sensor readings from your field
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Status */}
          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3
            ${
              sensorOnline
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-red-500/20 bg-red-500/10"
            }`}
          >
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full
                ${sensorOnline ? "bg-lime-400" : "bg-red-500"} opacity-75`}
              />

              <span
                className={`relative inline-flex rounded-full h-3 w-3
                ${sensorOnline ? "bg-lime-300" : "bg-red-500"}`}
              />
            </span>

            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-400">
                Status
              </p>

              <p
                className={`text-sm font-bold
                ${sensorOnline ? "text-lime-300" : "text-red-400"}`}
              >
                {sensorOnline ? "LIVE" : "OFFLINE"}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3">
            <CalendarDays size={18} className="text-cyan-300" />

            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-400">
                Date
              </p>

              <p className="text-sm font-bold text-white">
                {readings.date || "--"}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-3">
            <Clock3 size={18} className="text-violet-300" />

            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-400">
                Time
              </p>

              <p className="text-sm font-bold text-white">
                {readings.time || "--"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f2232] to-[#09141f] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${card.glow}`}
            >
              {/* Glow */}
              <div className="absolute inset-0 opacity-10 bg-white blur-2xl"></div>

              {/* Top */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    {card.title}
                  </p>

                  <h3 className={`mt-2 text-3xl font-bold ${card.color}`}>
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${card.color}`}
                >
                  <Icon size={18} />
                </div>
              </div>

              {/* Status */}
              <div className="mt-4 inline-flex rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-gray-300 border border-white/10">
                {card.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
