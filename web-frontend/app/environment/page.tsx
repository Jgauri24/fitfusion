"use client";

import StatCard from "@/components/StatCard";
import { environmentData } from "@/lib/mockData";

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
        </>
    );
}
