"use client";

import React, { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import { Users, Zap, AlertTriangle, Heart } from "lucide-react";
import ChartCard from "@/components/ChartCard";
import api from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
} from "recharts";

function DateSelector() {
  const days = [
    { num: "01", day: "Sat" },
    { num: "02", day: "Sun" },
    { num: "03", day: "Mon" },
    { num: "04", day: "Tue" },
    { num: "05", day: "Wed" },
    { num: "06", day: "Thu" },
    { num: "07", day: "Fri" },
    { num: "08", day: "Sat" },
    { num: "09", day: "Sun" },
    { num: "10", day: "Mon" },
    { num: "11", day: "Tue" },
    { num: "12", day: "Wed" },
    { num: "13", day: "Thu" },
  ];
  const [active, setActive] = useState(9);
  return (
    <div className="date-selector">
      {days.map((d, i) => (
        <div
          key={i}
          className={`date-pill ${active === i ? "active" : ""}`}
          onClick={() => setActive(i)}
        >
          <span className="date-pill-day">{d.num}</span>
          <span className="date-pill-label">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("Days");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const weeklyActivityTrend = stats?.weeklyActivityTrend || [];
  const maxActivity = weeklyActivityTrend.length ? Math.max(...weeklyActivityTrend.map((d: any) => d.count)) : 0;
  const avgActivity = weeklyActivityTrend.length ? weeklyActivityTrend.reduce((s: number, d: any) => s + d.count, 0) / weeklyActivityTrend.length : 0;

  const weeklyData = weeklyActivityTrend.map((d: any) => ({
    ...d,
    percentage: maxActivity > 0 ? Math.round((d.count / maxActivity) * 100) : 0
  }));
  const avgPercentage = maxActivity > 0 ? Math.round((avgActivity / maxActivity) * 100) : 0;

  const nutritionByMeal = stats?.nutritionByMeal || [];
  const totalMealCals = nutritionByMeal.reduce(
    (s: number, m: any) => s + m.avgCalories,
    0
  );

  const hostelComparison = stats?.hostelComparison || [];

  const burnoutFlagsMap: Record<string, number> = {
    "Govind": 1,
    "Sarojini": 3,
    "Rajendra": 0,
    "Kasturba": 5,
    "Cautley": 2,
    "Jawahar": 4,
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", color: "var(--text-muted)" }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            border: "3px solid var(--border)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading dashboard data...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header animate-fade-in-up">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">Statistics</h1>
            <p className="page-subtitle">
              Campus fitness & wellness overview — Real-time insights
            </p>
          </div>
          <div className="period-toggle">
            {["Days", "Weeks", "Months"].map((p) => (
              <button
                key={p}
                className={`period-btn ${period === p ? "active" : ""}`}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date Selector */}
      <div className="animate-fade-in-up stagger-1">
        <DateSelector />
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <StatCard
          icon={<Users size={20} />}
          label="Total Users"
          value={stats?.totalUsers?.toLocaleString() || "0"}
          trend={{ value: "12.5%", direction: "up" }}
          className="animate-fade-in-up stagger-1"
        />
        <StatCard
          icon={<Zap size={20} />}
          label="Active Today"
          value={stats?.activeToday?.toLocaleString() || "0"}
          trend={{ value: "8.2%", direction: "up" }}
          accentColor="var(--blue)"
          className="animate-fade-in-up stagger-2"
        />
        <div
          onClick={() => setDrawerOpen(!drawerOpen)}
          style={{ cursor: "pointer" }}
          title="Click to review burnout alerts"
        >
          <StatCard
            icon={<AlertTriangle size={20} />}
            label="Active Burnout Alerts"
            value="24"
            trend={{ value: "2 new", direction: "up" }}
            accentColor="var(--red)"
            className="animate-fade-in-up stagger-3"
          />
        </div>
        <StatCard
          icon={<Heart size={20} />}
          label="Wellness Score"
          value={`${stats?.wellnessScore || 0}/100`}
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
          <div style={{ width: "100%", height: 220, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                <Tooltip
                  cursor={{ stroke: "var(--accent)", strokeWidth: 1, strokeDasharray: "4 4" }}
                  contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-light)", borderRadius: "12px", color: "var(--text-primary)", boxShadow: "var(--shadow-md)" }}
                  formatter={(val: any) => [`${val}%`, "Activity Level"]}
                />
                <ReferenceLine
                  y={avgPercentage}
                  stroke="var(--gold)"
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  label={{ position: "right", value: "Avg", fill: "var(--gold)", fontSize: 11, fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fill="url(#purpleGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
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
                  (acc: { elements: React.ReactNode[]; offset: number }, item: any, i: number) => {
                    const percentage = totalMealCals > 0 ? (item.avgCalories / totalMealCals) * 100 : 0;
                    const strokeDasharray = `${(percentage / 100) * 376.99
                      } 376.99`;
                    const mealColors = ["#a855f7", "#f59e0b", "#5e9eff", "#ff6b9d"];
                    const element = (
                      <circle
                        key={i}
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke={mealColors[i % mealColors.length]}
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
              {nutritionByMeal.map((item: any, i: number) => {
                const mealColors = ["#a855f7", "#f59e0b", "#5e9eff", "#ff6b9d"];
                return (
                  <div key={item.meal} className="donut-legend-item">
                    <div
                      className="donut-legend-color"
                      style={{ background: mealColors[i % mealColors.length] }}
                    />
                    <span className="donut-legend-text">{item.meal}</span>
                    <span className="donut-legend-value">
                      {item.avgCalories} kcal
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Hostel Comparison */}
      <ChartCard
        title="Hostel Comparison"
        badge={
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="live-dot"></span>
            LIVE
          </div>
        }
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
                <th>Burnout Flags</th>
              </tr>
            </thead>
            <tbody>
              {hostelComparison.map((h: any) => {
                const flags = burnoutFlagsMap[h.hostel] || 0;
                return (
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
                    <td>
                      {flags === 0 ? (
                        <span style={{ color: "var(--green)", fontWeight: 600 }}>None</span>
                      ) : flags <= 2 ? (
                        <span className="badge badge-purple">
                          {flags} flags
                        </span>
                      ) : flags <= 4 ? (
                        <span className="badge badge-orange">{flags} flags</span>
                      ) : (
                        <span className="badge badge-red">{flags} flags</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Feature Card */}
      <div style={{ marginTop: "28px" }} className="animate-fade-in-up stagger-6">
        <div className="feature-card">
          <div className="feature-card-value">
            +{stats?.totalUsers?.toLocaleString() || "2,847"}
          </div>
          <div className="feature-card-label">Total Campus Users</div>
        </div>
      </div>
    </>
  );
}
