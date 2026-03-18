"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-0">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* About */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-2">
            Smart Agriculture
          </h2>
          <p className="text-sm leading-relaxed">
            Empowering farmers with data-driven insights for better crop yield,
            sustainable farming, and smarter decisions.
          </p>
        </div>

        {/* Quick Links */}
        <div className="ml-40">
          <h2 className=" text-white font-semibold text-lg mb-2">
            Quick Links
          </h2>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/" className="hover:text-green-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-green-400">
                About
              </Link>
            </li>
            <li>
              <Link href="/recommendations" className="hover:text-green-400">
                Prediction
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="ml-30">
          <h2 className="text-white font-semibold text-lg mb-2">Contact</h2>
          <p className="text-sm">Email: support@smartagri.com</p>
          <p className="text-sm">Location: Bengaluru, India</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center py-1 text-sm ">
        <p className="flex justify-center items-center gap-2 text-sm text-gray-300 py-4">
          © {new Date().getFullYear()} Smart Agriculture. Made with
          <span className="text-green-500 text-4xl leading-none animate-bounce drop-shadow-lg">
            💚
          </span>
        </p>
      </div>
    </footer>
  );
}
