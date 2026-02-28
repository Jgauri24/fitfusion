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

    // New profile fields
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [fitnessLevel, setFitnessLevel] = useState("");
    const [dietaryPref, setDietaryPref] = useState("");

    // Campus metadata
    const [hostel, setHostel] = useState("");
    const [branch, setBranch] = useState("");
    const [academicYear, setAcademicYear] = useState("");

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

                // Load new fields
                setAge(user.age?.toString() || "");
                setGender(user.gender || "");
                setHeight(user.height?.toString() || "");
                setWeight(user.weight?.toString() || "");
                setFitnessLevel(user.fitnessLevel || "");
                setDietaryPref(user.dietaryPref || "");
                setHostel(user.hostel || "");
                setBranch(user.branch || "");
                setAcademicYear(user.academicYear || "");
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

            const res = await api.put("/api/auth/profile", {
                firstName, lastName, email,
                age: age ? parseInt(age) : null,
                gender: gender || null,
                height: height ? parseFloat(height) : null,
                weight: weight ? parseFloat(weight) : null,
                fitnessLevel: fitnessLevel || null,
                dietaryPref: dietaryPref || null,
                hostel: hostel || null,
                branch: branch || null,
                academicYear: academicYear || null,
            });
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

                {/* Physical Profile */}
                <ChartCard title="Physical Profile">
                    <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                                <label style={labelStyle}>Age</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="e.g. 20"
                                    min={15} max={60}
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Gender</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
                                    <option value="">Select</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                                <label style={labelStyle}>Height (cm)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="e.g. 175"
                                    step="0.1"
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Weight (kg)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="e.g. 68"
                                    step="0.1"
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                                />
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                                <label style={labelStyle}>Fitness Level</label>
                                <select value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)} style={inputStyle}>
                                    <option value="">Select</option>
                                    <option value="BEGINNER">Beginner</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Dietary Preference</label>
                                <select value={dietaryPref} onChange={(e) => setDietaryPref(e.target.value)} style={inputStyle}>
                                    <option value="">Select</option>
                                    <option value="VEGETARIAN">Vegetarian</option>
                                    <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                                    <option value="VEGAN">Vegan</option>
                                    <option value="EGGETARIAN">Eggetarian</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginTop: "4px" }}>
                            <button type="submit" disabled={saving} style={{
                                padding: "12px 24px", background: "var(--accent)", color: "#000",
                                border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                                cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.8 : 1,
                            }}>
                                {saving ? "Saving..." : "Save Physical Profile"}
                            </button>
                        </div>
                    </form>
                </ChartCard>

                {/* Campus Details */}
                <ChartCard title="Campus Details">
                    <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
                        <div>
                            <label style={labelStyle}>Hostel / Residence</label>
                            <select value={hostel} onChange={(e) => setHostel(e.target.value)} style={inputStyle}>
                                <option value="">Select Hostel</option>
                                <option value="Rajendra Bhawan">Rajendra Bhawan</option>
                                <option value="Cautley Bhawan">Cautley Bhawan</option>
                                <option value="Kasturba Bhawan">Kasturba Bhawan</option>
                                <option value="Govind Bhawan">Govind Bhawan</option>
                                <option value="Radhakrishnan Bhawan">Radhakrishnan Bhawan</option>
                                <option value="Ravindra Bhawan">Ravindra Bhawan</option>
                                <option value="Sarojini Bhawan">Sarojini Bhawan</option>
                                <option value="Azad Bhawan">Azad Bhawan</option>
                                <option value="Jawahar Bhawan">Jawahar Bhawan</option>
                                <option value="Ganga Bhawan">Ganga Bhawan</option>
                            </select>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                                <label style={labelStyle}>Branch / Department</label>
                                <select value={branch} onChange={(e) => setBranch(e.target.value)} style={inputStyle}>
                                    <option value="">Select Branch</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="ME">ME</option>
                                    <option value="CE">CE (Civil)</option>
                                    <option value="EE">EE</option>
                                    <option value="BT">BT (Biotech)</option>
                                    <option value="CH">CH (Chemical)</option>
                                    <option value="IT">IT</option>
                                    <option value="MT">MT (Metallurgy)</option>
                                    <option value="AR">AR (Architecture)</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Academic Year</label>
                                <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} style={inputStyle}>
                                    <option value="">Select Year</option>
                                    <option value="1st">1st Year</option>
                                    <option value="2nd">2nd Year</option>
                                    <option value="3rd">3rd Year</option>
                                    <option value="4th">4th Year</option>
                                    <option value="5th">5th Year</option>
                                    <option value="PG">PG</option>
                                    <option value="PhD">PhD</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginTop: "4px" }}>
                            <button type="submit" disabled={saving} style={{
                                padding: "12px 24px", background: "var(--accent)", color: "#000",
                                border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                                cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.8 : 1,
                            }}>
                                {saving ? "Saving..." : "Save Campus Details"}
                            </button>
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
