"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import { Wind, Volume2, Thermometer, Droplets, MapPin, Plus, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "@/lib/api";

interface Zone {
    id: string;
    zone: string;
    aqi: number;
    noiseDb: number;
    temperature: number;
    humidity: number;
}

export default function EnvironmentPage() {
    const [zones, setZones] = useState<Zone[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({ zone: "", aqi: "", noiseDb: "", temperature: "", humidity: "" });

    useEffect(() => { fetchZones(); }, []);

    const fetchZones = async () => {
        try {
            const res = await api.get("/api/admin/environment");
            setZones(res.data);
        } catch (e) {
            console.error("Failed to fetch zones:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post("/api/admin/environment", {
                zone: form.zone,
                aqi: parseInt(form.aqi),
                noiseDb: parseInt(form.noiseDb),
                temperature: parseFloat(form.temperature),
                humidity: parseFloat(form.humidity),
            });
            setShowModal(false);
            setForm({ zone: "", aqi: "", noiseDb: "", temperature: "", humidity: "" });
            fetchZones();
        } catch (e) {
            alert("Failed to add zone reading.");
        } finally {
            setSaving(false);
        }
    };

    const avgAqi = zones.length ? Math.round(zones.reduce((s, e) => s + e.aqi, 0) / zones.length) : 0;
    const avgNoise = zones.length ? Math.round(zones.reduce((s, e) => s + e.noiseDb, 0) / zones.length) : 0;
    const avgTemp = zones.length ? Math.round(zones.reduce((s, e) => s + e.temperature, 0) / zones.length) : 0;
    const avgHumidity = zones.length ? Math.round(zones.reduce((s, e) => s + e.humidity, 0) / zones.length) : 0;

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

    const impactData = zones.length ? zones.map(z => ({
        zone: z.zone,
        stress: Math.max(1, Math.round((z.aqi / 50 + z.noiseDb / 30) * 10) / 10),
        activity: Math.max(10, Math.round(100 - z.aqi * 0.3 - z.noiseDb * 0.2)),
    })) : [
        { zone: "Library Area", stress: 3.2, activity: 45 },
        { zone: "Sports Complex", stress: 2.8, activity: 92 },
        { zone: "Academic Block", stress: 4.1, activity: 30 },
        { zone: "Hostel Zone", stress: 3.5, activity: 55 },
    ];

    const heatmapData = zones.length ? zones.map(z => ({
        zone: z.zone,
        morning: z.aqi <= 50 ? "Low" : z.aqi <= 100 ? "Medium" : "High",
        afternoon: z.noiseDb <= 40 ? "Low" : z.noiseDb <= 60 ? "Medium" : "High",
        evening: z.humidity <= 50 ? "Low" : z.humidity <= 70 ? "Medium" : "High",
        night: "Low",
    })) : [
        { zone: "Library Area", morning: "Medium", afternoon: "High", evening: "Medium", night: "Low" },
        { zone: "Sports Complex", morning: "Low", afternoon: "High", evening: "High", night: "Low" },
        { zone: "Academic Block", morning: "High", afternoon: "High", evening: "Medium", night: "Low" },
        { zone: "Hostel Zone", morning: "Medium", afternoon: "Medium", evening: "High", night: "Medium" },
    ];

    const getCrowdBadge = (density: string) => {
        switch (density) {
            case "Low": return "badge-green";
            case "Medium": return "badge-yellow";
            case "High": return "badge-red";
            default: return "badge-cyan";
        }
    };

    if (loading) {
        return <div className="loading-container">Loading environment data...</div>;
    }

    return (
        <>
            <div className="page-header animate-fade-in-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h1 className="page-title">Campus Environment</h1>
                    <p className="page-subtitle">Monitor air quality, noise levels, temperature, and humidity across zones</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary">
                    <Plus size={16} /> Add Zone Reading
                </button>
            </div>

            <div className="stats-grid">
                <StatCard icon={<Wind size={20} />} label="Avg AQI" value={avgAqi} trend={{ value: "5pts", direction: "down" }} accentColor={getAqiColor(avgAqi)} className="animate-fade-in-up stagger-1" />
                <StatCard icon={<Volume2 size={20} />} label="Avg Noise" value={`${avgNoise} dB`} accentColor="var(--purple)" className="animate-fade-in-up stagger-2" />
                <StatCard icon={<Thermometer size={20} />} label="Avg Temperature" value={`${avgTemp}°C`} accentColor="var(--orange)" className="animate-fade-in-up stagger-3" />
                <StatCard icon={<Droplets size={20} />} label="Avg Humidity" value={`${avgHumidity}%`} accentColor="var(--blue)" className="animate-fade-in-up stagger-4" />
            </div>

            {/* Environmental Impact Chart */}
            <ChartCard title="Environmental Impact on Student Wellness" badge="Zone Analysis" className="animate-fade-in-up stagger-3">
                <div style={{ width: "100%", height: 260, marginTop: 16 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={impactData} margin={{ top: 20, right: 30, left: -10, bottom: 0 }}>
                            <XAxis dataKey="zone" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                            <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "none", borderRadius: "8px", color: "var(--text-primary)" }} />
                            <Legend wrapperStyle={{ fontSize: "12px", color: "var(--text-secondary)" }} />
                            <Bar dataKey="stress" name="Stress Score" fill="#F87171" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="activity" name="Activity Level" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            {/* Zone Cards */}
            <div className="info-grid animate-fade-in-up stagger-5">
                {zones.map((zone) => (
                    <div className="info-card" key={zone.id}>
                        <div className="info-card-header">
                            <div className="info-card-icon" style={{ background: `${getAqiColor(zone.aqi)}15`, color: getAqiColor(zone.aqi) }}>
                                <MapPin size={18} />
                            </div>
                            <div>
                                <div className="info-card-title">{zone.zone}</div>
                                <div className="info-card-subtitle">AQI {zone.aqi}</div>
                            </div>
                        </div>
                        <div className="info-card-body">
                            <div className="info-metric"><span className="info-metric-label">Noise</span><span className="info-metric-value" style={{ color: getNoiseColor(zone.noiseDb) }}>{zone.noiseDb} dB</span></div>
                            <div className="info-metric"><span className="info-metric-label">Temp</span><span className="info-metric-value">{zone.temperature}°C</span></div>
                            <div className="info-metric"><span className="info-metric-label">Humidity</span><span className="info-metric-value">{zone.humidity}%</span></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Heatmap */}
            <ChartCard title="Zone Crowd Density Heatmap" badge="Simulated" className="animate-fade-in-up stagger-6">
                <div className="table-overflow" style={{ marginTop: "16px" }}>
                    <table>
                        <thead>
                            <tr><th>Zone</th><th>Morning</th><th>Afternoon</th><th>Evening</th><th>Night</th></tr>
                        </thead>
                        <tbody>
                            {heatmapData.map((row) => (
                                <tr key={row.zone}>
                                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{row.zone}</td>
                                    {(["morning", "afternoon", "evening", "night"] as const).map((slot) => (
                                        <td key={slot}><span className={`badge ${getCrowdBadge(row[slot])}`}>{row[slot]}</span></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartCard>

            {/* Add Zone Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Add Zone Reading</h2>
                            <button onClick={() => setShowModal(false)} className="modal-close"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div><label className="form-label">Zone Name *</label><input required value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} className="form-input" placeholder="e.g., Library Area" /></div>
                            <div className="modal-grid-2">
                                <div><label className="form-label">AQI *</label><input type="number" required value={form.aqi} onChange={(e) => setForm({ ...form, aqi: e.target.value })} className="form-input" placeholder="0-500" /></div>
                                <div><label className="form-label">Noise (dB) *</label><input type="number" required value={form.noiseDb} onChange={(e) => setForm({ ...form, noiseDb: e.target.value })} className="form-input" placeholder="0-120" /></div>
                                <div><label className="form-label">Temperature (°C) *</label><input type="number" step="0.1" required value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} className="form-input" placeholder="°C" /></div>
                                <div><label className="form-label">Humidity (%) *</label><input type="number" step="0.1" required value={form.humidity} onChange={(e) => setForm({ ...form, humidity: e.target.value })} className="form-input" placeholder="%" /></div>
                            </div>
                            <button type="submit" disabled={saving} className="btn-primary" style={{ marginTop: "8px" }}>
                                {saving ? "Adding..." : "Add Zone Reading"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
