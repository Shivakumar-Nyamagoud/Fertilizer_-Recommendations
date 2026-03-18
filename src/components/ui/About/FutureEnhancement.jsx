import React from "react";
import FeaturePill from "../FeatureFill";
const FutureEnhancement = () => {
  return (
    <ul className="grid sm:grid-cols-2 gap-3 text-gray-700 text-sm sm:text-base">
      <FeaturePill>
        Integration of AI-based crop disease detection for early identification
        and prevention of plant health issues
      </FeaturePill>
      <FeaturePill>
        Automated irrigation and fertigation systems for efficient water and
        nutrient management
      </FeaturePill>

      <FeaturePill>
        Continuous model improvement using updated datasets to enhance
        prediction accuracy over time
      </FeaturePill>
      <FeaturePill>
        Multilingual support to make the platform accessible to farmers across
        different regions and languages
      </FeaturePill>
      <FeaturePill>
        Integration of weather forecasting to support better planning and risk
        management
      </FeaturePill>
      <FeaturePill>
        Market price insights to help farmers make informed decisions about crop
        selling and profitability
      </FeaturePill>
    </ul>
  );
};

export default FutureEnhancement;
