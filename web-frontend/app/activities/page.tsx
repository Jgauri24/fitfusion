"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import { activities } from "@/lib/mockData";

export default function ActivitiesPage() {
    const [categoryFilter, setCategoryFilter] = useState("All");
    const categories = ["All", "Strength", "Cardio", "Sports", "Flexibility", "Wellness"];

    const totalParticipants = activities.reduce((s, a) => s + a.participants, 0);
    const trendingCount = activities.filter((a) => a.trending).length;
    const avgDuration = Math.round(
        activities.reduce((s, a) => s + a.avgDuration, 0) / activities.length
    );
    const avgCalBurned = Math.round(
        activities.reduce((s, a) => s + a.caloriesBurned, 0) / activities.length
    );

    const filtered =
        categoryFilter === "All"
            ? activities
            : activities.filter((a) => a.category === categoryFilter);

    const maxParticipants = Math.max(...activities.map((a) => a.participants));

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case "Strength": return "var(--red)";
            case "Cardio": return "var(--blue)";
            case "Sports": return "var(--green)";
            case "Flexibility": return "var(--purple)";
            case "Wellness": return "var(--accent)";
            default: return "var(--text-muted)";
        }
    };

    return (
        <>
            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">Fitness Activities</h1>
                <p className="page-subtitle">
                    Track campus-wide fitness activities, participation, and trending workouts
                </p>
            </div>

            <div className="stats-grid">
                <StatCard
                    icon="🏃"
                    label="Total Participants"
                    value={totalParticipants.toLocaleString()}
                    trend={{ value: "15.3%", direction: "up" }}
                    className="animate-fade-in-up stagger-1"
                />
                <StatCard
                    icon="🔥"
                    label="Trending Activities"
                    value={trendingCount}
                    accentColor="var(--pink)"
                    className="animate-fade-in-up stagger-2"
                />
                <StatCard
                    icon="⏱"
                    label="Avg Duration"
                    value={`${avgDuration} min`}
                    accentColor="var(--blue)"
                    className="animate-fade-in-up stagger-3"
                />
                <StatCard
                    icon="💪"
                    label="Avg Calories Burned"
                    value={`${avgCalBurned} kcal`}
                    accentColor="var(--orange)"
                    className="animate-fade-in-up stagger-4"
                />
            </div>

            <div className="charts-grid">
                <ChartCard
                    title="Participation by Activity"
                    badge="All Time"
                    className="animate-fade-in-up stagger-3"
                >
                    <div className="bar-chart">
                        {activities.map((a) => (
                            <div key={a.id} className="bar-chart-item">
                                <div
                                    className="bar"
                                    style={{
                                        height: `${(a.participants / maxParticipants) * 100}%`,
                                        background: getCategoryColor(a.category),
                                    }}
                                    title={`${a.participants} participants`}
                                />
                                <span className="bar-label" style={{ fontSize: "10px" }}>
                                    {a.type.split(" ")[0]}
                                </span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                <ChartCard
                    title="Calories Burned by Activity"
                    badge="Avg"
                    className="animate-fade-in-up stagger-4"
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {activities
                            .sort((a, b) => b.caloriesBurned - a.caloriesBurned)
                            .slice(0, 6)
                            .map((a) => (
                                <div key={a.id}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                color: "var(--text-secondary)",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                            }}
                                        >
                                            {a.type}
                                            {a.trending && (
                                                <span
                                                    style={{
                                                        fontSize: "10px",
                                                        color: "var(--pink)",
                                                    }}
                                                >
                                                    🔥
                                                </span>
                                            )}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                color: getCategoryColor(a.category),
                                            }}
                                        >
                                            {a.caloriesBurned} kcal
                                        </span>
                                    </div>
                                    <div className="progress-bar" style={{ height: "6px" }}>
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${(a.caloriesBurned / 500) * 100}%`,
                                                background: getCategoryColor(a.category),
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </ChartCard>
            </div>

            <div className="filters-row animate-fade-in-up stagger-4">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`filter-btn ${categoryFilter === cat ? "active" : ""}`}
                        onClick={() => setCategoryFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="info-grid animate-fade-in-up stagger-5">
                {filtered.map((a) => (
                    <div className="info-card" key={a.id}>
                        <div className="info-card-header">
                            <div
                                className="info-card-icon"
                                style={{
                                    background: `${getCategoryColor(a.category)}15`,
                                    color: getCategoryColor(a.category),
                                }}
                            >
                                {a.category === "Strength"
                                    ? "🏋️"
                                    : a.category === "Cardio"
                                        ? "🏃"
                                        : a.category === "Sports"
                                            ? "🏏"
                                            : a.category === "Flexibility"
                                                ? "🧘"
                                                : "🧠"}
                            </div>
                            <div>
                                <div className="info-card-title">
                                    {a.type}
                                    {a.trending && " 🔥"}
                                </div>
                                <div className="info-card-subtitle">{a.category}</div>
                            </div>
                        </div>
                        <div className="info-card-body">
                            <div className="info-metric">
                                <span className="info-metric-label">Participants</span>
                                <span className="info-metric-value">{a.participants}</span>
                            </div>
                            <div className="info-metric">
                                <span className="info-metric-label">Avg Duration</span>
                                <span className="info-metric-value">{a.avgDuration} min</span>
                            </div>
                            <div className="info-metric">
                                <span className="info-metric-label">Calories Burned</span>
                                <span className="info-metric-value">{a.caloriesBurned} kcal</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
