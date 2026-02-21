"use client";

import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import { environmentData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function EnvironmentPage() {
    const avgAqi = Math.round(
        environmentData.reduce((s, e) => s + e.aqi, 0) / environmentData.length
    );
    const avgNoise = Math.round(
        environmentData.reduce((s, e) => s + e.noiseDb, 0) / environmentData.length
    );
    const avgTemp = Math.round(
        environmentData.reduce((s, e) => s + e.temperature, 0) /
        environmentData.length
    );
    const avgHumidity = Math.round(
        environmentData.reduce((s, e) => s + e.humidity, 0) /
        environmentData.length
    );

    const getAqiColor = (aqi: number) => {
        if (aqi <= 50) return "var(--green)";
        if (aqi <= 100) return "var(--yellow)";
        if (aqi <= 150) return "var(--orange)";
        return "var(--red)";
    };

    const getNoiseColor = (db: number) => {
        if (db <= 35) return "var(--green)";
        if (db <= 50) return "var(--accent)";
        if (db <= 65) return "var(--yellow)";
        return "var(--red)";
    };

    const getCrowdBadge = (density: string) => {
        switch (density) {
            case "Low": return "badge-green";
            case "Medium": return "badge-yellow";
            case "High": return "badge-red";
            default: return "badge-cyan";
        }
    };

    const impactData = [
        { zone: "Library Area", stress: 3.2, activity: 45 },
        { zone: "Sports Complex", stress: 2.8, activity: 92 },
        { zone: "Main Ground", stress: 3.1, activity: 78 },
        { zone: "Academic Block", stress: 6.8, activity: 28 },
        { zone: "Hostel North", stress: 4.2, activity: 55 },
        { zone: "Mess Area", stress: 3.8, activity: 40 },
    ];

    const timeSlots = ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"];
    const heatmapData = [
        { zone: "Main Ground", data: [15, 20, 35, 40, 30, 65, 80, 45, 10] },
        { zone: "Library", data: [5, 15, 85, 60, 50, 45, 65, 90, 85] },
        { zone: "Sports Complex", data: [20, 45, 15, 10, 20, 85, 95, 40, 15] },
        { zone: "Academic Block", data: [5, 45, 95, 90, 85, 40, 15, 5, 5] },
        { zone: "Hostel North", data: [90, 70, 30, 40, 45, 60, 75, 85, 95] },
        { zone: "Hostel South", data: [85, 65, 35, 45, 50, 55, 70, 80, 90] },
        { zone: "Mess Area", data: [30, 95, 20, 90, 10, 15, 30, 95, 20] },
        { zone: "Gym", data: [45, 65, 25, 15, 20, 75, 90, 60, 20] },
    ];

    const getCellBg = (val: number) => {
        if (val < 25) return "#0d2b0d";
        if (val <= 50) return "#1a4a1a";
        if (val <= 75) return "rgba(255,107,53,0.2)";
        return "rgba(255,68,68,0.27)";
    };

    return (
        <>
            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">Environmental Monitoring</h1>
                <p className="page-subtitle">
                    Air quality, noise levels, weather, and crowd density across campus zones
                </p>
            </div>

            <div className="stats-grid">
                <StatCard
                    icon="🌬"
                    label="Avg AQI"
                    value={avgAqi}
                    trend={{ value: "5pts", direction: "down" }}
                    accentColor={getAqiColor(avgAqi)}
                    className="animate-fade-in-up stagger-1"
                />
                <StatCard
                    icon="🔊"
                    label="Avg Noise"
                    value={`${avgNoise} dB`}
                    accentColor="var(--purple)"
                    className="animate-fade-in-up stagger-2"
                />
                <StatCard
                    icon="🌡"
                    label="Avg Temperature"
                    value={`${avgTemp}°C`}
                    accentColor="var(--orange)"
                    className="animate-fade-in-up stagger-3"
                />
                <StatCard
                    icon="💧"
                    label="Avg Humidity"
                    value={`${avgHumidity}%`}
                    accentColor="var(--blue)"
                    className="animate-fade-in-up stagger-4"
                />
            </div>

            {/* Zone Cards */}
            <div className="info-grid">
                {environmentData.map((zone, idx) => (
                    <div
                        className={`info-card animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`}
                        key={zone.id}
                    >
                        <div className="info-card-header">
                            <div
                                className="info-card-icon"
                                style={{
                                    background: `${getAqiColor(zone.aqi)}15`,
                                    color: getAqiColor(zone.aqi),
                                }}
                            >
                                📍
                            </div>
                            <div>
                                <div className="info-card-title">{zone.zone}</div>
                                <div className="info-card-subtitle">
                                    Updated {zone.lastUpdated}
                                </div>
                            </div>
                        </div>

                        <div className="info-card-body">
                            <div className="info-metric">
                                <span className="info-metric-label">AQI</span>
                                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span
                                        className={`badge ${zone.aqi <= 50
                                            ? "badge-green"
                                            : zone.aqi <= 100
                                                ? "badge-yellow"
                                                : "badge-red"
                                            }`}
                                    >
                                        {zone.aqiStatus}
                                    </span>
                                    <span className="info-metric-value">{zone.aqi}</span>
                                </span>
                            </div>

                            <div className="info-metric">
                                <span className="info-metric-label">Noise Level</span>
                                <span
                                    className="info-metric-value"
                                    style={{ color: getNoiseColor(zone.noiseDb) }}
                                >
                                    {zone.noiseDb} dB
                                </span>
                            </div>

                            <div className="info-metric">
                                <span className="info-metric-label">Crowd Density</span>
                                <span className={`badge ${getCrowdBadge(zone.crowdDensity)}`}>
                                    {zone.crowdDensity}
                                </span>
                            </div>

                            <div className="info-metric">
                                <span className="info-metric-label">Temperature</span>
                                <span className="info-metric-value">{zone.temperature}°C</span>
                            </div>

                            <div className="info-metric">
                                <span className="info-metric-label">Humidity</span>
                                <span className="info-metric-value">{zone.humidity}%</span>
                            </div>

                            {/* AQI Bar */}
                            <div>
                                <div className="progress-bar" style={{ height: "6px" }}>
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${Math.min((zone.aqi / 200) * 100, 100)}%`,
                                            background: getAqiColor(zone.aqi),
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "32px", marginBottom: "32px" }} className="animate-fade-in-up stagger-6">
                <ChartCard
                    title="Environmental Impact on Student Wellness"
                    badge="Insights"
                >
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>
                        Students in zones with AQI below 50 show 18% lower stress scores on average.
                    </p>
                    <div style={{ width: "100%", height: 240 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={impactData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                                <XAxis dataKey="zone" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} dy={10} />
                                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                                <Tooltip
                                    cursor={{ fill: "transparent" }}
                                    contentStyle={{ background: "var(--bg-elevated)", border: "none", borderRadius: "8px", color: "var(--text-primary)" }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="stress" name="Avg Stress Score" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="right" dataKey="activity" name="Avg Activity Level" fill="#CCFF00" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            <div style={{ marginTop: "32px", marginBottom: "32px" }} className="animate-fade-in-up stagger-6">
                <ChartCard title="Zone Crowd Density — Time of Day">
                    <div style={{ overflowX: "auto", marginTop: "16px" }}>
                        <table style={{ width: "100%", borderSpacing: "4px", borderCollapse: "separate" }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", padding: "8px", fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, width: "120px" }}>Zone</th>
                                    {timeSlots.map(time => (
                                        <th key={time} style={{ textAlign: "center", padding: "8px", fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>{time}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {heatmapData.map(row => (
                                    <tr key={row.zone}>
                                        <td style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", padding: "8px" }}>
                                            {row.zone}
                                        </td>
                                        {row.data.map((val, i) => (
                                            <td key={i} style={{ padding: "2px" }}>
                                                <div style={{
                                                    height: "32px",
                                                    borderRadius: "4px",
                                                    backgroundColor: getCellBg(val),
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "11px",
                                                    fontWeight: 600,
                                                    color: val > 50 ? "rgba(255,255,255,0.9)" : "transparent"
                                                }}>
                                                    {Math.round(val)}%
                                                </div>
                                            </td>
                                        ))}
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
