"use client";

import { useState } from "react";
import GradientButton from "../../components/ui/GradientButton";
import PlantSearchInput from "../../components/ui/PlantSearchInput";
import PlantStageSelect from "../../components/ui/PlantStageSelect";
import RealtimeReadingsCard from "../../components/ui/RealtimeReadingsCard";

const STAGE_OPTIONS = [
  { value: "seedling", label: "Seedling" },
  { value: "vegetative", label: "Vegetative" },
  { value: "flowering", label: "Flowering" },
  { value: "fruiting", label: "Fruiting" },
];

export default function RecommendationsPage() {
  const [crop, setCrop] = useState("Tomato");
  const [stage, setStage] = useState("fruiting");
  const [readings] = useState({
    ph: "6.5",
    moisture: "45%",
    temperature: "28°C",
  });
  const [recommendation, setRecommendation] = useState(null);

  const handleGetRecommendations = () => {
    // TODO: replace with real API call
    setRecommendation({
      n: "120 kg/ha",
      p: "60 kg/ha",
      k: "80 kg/ha",
      note: "Apply the recommended dose in 2–3 split applications through fertigation. Maintain proper soil moisture before and after fertilizer application.",
    });
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 flex justify-center bg-gradient-to-b from-[#02301b] via-[#044625] to-[#e9fff3]">
      <div className="w-full max-w-6xl space-y-10">
        {/* Top controls – single line */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 px-6 py-5 shadow-lg">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_auto] items-end">
            <PlantSearchInput
              value={crop}
              onChange={setCrop}
              onBack={() => {}}
              onClear={() => setCrop("")}
            />

            <PlantStageSelect
              value={stage}
              onChange={setStage}
              options={STAGE_OPTIONS}
            />

            <GradientButton
              onClick={handleGetRecommendations}
              className="px-8 py-3 text-sm sm:text-base whitespace-nowrap bg-gradient-to-r from-emerald-500 to-green-500"
            >
              Get Recommendations
            </GradientButton>
          </div>
        </div>

        {/* Middle row – realtime + add to dashboard */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_auto] items-start">
          <RealtimeReadingsCard readings={readings} />

          <div className="flex flex-col items-center gap-4">
            <GradientButton
              disabled
              className="px-8 py-3 text-sm bg-gradient-to-r from-emerald-300 to-green-300 opacity-70 cursor-not-allowed"
            >
              Add To Dashboard
            </GradientButton>
            <p className="text-xs text-green-50 max-w-[200px] text-center">
              Soon you will be able to pin this crop&apos;s recommendations to a
              personalized dashboard.
            </p>
          </div>
        </div>

        {/* Recommendation panel */}
        <div className="w-full max-w-3xl bg-white/95 rounded-3xl shadow-2xl px-6 sm:px-8 py-6 space-y-4 border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-800">
            Recommendation Summary
          </h2>

          {!recommendation ? (
            <p className="text-gray-600 text-sm sm:text-base">
              Select a crop and plant stage above, then click{" "}
              <span className="font-semibold text-green-700">
                Get Recommendations
              </span>{" "}
              to view fertilizer suggestions based on your realtime sensor
              readings.
            </p>
          ) : (
            <>
              <p className="text-gray-700 text-sm sm:text-base">
                Recommended NPK dose for{" "}
                <span className="font-semibold text-green-700">
                  {crop || "selected crop"}
                </span>{" "}
                at{" "}
                <span className="font-semibold text-green-700">
                  {STAGE_OPTIONS.find((s) => s.value === stage)?.label}
                </span>{" "}
                stage:
              </p>

              <div className="grid sm:grid-cols-3 gap-4 text-sm sm:text-base">
                <div className="rounded-2xl bg-[#ecfff4] px-4 py-3">
                  <p className="text-xs text-gray-500">Nitrogen (N)</p>
                  <p className="font-semibold text-green-800 mt-1">
                    {recommendation.n}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#ecfff4] px-4 py-3">
                  <p className="text-xs text-gray-500">Phosphorus (P)</p>
                  <p className="font-semibold text-green-800 mt-1">
                    {recommendation.p}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#ecfff4] px-4 py-3">
                  <p className="text-xs text-gray-500">Potassium (K)</p>
                  <p className="font-semibold text-green-800 mt-1">
                    {recommendation.k}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 text-sm sm:text-base">
                {recommendation.note}
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
