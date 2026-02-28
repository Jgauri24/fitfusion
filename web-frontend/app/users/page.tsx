"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { Users, Sprout, Dumbbell, Trophy } from "lucide-react";
import api from "@/lib/api";

interface Cohort {
    id: number;
    hostel: string;
    branch: string;
    year: string;
    students: number;
    wellness: number;
    steps: number;
    diet: string;
    flags: number;
    trend: string;
}

export default function UsersPage() {
    const [hostel, setHostel] = useState("All");
    const [branch, setBranch] = useState("All");
    const [year, setYear] = useState("All");
    const [fitness, setFitness] = useState("All");
    const [loading, setLoading] = useState(true);

    const [totalStudents, setTotalStudents] = useState(0);
    const [beginners, setBeginners] = useState(0);
    const [intermediate, setIntermediate] = useState(0);
    const [advanced, setAdvanced] = useState(0);
    const [cohorts, setCohorts] = useState<Cohort[]>([]);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const res = await api.get('/api/admin/users/stats');
                setTotalStudents(res.data.totalStudents);
                setBeginners(res.data.beginners);
                setIntermediate(res.data.intermediate);
                setAdvanced(res.data.advanced);
                setCohorts(res.data.cohorts);
            } catch (error) {
                console.error("Failed to fetch user stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserStats();
    }, []);

    const filteredCohorts = cohorts.filter(c => {
        if (hostel !== "All" && c.hostel !== hostel) return false;
        if (branch !== "All" && c.branch !== branch) return false;
        if (year !== "All" && c.year !== year.replace(/\D/g, '')) return false;
        if (fitness !== "All") return false;
        return true;
    });

    const filteredTotal = filteredCohorts.reduce((acc, c) => acc + c.students, 0);
    const showSuppression = filteredTotal < 10;
    const finalCohorts = showSuppression ? [] : filteredCohorts;

    const columns = [
        {
            key: "cohort", label: "COHORT",
            render: (c: Cohort) => <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{c.hostel} · {c.branch} · Year {c.year}</span>,
        },
        { key: "students", label: "STUDENTS" },
        {
            key: "wellness", label: "AVG WELLNESS",
            render: (c: Cohort) => (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div className="progress-bar" style={{ width: "60px" }}>
                        <div className="progress-bar-fill" style={{ width: `${c.wellness}%`, background: c.wellness >= 85 ? "var(--green)" : c.wellness >= 70 ? "var(--accent)" : "var(--orange)" }} />
                    </div>
                    <span style={{ fontSize: "12px" }}>{c.wellness}</span>
                </div>
            )
        },
        { key: "steps", label: "AVG STEPS/DAY" },
        { key: "diet", label: "DIET BREAKDOWN" },
        {
            key: "flags", label: "BURNOUT FLAGS",
            render: (c: Cohort) => {
                if (c.flags === 0) return <span style={{ color: "var(--green)", fontWeight: 600 }}>None</span>;
                if (c.flags <= 2) return <span className="badge badge-purple">{c.flags} flags</span>;
                if (c.flags <= 4) return <span className="badge badge-orange">{c.flags} flags</span>;
                return <span className="badge badge-red">{c.flags} flags</span>;
            }
        },
        {
            key: "trend", label: "TREND",
            render: (c: Cohort) => (
                <span style={{ color: c.trend === "up" ? "var(--green)" : c.trend === "down" ? "var(--red)" : "var(--text-secondary)", fontWeight: 600 }}>
                    {c.trend === "up" ? "↑ Up" : c.trend === "down" ? "↓ Down" : "— Neutral"}
                </span>
            )
        }
    ];

    if (loading) {
        return <div className="loading-container"><div className="loading-inner"><div className="loading-spinner" />Loading user data...</div></div>;
    }

    return (
        <>
            <div className="alert-banner alert-banner-warning animate-fade-in-up">
                🔒 Privacy Mode Active — All data represents groups of 10+ students. Individual records are never accessible through this panel.
            </div>

            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">User Management</h1>
                <p className="page-subtitle">Manage student profiles, fitness levels, and dietary preferences</p>
            </div>

            <div className="stats-grid">
                <StatCard icon={<Users size={20} />} label="Total Students (Aggregated)" value={totalStudents} className="animate-fade-in-up stagger-1" />
                <StatCard icon={<Sprout size={20} />} label="Beginners" value={beginners} accentColor="var(--orange)" className="animate-fade-in-up stagger-2" />
                <StatCard icon={<Dumbbell size={20} />} label="Intermediate" value={intermediate} accentColor="var(--blue)" className="animate-fade-in-up stagger-3" />
                <StatCard icon={<Trophy size={20} />} label="Advanced" value={advanced} accentColor="var(--green)" className="animate-fade-in-up stagger-4" />
            </div>

            <div className="filters-row animate-fade-in-up stagger-4">
                <select className="filter-btn" value={hostel} onChange={e => setHostel(e.target.value)}>
                    {["All", "Govind Bhawan", "Sarojini Bhawan", "Rajendra Bhawan", "Kasturba Bhawan", "Cautley Bhawan", "Jawahar Bhawan"].map(o => <option key={o} value={o}>{o === "All" ? "Hostel: All" : o}</option>)}
                </select>
                <select className="filter-btn" value={branch} onChange={e => setBranch(e.target.value)}>
                    {["All", "CSE", "IT", "ME", "ECE", "Civil", "EE", "BT", "CH"].map(o => <option key={o} value={o}>{o === "All" ? "Branch: All" : o}</option>)}
                </select>
                <select className="filter-btn" value={year} onChange={e => setYear(e.target.value)}>
                    {["All", "1st", "2nd", "3rd", "4th"].map(o => <option key={o} value={o}>{o === "All" ? "Year: All" : o}</option>)}
                </select>
                <select className="filter-btn" value={fitness} onChange={e => setFitness(e.target.value)}>
                    {["All", "Beginner", "Intermediate", "Advanced"].map(o => <option key={o} value={o}>{o === "All" ? "Fitness: All" : o}</option>)}
                </select>
            </div>

            <div className="animate-fade-in-up stagger-5" style={{ marginBottom: "32px", minHeight: "200px" }}>
                {showSuppression ? (
                    <div className="empty-state">🔒 Group too small to display (privacy protected — minimum group size: 10)</div>
                ) : (
                    <DataTable title="Cohort Overview" columns={columns} data={finalCohorts} />
                )}
            </div>

            {/* Flagged Cohorts */}
            <div className="animate-fade-in-up stagger-6">
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "16px" }}>Flagged Cohorts Requiring Attention</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "16px" }}>
                    <div className="flagged-card">
                        <div className="flagged-card-title">Sarojini Bhawan · Year 1 · Mixed Branches</div>
                        <div className="flagged-card-metrics">
                            <div className="flagged-card-metric"><div className="flagged-card-metric-label">Flagged Students</div><div className="flagged-card-metric-value" style={{ color: "var(--red)" }}>3 students</div></div>
                            <div className="flagged-card-metric"><div className="flagged-card-metric-label">Avg Mood</div><div className="flagged-card-metric-value">2.8/5</div></div>
                            <div className="flagged-card-metric"><div className="flagged-card-metric-label">Avg Sleep</div><div className="flagged-card-metric-value">5.2h</div></div>
                            <div className="flagged-card-metric"><div className="flagged-card-metric-label">Avg Stress</div><div className="flagged-card-metric-value" style={{ color: "var(--orange)" }}>7.1</div></div>
                        </div>
                        <div className="flagged-card-recommendation warning"><strong>Recommendation:</strong> Schedule wellness circle session this week</div>
                        <div className="flagged-card-actions">
                            <button className="btn-ghost">Notify Warden</button>
                            <button className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>Schedule Circle</button>
                            <button className="btn-ghost" style={{ marginLeft: "auto" }}>Dismiss</button>
                        </div>
                    </div>

                    <div className="flagged-card">
                        <div className="flagged-card-title">Kasturba Bhawan · BT · Year 1</div>
                        <div className="flagged-card-metrics">
                            <div className="flagged-card-metric"><div className="flagged-card-metric-label">Flagged Students</div><div className="flagged-card-metric-value" style={{ color: "var(--red)" }}>5 students</div></div>
                            <div className="flagged-card-metric"><div className="flagged-card-metric-label">Avg Mood</div><div className="flagged-card-metric-value">2.5/5</div></div>
                            <div className="flagged-card-metric"><div className="flagged-card-metric-label">Avg Sleep</div><div className="flagged-card-metric-value">4.9h</div></div>
                            <div className="flagged-card-metric"><div className="flagged-card-metric-label">Avg Stress</div><div className="flagged-card-metric-value" style={{ color: "var(--red)" }}>7.8</div></div>
                        </div>
                        <div className="flagged-card-recommendation critical"><strong>Recommendation:</strong> Urgent: Notify warden and counselor referral</div>
                        <div className="flagged-card-actions">
                            <button className="btn-ghost">Notify Warden</button>
                            <button className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>Schedule Circle</button>
                            <button className="btn-ghost" style={{ marginLeft: "auto" }}>Dismiss</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
