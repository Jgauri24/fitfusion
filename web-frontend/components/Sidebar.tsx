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
    { label: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
    { label: "Wellness", href: "/wellness", icon: <HeartPulse size={18} /> },
    { label: "Environment", href: "/environment", icon: <TreePine size={18} /> },
    { label: "Users", href: "/users", icon: <Users size={18} /> },
    { label: "Nutrition", href: "/nutrition", icon: <Salad size={18} /> },
    { label: "Activities", href: "/activities", icon: <Activity size={18} /> },
    { label: "Analytics", href: "/analytics", icon: <TrendingUp size={18} /> },
    { label: "Reports", href: "/reports", icon: <FileText size={18} /> },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [adminProfile, setAdminProfile] = useState({ name: "Admin", initials: "A", role: "Admin" });

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
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">
                    <img src="/fitfusion-icon.svg" alt="FF" style={{ width: 20, height: 20 }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.textContent = 'FF'; }}
                    />
                </div>
                <div className="sidebar-brand-text">
                    <span className="sidebar-brand-title">FitFusion Admin</span>
                    <span className="sidebar-brand-subtitle">Campus Wellness</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => (
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

            {/* Footer */}
            <div className="sidebar-footer">
                <Link href="/profile" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div className="admin-profile">
                        <div className="admin-avatar">{adminProfile.initials}</div>
                        <div className="admin-info">
                            <span className="admin-name">{adminProfile.name}</span>
                            <span className="admin-role">{adminProfile.role}</span>
                        </div>
                        <LogOut
                            size={16}
                            className="admin-logout-icon"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleLogout();
                            }}
                        />
                    </div>
                </Link>
            </div>
        </aside>
    );
}
