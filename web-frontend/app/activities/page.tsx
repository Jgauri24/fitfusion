"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import { Users, Activity, Clock, Flame, Dumbbell } from "lucide-react";
import api from "@/lib/api";

interface ActivityItem {
    id: string;
    name: string;
    category: string;
    participants: number;
    avgDuration: number;
    avgCalories: number;
    intensity: string;
}

const CATEGORY_COLORS: Record<string, string> = {
    "Gym": "var(--accent)",
    "Sports": "var(--blue)",
    "Yoga": "var(--purple)",
    "Cardio": "var(--orange)",
    "Swimming": "var(--green)",
    "Stretching": "var(--amber)",
    "Dance": "var(--pink)",
};

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await api.get("/api/admin/activities");
                setActivities(res.data);
            } catch (e) {
                console.error("Failed to fetch activities:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const categories = ["All", ...new Set(activities.map((a) => a.category))];
    const filtered = categoryFilter === "All" ? activities : activities.filter((a) => a.category === categoryFilter);

    const totalParticipants = activities.reduce((s, a) => s + a.participants, 0);
    const trendingActivity = [...activities].sort((a, b) => b.participants - a.participants)[0]?.name || "-";
    const avgDuration = activities.length ? Math.round(activities.reduce((s, a) => s + a.avgDuration, 0) / activities.length) : 0;
    const avgCalBurned = activities.length ? Math.round(activities.reduce((s, a) => s + a.avgCalories, 0) / activities.length) : 0;

    const maxParticipants = Math.max(...activities.map((a) => a.participants), 1);
    const maxCalories = Math.max(...activities.map((a) => a.avgCalories), 1);

    if (loading) {
        return <div className="loading-container"><div className="loading-inner"><div className="loading-spinner" />Loading activities...</div></div>;
    }

    return (
        <>
            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">Fitness Activities</h1>
                <p className="page-subtitle">Track campus fitness trends, participation rates, and activity performance</p>
            </div>

            <div className="stats-grid">
                <StatCard icon={<Users size={20} />} label="Total Participants" value={totalParticipants.toLocaleString()} trend={{ value: "14%", direction: "up" }} className="animate-fade-in-up stagger-1" />
                <StatCard icon={<Activity size={20} />} label="Trending Activity" value={trendingActivity} accentColor="var(--blue)" className="animate-fade-in-up stagger-2" />
                <StatCard icon={<Clock size={20} />} label="Avg Duration" value={`${avgDuration} min`} accentColor="var(--purple)" className="animate-fade-in-up stagger-3" />
                <StatCard icon={<Flame size={20} />} label="Avg Calories Burned" value={`${avgCalBurned} kcal`} accentColor="var(--orange)" className="animate-fade-in-up stagger-4" />
            </div>

            <div className="charts-grid">
                {/* Participation by Activity */}
                <ChartCard title="Participation by Activity" badge="All Time" className="animate-fade-in-up stagger-3">
                    <div className="bar-chart">
                        {activities.slice(0, 7).map((a) => (
                            <div key={a.name} className="bar-chart-item">
                                <div className="bar" style={{ height: `${(a.participants / maxParticipants) * 100}%`, background: CATEGORY_COLORS[a.category] || "var(--accent)" }} title={`${a.participants} participants`} />
                                <span className="bar-label">{a.name.length > 6 ? a.name.substring(0, 6) + ".." : a.name}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                {/* Calories Burned */}
                <ChartCard title="Calories Burned by Activity" badge="Average" className="animate-fade-in-up stagger-4">
                    <div className="bar-chart">
                        {activities.slice(0, 7).map((a) => (
                            <div key={a.name} className="bar-chart-item">
                                <div className="bar" style={{ height: `${(a.avgCalories / maxCalories) * 100}%`, background: CATEGORY_COLORS[a.category] || "var(--orange)" }} title={`${a.avgCalories} kcal`} />
                                <span className="bar-label">{a.name.length > 6 ? a.name.substring(0, 6) + ".." : a.name}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            {/* Category Filters */}
            <div className="filters-row animate-fade-in-up stagger-5">
                {categories.map((cat) => (
                    <button key={cat} className={`filter-btn ${categoryFilter === cat ? "active" : ""}`} onClick={() => setCategoryFilter(cat)}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Activity Detail Cards */}
            <div className="info-grid animate-fade-in-up stagger-6">
                {filtered.map((a) => (
                    <div className="info-card" key={a.id}>
                        <div className="info-card-header">
                            <div className="info-card-icon" style={{ background: `${CATEGORY_COLORS[a.category] || "var(--accent)"}15`, color: CATEGORY_COLORS[a.category] || "var(--accent)" }}>
                                <Dumbbell size={18} />
                            </div>
                            <div>
                                <div className="info-card-title">{a.name}</div>
                                <div className="info-card-subtitle">{a.category} · {a.intensity}</div>
                            </div>
                        </div>
                        <div className="info-card-body">
                            <div className="info-metric"><span className="info-metric-label">Participants</span><span className="info-metric-value">{a.participants}</span></div>
                            <div className="info-metric"><span className="info-metric-label">Avg Duration</span><span className="info-metric-value">{a.avgDuration} min</span></div>
                            <div className="info-metric"><span className="info-metric-label">Avg Calories</span><span className="info-metric-value" style={{ color: "var(--orange)" }}>{a.avgCalories} kcal</span></div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}