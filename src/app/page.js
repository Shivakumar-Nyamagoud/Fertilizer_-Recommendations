"use client";

import { useRouter, usePathname } from "next/navigation";

import { Sprout, Activity, Info, ArrowRight } from "lucide-react";
import GradientButton from "../components/ui/GradientButton";
import RealtimeReadingsCard from "../components/ui/RealtimeReadingsCard";

export default function HomePage() {
  const router = useRouter();

  const demoReadings = {};

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 flex justify-center bg-gradient-to-b from-[#012818] via-[#044625] to-[#f3fff7]">
      <div className="w-full max-w-6xl space-y-12">
        {/* HERO SECTION */}
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center">
          <div className="space-y-6 text-emerald-50">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-medium">
              <Sprout size={16} />
              Smart Fertilizer Recommendation System
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              Turn your soil data into{" "}
              <span className="text-lime-300">smart fertilizer decisions.</span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/85 max-w-xl">
              Monitor realtime sensor readings, understand your soil health and
              get precise NPK recommendations for each crop and growth stage –
              all from one simple web dashboard.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <GradientButton
                onClick={() => router.push("/recommendations")}
                className="bg-gradient-to-r from-emerald-500 to-green-500 flex items-center gap-2"
              >
                Get Recommendations
                <ArrowRight size={18} />
              </GradientButton>

              <button
                onClick={() => router.push("/sensorreading")}
                className="rounded-full px-6 py-3 text-sm sm:text-base font-medium
                           border border-emerald-200/70 text-emerald-50
                           bg-white/5 hover:bg-white/10 transition-colors"
              >
                View Sensor Readings
              </button>
            </div>

            <p className="text-[11px] sm:text-xs text-emerald-100/70">
              Works best with calibrated soil moisture, pH and temperature
              sensors installed in the field.
            </p>
          </div>

          {/* Right side – small live card */}
          <div className="flex justify-center lg:justify-end">
            <RealtimeReadingsCard readings={demoReadings} />
          </div>
        </section>

        {/* QUICK FEATURES ROW */}
        <section className="grid gap-6 md:grid-cols-3">
          <InfoCard
            icon={<Activity size={20} />}
            title="Realtime Monitoring"
            text="Track pH, moisture and temperature as they change in your field to avoid stress and over-irrigation."
          />
          <InfoCard
            icon={<Sprout size={20} />}
            title="Smart NPK Guidance"
            text="Get crop- and stage-specific fertilizer recommendations instead of one-size-fits-all doses."
          />
          <InfoCard
            icon={<Info size={20} />}
            title="Simple & Visual"
            text="Designed for farmers first – clean screens, clear language and mobile-friendly layout."
          />
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-white/95 rounded-3xl shadow-xl px-6 sm:px-10 py-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-emerald-900">
            How this website helps you in the field
          </h2>
          <p className="text-gray-700 text-sm sm:text-base">
            The system connects your field sensors with this web platform. Once
            installed, you can:
          </p>
          <ol className="list-decimal list-inside text-gray-700 text-sm sm:text-base space-y-1">
            <li>
              Check live soil and climate values from the Sensor Readings page.
            </li>
            <li>
              Select your crop and growth stage on the Recommendations page.
            </li>
            <li>
              Get NPK dosage suggestions based on current sensor values and
              agronomy rules.
            </li>
            <li>
              Apply fertilizers in split doses as advised to reduce wastage.
            </li>
          </ol>
          <p className="text-gray-600 text-xs sm:text-sm">
            As you expand, more fields and sensor nodes can be added, and a
            personalized dashboard will help you manage multiple plots.
          </p>
        </section>
      </div>
    </main>
  );
}

/* Small reusable card for the feature section */
function InfoCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-md shadow-lg px-5 py-4 space-y-3 border border-emerald-50">
      <div className="flex items-center gap-2 text-emerald-700">
        <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-600">{text}</p>
    </div>
  );
}
