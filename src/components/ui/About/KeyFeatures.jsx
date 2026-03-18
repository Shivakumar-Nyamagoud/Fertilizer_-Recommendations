import React from "react";
import FeaturePill from "../FeatureFill";
import { Target } from "lucide-react";

const KeyFeatures = () => {
  return (
    <ul className="grid sm:grid-cols-2 gap-3 text-gray-700 text-sm sm:text-base">
      <FeaturePill>Smart fertilizer recommendation engine</FeaturePill>
      <FeaturePill>Real-time prediction using machine learning</FeaturePill>
      <FeaturePill>NPK-based soil analysis</FeaturePill>
      <FeaturePill>Fallback recommendation for unknown crops</FeaturePill>
      <FeaturePill>Simple and user-friendly interface</FeaturePill>
      <FeaturePill>Responsive design for mobile and desktop</FeaturePill>

      <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 shadow-sm text-justify">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <Target />
        <p>More then 80% accurecy for every prediction</p>
      </div>
    </ul>
  );
};

export default KeyFeatures;
