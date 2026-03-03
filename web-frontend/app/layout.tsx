"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Bell, X } from "lucide-react";
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
  message: string;
  type: string;
  time: string;
  read: boolean;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [adminInitials, setAdminInitials] = useState("A");
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  // Fetch notifications from backend, fallback to static data
  useEffect(() => {
    if (pathname === "/login") return;
    const token = localStorage.getItem("token");
    if (!token) return;
    api.get("/api/admin/notifications")
      .then(res => setNotifications(res.data))
      .catch(() => {
        setNotifications([
          { id: "1", message: "2 new burnout alerts flagged", type: "alert", time: "2 mins ago", read: false },
          { id: "2", message: "Weekly wellness report ready", type: "info", time: "1 hour ago", read: false },
          { id: "3", message: "Environment data updated", type: "success", time: "5 hours ago", read: true },
        ]);
      });
  }, [pathname]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    api.post("/api/admin/notifications/read-all").catch(() => {});
  };

  const getDotColor = (type: string) => {
    switch (type) {
      case "alert": return "#F87171";
      case "info": return "#0070F3";
      case "success": return "#4ADE80";
      default: return "#64748B";
    }
  };

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
              {/* Header */}
              <header className="top-header">
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowNotif(!showNotif)}
                    className="header-notification-btn"
                  >
                    <Bell size={18} />
                  </button>
                  {unreadCount > 0 && (
                    <span className="header-notification-badge">{unreadCount}</span>
                  )}
                </div>
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

            {/* Notification Panel — OUTSIDE main-content to avoid overflow clipping */}
            {showNotif && (
              <>
                <div className="notif-overlay" onClick={() => setShowNotif(false)} />
                <div className="notif-panel">
                  <div className="notif-panel-header">
                    <span className="notif-panel-title">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="notif-count-badge">{unreadCount}</span>
                      )}
                    </span>
                    <button onClick={() => setShowNotif(false)} className="notif-panel-close">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="notif-panel-list">
                    {notifications.length === 0 ? (
                      <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                        No notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`notif-panel-item ${!n.read ? "notif-unread" : ""}`}>
                          <div className="notif-dot" style={{ background: getDotColor(n.type) }} />
                          <div className="notif-item-body">
                            <div className="notif-item-text">{n.message}</div>
                            <div className="notif-item-time">{n.time}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button className="notif-panel-footer" onClick={markAllRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </body>
    </html>
  );
}