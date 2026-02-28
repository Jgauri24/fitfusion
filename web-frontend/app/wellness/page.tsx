"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import { Smile, BookOpen, Users, Moon } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import api from "@/lib/api";

interface WellnessSummary {
    date: string;
    avgMood: number;
    journalCount: number;
    circleParticipants: number;
    avgSleep: number;
    avgStress: number;
    topConcern: string;
}

const MOOD_ICONS: Record<number, string> = {
    1: "😞", 2: "😐", 3: "🙂", 4: "😊", 5: "😄"
};

export default function WellnessPage() {
    const [data, setData] = useState<WellnessSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWellness = async () => {
            try {
                const res = await api.get("/api/admin/wellness");
                setData(res.data);
            } catch (e) {
                console.error("Failed to fetch wellness:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchWellness();
    }, []);

    const avgMood = data.length ? +(data.reduce((s, d) => s + d.avgMood, 0) / data.length).toFixed(1) : 0;
    const totalJournals = data.reduce((s, d) => s + d.journalCount, 0);
    const totalCircle = data.reduce((s, d) => s + d.circleParticipants, 0);
    const avgSleep = data.length ? +(data.reduce((s, d) => s + d.avgSleep, 0) / data.length).toFixed(1) : 0;

    const moodDist = [1, 2, 3, 4, 5].map((m) => ({
        label: MOOD_ICONS[m],
        value: data.filter((d) => Math.round(d.avgMood) === m).length
    }));
    const MOOD_COLORS = ["#F87171", "#FB923C", "#FBBF24", "#0070F3", "#60A5FA"];
    const totalMoodEntries = moodDist.reduce((s, d) => s + d.value, 0) || 1;

    const weeklyTrend = data.slice(-7);

    const journalData = data.slice(-7).map(d => ({
        date: d.date.slice(5),
        entries: d.journalCount
    }));

    const columns = [
        {
            key: "date", label: "DATE",
            render: (d: WellnessSummary) => <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{d.date}</span>
        },
        {
            key: "avgMood", label: "MOOD",
            render: (d: WellnessSummary) => (
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "16px" }}>{MOOD_ICONS[Math.round(d.avgMood)] || "🙂"}</span>
                    <span style={{ fontWeight: 600 }}>{d.avgMood.toFixed(1)}/5</span>
                </span>
            )
        },
        {
            key: "avgSleep", label: "SLEEP",
            render: (d: WellnessSummary) => (
                <span className={`badge ${d.avgSleep >= 7 ? "badge-green" : d.avgSleep >= 6 ? "badge-blue" : "badge-red"}`}>
                    {d.avgSleep.toFixed(1)}h
                </span>
            )
        },
        {
            key: "avgStress", label: "STRESS",
            render: (d: WellnessSummary) => (
                <span style={{ fontWeight: 600, color: d.avgStress >= 7 ? "var(--red)" : d.avgStress >= 5 ? "var(--orange)" : "var(--green)" }}>
                    {d.avgStress.toFixed(1)}/10
                </span>
            )
        },
        { key: "journalCount", label: "JOURNALS" },
        { key: "circleParticipants", label: "CIRCLE" },
        {
            key: "topConcern", label: "TOP CONCERN",
            render: (d: WellnessSummary) => <span className="badge badge-orange">{d.topConcern}</span>
        }
    ];

    if (loading) {
        return <div className="loading-container"><div className="loading-inner"><div className="loading-spinner" />Loading wellness data...</div></div>;
    }

    return (
        <>
            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">Mental Wellness</h1>
                <p className="page-subtitle">Monitor mood, journaling activity, wellness circles, and sleep patterns</p>
            </div>

            <div className="stats-grid">
                <StatCard icon={<Smile size={20} />} label="Avg Mood" value={`${avgMood}/5`} trend={{ value: "Stable", direction: "up" }} className="animate-fade-in-up stagger-1" />
                <StatCard icon={<BookOpen size={20} />} label="Journal Entries" value={totalJournals} accentColor="var(--blue)" className="animate-fade-in-up stagger-2" />
                <StatCard icon={<Users size={20} />} label="Circle Participants" value={totalCircle} accentColor="var(--purple)" className="animate-fade-in-up stagger-3" />
                <StatCard icon={<Moon size={20} />} label="Avg Sleep" value={`${avgSleep}h`} accentColor="var(--amber)" className="animate-fade-in-up stagger-4" />
            </div>

            <div className="charts-grid">
                {/* Mood Distribution */}
                <ChartCard title="Mood Distribution" badge="All Days" className="animate-fade-in-up stagger-3">
                    <div className="donut-chart-container">
                        <div className="donut-chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={moodDist} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                                        {moodDist.map((_, i) => <Cell key={i} fill={MOOD_COLORS[i]} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="donut-center">
                                <div className="donut-center-value">{avgMood}</div>
                                <div className="donut-center-label">avg/5</div>
                            </div>
                        </div>
                        <div className="donut-legend">
                            {moodDist.map((d, i) => (
                                <div key={i} className="donut-legend-item">
                                    <div className="donut-legend-color" style={{ background: MOOD_COLORS[i] }} />
                                    <span className="donut-legend-text">{d.label}</span>
                                    <span className="donut-legend-value">{Math.round((d.value / totalMoodEntries) * 100)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </ChartCard>

                {/* Weekly Mood Trend */}
                <ChartCard title="Weekly Mood Trend" badge="Recent" className="animate-fade-in-up stagger-4">
                    <div style={{ width: "100%", height: 200, marginTop: 16 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyTrend} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0070F3" stopOpacity={0.22} />
                                        <stop offset="100%" stopColor="#0070F3" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                                <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "none", borderRadius: "8px", color: "var(--text-primary)" }} />
                                <Area type="monotone" dataKey="avgMood" stroke="#0070F3" strokeWidth={2} fill="url(#moodGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {/* Journal Entries Chart */}
            <ChartCard title="Journal Entries" badge="Last 7 Days" className="animate-fade-in-up stagger-5">
                <div style={{ width: "100%", height: 200, marginTop: 16 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={journalData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                            <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "none", borderRadius: "8px", color: "var(--text-primary)" }} />
                            <Bar dataKey="entries" fill="var(--blue)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            {/* Detailed Table */}
            <div className="animate-fade-in-up stagger-6" style={{ marginTop: "24px" }}>
                <DataTable title="Daily Wellness Summary" columns={columns} data={data} />
            </div>

            <div className="privacy-footer">
                ⚠️ All mood and journaling data is anonymized. This dashboard reflects aggregate data only. No individual entries are ever accessible.
            </div>
        </>
    );
}
