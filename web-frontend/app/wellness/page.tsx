"use client";

import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import { Smile, BookOpen, Users, Moon } from "lucide-react";
import { wellnessData, moodDistribution } from "@/lib/mockData";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function WellnessPage() {
    const avgMood =
        (
            wellnessData.reduce((s, w) => s + w.avgMood, 0) / wellnessData.length
        ).toFixed(1);
    const totalJournals = wellnessData.reduce((s, w) => s + w.journalEntries, 0);
    const totalCircle = wellnessData.reduce(
        (s, w) => s + w.circleParticipants,
        0
    );
    const avgSleep =
        (
            wellnessData.reduce((s, w) => s + w.sleepAvg, 0) / wellnessData.length
        ).toFixed(1);

    const maxMood = 5;
    const maxJournal = Math.max(...wellnessData.map((w) => w.journalEntries));

    const moodDeltas: Record<string, number> = {
        "😊 Happy": 4,
        "😌 Calm": 2,
        "😐 Neutral": -1,
        "😰 Anxious": -3,
        "😞 Low": -2,
    };

    const attendanceData = [
        { week: 'W1', attendance: 210 },
        { week: 'W2', attendance: 235 },
        { week: 'W3', attendance: 198 },
        { week: 'W4', attendance: 176 },
        { week: 'W5', attendance: 220 },
        { week: 'W6', attendance: 248 },
        { week: 'W7', attendance: 270 },
    ];

    return (
        <>
            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">Mental Wellness</h1>
                <p className="page-subtitle">
                    Monitor campus-wide mental well-being, mood trends, and wellness
                    participation
                </p>
            </div>

            <div className="stats-grid">
                <StatCard
                    icon={<Smile size={20} />}
                    label="Avg Mood Score"
                    value={`${avgMood}/5`}
                    trend={{ value: "0.3", direction: "up" }}
                    className="animate-fade-in-up stagger-1"
                />
                <StatCard
                    icon={<BookOpen size={20} />}
                    label="Journal Entries"
                    value={totalJournals}
                    trend={{ value: "18%", direction: "up" }}
                    accentColor="var(--purple)"
                    className="animate-fade-in-up stagger-2"
                />
                <StatCard
                    icon={<Users size={20} />}
                    label="Circle Participants"
                    value={totalCircle}
                    trend={{ value: "22%", direction: "up" }}
                    accentColor="var(--blue)"
                    className="animate-fade-in-up stagger-3"
                />
                <StatCard
                    icon={<Moon size={20} />}
                    label="Avg Sleep"
                    value={`${avgSleep}h`}
                    trend={{ value: "0.2h", direction: "up" }}
                    accentColor="var(--accent)"
                    className="animate-fade-in-up stagger-4"
                />
            </div>

            <div className="charts-grid">
                {/* Mood Distribution */}
                <ChartCard
                    title="Mood Distribution"
                    badge="This Week"
                    className="animate-fade-in-up stagger-3"
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                            padding: "8px 0",
                        }}
                    >
                        {moodDistribution.map((m) => {
                            const delta = moodDeltas[m.mood];
                            return (
                                <div key={m.mood}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                color: "var(--text-secondary)",
                                            }}
                                        >
                                            {m.mood}
                                        </span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    color: m.color,
                                                }}
                                            >
                                                {m.percentage}%
                                            </span>
                                            {delta !== undefined && (
                                                <span style={{
                                                    fontSize: "11px",
                                                    color: delta > 0 ? "var(--green)" : "var(--red)",
                                                    fontWeight: 600
                                                }}>
                                                    {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="progress-bar" style={{ height: "10px" }}>
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${m.percentage}%`,
                                                background: m.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ChartCard>

                {/* Weekly Mood Trend */}
                <ChartCard
                    title="Weekly Mood Trend"
                    badge="7 Days"
                    className="animate-fade-in-up stagger-4"
                >
                    <div className="bar-chart">
                        {wellnessData.map((w) => (
                            <div key={w.date} className="bar-chart-item">
                                <div
                                    className="bar"
                                    style={{
                                        height: `${(w.avgMood / maxMood) * 100}%`,
                                        background:
                                            w.avgMood >= 4.2
                                                ? "var(--green)"
                                                : w.avgMood >= 3.8
                                                    ? "var(--accent)"
                                                    : "var(--orange)",
                                    }}
                                    title={`Mood: ${w.avgMood}`}
                                />
                                <span className="bar-label">{w.date}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            <div className="charts-grid">
                {/* Journal Activity */}
                <ChartCard
                    title="Journal Entries"
                    badge="Daily"
                    className="animate-fade-in-up stagger-5"
                >
                    <div className="bar-chart">
                        {wellnessData.map((w) => (
                            <div key={w.date} className="bar-chart-item">
                                <div
                                    className="bar"
                                    style={{
                                        height: `${(w.journalEntries / maxJournal) * 100}%`,
                                        background: `linear-gradient(to top, var(--purple), #a78bfa)`,
                                    }}
                                    title={`${w.journalEntries} entries`}
                                />
                                <span className="bar-label">{w.date}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                {/* Wellness Details */}
                <ChartCard
                    title="Daily Wellness Summary"
                    badge="Details"
                    className="animate-fade-in-up stagger-6"
                >
                    <div style={{ overflowX: "auto" }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Mood</th>
                                    <th>Stress</th>
                                    <th>Sleep</th>
                                    <th>Journals</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wellnessData.map((w) => (
                                    <tr key={w.date}>
                                        <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                                            {w.date}
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${w.avgMood >= 4.2
                                                    ? "badge-green"
                                                    : w.avgMood >= 3.8
                                                        ? "badge-cyan"
                                                        : "badge-orange"
                                                    }`}
                                            >
                                                {w.avgMood}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${w.stressLevel <= 4
                                                    ? "badge-green"
                                                    : w.stressLevel <= 5.5
                                                        ? "badge-yellow"
                                                        : "badge-red"
                                                    }`}
                                            >
                                                {w.stressLevel}
                                            </span>
                                        </td>
                                        <td>{w.sleepAvg}h</td>
                                        <td>{w.journalEntries}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </ChartCard>
            </div>

            <div style={{ marginTop: "24px", marginBottom: "32px" }} className="animate-fade-in-up stagger-6">
                <ChartCard title="Wellness Circle Attendance Trend">
                    <div style={{ width: "100%", height: 160, marginTop: 16 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={attendanceData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                                <Tooltip
                                    contentStyle={{ background: "var(--bg-elevated)", border: "none", borderRadius: "8px", color: "var(--text-primary)" }}
                                />
                                <Line type="monotone" dataKey="attendance" stroke="#A78BFA" strokeWidth={2} dot={{ r: 3, fill: "#A78BFA" }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            <div style={{
                borderTop: "1px solid #1a1a1a",
                paddingTop: "16px",
                marginTop: "24px",
                fontSize: "12px",
                color: "#333",
                textAlign: "center"
            }}>
                All wellness data represents campus-wide aggregates (min. group: 10). No individual mood, journal, or stress data is accessible to administrators. Journal content is never stored or viewable by this panel.
            </div>
        </>
    );
}
