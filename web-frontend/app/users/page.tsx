"use client";

import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { users } from "@/lib/mockData";

export default function UsersPage() {
    const totalUsers = users.length;
    const beginners = users.filter((u) => u.fitnessLevel === "Beginner").length;
    const intermediate = users.filter((u) => u.fitnessLevel === "Intermediate").length;
    const advanced = users.filter((u) => u.fitnessLevel === "Advanced").length;

    const columns = [
        {
            key: "name",
            label: "Name",
            render: (u: typeof users[0]) => (
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {u.name}
                </span>
            ),
        },
        { key: "age", label: "Age" },
        { key: "gender", label: "Gender" },
        { key: "hostel", label: "Hostel" },
        { key: "branch", label: "Branch" },
        { key: "year", label: "Year" },
        {
            key: "fitnessLevel",
            label: "Fitness Level",
            render: (u: typeof users[0]) => (
                <span
                    className={`badge ${u.fitnessLevel === "Advanced"
                            ? "badge-green"
                            : u.fitnessLevel === "Intermediate"
                                ? "badge-blue"
                                : "badge-orange"
                        }`}
                >
                    {u.fitnessLevel}
                </span>
            ),
        },
        { key: "dietaryPref", label: "Diet" },
        {
            key: "wellnessScore",
            label: "Wellness",
            render: (u: typeof users[0]) => (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div className="progress-bar" style={{ width: "60px" }}>
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${u.wellnessScore}%`,
                                background:
                                    u.wellnessScore >= 85
                                        ? "var(--green)"
                                        : u.wellnessScore >= 70
                                            ? "var(--accent)"
                                            : "var(--orange)",
                            }}
                        />
                    </div>
                    <span style={{ fontSize: "12px" }}>{u.wellnessScore}</span>
                </div>
            ),
        },
        { key: "lastActive", label: "Last Active" },
    ];

    return (
        <>
            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">User Management</h1>
                <p className="page-subtitle">
                    Manage student profiles, fitness levels, and dietary preferences
                </p>
            </div>

            <div className="stats-grid">
                <StatCard
                    icon="👥"
                    label="Total Users"
                    value={totalUsers}
                    className="animate-fade-in-up stagger-1"
                />
                <StatCard
                    icon="🌱"
                    label="Beginners"
                    value={beginners}
                    accentColor="var(--orange)"
                    className="animate-fade-in-up stagger-2"
                />
                <StatCard
                    icon="💪"
                    label="Intermediate"
                    value={intermediate}
                    accentColor="var(--blue)"
                    className="animate-fade-in-up stagger-3"
                />
                <StatCard
                    icon="🏆"
                    label="Advanced"
                    value={advanced}
                    accentColor="var(--green)"
                    className="animate-fade-in-up stagger-4"
                />
            </div>

            <div className="animate-fade-in-up stagger-5">
                <DataTable
                    title="All Users"
                    columns={columns}
                    data={users}
                    searchKey="name"
                    searchPlaceholder="Search by name..."
                />
            </div>
        </>
    );
}
