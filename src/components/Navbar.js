"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AgroSenseLogo from "@/components/ui/AgroSenseLogo";
import {
  Home,
  Info,
  User,
  Settings,
  Activity,
  Sprout,
  Menu,
  X,
  Bell,
  Moon,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
    setMenuOpen(false);
    router.push(href);
  };

  // Close popups on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".profile-box")) setProfileOpen(false);
      if (!e.target.closest(".settings-box")) setSettingsOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#f6f0fa] px-4 sm:px-8 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <AgroSenseLogo size={36} textSize="text-lg" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 bg-white/70 px-6 py-2 rounded-full shadow-md">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href}
              onClick={() => handleNavigate(item.href)}
            />
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Desktop Icons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Profile */}
            <div className="relative profile-box">
              <div
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setSettingsOpen(false);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 cursor-pointer transition"
              >
                <User className="text-green-600" size={20} />
              </div>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border p-4 animate-fadeIn">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
                      <User className="text-green-600" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-green-900">
                        Farmer
                      </p>
                      <p className="text-sm text-gray-500">Smart User</p>
                    </div>
                  </div>

                  <div className="my-3 border-t"></div>

                  <div className="text-sm space-y-1 text-gray-600">
                    <p>
                      <b>Role:</b> Farmer
                    </p>
                    <p>
                      <b>Access:</b> AI Recommendations
                    </p>
                    <p>
                      <b>Location:</b> India
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="relative settings-box">
              <div
                onClick={() => {
                  setSettingsOpen(!settingsOpen);
                  setProfileOpen(false);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 cursor-pointer transition"
              >
                <Settings className="text-green-600" size={20} />
              </div>

              {settingsOpen && (
                <div className="absolute right-0 mt-2 text-green-900 w-60 bg-white rounded-xl shadow-lg border p-3 animate-fadeIn">
                  <p className="text-sm font-semibold mb-2 px-2">Settings</p>

                  <button className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-100 rounded">
                    <Bell size={16} /> Notifications
                  </button>

                  {/* <button className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-100 rounded">
                    <Moon size={16} /> Dark Mode
                  </button> */}

                  <div className="border-t my-2"></div>

                  <button className="flex items-center gap-2 w-full px-2 py-2 text-red-600 hover:bg-red-50 rounded">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <button
            className="md:hidden p-2 bg-green-200 rounded-md"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden mt-3 overflow-hidden transition-all ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white p-4 rounded-lg shadow text-green-900">
          {navItems.map((item) => (
            <MobileNavItem
              key={item.href}
              {...item}
              active={pathname === item.href}
              onClick={() => handleNavigate(item.href)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavItem({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-full transition
      ${active ? "bg-green-200 text-green-800 font-semibold" : "text-green-600 hover:bg-green-100"}`}
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
}

function MobileNavItem({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex gap-3 px-4 py-2 rounded
      ${active ? "bg-green-100 font-semibold" : "hover:bg-green-50"}`}
    >
      {icon}
      {text}
    </button>
  );
}
