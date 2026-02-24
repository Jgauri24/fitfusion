"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Salad,
    Activity,
    HeartPulse,
    TreePine,
    TrendingUp,
    FileText,
    LogOut,
} from "lucide-react";
import React,{useEffect,useState} from "react";

const navItems = [
    { label: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
    { label: "Users", href: "/users", icon: <Users size={18} /> },
    { label: "Nutrition", href: "/nutrition", icon: <Salad size={18} /> },
    { label: "Activities", href: "/activities", icon: <Activity size={18} /> },
    { label: "Wellness", href: "/wellness", icon: <HeartPulse size={18} /> },
    { label: "Environment", href: "/environment", icon: <TreePine size={18} /> },
    { label: "Analytics", href: "/analytics", icon: <TrendingUp size={18} /> },
    { label: "Reports", href: "/reports", icon: <FileText size={18} /> },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [adminProfile, setAdminProfile] = useState({ name: "Admin", initials: "A", role: "Super Admin" });

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            try {
                const parsed = JSON.parse(userInfo);
                const firstName = parsed.firstName || "Admin";
                const lastName = parsed.lastName || "";
                const fullName = `${firstName} ${lastName}`.trim();
                const init = firstName.charAt(0).toUpperCase() + (lastName ? lastName.charAt(0).toUpperCase() : "");
                setAdminProfile({
                    name: fullName,
                    initials: init,
                    role: parsed.role || "Admin"
                });
            } catch (e) { }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        router.push("/login");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">FF</div>
                <div className="sidebar-brand-text">
                    <span className="sidebar-brand-title">FitFusion</span>
                    <span className="sidebar-brand-subtitle">Admin Panel</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section-label">Main Menu</div>
                {navItems.slice(0, 1).map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-item ${pathname === item.href ? "active" : ""}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}

                <div className="sidebar-section-label">Management</div>
                {navItems.slice(1, 6).map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-item ${pathname === item.href ? "active" : ""}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}

                <div className="sidebar-section-label">Insights</div>
                {navItems.slice(6).map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-item ${pathname === item.href ? "active" : ""}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <Link href="/profile" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div className="admin-profile">
                        <div className="admin-avatar">{adminProfile.initials}</div>
                        <div className="admin-info">
                            <span className="admin-name">{adminProfile.name}</span>
                            <span className="admin-role">{adminProfile.role}</span>
                        </div>
                    </div>
                </Link>
                <button onClick={handleLogout} style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    width: "100%", padding: "10px 16px", marginTop: "8px",
                    background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.15)",
                    borderRadius: "8px", color: "#ff6b6b", fontSize: "13px", fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s ease"
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,68,68,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,68,68,0.08)"; }}>
                    <LogOut size={16} /> Sign Out
                </button>
            </div>
        </aside>
    );
}
