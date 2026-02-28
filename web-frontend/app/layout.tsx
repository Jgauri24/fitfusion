"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Bell, Search } from "lucide-react";
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [adminInitials, setAdminInitials] = useState("A");
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
              {/* Top Header Bar */}
              <header className="top-header">
                <div className="top-header-left">
                  <div className="header-search">
                    <span className="header-search-icon">
                      <Search size={16} />
                    </span>
                    <input type="text" placeholder="Search anything..." />
                  </div>
                </div>

                <div className="top-header-right">
                  {/* Avatar Group */}
                  <div className="header-avatar-group">
                    <div className="avatar-circle" style={{ background: "#a855f7" }}>A</div>
                    <div className="avatar-circle" style={{ background: "#f59e0b" }}>B</div>
                    <div className="avatar-circle" style={{ background: "#5e9eff" }}>C</div>
                    <div className="avatar-overflow">+12</div>
                  </div>

                  {/* Status Pills */}
                  <div className="header-status-pill">
                    <span className="status-dot online"></span>
                    12 of 15 <span style={{ color: "var(--text-muted)" }}>active</span>
                  </div>

                  <div className="header-status-pill">
                    <span className="status-dot break"></span>
                    2 on break
                  </div>

                  {/* Notifications */}
                  <button
                    className="notification-btn"
                    onClick={() => setDrawerOpen(!drawerOpen)}
                  >
                    <Bell size={18} color="var(--text-secondary)" />
                    <span className="notification-badge">24</span>
                  </button>

                  {/* Profile */}
                  <div className="header-profile" onClick={() => router.push("/profile")}>
                    <div className="header-profile-avatar">{adminInitials}</div>
                    <div className="header-profile-info">
                      <span className="header-profile-name">{adminName}</span>
                      <span className="header-profile-role">Admin</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Notification Drawer */}
              {drawerOpen && (
                <div style={{
                  position: "fixed",
                  top: "70px",
                  right: "60px",
                  width: "320px",
                  background: "var(--bg-card-solid)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "20px",
                  zIndex: 100,
                  boxShadow: "var(--shadow-lg)",
                  backdropFilter: "blur(16px)",
                }}>
                  <div style={{ fontWeight: 600, marginBottom: "12px", color: "var(--text-primary)" }}>Notifications</div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>🚨 You have 24 unread burnout alerts.</div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Review flagged cohorts in the Users section.</p>
                </div>
              )}

              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
