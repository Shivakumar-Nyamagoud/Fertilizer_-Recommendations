import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Fertilizer Recommendations",
  description: "Fertilizer recommendations system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6f0fa]">
        <div className="bg-[#f6f0fa]">
          <Navbar />
        </div>

        {/* Main content area */}
        <main className="p-8 text-white">{children}</main>
      </body>
    </html>
  );
}
