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
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 6 L16 26 L12 26 L6 6 Z" fill="#EDEDED" />
                        <path d="M22 6 C22 12 18 15 12 15 C18 15 22 18 22 24 C22 18 26 15 32 15 C26 15 22 12 22 6 Z" fill="#0070F3" />
                    </svg>
                </div>
            </div>

            {/* Navigation */}
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

            {/* Footer */}
            <div className="sidebar-footer">
                <Link href="/profile" style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="admin-profile" data-tooltip={adminProfile.name}>
                        <div className="admin-avatar">{adminProfile.initials}</div>
                    </div>
                </Link>
                <button
                    onClick={handleLogout}
                    className="nav-item nav-item-logout"
                    data-tooltip="Sign Out"
                >
                    <span className="nav-icon"><LogOut size={20} /></span>
                </button>
            </div>
        </aside>
    );
}
