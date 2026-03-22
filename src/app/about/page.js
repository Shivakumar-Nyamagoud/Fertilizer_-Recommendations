"use client";

import { useEffect, useState } from "react";
import {
  Leaf,
  Activity,
  MonitorSmartphone,
  Sparkles,
  TrendingUp,
  Target,
} from "lucide-react";

import { useRouter } from "next/navigation";
import AboutSoil from "@/components/ui/About/AboutSoil";
import AboutPlatform from "@/components/ui/About/AboutPlatform";
import SystemOperation from "@/components/ui/About/SystemOperation";
import KeyFeatures from "@/components/ui/About/KeyFeatures";
import PlatformBenefits from "@/components/ui/About/PlatformBenefits";
import FutureEnhancement from "@/components/ui/About/FutureEnhancement";
import FeaturePill from "@/components/ui/FeatureFill";

import { useRef } from "react";

// export const metadata = {
//   title: "About | Smart Fertilizer Recommendation System",
// };

export default function AboutPage() {
  const [active, setActive] = useState("");
  const router = useRouter();
  const sections = [
    "overview",
    "platform",
    "about-soil",
    "system",
    "features",
    "ai",
    "benefits",
    "future",
    "technology",
    "vision",
  ];

  const navRef = useRef(null);
  useEffect(() => {
    if (!navRef.current) return;

    const activeEl = navRef.current.querySelector(`[data-id="${active}"]`);

    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [active]);

  // Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      let current = "";

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const rect = el.getBoundingClientRect();

        // Section is in viewport (top portion)
        if (rect.top <= 150 && rect.bottom >= 150) {
          current = id;
        }
      });

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen  pt-28 pb-16 px-4 flex justify-center bg-gradient-to-b from-[#012818] via-[#04512c] to-[#f3fff7]">
      {/* ✅ TOP SCROLL NAV (ALL SCREENS) */}
      <div className="fixed top-25 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-5xl px-4">
        <div
          className="flex gap-3 overflow-x-auto no-scrollbar bg-emerald-900/80 backdrop-blur-xl border border-white/10 rounded-full px-3 py-2 shadow-lg"
          ref={navRef}
        >
          {[
            { id: "overview", label: "Project Overview" },
            { id: "platform", label: "About the Web Platform" },
            { id: "about-soil", label: "About Soil Types" },
            { id: "system", label: "How the System Operates" },
            { id: "features", label: "Key Features of the Website" },
            { id: "benefits", label: "Benefits for Farmers" },
            { id: "ai", label: "How AI Recommendation Works" },
            { id: "future", label: "Future Enhancements" },
            { id: "technology", label: "Technology Stack" },
            { id: "vision", label: "Our Vision" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-id={item.id}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm transition ${
                active === item.id
                  ? "bg-white text-emerald-800 font-semibold"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 via-lime-400/20 to-emerald-500/30 blur-3xl opacity-60" />

        <div className="relative w-full bg-white/95 backdrop-blur-xl rounded-[32px] border border-emerald-50 shadow-[0_24px_60px_rgba(0,0,0,0.25)] px-6 sm:px-10 py-10 space-y-10">
          {/* HEADER */}
          <section id="overview" className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-xs font-medium text-emerald-700 shadow-sm">
              <Leaf size={16} /> Smart Farming Web Platform
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-900">
              About Smart Fertilizer Recommendation System
            </h1>

            <ul className="max-w-2xl mx-auto text-gray-600">
              <FeaturePill>
                An intelligent platform that turns realtime soil data into
                actionable farming insights.
              </FeaturePill>
            </ul>
          </section>

          <Divider />

          {/* OVERVIEW */}
          <Section
            id="overview"
            icon={<Activity size={20} />}
            title="Project Overview"
          >
            <>
              <p className="text-gray-700 text-justify">
                The Smart Fertilizer Recommendation System is a full-stack web
                application designed to help farmers and agricultural users
                select the most suitable fertilizer based on soil nutrients and
                crop type. The system uses machine learning to analyze key
                parameters such as nitrogen (N), phosphorus (P), potassium (K),
                temperature, humidity, moisture, and crop type to provide
                accurate fertilizer recommendations.
              </p>
              <p className="text-gray-700 text-justify">
                The application consists of a React/Next.js frontend and a
                FastAPI backend. Users input soil and crop details through an
                intuitive interface, and the backend processes this data using a
                trained ML model to predict the best fertilizer along with a
                confidence score.
              </p>
              <p className="text-gray-700 text-justify">
                To enhance usability, the system can also display top multiple
                fertilizer suggestions ranked by probability, allowing users to
                make informed decisions. Additionally, the platform includes
                educational content such as soil information and benefits for
                farmers, making it both a predictive and informative tool.
              </p>
            </>
          </Section>
          <Divider />
          {/* PLATFORM */}
          <Section
            id="platform"
            icon={<MonitorSmartphone size={20} />}
            title="About the Web Platform"
          >
            <AboutPlatform />
          </Section>
          <Divider />
          {/* SOIL */}
          <Section
            id="about-soil"
            icon={<Leaf size={20} />}
            title="About Soil Types"
          >
            <AboutSoil />
          </Section>
          <Divider />
          {/* SYSTEM */}
          <Section
            id="system"
            icon={<Sparkles size={20} />}
            title="How the System Operates"
          >
            <SystemOperation />
          </Section>
          <Divider />
          {/* FEATURES */}
          <Section
            id="features"
            icon={<TrendingUp size={20} />}
            title="Key Features"
          >
            <KeyFeatures />
          </Section>
          <Divider />
          {/* BENEFITS */}
          <Section
            id="benefits"
            icon={<Leaf size={20} />}
            title="Benefits for Farmers"
          >
            <PlatformBenefits />
          </Section>
          <Divider />
          <Section
            id="ai"
            icon={<Sparkles size={20} />}
            title="How AI Recommendation Works"
          >
            <ul className="list-disc list-inside text-gray-700 space-y-2 font-mono">
              <li>Collect soil parameters (N, P, K, moisture, pH)</li>
              <li>Preprocess and normalize input data</li>
              <li>Feed data into trained ML model</li>
              <li>Predict best fertilizer combination</li>
              <li>Return recommendation with confidence score</li>
            </ul>

            <button
              onClick={() => router.push("/recommendations")}
              className="group relative inline-flex items-center gap-2 px-6 py-3 ml-10 mt-4 text-lg font-semibold text-white 
             bg-gradient-to-r from-green-500 to-emerald-600 cursor-pointer
             rounded-full shadow-lg transition-all duration-300 
             hover:scale-105 hover:shadow-xl active:scale-95 animate-bounce"
            >
              {/* Glow Effect */}
              <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:rotate-360 " />
              <span className="">Try AI Prediction</span>
              <span
                className="absolute inset-0 rounded-full bg-green-400 opacity-0 blur-md 
                   group-hover:opacity-30 transition duration-300"
              ></span>
            </button>
          </Section>
          <Divider />
          {/* FUTURE */}
          <Section
            id="future"
            icon={<Sparkles size={20} />}
            title="Future Enhancements"
          >
            <FutureEnhancement />
          </Section>
          <Divider />
          <Section
            id="technology"
            icon={<MonitorSmartphone size={20} />}
            title="Technology Stack"
          >
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-emerald-200 p-4 rounded-xl">
                <p className="font-semibold text-emerald-800">Frontend</p>

                <ul className="grid sm:grid-cols-2 gap-3 text-gray-700 text-sm sm:text-base">
                  <FeaturePill>Next.js</FeaturePill>
                  <FeaturePill>Tailwind CSS</FeaturePill>
                </ul>
              </div>
              <div className="bg-emerald-200 p-4 rounded-xl">
                <p className="font-semibold text-emerald-800">Backend</p>

                <ul className="grid sm:grid-cols-2 gap-3 text-gray-700 text-sm sm:text-base">
                  <FeaturePill>FastAPI (Python)</FeaturePill>
                  <FeaturePill>REST API</FeaturePill>
                </ul>
              </div>
              <div className="bg-emerald-200 p-4 rounded-xl">
                <p className="font-semibold text-emerald-800">ML Model</p>

                <ul className="grid sm:grid-cols-2 gap-3 text-gray-700 text-sm sm:text-base">
                  <FeaturePill>Python</FeaturePill>
                  <FeaturePill>Scikit-learn</FeaturePill>
                </ul>
              </div>
              <div className="bg-emerald-200 p-4 rounded-xl">
                <p className="font-semibold text-emerald-800">Programming</p>

                <ul className="grid sm:grid-cols-2 gap-3 text-gray-700 text-sm sm:text-base">
                  <FeaturePill>C++</FeaturePill>
                  <FeaturePill>Java Script</FeaturePill>
                </ul>
              </div>
            </div>
            <div className="bg-emerald-200 p-4 rounded-xl text-sm">
              <p className="font-semibold text-emerald-800">IoT Sensors</p>
              <ul className="grid sm:grid-cols-3 gap-3 text-gray-700 text-sm sm:text-base">
                <FeaturePill>pH</FeaturePill>{" "}
                <FeaturePill>Temparature & Humidity</FeaturePill>
                <FeaturePill>Soil Moisture</FeaturePill>
                <FeaturePill>NPK</FeaturePill>
                <FeaturePill>TDS</FeaturePill>
              </ul>
            </div>
          </Section>
          <Divider />
          {/* VISION */}
          <section id="vision" className="text-center pt-6 border-t">
            <div className="inline-flex items-center gap-2 bg-emerald-600 px-4 py-1 rounded-full">
              <Target size={16} /> Vision
            </div>
            <p className="text-gray-700 mt-2 max-w-xl mx-auto">
              Our vision is to revolutionize agriculture by empowering farmers
              with intelligent, data-driven insights that enhance productivity,
              promote sustainable practices, and improve livelihoods, while
              ensuring a smarter and more secure future for global food systems.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

/* Reusable Components */

function Section({ id, icon, title, children }) {
  return (
    <section id={id} className="space-y-4 scroll-mt-32">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 flex items-center justify-center bg-emerald-50 rounded-full text-emerald-700">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-emerald-800">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Divider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
  );
}
