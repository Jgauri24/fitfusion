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

    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [fitnessLevel, setFitnessLevel] = useState("");
    const [dietaryPref, setDietaryPref] = useState("");

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
            setPwdMsg({ text: error.response?.data?.message || "Failed to change password.", type: "error" });
        } finally {
            setPwdSaving(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="loading-inner"><div className="loading-spinner" /></div></div>;
    }

    return (
        <>
            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">Edit Profile</h1>
                <p className="page-subtitle">Manage your administrator credentials and account settings</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }} className="animate-fade-in-up stagger-1">
                {/* Profile Settings */}
                <ChartCard title="Profile Information">
                    <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "8px" }}>
                            <div className="admin-avatar" style={{ width: "80px", height: "80px", fontSize: "28px", borderRadius: "50%", border: "2px solid var(--accent)" }}>
                                {initials}
                            </div>
                            <button type="button" className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                                Change Avatar
                            </button>
                        </div>

                        <div>
                            <label className="form-label">Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
                        </div>
                        <div>
                            <label className="form-label">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
                        </div>
                        <div>
                            <label className="form-label">Role &amp; Privileges</label>
                            <input type="text" value={role} disabled className="form-input" style={{ opacity: 0.7, cursor: "not-allowed" }} />
                            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>To change your role privileges, contact the System Administrator.</p>
                        </div>

                        <div style={{ marginTop: "12px" }}>
                            <button type="submit" disabled={saving} className="btn-primary">
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            {success && <span style={{ marginLeft: "16px", color: "var(--green)", fontSize: "13px", fontWeight: 600 }}>✓ Saved!</span>}
                        </div>
                    </form>
                </ChartCard>

                {/* Physical Profile */}
                <ChartCard title="Physical Profile">
                    <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
                        <div className="modal-grid-2">
                            <div><label className="form-label">Age</label><input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 20" min={15} max={60} className="form-input" /></div>
                            <div><label className="form-label">Gender</label><select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select"><option value="">Select</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option></select></div>
                        </div>
                        <div className="modal-grid-2">
                            <div><label className="form-label">Height (cm)</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 175" step="0.1" className="form-input" /></div>
                            <div><label className="form-label">Weight (kg)</label><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 68" step="0.1" className="form-input" /></div>
                        </div>
                        <div className="modal-grid-2">
                            <div><label className="form-label">Fitness Level</label><select value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)} className="form-select"><option value="">Select</option><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option></select></div>
                            <div><label className="form-label">Dietary Preference</label><select value={dietaryPref} onChange={(e) => setDietaryPref(e.target.value)} className="form-select"><option value="">Select</option><option value="VEGETARIAN">Vegetarian</option><option value="NON_VEGETARIAN">Non-Vegetarian</option><option value="VEGAN">Vegan</option><option value="EGGETARIAN">Eggetarian</option></select></div>
                        </div>
                        <div style={{ marginTop: "4px" }}>
                            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Physical Profile"}</button>
                        </div>
                    </form>
                </ChartCard>

                {/* Campus Details */}
                <ChartCard title="Campus Details">
                    <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
                        <div>
                            <label className="form-label">Hostel / Residence</label>
                            <select value={hostel} onChange={(e) => setHostel(e.target.value)} className="form-select">
                                <option value="">Select Hostel</option>
                                {["Rajendra Bhawan", "Cautley Bhawan", "Kasturba Bhawan", "Govind Bhawan", "Radhakrishnan Bhawan", "Ravindra Bhawan", "Sarojini Bhawan", "Azad Bhawan", "Jawahar Bhawan", "Ganga Bhawan"].map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                        <div className="modal-grid-2">
                            <div>
                                <label className="form-label">Branch / Department</label>
                                <select value={branch} onChange={(e) => setBranch(e.target.value)} className="form-select">
                                    <option value="">Select Branch</option>
                                    {[["CSE", "CSE"], ["ECE", "ECE"], ["ME", "ME"], ["CE", "CE (Civil)"], ["EE", "EE"], ["BT", "BT (Biotech)"], ["CH", "CH (Chemical)"], ["IT", "IT"], ["MT", "MT (Metallurgy)"], ["AR", "AR (Architecture)"]].map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Academic Year</label>
                                <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="form-select">
                                    <option value="">Select Year</option>
                                    {["1st", "2nd", "3rd", "4th", "5th", "PG", "PhD"].map(y => <option key={y} value={y}>{y} Year</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ marginTop: "4px" }}>
                            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Campus Details"}</button>
                        </div>
                    </form>
                </ChartCard>

                {/* Security Settings */}
                <ChartCard title="Security &amp; Authentication">
                    <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
                        <div><label className="form-label">Current Password</label><input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} placeholder="••••••••" required className="form-input" /></div>

                        <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "8px 0" }} />

                        <div><label className="form-label">New Password</label><input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="8+ characters" required minLength={8} className="form-input" /></div>
                        <div>
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="8+ characters" required minLength={8}
                                className="form-input"
                                style={(confirmPwd && newPwd !== confirmPwd) ? { borderColor: "var(--red)" } : {}}
                            />
                            {(confirmPwd && newPwd !== confirmPwd) && <span style={{ color: "var(--red)", fontSize: "12px", marginTop: "6px", display: "inline-block" }}>Passwords do not match</span>}
                        </div>

                        {pwdMsg.text && (
                            <div style={{
                                padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                                background: pwdMsg.type === "success" ? "rgba(74, 222, 128, 0.10)" : "rgba(248, 113, 113, 0.10)",
                                color: pwdMsg.type === "success" ? "var(--green)" : "var(--red)",
                                border: `1px solid ${pwdMsg.type === "success" ? "rgba(74, 222, 128, 0.2)" : "rgba(248, 113, 113, 0.2)"}`
                            }}>
                                {pwdMsg.text}
                            </div>
                        )}

                        <div style={{ marginTop: "12px" }}>
                            <button type="submit" disabled={pwdSaving || (newPwd !== confirmPwd) || !newPwd || !currentPwd} className="btn-secondary">
                                {pwdSaving ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </ChartCard>
            </div>
        </>
    );
}