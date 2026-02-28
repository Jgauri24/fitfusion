"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [adminInitials, setAdminInitials] = useState("A");
  const [showNotif, setShowNotif] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (!token && pathname !== "/login") {
      router.push("/login");
    } else if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.firstName) {
          const fullName = `${parsed.firstName} ${parsed.lastName || ""}`.trim();
          setAdminName(fullName);
          setAdminInitials(
            parsed.firstName.charAt(0).toUpperCase() +
            (parsed.lastName ? parsed.lastName.charAt(0).toUpperCase() : "")
          );
        }
      } catch (e) { }
    }
  }, [pathname, router]);

  const isLogin = pathname === "/login";

  return (
    <html lang="en">
      <head>
        <title>VITA Admin — Campus Wellness Intelligence</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} bg-gray-100 text-gray-900 font-sans antialiased`}>
        {!isClient ? (
          <main className="loading-container" />
        ) : isLogin ? (
          <main>
            {children}
          </main>
        ) : (
          <div className="admin-layout">
            <Sidebar />
            <main className="main-content">
              {/* Header — Notification + Profile */}
              <header className="top-header">
                {/* Notification Bell */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowNotif(!showNotif)}
                    className="header-notification-btn"
                  >
                    <Bell size={18} />
                  </button>
                  <span className="header-notification-badge">3</span>

                  {showNotif && (
                    <div className="header-notification-dropdown">
                      <div className="header-notification-title">Notifications</div>
                      <div className="header-notification-list">
                        <div className="header-notification-item">
                          🚨 2 new burnout alerts flagged
                        </div>
                        <div className="header-notification-item">
                          📊 Weekly wellness report ready
                        </div>
                        <div className="header-notification-item">
                          ✅ Environment data updated
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Chip */}
                <div
                  onClick={() => router.push("/profile")}
                  className="header-profile-chip"
                >
                  <div className="header-profile-avatar">
                    {adminInitials}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span className="header-profile-name">{adminName}</span>
                    <span className="header-profile-role">Admin</span>
                  </div>
                </div>
              </header>

              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}