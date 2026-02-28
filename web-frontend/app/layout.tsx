"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface Notification {
  id: string;
  type: "alert" | "info" | "warning" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

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
  const panelRef = useRef<HTMLDivElement>(null);

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

  // Fetch notifications
  useEffect(() => {
    if (pathname === "/login") return;
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/api/admin/notifications");
        setNotifications(res.data);
      } catch (e) {
        // Fallback: generate client-side notifications from context
        setNotifications(generateLocalNotifications());
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [pathname]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    };
    if (drawerOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [drawerOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertTriangle size={16} color="#FF4444" />;
      case "warning": return <Zap size={16} color="#FFB800" />;
      case "success": return <Check size={16} color="#00C853" />;
      default: return <Info size={16} color="var(--blue)" />;
    }
  };

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
                <div ref={panelRef} style={{
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

// Local fallback notifications when API isn't available
function generateLocalNotifications(): Notification[] {
  const now = new Date();
  return [
    { id: "1", type: "alert", title: "Burnout Risk Detected", message: "5 students in Kasturba Bhawan showing low mood scores consistently over the past week.", time: "2 min ago", read: false },
    { id: "2", type: "warning", title: "Low Activity Alert", message: "Activity logging has dropped 23% across all hostels compared to last week.", time: "15 min ago", read: false },
    { id: "3", type: "info", title: "New Food Items Added", message: "16 new food items were added to the nutrition database by the system.", time: "1 hour ago", read: false },
    { id: "4", type: "success", title: "Database Seeded", message: "1,500 student profiles with complete activity and nutrition history have been generated.", time: "2 hours ago", read: false },
    { id: "5", type: "alert", title: "High Stress in Year 1", message: "First-year students across Sarojini and Govind bhawan report elevated stress levels.", time: "3 hours ago", read: false },
    { id: "6", type: "info", title: "Weekly Report Ready", message: "The weekly campus wellness report is now available for download.", time: "5 hours ago", read: true },
    { id: "7", type: "warning", title: "AQI Spike — Library Zone", message: "Air quality index in the Library zone has crossed 150 (Unhealthy for sensitive groups).", time: "6 hours ago", read: true },
    { id: "8", type: "success", title: "Environment Readings Updated", message: "Fresh environment zone readings have been recorded across all 8 campus zones.", time: "8 hours ago", read: true },
    { id: "9", type: "info", title: "Auto-Updater Active", message: "The system auto-updater is generating fresh student data every 30 minutes.", time: "12 hours ago", read: true },
    { id: "10", type: "alert", title: "Missed Meals Trending Up", message: "12% of students skipped breakfast 3+ days this week. Consider a wellness nudge.", time: "1 day ago", read: true },
  ];
}
