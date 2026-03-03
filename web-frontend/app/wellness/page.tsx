"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import { Users, Calendar, MapPin, Clock, Plus, HeartPulse } from "lucide-react";
import api from "@/lib/api";

interface WellnessEvent {
    id: string;
    name: string;
    type: string;
    description: string;
    location: string;
    scheduledAt: string;
    durationMins: number;
    maxCapacity: number;
    currentParticipants: number;
}

export default function WellnessEventsPage() {
    const [events, setEvents] = useState<WellnessEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        type: "Workshop",
        description: "",
        location: "",
        scheduledAt: "",
        scheduledTime: "",
        durationMins: "60",
        maxCapacity: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/admin/wellness/events");
            setEvents(res.data);
        } catch (e) {
            console.error("Failed to fetch events:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSubmitting(true);

        try {
            // Combine date and time
            const dateStr = `${formData.scheduledAt}T${formData.scheduledTime}:00`;
            
            await api.post("/api/admin/wellness/manage", {
                name: formData.name,
                type: formData.type,
                description: formData.description,
                location: formData.location,
                scheduledAt: dateStr,
                durationMins: parseInt(formData.durationMins),
                maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : null
            });

            setShowForm(false);
            setFormData({
                name: "",
                type: "Workshop",
                description: "",
                location: "",
                scheduledAt: "",
                scheduledTime: "",
                durationMins: "60",
                maxCapacity: ""
            });
            fetchEvents();
        } catch (e: any) {
            setErrorMsg(e.response?.data?.message || "Failed to create event");
        } finally {
            setSubmitting(false);
        }
    };

    const totalUpcoming = events.length;
    const totalParticipants = events.reduce((s, e) => s + e.currentParticipants, 0);
    const totalCapacity = events.reduce((s, e) => s + (e.maxCapacity || 0), 0);
    const capacityPct = totalCapacity > 0 ? Math.round((totalParticipants / totalCapacity) * 100) : 0;

    if (loading) {
        return <div className="loading-container"><div className="loading-inner"><div className="loading-spinner" />Loading events...</div></div>;
    }

    return (
        <>
            <div className="page-header animate-fade-in-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                        <h1 className="page-title">Wellness Events</h1>
                        <p className="page-subtitle">Manage campus wellness sessions, workshops, and activities</p>
                    </div>
                    <button 
                        className="btn-primary" 
                        onClick={() => setShowForm(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={18} /> Create Event
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon={<Calendar size={20} />} label="Upcoming Events" value={totalUpcoming.toString()} accentColor="var(--accent)" className="animate-fade-in-up stagger-1" />
                <StatCard icon={<Users size={20} />} label="Total Registrations" value={totalParticipants.toString()} accentColor="var(--blue)" className="animate-fade-in-up stagger-2" />
                <StatCard icon={<HeartPulse size={20} />} label="Avg Capacity Fill" value={`${capacityPct}%`} accentColor="var(--purple)" className="animate-fade-in-up stagger-3" />
            </div>

            {/* Create Event Form Modal */}
            {showForm && (
                <div className="modal-overlay animate-fade-in-up">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ color: 'var(--white)', margin: 0 }}>Create Wellness Event</h2>
                            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
                        </div>

                        {errorMsg && <div style={{ color: 'var(--danger)', marginBottom: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{errorMsg}</div>}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Event Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder="e.g., Morning Yoga Session" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--white)' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Type *</label>
                                    <select name="type" value={formData.type} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--white)' }}>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Session">Session</option>
                                        <option value="Seminar">Seminar</option>
                                        <option value="Meditation">Meditation</option>
                                        <option value="Fitness">Fitness</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" placeholder="e.g., Student Activity Center" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--white)' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Date *</label>
                                    <input type="date" name="scheduledAt" value={formData.scheduledAt} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--white)' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Time *</label>
                                    <input type="time" name="scheduledTime" value={formData.scheduledTime} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--white)' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Duration (mins) *</label>
                                    <input type="number" name="durationMins" value={formData.durationMins} onChange={handleChange} required min="15" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--white)' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Max Capacity</label>
                                    <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} placeholder="Leave empty for unlimited" min="1" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--white)' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Event details..." style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--white)', resize: 'vertical' }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--card-hover)', color: 'var(--white)', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                                <button type="submit" disabled={submitting} className="btn-primary" style={{ opacity: submitting ? 0.7 : 1 }}>
                                    {submitting ? "Creating..." : "Create Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Events List */}
            <div className="info-grid animate-fade-in-up stagger-5">
                {events.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <Calendar size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                        <h3 style={{ color: 'var(--white)', marginBottom: '8px' }}>No Upcoming Events</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>There are no wellness events scheduled yet.</p>
                        <button className="btn-primary" onClick={() => setShowForm(true)}>Create One Now</button>
                    </div>
                ) : (
                    events.map((e) => {
                        const date = new Date(e.scheduledAt);
                        const isFull = e.maxCapacity && e.currentParticipants >= e.maxCapacity;

                        return (
                            <div className="info-card" key={e.id}>
                                <div className="info-card-header">
                                    <div className="info-card-icon" style={{ background: `var(--accent)15`, color: "var(--accent)" }}>
                                        <HeartPulse size={18} />
                                    </div>
                                    <div>
                                        <div className="info-card-title">{e.name}</div>
                                        <div className="info-card-subtitle">{e.type}</div>
                                    </div>
                                </div>
                                <div className="info-card-body">
                                    <div className="info-metric">
                                        <span className="info-metric-label"><Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Date & Time</span>
                                        <span className="info-metric-value">{date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="info-metric">
                                        <span className="info-metric-label"><MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Location</span>
                                        <span className="info-metric-value">{e.location || "TBA"}</span>
                                    </div>
                                    <div className="info-metric">
                                        <span className="info-metric-label"><Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Duration</span>
                                        <span className="info-metric-value">{e.durationMins} mins</span>
                                    </div>
                                    <div className="info-metric">
                                        <span className="info-metric-label"><Users size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Participants</span>
                                        <span className="info-metric-value" style={{ color: isFull ? "var(--warning)" : "var(--accent)" }}>
                                            {e.currentParticipants} {e.maxCapacity ? `/ ${e.maxCapacity}` : ""}
                                            {isFull && <span style={{ fontSize: '10px', marginLeft: '4px', background: 'var(--warning)', color: '#000', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>FULL</span>}
                                        </span>
                                    </div>
                                </div>
                                {e.description && (
                                    <div style={{ padding: '0 24px 24px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>
                                        {e.description}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}

