"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Info,
  User,
  Settings,
  Activity,
  Sprout,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="w-full  bg-[#f6f0fa] px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="mx-auto flex items-center gap-6 bg-white/70 px-6 py-2 rounded-full shadow-md">
        <NavItem
          icon={<Home size={18} />}
          text="Home"
          active={pathname === "/"}
          onClick={() => router.push("/")}
        />

        <NavItem
          icon={<LayoutDashboard size={18} />}
          text="Dashboard"
          active={pathname === "/dashboard"}
          onClick={() => router.push("/dashboard")}
        />

        <NavItem
          icon={<Activity size={18} />}
          text="Sensor Reading"
          active={pathname === "/sensorreading"}
          onClick={() => router.push("/sensorreading")}
        />

        <NavItem
          icon={<Sprout size={18} />}
          text="Recommendations"
          active={pathname === "/recommendations"}
          onClick={() => router.push("/recommendations")}
        />

        <NavItem
          icon={<Info size={18} />}
          text="About"
          active={pathname === "/about"}
          onClick={() => router.push("/about")}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
          <User className="text-green-500" size={20} />
        </div>

        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
          <Settings className="text-green-500" size={20} />
        </div>
      </div>
    </nav>
  );
}

function NavItem({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all cursor-pointer
      ${
        active
          ? "bg-violet-200 text-green-800 font-semibold"
          : "text-green-600 hover:bg-green-100"
      }`}
    >
      <span className="text-green-500">{icon}</span>
      <span>{text}</span>
    </button>
  );
}
