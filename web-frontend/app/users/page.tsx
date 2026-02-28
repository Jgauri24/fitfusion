"use client";

import { useState } from "react";
import DataTable from "@/components/DataTable";
import StatCard from "@/components/StatCard";
import { Users, Sprout, Dumbbell, Trophy } from "lucide-react";

const cohorts = [
    { id: 1, hostel: "Govind Bhawan", branch: "ME", year: "3", students: 45, wellness: 85, steps: 9200, diet: "61% Non-Veg", flags: 1, trend: "up" },
    { id: 2, hostel: "Sarojini Bhawan", branch: "ECE", year: "1", students: 38, wellness: 74, steps: 7800, diet: "91% Veg", flags: 3, trend: "neutral" },
    { id: 3, hostel: "Rajendra Bhawan", branch: "CSE", year: "2", students: 52, wellness: 79, steps: 8400, diet: "78% Veg", flags: 0, trend: "up" },
    { id: 4, hostel: "Kasturba Bhawan", branch: "BT", year: "1", students: 29, wellness: 68, steps: 6900, diet: "88% Veg", flags: 5, trend: "down" },
    { id: 5, hostel: "Cautley Bhawan", branch: "Civil", year: "3", students: 34, wellness: 77, steps: 8200, diet: "55% Veg", flags: 2, trend: "up" },
    { id: 6, hostel: "Jawahar Bhawan", branch: "EE", year: "4", students: 41, wellness: 71, steps: 7500, diet: "67% Veg", flags: 4, trend: "down" }
];

