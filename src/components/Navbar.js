"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AgroSenseLogo from "@/components/ui/AgroSenseLogo";
import {
  Home,
  LayoutDashboard,
  Info,
  User,
  Settings,
  Activity,
  Sprout,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { icon: <Home size={18} />, text: "Home", href: "/" },

    {
      icon: <Activity size={18} />,
      text: "Sensor Reading",
      href: "/sensorreading",
    },
    {
      icon: <Sprout size={18} />,
      text: "Recommendations",
      href: "/recommendations",
    },
    { icon: <Info size={18} />, text: "About", href: "/about" },
  ];

  const handleNavigate = (href) => {
    setOpen(false); // close mobile menu when navigating
    router.push(href);
  };

  return (
    <nav className="w-full bg-[#f6f0fa] px-4 sm:px-8 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LEFT: Logo (always visible, aligned to left) */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            setOpen(false);
            router.push("/");
          }}
        >
          <div className="flex items-center">
            {/* Use a compact size so it fits well on small screens */}
            <AgroSenseLogo size={36} textSize="text-lg" />
          </div>
        </div>

        {/* CENTER: pill nav (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-6 bg-white/70 px-6 py-2 rounded-full shadow-md">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              text={item.text}
              active={pathname === item.href}
              onClick={() => handleNavigate(item.href)}
            />
          ))}
        </div>

        {/* RIGHT: icons + mobile menu button */}
        <div className="flex items-center gap-3">
          {/* desktop icons */}
          <div className="hidden sm:flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 cursor-pointer"
              onClick={() => router.push("/profile")}
              title="Profile"
            >
              <User className="text-green-500" size={20} />
            </div>

            <div
              className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 cursor-pointer"
              onClick={() => router.push("/settings")}
              title="Settings"
            >
              <Settings className="text-green-500" size={20} />
            </div>
          </div>

          {/* hamburger for small screens */}
          <button
            className="md:hidden p-2 rounded-md bg-white/60 hover:bg-white/80"
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <X size={20} className="text-green-600" />
            ) : (
              <Menu size={20} className="text-green-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu: shown when `open` is true (collapsible) */}
      <div
        className={`md:hidden mt-3 transition-[max-height,opacity] duration-200 ease-in-out overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="bg-white/95 p-4 rounded-lg shadow-md">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <MobileNavItem
                key={item.href}
                icon={item.icon}
                text={item.text}
                active={pathname === item.href}
                onClick={() => handleNavigate(item.href)}
              />
            ))}
            {/* small divider and quick links */}
            <div className="h-px bg-gray-100 my-2" />
            <button
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
              className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-md text-green-700 hover:bg-green-50"
            >
              <User size={18} /> Profile
            </button>
            <button
              onClick={() => {
                setOpen(false);
                router.push("/settings");
              }}
              className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-md text-green-700 hover:bg-green-50"
            >
              <Settings size={18} /> Settings
            </button>
          </div>
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
          ? "bg-emerald-200 text-green-800 font-semibold"
          : "text-green-600 hover:bg-green-100"
      }`}
    >
      <span className="text-green-500">{icon}</span>
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
}

/* Mobile stacked nav item */
function MobileNavItem({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-md transition-colors
        ${
          active
            ? "bg-emerald-100 text-green-800 font-semibold"
            : "text-green-700 hover:bg-green-50"
        }`}
    >
      <span className="text-green-500">{icon}</span>
      <span>{text}</span>
    </button>
  );
}
