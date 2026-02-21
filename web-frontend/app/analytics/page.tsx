"use client";

import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import { monthlyTrends, departmentStats, hostelComparison } from "@/lib/mockData";

export default function AnalyticsPage() {
    const latestMonth = monthlyTrends[monthlyTrends.length - 1];
    const prevMonth = monthlyTrends[monthlyTrends.length - 2];
    const userGrowth = (
        ((latestMonth.users - prevMonth.users) / prevMonth.users) *
        100
    ).toFixed(1);
    const activityGrowth = (
        ((latestMonth.activities - prevMonth.activities) / prevMonth.activities) *
        100
    ).toFixed(1);

    const maxUsers = Math.max(...monthlyTrends.map((m) => m.users));
    const maxDeptUsers = Math.max(...departmentStats.map((d) => d.users));

    return (
        <>
            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">Analytics</h1>
                <p className="page-subtitle">
                    Cross-domain insights, growth trends, and engagement metrics across
                    campus
                </p>
            </div>

            <div className="stats-grid">
                <StatCard
                    icon="📈"
                    label="User Growth"
                    value={`+${userGrowth}%`}
                    trend={{
                        value: `${latestMonth.users - prevMonth.users} new`,
                        direction: "up",
                    }}
                    className="animate-fade-in-up stagger-1"
                />
                <StatCard
                    icon="⚡"
                    label="Activity Growth"
                    value={`+${activityGrowth}%`}
                    trend={{ value: "MoM", direction: "up" }}
                    accentColor="var(--blue)"
                    className="animate-fade-in-up stagger-2"
                />
                <StatCard
                    icon="🍽"
                    label="Meals Served"
                    value={latestMonth.meals.toLocaleString()}
                    accentColor="var(--orange)"
                    className="animate-fade-in-up stagger-3"
                />
                <StatCard
                    icon="🎯"
                    label="Engagement Rate"
                    value="78%"
                    trend={{ value: "4.2%", direction: "up" }}
                    accentColor="var(--green)"
                    className="animate-fade-in-up stagger-4"
                />
            </div>

            <div className="charts-grid">
                {/* Monthly User Growth */}
                <ChartCard
                    title="Monthly User Growth"
                    badge="6 Months"
                    className="animate-fade-in-up stagger-3"
                >
                    <div className="bar-chart">
                        {monthlyTrends.map((m) => (
                            <div key={m.month} className="bar-chart-item">
                                <div
                                    className="bar"
                                    style={{
                                        height: `${(m.users / maxUsers) * 100}%`,
                                        background: `linear-gradient(to top, var(--accent-dark), var(--accent-light))`,
                                    }}
                                    title={`${m.users} users`}
                                />
                                <span className="bar-label">{m.month}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                {/* Department Engagement */}
                <ChartCard
                    title="Department Engagement"
                    badge="All Depts"
                    className="animate-fade-in-up stagger-4"
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                        }}
                    >
                        {departmentStats
                            .sort((a, b) => b.engagement - a.engagement)
                            .slice(0, 6)
                            .map((d) => (
                                <div key={d.dept}>
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
                                            }}
                                        >
                                            {d.dept}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                color:
                                                    d.engagement >= 80
                                                        ? "var(--green)"
                                                        : d.engagement >= 70
                                                            ? "var(--accent)"
                                                            : "var(--orange)",
                                            }}
                                        >
                                            {d.engagement}%
                                        </span>
                                    </div>
                                    <div className="progress-bar" style={{ height: "6px" }}>
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${d.engagement}%`,
                                                background:
                                                    d.engagement >= 80
                                                        ? "var(--green)"
                                                        : d.engagement >= 70
                                                            ? "var(--accent)"
                                                            : "var(--orange)",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </ChartCard>
            </div>

            {/* Department Table */}
            <ChartCard
                title="Department Breakdown"
                badge="Detailed"
                className="animate-fade-in-up stagger-5"
            >
                <div style={{ overflowX: "auto" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th>Users</th>
                                <th>Avg Fitness Score</th>
                                <th>Engagement</th>
                                <th>Distribution</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departmentStats.map((d) => (
                                <tr key={d.dept}>
                                    <td
                                        style={{
                                            fontWeight: 600,
                                            color: "var(--text-primary)",
                                        }}
                                    >
                                        {d.dept}
                                    </td>
                                    <td>{d.users}</td>
                                    <td>
                                        <span
                                            className={`badge ${d.avgFitness >= 80
                                                    ? "badge-green"
                                                    : d.avgFitness >= 75
                                                        ? "badge-cyan"
                                                        : "badge-orange"
                                                }`}
                                        >
                                            {d.avgFitness}/100
                                        </span>
                                    </td>
                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                            }}
                                        >
                                            <div
                                                className="progress-bar"
                                                style={{ width: "80px" }}
                                            >
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{
                                                        width: `${d.engagement}%`,
                                                        background:
                                                            d.engagement >= 80
                                                                ? "var(--green)"
                                                                : d.engagement >= 70
                                                                    ? "var(--accent)"
                                                                    : "var(--orange)",
                                                    }}
                                                />
                                            </div>
                                            <span>{d.engagement}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div
                                            className="progress-bar"
                                            style={{ width: "100px", height: "8px" }}
                                        >
                                            <div
                                                className="progress-bar-fill"
                                                style={{
                                                    width: `${(d.users / maxDeptUsers) * 100}%`,
                                                    background: "var(--blue)",
                                                }}
                                            />
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
                <ChartCard
                    title="Hostel Performance Ranking"
                    badge="Comparative"
                    className="animate-fade-in-up stagger-6"
                >
                    <div className="info-grid" style={{ marginBottom: 0 }}>
                        {hostelComparison
                            .sort((a, b) => b.wellnessScore - a.wellnessScore)
                            .map((h, idx) => (
                                <div className="info-card" key={h.hostel} style={{ border: idx === 0 ? "1px solid var(--border-accent)" : undefined }}>
                                    <div className="info-card-header">
                                        <div
                                            className="info-card-icon"
                                            style={{
                                                background:
                                                    idx === 0
                                                        ? "var(--accent-glow)"
                                                        : "rgba(100, 116, 139, 0.1)",
                                                color: idx === 0 ? "var(--accent)" : "var(--text-muted)",
                                                fontSize: "16px",
                                            }}
                                        >
                                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                                        </div>
                                        <div>
                                            <div className="info-card-title">{h.hostel} Bhawan</div>
                                            <div className="info-card-subtitle">
                                                {h.activeUsers} active users
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info-card-body">
                                        <div className="info-metric">
                                            <span className="info-metric-label">Wellness</span>
                                            <span className="info-metric-value">{h.wellnessScore}/100</span>
                                        </div>
                                        <div className="info-metric">
                                            <span className="info-metric-label">Avg Steps</span>
                                            <span className="info-metric-value">
                                                {h.avgSteps.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="info-metric">
                                            <span className="info-metric-label">Avg Calories</span>
                                            <span className="info-metric-value">{h.avgCalories}</span>
                                        </div>
                                        <div className="progress-bar" style={{ height: "4px" }}>
                                            <div
                                                className="progress-bar-fill"
                                                style={{
                                                    width: `${h.wellnessScore}%`,
                                                    background: idx === 0 ? "var(--accent)" : "var(--blue)",
                                                }}
                                            />
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
