"use client";

import React from "react";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import {
  dashboardStats,
  weeklyActivityTrend,
  nutritionByMeal,
  hostelComparison,
  users,
} from "@/lib/mockData";

export default function DashboardPage() {
  const maxActivity = Math.max(...weeklyActivityTrend.map((d) => d.count));
  const totalMealCals = nutritionByMeal.reduce(
    (s, m) => s + m.avgCalories,
    0
  );

  return (
    <>
      <div className="page-header animate-fade-in-up">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Campus fitness & wellness overview — Real-time insights
        </p>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <StatCard
          icon="👥"
          label="Total Users"
          value={dashboardStats.totalUsers.toLocaleString()}
          trend={{ value: "12.5%", direction: "up" }}
          className="animate-fade-in-up stagger-1"
        />
        <StatCard
          icon="⚡"
          label="Active Today"
          value={dashboardStats.activeToday.toLocaleString()}
          trend={{ value: "8.2%", direction: "up" }}
          accentColor="var(--blue)"
          className="animate-fade-in-up stagger-2"
        />
        <StatCard
          icon="🔥"
          label="Avg Calories"
          value={dashboardStats.avgCalories.toLocaleString()}
          trend={{ value: "3.1%", direction: "down" }}
          accentColor="var(--orange)"
          className="animate-fade-in-up stagger-3"
        />
        <StatCard
          icon="💚"
          label="Wellness Score"
          value={`${dashboardStats.wellnessScore}/100`}
          trend={{ value: "5.4%", direction: "up" }}
          accentColor="var(--green)"
          className="animate-fade-in-up stagger-4"
        />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <ChartCard
          title="Weekly Activity Trends"
          badge="This Week"
          className="animate-fade-in-up stagger-3"
        >
          <div className="bar-chart">
            {weeklyActivityTrend.map((d) => (
              <div key={d.day} className="bar-chart-item">
                <div
                  className="bar"
                  style={{
                    height: `${(d.count / maxActivity) * 100}%`,
                    background: `linear-gradient(to top, var(--accent-dark), var(--accent-light))`,
                  }}
                  title={`${d.count} activities`}
                />
                <span className="bar-label">{d.day}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Nutrition by Meal"
          badge="Daily Avg"
          className="animate-fade-in-up stagger-4"
        >
          <div className="donut-chart-container">
            <div className="donut-chart">
              <svg viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                {nutritionByMeal.reduce(
                  (acc, item, i) => {
                    const percentage = (item.avgCalories / totalMealCals) * 100;
                    const strokeDasharray = `${(percentage / 100) * 376.99
                      } 376.99`;
                    const element = (
                      <circle
                        key={i}
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="20"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={`${-acc.offset}`}
                        strokeLinecap="round"
                        style={{
                          transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                    );
                    acc.elements.push(element);
                    acc.offset += (percentage / 100) * 376.99;
                    return acc;
                  },
                  { elements: [] as React.ReactNode[], offset: 0 }
                ).elements}
              </svg>
              <div className="donut-center">
                <div className="donut-center-value">
                  {totalMealCals.toLocaleString()}
                </div>
                <div className="donut-center-label">kcal/day</div>
              </div>
            </div>
            <div className="donut-legend">
              {nutritionByMeal.map((item) => (
                <div key={item.meal} className="donut-legend-item">
                  <div
                    className="donut-legend-color"
                    style={{ background: item.color }}
                  />
                  <span className="donut-legend-text">{item.meal}</span>
                  <span className="donut-legend-value">
                    {item.avgCalories} kcal
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Hostel Comparison */}
      <ChartCard
        title="Hostel Comparison"
        badge="Live"
        className="animate-fade-in-up stagger-5"
      >
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Hostel</th>
                <th>Active Users</th>
                <th>Avg Steps</th>
                <th>Avg Calories</th>
                <th>Wellness Score</th>
              </tr>
            </thead>
            <tbody>
              {hostelComparison.map((h) => (
                <tr key={h.hostel}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {h.hostel} Bhawan
                  </td>
                  <td>{h.activeUsers}</td>
                  <td>{h.avgSteps.toLocaleString()}</td>
                  <td>{h.avgCalories.toLocaleString()} kcal</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div className="progress-bar" style={{ width: "80px" }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${h.wellnessScore}%`,
                            background:
                              h.wellnessScore >= 80
                                ? "var(--green)"
                                : h.wellnessScore >= 70
                                  ? "var(--accent)"
                                  : "var(--orange)",
                          }}
                        />
                      </div>
                      <span>{h.wellnessScore}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Recent Users */}
      <div style={{ marginTop: "24px" }}>
        <ChartCard
          title="Recent Active Users"
          badge={`${users.length} users`}
          className="animate-fade-in-up stagger-6"
        >
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Hostel</th>
                  <th>Branch</th>
                  <th>Fitness Level</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 6).map((u) => (
                  <tr key={u.id}>
                    <td
                      style={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {u.name}
                    </td>
                    <td>{u.hostel}</td>
                    <td>{u.branch}</td>
                    <td>
                      <span
                        className={`badge ${u.fitnessLevel === "Advanced"
                          ? "badge-green"
                          : u.fitnessLevel === "Intermediate"
                            ? "badge-blue"
                            : "badge-orange"
                          }`}
                      >
                        {u.fitnessLevel}
                      </span>
                    </td>
                    <td>{u.lastActive}</td>
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
