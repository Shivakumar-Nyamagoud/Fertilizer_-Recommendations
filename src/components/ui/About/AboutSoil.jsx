import React from "react";

const soilTypes = [
  {
    name: "Sandy Soil",
    image: "/images/soil/sandy.png",
    description:
      "Light, dry, and coarse soil with large particles. It drains water quickly but has low nutrient retention, making frequent fertilization necessary.",
  },
  {
    name: "Loamy Soil",
    image: "/images/soil/loamy.png",
    description:
      "A balanced mix of sand, silt, and clay. It is highly fertile, retains moisture well, and is ideal for most crops.",
  },
  {
    name: "Black Soil",
    image: "/images/soil/black.png",
    description:
      "Rich in minerals and known for high moisture retention. Suitable for crops like cotton and wheat.",
  },
  {
    name: "Red Soil",
    image: "/images/soil/red.png",
    description:
      "Reddish in color due to iron content. It is porous and well-drained but requires fertilizers to improve productivity.",
  },
  {
    name: "Clayey Soil",
    image: "/images/soil/clayey.png",
    description:
      "Heavy soil with fine particles. It retains water well but has poor drainage and aeration.",
  },
];

const AboutSoil = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {soilTypes.map((soil, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <img
            src={soil.image}
            alt={soil.name}
            className="w-full h-40 object-cover"
          />

          <div className="p-4">
            <h3 className="text-lg font-semibold text-green-700">
              {soil.name}
            </h3>
            <p className="text-gray-600 text-sm mt-2">{soil.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutSoil;
