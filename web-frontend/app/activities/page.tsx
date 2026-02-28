"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import { Activity as ActivityIcon, Flame, Timer, Dumbbell, PersonStanding, Trophy, StretchHorizontal, BrainCircuit } from "lucide-react";
import api from "@/lib/api";

interface Activity {
    id: string;
    type: string;
    participants: number;
    avgDuration: number;
    caloriesBurned: number;
    trending: boolean;
    category: string;
}

export default function ActivitiesPage() {
    const [categoryFilter, setCategoryFilter] = useState("All");
    const categories = ["All", "Strength", "Cardio", "Sports", "Flexibility", "Wellness"];
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await api.get('/api/admin/activities/stats');
                setActivities(res.data);
            } catch (error) {
                console.error("Failed to fetch activity stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const totalParticipants = activities.reduce((s, a) => s + a.participants, 0);
    const trendingCount = activities.filter((a) => a.trending).length;
    
    // Protect against division by zero if activities is empty
    const validActivitiesWithDuration = activities.filter(a => a.avgDuration > 0);
    const validActivitiesWithCalories = activities.filter(a => a.caloriesBurned > 0);
    
    const avgDuration = validActivitiesWithDuration.length 
        ? Math.round(validActivitiesWithDuration.reduce((s, a) => s + a.avgDuration, 0) / validActivitiesWithDuration.length)
        : 0;
        
    const avgCalBurned = validActivitiesWithCalories.length
        ? Math.round(validActivitiesWithCalories.reduce((s, a) => s + a.caloriesBurned, 0) / validActivitiesWithCalories.length)
        : 0;

    const filtered =
        categoryFilter === "All"
            ? activities
            : activities.filter((a) => a.category === categoryFilter);

    const maxParticipants = activities.length ? Math.max(...activities.map((a) => a.participants), 1) : 1;

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

    if (loading) {
        return <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>Loading activity data...</div>;
    }

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
                    icon={<ActivityIcon size={20} />}
                    label="Total Participants"
                    value={totalParticipants.toLocaleString()}
                    trend={{ value: "Real-time", direction: "up" }}
                    className="animate-fade-in-up stagger-1"
                />
                <StatCard
                    icon={<Flame size={20} />}
                    label="Trending Activities"
                    value={trendingCount}
                    accentColor="var(--pink)"
                    className="animate-fade-in-up stagger-2"
                />
                <StatCard
                    icon={<Timer size={20} />}
                    label="Avg Duration"
                    value={`${avgDuration} min`}
                    accentColor="var(--blue)"
                    className="animate-fade-in-up stagger-3"
                />
                <StatCard
                    icon={<Dumbbell size={20} />}
                    label="Avg Calories Burned"
                    value={`${avgCalBurned} kcal`}
                    accentColor="var(--orange)"
                    className="animate-fade-in-up stagger-4"
                />
            </div>

            <div className="charts-grid">
                <ChartCard
                    title="Participation by Activity"
                    badge="Last 30 Days"
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
                                <span className="bar-label" style={{ fontSize: "10px", transform: "rotate(-45deg)", whiteSpace: "nowrap", marginTop: "10px" }}>
                                    {a.type}
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
                        {[...activities]
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
                                                    <Flame size={12} />
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
                                                width: `${Math.min((a.caloriesBurned / 800) * 100, 100)}%`, // adjust denominator based on realistic max calorie burn average
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
                                    ? <Dumbbell size={18} />
                                    : a.category === "Cardio"
                                        ? <PersonStanding size={18} />
                                        : a.category === "Sports"
                                            ? <Trophy size={18} />
                                            : a.category === "Flexibility"
                                                ? <StretchHorizontal size={18} />
                                                : <BrainCircuit size={18} />}
                            </div>
                            <div>
                                <div className="info-card-title">
                                    {a.type}
                                    {a.trending && " ★"}
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
                                <span className="info-metric-label">Avg Calories Check</span>
                                <span className="info-metric-value">{a.caloriesBurned} kcal</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
