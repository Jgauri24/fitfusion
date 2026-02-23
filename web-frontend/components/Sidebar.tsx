"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Salad,
    Activity,
    HeartPulse,
    TreePine,
    TrendingUp,
    FileText,
} from "lucide-react";
import React from "react";

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
                        <div className="admin-avatar">GA</div>
                        <div className="admin-info">
                            <span className="admin-name">Gauri Admin</span>
                            <span className="admin-role">Super Admin</span>
                        </div>
                    </div>
                </Link>
            </div>
        </aside>
    );
}
