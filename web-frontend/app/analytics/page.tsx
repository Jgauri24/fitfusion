"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import { TrendingUp, Zap, UtensilsCrossed, Target } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import api from "@/lib/api";

interface MonthlyTrend {
    month: string;
    users: number;
    activities: number;
    meals: number;
}

interface DepartmentStat {
    dept: string;
    users: number;
    avgFitness: number;
    engagement: number;
}

interface HostelStat {
    hostel: string;
    activeUsers: number;
    avgSteps: number;
    avgCalories: number;
    wellnessScore: number;
}

export default function AnalyticsPage() {
    const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
    const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);
    const [hostelComparison, setHostelComparison] = useState<HostelStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/api/admin/analytics/stats');
                setMonthlyTrends(res.data.monthlyTrends || []);
                setDepartmentStats(res.data.departmentStats || []);
                setHostelComparison(res.data.hostelComparison || []);
            } catch (error) {
                console.error("Failed to fetch analytics stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const latestMonth = monthlyTrends.length >= 1 ? monthlyTrends[monthlyTrends.length - 1] : { users: 0, activities: 0, meals: 0, month: "" };
    const prevMonth = monthlyTrends.length >= 2 ? monthlyTrends[monthlyTrends.length - 2] : { users: 0, activities: 0, meals: 0, month: "" };

    const userGrowth = prevMonth.users > 0 ? (((latestMonth.users - prevMonth.users) / prevMonth.users) * 100).toFixed(1) : "0.0";
    const activityGrowth = prevMonth.activities > 0 ? (((latestMonth.activities - prevMonth.activities) / prevMonth.activities) * 100).toFixed(1) : "0.0";

    const maxUsers = monthlyTrends.length > 0 ? Math.max(...monthlyTrends.map((m) => m.users), 1) : 1;
    const maxDeptUsers = departmentStats.length > 0 ? Math.max(...departmentStats.map((d) => d.users), 1) : 1;

    const correlationData = [
        { week: "W1", mood: 75, stress: 30 },
        { week: "W2", mood: 78, stress: 28 },
        { week: "W3", mood: 65, stress: 55 },
        { week: "W4", mood: 50, stress: 70 },
        { week: "W5", mood: 45, stress: 80 },
        { week: "W6", mood: 60, stress: 60 },
        { week: "W7", mood: 80, stress: 45 },
        { week: "W8", mood: 85, stress: 25 },
    ];

    const deltas: Record<string, number> = {
        "CSE": 3, "IT": 1, "ME": -2, "ECE": 4, "Civil": -1, "EE": 2,
    };

    if (loading) {
        return <div className="loading-container"><div className="loading-inner"><div className="loading-spinner" />Loading analytics data...</div></div>;
    }

    return (
        <>
            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">Analytics</h1>
                <p className="page-subtitle">Cross-domain insights, growth trends, and engagement metrics across campus</p>
            </div>

            <div className="stats-grid">
                <StatCard icon={<TrendingUp size={20} />} label="User Growth" value={Number(userGrowth) > 0 ? `+${userGrowth}%` : `${userGrowth}%`} trend={{ value: `${latestMonth.users - prevMonth.users} new`, direction: Number(userGrowth) >= 0 ? "up" : "down" }} className="animate-fade-in-up stagger-1" />
                <StatCard icon={<Zap size={20} />} label="Activity Growth" value={Number(activityGrowth) > 0 ? `+${activityGrowth}%` : `${activityGrowth}%`} trend={{ value: "MoM", direction: Number(activityGrowth) >= 0 ? "up" : "down" }} accentColor="var(--blue)" className="animate-fade-in-up stagger-2" />
                <StatCard icon={<UtensilsCrossed size={20} />} label="Meals Served" value={latestMonth.meals.toLocaleString()} accentColor="var(--orange)" className="animate-fade-in-up stagger-3" />
                <StatCard icon={<Target size={20} />} label="Engagement Rate" value="78%" trend={{ value: "4.2%", direction: "up" }} accentColor="var(--green)" className="animate-fade-in-up stagger-4" />
            </div>

            <div className="charts-grid">
                {/* Monthly User Growth */}
                <ChartCard title="Monthly User Growth" badge="6 Months" className="animate-fade-in-up stagger-3">
                    <div className="bar-chart">
                        {monthlyTrends.map((m) => (
                            <div key={m.month} className="bar-chart-item">
                                <div className="bar" style={{ height: `${(m.users / maxUsers) * 100}%`, background: "linear-gradient(to top, var(--accent-dark), var(--accent-light))" }} title={`${m.users} users`} />
                                <span className="bar-label">{m.month}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                {/* Department Engagement */}
                <ChartCard title="Department Engagement" badge="All Depts" className="animate-fade-in-up stagger-4">
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {[...departmentStats]
                            .sort((a, b) => b.engagement - a.engagement)
                            .slice(0, 6)
                            .map((d) => {
                                const delta = deltas[d.dept];
                                return (
                                    <div key={d.dept}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", alignItems: "center" }}>
                                            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{d.dept}</span>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span style={{ fontSize: "13px", fontWeight: 600, color: d.engagement >= 80 ? "var(--green)" : d.engagement >= 70 ? "var(--accent)" : "var(--orange)" }}>
                                                    {d.engagement}%
                                                </span>
                                                {delta !== undefined && (
                                                    <span style={{ fontSize: "11px", color: delta > 0 ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                                                        {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="progress-bar" style={{ height: "6px" }}>
                                            <div className="progress-bar-fill" style={{ width: `${d.engagement}%`, background: d.engagement >= 80 ? "var(--green)" : d.engagement >= 70 ? "var(--accent)" : "var(--orange)" }} />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </ChartCard>
            </div>

            {/* Stress and Mood Correlation */}
            <div style={{ marginTop: "24px", marginBottom: "24px" }} className="animate-fade-in-up stagger-5">
                <ChartCard title="Stress and Mood Correlation" badge={<span className="badge badge-cyan">r = −0.82 strong inverse</span>}>
                    <div style={{ width: "100%", height: 300, marginTop: 16 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={correlationData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0070F3" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#0070F3" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F87171" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} dy={10} />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                                <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "none", borderRadius: "8px", color: "var(--text-primary)" }} />
                                <ReferenceLine x="W3" stroke="#333" strokeDasharray="3 3" label={{ position: "top", value: "Midsem Begin", fill: "#555", fontSize: 10 }} />
                                <ReferenceLine x="W5" stroke="#333" strokeDasharray="3 3" label={{ position: "top", value: "Midsem End", fill: "#555", fontSize: 10 }} />
                                <ReferenceLine x="W7" stroke="#333" strokeDasharray="3 3" label={{ position: "top", value: "Techfest", fill: "#555", fontSize: 10 }} />
                                <Area type="monotone" dataKey="mood" stroke="#0070F3" fillOpacity={1} fill="url(#colorMood)" strokeWidth={2} />
                                <Area type="monotone" dataKey="stress" stroke="#F87171" fillOpacity={1} fill="url(#colorStress)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {/* Department Table */}
            <ChartCard title="Department Breakdown" badge="Detailed" className="animate-fade-in-up stagger-6">
                <div className="table-overflow">
                    <table>
                        <thead>
                            <tr><th>Department</th><th>Users</th><th>Avg Fitness Score</th><th>Engagement</th><th>Distribution</th></tr>
                        </thead>
                        <tbody>
                            {departmentStats.map((d) => (
                                <tr key={d.dept}>
                                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{d.dept}</td>
                                    <td>{d.users}</td>
                                    <td><span className={`badge ${d.avgFitness >= 80 ? "badge-green" : d.avgFitness >= 75 ? "badge-cyan" : "badge-orange"}`}>{d.avgFitness}/100</span></td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div className="progress-bar" style={{ width: "80px" }}>
                                                <div className="progress-bar-fill" style={{ width: `${d.engagement}%`, background: d.engagement >= 80 ? "var(--green)" : d.engagement >= 70 ? "var(--accent)" : "var(--orange)" }} />
                                            </div>
                                            <span>{d.engagement}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="progress-bar" style={{ width: "100px", height: "8px" }}>
                                            <div className="progress-bar-fill" style={{ width: `${(d.users / maxDeptUsers) * 100}%`, background: "var(--blue)" }} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartCard>

            {/* Hostel Insights */}
            <div style={{ marginTop: "24px" }}>
                <ChartCard title="Hostel Performance Ranking" badge="Comparative" className="animate-fade-in-up stagger-6">
                    <div className="info-grid" style={{ marginBottom: 0 }}>
                        {[...hostelComparison]
                            .sort((a, b) => b.wellnessScore - a.wellnessScore)
                            .map((h, idx) => (
                                <div className="info-card" key={h.hostel} style={idx === 0 ? { border: "1px solid var(--border-accent)" } : {}}>
                                    <div className="info-card-header">
                                        <div className="info-card-icon" style={{
                                            background: idx === 0 ? "var(--accent-glow)" : "rgba(100, 116, 139, 0.1)",
                                            color: idx === 0 ? "var(--accent)" : "var(--text-muted)",
                                            fontSize: "16px",
                                        }}>
                                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                                        </div>
                                        <div>
                                            <div className="info-card-title">{h.hostel} Bhawan</div>
                                            <div className="info-card-subtitle">{h.activeUsers} active users</div>
                                        </div>
                                    </div>
                                    <div className="info-card-body">
                                        <div className="info-metric"><span className="info-metric-label">Wellness</span><span className="info-metric-value">{h.wellnessScore}/100</span></div>
                                        <div className="info-metric"><span className="info-metric-label">Avg Steps</span><span className="info-metric-value">{h.avgSteps.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                                        <div className="info-metric"><span className="info-metric-label">Avg Calories</span><span className="info-metric-value">{h.avgCalories.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                                        <div className="progress-bar" style={{ height: "4px" }}>
                                            <div className="progress-bar-fill" style={{ width: `${h.wellnessScore}%`, background: idx === 0 ? "var(--accent)" : "var(--blue)" }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </ChartCard>
            </div>
        </>
    );
}
