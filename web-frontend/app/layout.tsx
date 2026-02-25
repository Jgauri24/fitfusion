"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Bell, X, Check, AlertTriangle, Info, Users as UsersIcon, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
          setAdminName(`${parsed.firstName} ${parsed.lastName || ""}`.trim());
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
                  {unreadCount > 0 && (
                    <span style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      background: "#FF4444",
                      color: "white",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      fontSize: "10px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>{unreadCount > 99 ? "99+" : unreadCount}</span>
                  )}
                </button>
              </header>

              {/* Notification Panel — Fixed, Scrollable, Closable */}
              {drawerOpen && (
                <div ref={panelRef} style={{
                  position: "fixed",
                  top: "12px",
                  right: "12px",
                  width: "380px",
                  maxHeight: "calc(100vh - 24px)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  zIndex: 1000,
                  boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}>
                  {/* Header — Fixed */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "20px 20px 16px", borderBottom: "1px solid var(--border)",
                    flexShrink: 0
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)" }}>Notifications</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {unreadCount} unread
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} style={{
                          background: "none", border: "none", color: "var(--accent)",
                          fontSize: "12px", fontWeight: 600, cursor: "pointer", padding: "4px 8px"
                        }}>Mark all read</button>
                      )}
                      <button onClick={() => setDrawerOpen(false)} style={{
                        background: "var(--bg-elevated)", border: "1px solid var(--border)",
                        borderRadius: "8px", cursor: "pointer", color: "var(--text-muted)",
                        padding: "6px", display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable notification list */}
                  <div style={{
                    flex: 1, overflowY: "auto", padding: "8px 12px",
                    scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent"
                  }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                        🎉 No notifications right now!
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} style={{
                          padding: "14px 12px",
                          borderRadius: "10px",
                          marginBottom: "4px",
                          background: n.read ? "transparent" : "rgba(204,255,0,0.03)",
                          borderLeft: n.read ? "3px solid transparent" : "3px solid var(--accent)",
                          cursor: "pointer",
                          transition: "background 0.15s ease",
                          position: "relative",
                        }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-elevated)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = n.read ? "transparent" : "rgba(204,255,0,0.03)"; }}
                          onClick={() => markAsRead(n.id)}
                        >
                          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                            <div style={{
                              flexShrink: 0, width: "32px", height: "32px", borderRadius: "8px",
                              background: "var(--bg-elevated)", display: "flex", alignItems: "center",
                              justifyContent: "center", marginTop: "2px"
                            }}>
                              {getIcon(n.type)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "3px" }}>
                                {n.title}
                              </div>
                              <div style={{
                                fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4,
                                overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box",
                                WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
                              }}>
                                {n.message}
                              </div>
                              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                                {n.time}
                              </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); }} style={{
                              background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                              padding: "4px", flexShrink: 0, opacity: 0.5
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
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
