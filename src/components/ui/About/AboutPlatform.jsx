import React from "react";

const AboutPlatform = () => {
  return (
    <div className="space-y-4">
      <p className="text-gray-700 leading-relaxed text-justify">
        The website serves as the primary interaction layer for the smart
        fertilizer recommendation system. It is designed to be clean,
        responsive, and easy to use, even for users with minimal technical
        background. Complex soil and nutrient data is transformed into clear
        insights, simple language, and actionable recommendations, enabling
        farmers to focus more on productivity rather than technology.
      </p>

      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>
          Central dashboard displaying soil nutrient values (N, P, K) and key
          input parameters
        </li>
        <li>
          Real-time prediction module powered by machine learning for accurate
          fertilizer recommendations
        </li>
        <li>
          Intelligent fallback system that provides recommendations based on
          nutrient values even when crop data is unavailable
        </li>
        <li>
          Clear and simple UI for easy understanding and usability by farmers
        </li>
        <li>
          API-based architecture enabling seamless integration between frontend
          and backend systems
        </li>
      </ul>
    </div>
  );
};

export default AboutPlatform;
