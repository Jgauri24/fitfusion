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
} from "recharts";

export default function DashboardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        Loading dashboard data...
      </div>
    );
  }

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
              <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ background: "var(--bg-elevated)", border: "none", borderRadius: "8px", color: "var(--text-primary)" }}
                  formatter={(val: any) => [`${val}%`, "Activity Level"]}
                />
                <ReferenceLine
                  y={avgPercentage}
                  stroke="var(--text-muted)"
                  strokeDasharray="3 3"
                  label={{ position: "right", value: "Avg", fill: "var(--text-muted)", fontSize: 11 }}
                />
                <Bar dataKey="percentage" fill="var(--accent-dark)" radius={[4, 4, 0, 0]} />
              </BarChart>
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
              {nutritionByMeal.map((item: any) => (
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
                        <span className="badge badge-cyan" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
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
    </>
  );
}
