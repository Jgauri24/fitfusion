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
    Settings,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const navItems = [
    { label: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
    { label: "Users", href: "/users", icon: <Users size={20} /> },
    { label: "Nutrition", href: "/nutrition", icon: <Salad size={20} /> },
    { label: "Activities", href: "/activities", icon: <Activity size={20} /> },
    { label: "Wellness", href: "/wellness", icon: <HeartPulse size={20} /> },
    { label: "Environment", href: "/environment", icon: <TreePine size={20} /> },
    { label: "Analytics", href: "/analytics", icon: <TrendingUp size={20} /> },
    { label: "Reports", href: "/reports", icon: <FileText size={20} /> },
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
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-item ${pathname === item.href ? "active" : ""}`}
                        data-tooltip={item.label}
                    >
                        <span className="nav-icon">{item.icon}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <Link href="/profile" style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="admin-profile" data-tooltip={adminProfile.name}>
                        <div className="admin-avatar">{adminProfile.initials}</div>
                    </div>
                </Link>
                <button
                    onClick={handleLogout}
                    className="nav-item"
                    data-tooltip="Sign Out"
                    style={{
                        border: "none",
                        color: "var(--red)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,68,68,0.12)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                    <span className="nav-icon"><LogOut size={20} /></span>
                </button>
            </div>
        </aside>
    );
}
