import {
  Leaf,
  Activity,
  MonitorSmartphone,
  Sparkles,
  TrendingUp,
  Target,
} from "lucide-react";

export const metadata = {
  title: "About | Smart Fertilizer Recommendation System",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 px-4 flex justify-center bg-gradient-to-b from-[#012818] via-[#04512c] to-[#f3fff7]">
      <div className="w-full max-w-6xl relative">
        {/* soft glow behind card */}
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 via-lime-400/20 to-emerald-500/30 blur-3xl opacity-60" />

        {/* main card */}
        <div className="relative w-full bg-white/95 backdrop-blur-xl rounded-[32px] border border-emerald-50 shadow-[0_24px_60px_rgba(0,0,0,0.25)] px-6 sm:px-10 py-10 space-y-10">
          {/* top badge + title */}
          <section className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-xs font-medium text-emerald-700 shadow-sm">
              <Leaf size={16} /> Smart Farming Web Platform
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tracking-tight">
              About Smart Fertilizer Recommendation System
            </h1>

            <p className="max-w-2xl mx-auto mt-2 text-gray-600 text-base sm:text-lg">
              An intelligent, web-first platform that turns realtime soil data
              into clear, actionable guidance for precision agriculture and
              sustainable farming.
            </p>

            {/* quick stats */}
            <div className="mt-5 grid gap-4 sm:grid-cols-3 text-sm">
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-left">
                <p className="text-[11px] uppercase tracking-wide text-emerald-600">
                  Core Modules
                </p>
                <p className="text-lg font-semibold text-emerald-900">
                  Dashboard · Sensors · NPK
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-left">
                <p className="text-[11px] uppercase tracking-wide text-emerald-600">
                  Focus
                </p>
                <p className="text-lg font-semibold text-emerald-900">
                  Realtime insights
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-left">
                <p className="text-[11px] uppercase tracking-wide text-emerald-600">
                  Designed For
                </p>
                <p className="text-lg font-semibold text-emerald-900">
                  Farmers & agronomists
                </p>
              </div>
            </div>
          </section>

          {/* separator line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

          {/* Project Overview */}
          <section className="space-y-4">
            <HeaderWithIcon
              icon={<Activity size={20} />}
              title="Project Overview"
            />

            <p className="text-gray-700 leading-relaxed">
              The Smart Fertilizer Recommendation System is a modern web-based
              platform designed to assist farmers in making accurate and
              data-driven decisions related to fertilizer application and
              irrigation scheduling. The website integrates real-time IoT sensor
              data, intelligent algorithms and an intuitive user interface to
              deliver precise recommendations that improve crop productivity
              while reducing resource wastage.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Unlike traditional farming methods that rely heavily on manual
              observation and intuition, this platform introduces automation and
              intelligence into agricultural decision-making. The website acts
              as a centralized hub where farmers can monitor live sensor
              readings, analyze soil conditions and receive customized
              fertilizer suggestions based on crop type and environmental
              factors.
            </p>
          </section>

          {/* Website Focus */}
          <section className="space-y-4">
            <HeaderWithIcon
              icon={<MonitorSmartphone size={20} />}
              title="About the Web Platform"
            />

            <p className="text-gray-700 leading-relaxed">
              The website is the primary interaction layer for the entire smart
              farming ecosystem. It is designed to be clean, responsive and easy
              to understand, even for users with minimal technical background.
              Complex sensor data is converted into visual insights, simple
              language and clear calls to action so that farmers can focus on
              their field instead of struggling with technology.
            </p>

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Central dashboard displaying live soil moisture, temperature, pH
                and nutrient levels
              </li>
              <li>
                Sensor Reading page for real-time monitoring of field conditions
                and sensor health
              </li>
              <li>
                Recommendation module providing precise fertilizer quantity,
                type and application schedule
              </li>
              <li>
                Alerts and notifications when soil nutrients or moisture move
                out of the optimal range
              </li>
              <li>
                Historical data visualization for trend analysis and smarter
                long-term planning
              </li>
            </ul>
          </section>

          {/* System Working */}
          <section className="space-y-4">
            <HeaderWithIcon
              icon={<Sparkles size={20} />}
              title="How the System Operates"
            />

            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>
                Sensors deployed in the agricultural field collect soil and
                environmental data.
              </li>
              <li>
                Data is securely transmitted to the cloud via IoT communication
                modules.
              </li>
              <li>
                The backend processes, validates and analyzes incoming data.
              </li>
              <li>
                The system calculates fertilizer requirements based on crop
                needs, soil nutrient levels and growth stage.
              </li>
              <li>
                The website presents recommendations in a clear, structured and
                farmer-friendly format.
              </li>
            </ol>
          </section>

          {/* Key Features */}
          <section className="space-y-4">
            <HeaderWithIcon
              icon={<TrendingUp size={20} />}
              title="Key Features of the Website"
            />

            <ul className="grid sm:grid-cols-2 gap-3 text-gray-700 text-sm sm:text-base">
              <FeaturePill>Real-time sensor monitoring dashboard</FeaturePill>
              <FeaturePill>Smart fertilizer recommendation engine</FeaturePill>
              <FeaturePill>Visual data charts and analytics</FeaturePill>
              <FeaturePill>User-friendly navigation interface</FeaturePill>
              <FeaturePill>Crop-specific guidance system</FeaturePill>
              <FeaturePill>Responsive design for mobile and tablet</FeaturePill>
            </ul>
          </section>

          {/* Benefits */}
          <section className="space-y-4">
            <HeaderWithIcon
              icon={<Leaf size={20} />}
              title="Benefits for Farmers"
            />

            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Optimized use of fertilizers and irrigation water</li>
              <li>Improved crop yield, quality and consistency</li>
              <li>Reduced farming costs and input wastage</li>
              <li>Prevention of soil nutrient imbalance and degradation</li>
              <li>Promotion of climate-smart and sustainable practices</li>
            </ul>
          </section>

          {/* Future Scope */}
          <section className="space-y-4">
            <HeaderWithIcon
              icon={<Sparkles size={20} />}
              title="Future Enhancements"
            />

            <p className="text-gray-700 leading-relaxed">
              Future development of the platform includes integration of
              AI-based disease detection, automated irrigation and fertigation
              control, more advanced crop prediction models and multilingual
              support to reach farmers across different regions. Weather
              forecasting and market price integration can further strengthen
              decision-making and planning at the farm level.
            </p>
          </section>

          {/* Vision */}
          <section className="text-center space-y-3 pt-4 border-t border-emerald-50">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-4 py-1">
              <Target size={18} className="text-emerald-700" />
              <span className="text-xs font-semibold tracking-wide text-emerald-800">
                Our Vision
              </span>
            </div>
            <p className="mt-1 text-gray-700 leading-relaxed max-w-2xl mx-auto">
              To empower farmers with cutting-edge yet accessible technology
              that transforms traditional agriculture into a smart, efficient
              and sustainable ecosystem – where every fertilizer decision is
              backed by realtime intelligence and every field becomes a
              data-driven farm.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

/* Reusable small components */

function HeaderWithIcon({ icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        {icon}
      </div>
      <h2 className="text-2xl font-semibold text-emerald-800">{title}</h2>
    </div>
  );
}

function FeaturePill({ children }) {
  return (
    <li className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 shadow-sm">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      <span>{children}</span>
    </li>
  );
}
