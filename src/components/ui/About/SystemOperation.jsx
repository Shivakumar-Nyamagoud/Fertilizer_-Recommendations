import React from "react";

const SystemOperation = () => {
  return (
    <div className="space-y-4">
      <ol className="list-decimal list-inside text-gray-700 text-justify space-y-3">
        <li>
          The user provides essential input data such as soil nutrient values
          (Nitrogen, Phosphorus, Potassium) along with optional crop information
          through a simple and user-friendly interface.
        </li>

        <li>
          The input data is validated on the frontend and securely sent to the
          backend API for processing, ensuring correctness and consistency of
          values.
        </li>

        <li>
          The backend system preprocesses the input by handling missing values,
          normalizing data if required, and preparing it for the machine
          learning model.
        </li>

        <li>
          The trained machine learning model analyzes the input data and
          predicts the most suitable fertilizer recommendation based on learned
          patterns from historical agricultural datasets.
        </li>

        <li>
          If crop information is unavailable or not recognized, the system
          intelligently falls back to nutrient-based logic to ensure a valid and
          reliable recommendation.
        </li>

        <li>
          The prediction result, along with confidence level and fertilizer
          details, is sent back to the frontend through the API.
        </li>

        <li>
          The website displays the recommendation in a clear, structured, and
          farmer-friendly format, enabling quick understanding and practical
          application.
        </li>

        <li>
          The system can be further enhanced by storing past predictions for
          analysis, improving model performance, and supporting better long-term
          decision-making.
        </li>
      </ol>
    </div>
  );
};

export default SystemOperation;
