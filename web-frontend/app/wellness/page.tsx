"use client";

import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import { wellnessData, moodDistribution } from "@/lib/mockData";

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
                    icon="😊"
                    label="Avg Mood Score"
                    value={`${avgMood}/5`}
                    trend={{ value: "0.3", direction: "up" }}
                    className="animate-fade-in-up stagger-1"
                />
                <StatCard
                    icon="📝"
                    label="Journal Entries"
                    value={totalJournals}
                    trend={{ value: "18%", direction: "up" }}
                    accentColor="var(--purple)"
                    className="animate-fade-in-up stagger-2"
                />
                <StatCard
                    icon="🤝"
                    label="Circle Participants"
                    value={totalCircle}
                    trend={{ value: "22%", direction: "up" }}
                    accentColor="var(--blue)"
                    className="animate-fade-in-up stagger-3"
                />
                <StatCard
                    icon="😴"
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
                        {moodDistribution.map((m) => (
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
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            color: m.color,
                                        }}
                                    >
                                        {m.percentage}%
                                    </span>
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
                        ))}
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
        </>
    );
}
