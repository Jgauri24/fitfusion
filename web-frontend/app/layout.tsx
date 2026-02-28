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
        <title>FitFusion Admin — Campus Fitness & Wellness</title>
      </head>
      <body className={`${inter.variable}`}>
        {!isClient ? (
          <main style={{ minHeight: "100vh", background: "var(--bg-primary)" }} />
        ) : isLogin ? (
          <main style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
            {children}
          </main>
        ) : (
          <div className="admin-layout">
            <Sidebar />
            <main className="main-content">
              {/* Clean Header — Notification + Profile */}
              <header style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "16px",
                padding: "16px 0 20px",
                marginBottom: "4px",
              }}>
                {/* Notification Bell */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowNotif(!showNotif)}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Bell size={18} color="var(--text-secondary)" />
                  </button>
                  {/* Badge */}
                  <span style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "var(--red)",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid var(--bg-primary)",
                  }}>
                    3
                  </span>

                  {/* Dropdown */}
                  {showNotif && (
                    <div style={{
                      position: "absolute",
                      top: "48px",
                      right: 0,
                      width: "300px",
                      background: "var(--bg-card-solid)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "14px",
                      padding: "16px",
                      zIndex: 100,
                      boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                      backdropFilter: "blur(16px)",
                    }}>
                      <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)", marginBottom: "12px" }}>Notifications</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ fontSize: "13px", color: "var(--text-secondary)", padding: "8px 10px", background: "var(--bg-elevated)", borderRadius: "8px" }}>
                          🚨 2 new burnout alerts flagged
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--text-secondary)", padding: "8px 10px", background: "var(--bg-elevated)", borderRadius: "8px" }}>
                          📊 Weekly wellness report ready
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--text-secondary)", padding: "8px 10px", background: "var(--bg-elevated)", borderRadius: "8px" }}>
                          ✅ Environment data updated
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Avatar */}
                <div
                  onClick={() => router.push("/profile")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    padding: "6px 12px 6px 6px",
                    borderRadius: "14px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#fff",
                  }}>
                    {adminInitials}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", lineHeight: "1.2" }}>{adminName}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Admin</span>
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