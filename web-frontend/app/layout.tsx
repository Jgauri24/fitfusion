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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
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
          setAdminName(`${parsed.firstName} ${parsed.lastName || ""}`.trim());
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
          <main style={{ minHeight: "100vh", background: "var(--bg-base)" }} />
        ) : isLogin ? (
          <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
            {children}
          </main>
        ) : (
          <div className="admin-layout">
            <Sidebar />
            <main className="main-content">
              <header style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: "16px",
              }}>
                <button
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  style={{
                    background: "#111",
                    border: "1px solid #1f1f1f",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    position: "relative",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                  <Bell size={20} color="var(--text-secondary)" />
                  <span style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    background: "#FF4444",
                    color: "white",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    fontSize: "9px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>24</span>
                </button>
              </header>

              {/* Minimal mock notification drawer for demonstration */}
              {drawerOpen && (
                <div style={{
                  position: "fixed",
                  top: "20px",
                  right: "60px",
                  width: "300px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "20px",
                  zIndex: 100,
                  boxShadow: "var(--shadow-lg)"
                }}>
                  <div style={{ fontWeight: 600, marginBottom: "12px", color: "var(--text-primary)" }}>Notifications</div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>🚨 You have 24 unread burnout alerts.</div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>This is a mock drawer.</p>
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