export default function UsersPage() {
    const [hostel, setHostel] = useState("All");
    const [branch, setBranch] = useState("All");
    const [year, setYear] = useState("All");
    const [fitness, setFitness] = useState("All");

    const filteredCohorts = cohorts.filter(c => {
        if (hostel !== "All" && c.hostel !== hostel) return false;
        if (branch !== "All" && c.branch !== branch) return false;
        if (year !== "All" && c.year !== year.replace(/\D/g, '')) return false;
        if (fitness !== "All") return false;
        return true;
    });

    const totalStudents = filteredCohorts.reduce((acc, c) => acc + c.students, 0);
    const showSuppression = totalStudents < 10;
    const finalCohorts = showSuppression ? [] : filteredCohorts;

    const columns = [
        {
            key: "cohort",
            label: "COHORT",
            render: (c: typeof cohorts[0]) => (
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {c.hostel} · {c.branch} · Year {c.year}
                </span>
            ),
        },
        { key: "students", label: "STUDENTS" },
        {
            key: "wellness",
            label: "AVG WELLNESS",
            render: (c: typeof cohorts[0]) => (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div className="progress-bar" style={{ width: "60px" }}>
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${c.wellness}%`,
                                background:
                                    c.wellness >= 85
                                        ? "var(--green)"
                                        : c.wellness >= 70
                                            ? "var(--accent)"
                                            : "var(--orange)",
                            }}
                        />
                    </div>
                    <span style={{ fontSize: "12px" }}>{c.wellness}</span>
                </div>
            )
        },
        { key: "steps", label: "AVG STEPS/DAY" },
        { key: "diet", label: "DIET BREAKDOWN" },
        {
            key: "flags",
            label: "BURNOUT FLAGS",
            render: (c: typeof cohorts[0]) => {
                if (c.flags === 0) return <span style={{ color: "var(--green)", fontWeight: 600 }}>None</span>;
                if (c.flags <= 2) return <span className="badge badge-purple">{c.flags} flags</span>;
                if (c.flags <= 4) return <span className="badge badge-orange">{c.flags} flags</span>;
                return <span className="badge badge-red">{c.flags} flags</span>;
            }
        },
        {
            key: "trend",
            label: "TREND",
            render: (c: typeof cohorts[0]) => (
                <span style={{
                    color: c.trend === "up" ? "var(--green)" : c.trend === "down" ? "var(--red)" : "var(--text-secondary)",
                    fontWeight: 600
                }}>
                    {c.trend === "up" ? "↑ Up" : c.trend === "down" ? "↓ Down" : "— Neutral"}
                </span>
            )
        }
    ];

    return (
        <>
            <div style={{
                background: "rgba(255,68,68,0.06)",
                border: "1px solid rgba(255,68,68,0.2)",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "24px",
                color: "var(--text-primary)",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            }}>
                🔒 Privacy Mode Active — All data represents groups of 10+ students. Individual records are never accessible through this panel.
            </div>

            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">User Management</h1>
                <p className="page-subtitle">
                    Manage student profiles, fitness levels, and dietary preferences
                </p>
            </div>

            <div className="stats-grid">
                <StatCard
                    icon={<Users size={20} />}
                    label="Total Students (Aggregated)"
                    value={2847}
                    className="animate-fade-in-up stagger-1"
                />
                <StatCard
                    icon={<Sprout size={20} />}
                    label="Beginners"
                    value={1040}
                    accentColor="var(--orange)"
                    className="animate-fade-in-up stagger-2"
                />
                <StatCard
                    icon={<Dumbbell size={20} />}
                    label="Intermediate"
                    value={1255}
                    accentColor="var(--blue)"
                    className="animate-fade-in-up stagger-3"
                />
                <StatCard
                    icon={<Trophy size={20} />}
                    label="Advanced"
                    value={552}
                    accentColor="var(--green)"
                    className="animate-fade-in-up stagger-4"
                />
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
                    <div style={{
                        padding: "48px",
                        textAlign: "center",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--text-muted)",
                        fontSize: "15px"
                    }}>
                        🔒 Group too small to display (privacy protected — minimum group size: 10)
                    </div>
                ) : (
                    <DataTable
                        title="Cohort Overview"
                        columns={columns}
                        data={finalCohorts}
                    />
                )}
            </div>

            <div className="animate-fade-in-up stagger-6">
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "16px" }}>
                    Flagged Cohorts Requiring Attention
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "16px" }}>

                    <div style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderLeft: "4px solid var(--red)",
                        borderRadius: "var(--radius-md)",
                        padding: "20px"
                    }}>
                        <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px" }}>
                            Sarojini Bhawan · Year 1 · Mixed Branches
                        </div>
                        <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Flagged Students</div>
                                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--red)" }}>3 students</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Avg Mood</div>
                                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>2.8/5</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Avg Sleep</div>
                                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>5.2h</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Avg Stress</div>
                                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--orange)" }}>7.1</div>
                            </div>
                        </div>
                        <div style={{
                            background: "rgba(255,255,255,0.03)",
                            padding: "12px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                            marginBottom: "16px"
                        }}>
                            <strong>Recommendation:</strong> Schedule wellness circle session this week
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button className="filter-btn" style={{ background: "var(--bg-elevated)", color: "var(--text-primary)" }}>Notify Warden</button>
                            <button className="filter-btn" style={{ background: "var(--accent)", color: "#fff", fontWeight: 600, borderColor: "var(--accent)" }}>Schedule Circle</button>
                            <button className="filter-btn" style={{ marginLeft: "auto" }}>Dismiss</button>
                        </div>
                    </div>

                    <div style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderLeft: "4px solid var(--red)",
                        borderRadius: "var(--radius-md)",
                        padding: "20px"
                    }}>
                        <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px" }}>
                            Kasturba Bhawan · BT · Year 1
                        </div>
                        <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Flagged Students</div>
                                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--red)" }}>5 students</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Avg Mood</div>
                                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>2.5/5</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Avg Sleep</div>
                                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>4.9h</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Avg Stress</div>
                                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--red)" }}>7.8</div>
                            </div>
                        </div>
                        <div style={{
                            background: "rgba(255,107,107,0.1)",
                            padding: "12px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            color: "var(--red)",
                            marginBottom: "16px"
                        }}>
                            <strong>Recommendation:</strong> Urgent: Notify warden and counselor referral
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button className="filter-btn" style={{ background: "var(--bg-elevated)", color: "var(--text-primary)" }}>Notify Warden</button>
                            <button className="filter-btn" style={{ background: "var(--accent)", color: "#fff", fontWeight: 600, borderColor: "var(--accent)" }}>Schedule Circle</button>
                            <button className="filter-btn" style={{ marginLeft: "auto" }}>Dismiss</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
