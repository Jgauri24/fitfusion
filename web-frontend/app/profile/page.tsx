"use client";

import { useState, useEffect } from "react";
import ChartCard from "@/components/ChartCard";
import api from "@/lib/api";

export default function ProfilePage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [initials, setInitials] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [pwdSaving, setPwdSaving] = useState(false);
    const [pwdMsg, setPwdMsg] = useState({ text: "", type: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/api/auth/me");
                const user = res.data;
                setName(`${user.firstName} ${user.lastName}`.trim());
                setEmail(user.email);
                setRole(user.role === "ADMIN" ? "Super Admin (Restricted)" : user.role);
                const fi = user.firstName?.charAt(0)?.toUpperCase() || "";
                const li = user.lastName?.charAt(0)?.toUpperCase() || "";
                setInitials(`${fi}${li}` || "U");
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const parts = name.trim().split(/\s+/);
            const firstName = parts[0] || "";
            const lastName = parts.slice(1).join(" ") || "";

            const res = await api.put("/api/auth/profile", { firstName, lastName, email });
            const user = res.data.user;

            // Update localStorage so sidebar reflects the change
            const stored = localStorage.getItem("userInfo");
            if (stored) {
                const parsed = JSON.parse(stored);
                parsed.firstName = user.firstName;
                parsed.lastName = user.lastName;
                parsed.email = user.email;
                localStorage.setItem("userInfo", JSON.stringify(parsed));
            }

            const fi = user.firstName?.charAt(0)?.toUpperCase() || "";
            const li = user.lastName?.charAt(0)?.toUpperCase() || "";
            setInitials(`${fi}${li}` || "U");

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwdSaving(true);
        setPwdMsg({ text: "", type: "" });
        try {
            await api.put("/api/auth/change-password", {
                currentPassword: currentPwd,
                newPassword: newPwd
            });
            setCurrentPwd("");
            setNewPwd("");
            setConfirmPwd("");
            setPwdMsg({ text: "Password updated successfully!", type: "success" });
            setTimeout(() => setPwdMsg({ text: "", type: "" }), 4000);
        } catch (error: any) {
            setPwdMsg({
                text: error.response?.data?.message || "Failed to change password.",
                type: "error"
            });
        } finally {
            setPwdSaving(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px 16px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        color: "var(--text-primary)",
        fontSize: "14px",
        boxSizing: "border-box" as const,
        outline: "none",
        transition: "border-color 0.2s"
    };

    const labelStyle = {
        display: "block",
        fontSize: "13px",
        fontWeight: 600,
        color: "var(--text-secondary)",
        marginBottom: "8px"
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <div className="pulse-dot" style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--accent)" }} />
            </div>
        );
    }

    return (
        <>
            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">Edit Profile</h1>
                <p className="page-subtitle">
                    Manage your administrator credentials and account settings
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }} className="animate-fade-in-up stagger-1">
                {/* Profile Settings */}
                <ChartCard title="Profile Information">
                    <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "8px" }}>
                            <div style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "var(--accent-glow)",
                                border: "2px solid var(--accent)",
                                color: "var(--accent)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "28px",
                                fontWeight: 800
                            }}>
                                {initials}
                            </div>
                            <button
                                type="button"
                                style={{
                                    padding: "8px 16px",
                                    background: "transparent",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    color: "var(--text-primary)",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    fontWeight: 600
                                }}
                            >
                                Change Avatar
                            </button>
                        </div>

                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Role & Privileges</label>
                            <input
                                type="text"
                                value={role}
                                disabled
                                style={{ ...inputStyle, opacity: 0.7, cursor: "not-allowed", border: "1px solid transparent" }}
                            />
                            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
                                To change your role privileges, contact the System Administrator.
                            </p>
                        </div>

                        <div style={{ marginTop: "12px" }}>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    padding: "12px 24px",
                                    background: "var(--accent)",
                                    color: "#000",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    cursor: saving ? "not-allowed" : "pointer",
                                    opacity: saving ? 0.8 : 1,
                                }}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            {success && <span style={{ marginLeft: "16px", color: "var(--green)", fontSize: "13px", fontWeight: 600 }}>✓ Saved!</span>}
                        </div>
                    </form>
                </ChartCard>

                {/* Security Settings */}
                <ChartCard title="Security & Authentication">
                    <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
                        <div>
                            <label style={labelStyle}>Current Password</label>
                            <input
                                type="password"
                                value={currentPwd}
                                onChange={(e) => setCurrentPwd(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                            />
                        </div>

                        <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "8px 0" }} />

                        <div>
                            <label style={labelStyle}>New Password</label>
                            <input
                                type="password"
                                value={newPwd}
                                onChange={(e) => setNewPwd(e.target.value)}
                                placeholder="8+ characters"
                                required
                                minLength={8}
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPwd}
                                onChange={(e) => setConfirmPwd(e.target.value)}
                                placeholder="8+ characters"
                                required
                                minLength={8}
                                style={{
                                    ...inputStyle,
                                    borderColor: (confirmPwd && newPwd !== confirmPwd) ? "var(--red)" : "var(--border)"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                onBlur={(e) => {
                                    if (!confirmPwd || newPwd === confirmPwd) e.target.style.borderColor = "var(--border)";
                                }}
                            />
                            {(confirmPwd && newPwd !== confirmPwd) && (
                                <span style={{ color: "var(--red)", fontSize: "12px", marginTop: "6px", display: "inline-block" }}>Passwords do not match</span>
                            )}
                        </div>

                        {pwdMsg.text && (
                            <div style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 600,
                                background: pwdMsg.type === "success" ? "rgba(0, 230, 118, 0.1)" : "rgba(255, 107, 107, 0.1)",
                                color: pwdMsg.type === "success" ? "var(--green)" : "var(--red)",
                                border: `1px solid ${pwdMsg.type === "success" ? "rgba(0, 230, 118, 0.2)" : "rgba(255, 107, 107, 0.2)"}`
                            }}>
                                {pwdMsg.text}
                            </div>
                        )}

                        <div style={{ marginTop: "12px" }}>
                            <button
                                type="submit"
                                disabled={pwdSaving || (newPwd !== confirmPwd) || !newPwd || !currentPwd}
                                style={{
                                    padding: "12px 24px",
                                    background: "transparent",
                                    color: "var(--text-primary)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    cursor: (pwdSaving || (newPwd !== confirmPwd) || !newPwd || !currentPwd) ? "not-allowed" : "pointer",
                                    opacity: (pwdSaving || (newPwd !== confirmPwd) || !newPwd || !currentPwd) ? 0.5 : 1,
                                    transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                    if (!e.currentTarget.disabled) {
                                        e.currentTarget.style.borderColor = "var(--text-primary)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!e.currentTarget.disabled) {
                                        e.currentTarget.style.borderColor = "var(--border)";
                                    }
                                }}
                            >
                                {pwdSaving ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </ChartCard>
            </div>
        </>
    );
}
