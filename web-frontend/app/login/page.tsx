"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, Activity, HeartPulse, Zap } from "lucide-react";
import api from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);
        try {
            const response = await api.post("/api/auth/login", { email, password });
            const { token, user } = response.data;
            if (user.role !== "ADMIN") {
                setErrorMsg("Access Denied: Admins only.");
                setLoading(false);
                return;
            }
            localStorage.setItem("token", token);
            localStorage.setItem("userInfo", JSON.stringify(user));
            router.push("/");
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Invalid email or password.");
            setLoading(false);
        }
    };

    const inputFocusHandlers = {
        onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
            e.target.style.borderColor = "var(--accent)";
            e.target.style.boxShadow = "0 0 0 1px var(--accent), 0 0 16px rgba(204,255,0,0.08)";
            e.target.style.background = "rgba(0,0,0,0.6)";
        },
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
            e.target.style.borderColor = "rgba(255,255,255,0.08)";
            e.target.style.boxShadow = "none";
            e.target.style.background = "rgba(255,255,255,0.03)";
        },
    };

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "14px 16px",
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px", color: "#fff", fontSize: "14px",
        boxSizing: "border-box", outline: "none", transition: "all 0.25s ease"
    };

    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            background: "#050505", padding: "24px", position: "relative", overflow: "hidden"
        }}>
            {/* Animated gradient blobs */}
            <div style={{
                position: "absolute", top: "-20%", left: "-10%", width: "50%", height: "60%",
                background: "radial-gradient(circle, rgba(204,255,0,0.07) 0%, transparent 70%)",
                borderRadius: "50%", filter: "blur(80px)", animation: "float 8s ease-in-out infinite", pointerEvents: "none"
            }} />
            <div style={{
                position: "absolute", bottom: "-15%", right: "-5%", width: "45%", height: "55%",
                background: "radial-gradient(circle, rgba(204,255,0,0.05) 0%, transparent 70%)",
                borderRadius: "50%", filter: "blur(80px)", animation: "float 10s ease-in-out infinite reverse", pointerEvents: "none"
            }} />

            {/* Grid pattern overlay */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
                backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "60px 60px"
            }} />

            {/* Floating fitness icons */}
            <div style={{ position: "absolute", top: "15%", left: "12%", opacity: 0.06, animation: "float 6s ease-in-out infinite", pointerEvents: "none" }}>
                <Dumbbell size={80} color="#ccff00" />
            </div>
            <div style={{ position: "absolute", bottom: "20%", left: "8%", opacity: 0.04, animation: "float 9s ease-in-out infinite reverse", pointerEvents: "none" }}>
                <Activity size={60} color="#ccff00" />
            </div>
            <div style={{ position: "absolute", top: "25%", right: "10%", opacity: 0.05, animation: "float 7s ease-in-out infinite", pointerEvents: "none" }}>
                <HeartPulse size={70} color="#ccff00" />
            </div>
            <div style={{ position: "absolute", bottom: "12%", right: "15%", opacity: 0.04, animation: "float 11s ease-in-out infinite reverse", pointerEvents: "none" }}>
                <Zap size={50} color="#ccff00" />
            </div>

            {/* Login Card */}
            <div style={{
                position: "relative", zIndex: 10, width: "100%", maxWidth: "420px",
                background: "rgba(12,12,12,0.7)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", padding: "48px 40px",
                boxShadow: "0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)"
            }} className="animate-fade-in-up">

                {/* Brand */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <div style={{
                        width: "60px", height: "60px",
                        background: "linear-gradient(135deg, rgba(204,255,0,0.15), rgba(204,255,0,0.05))",
                        color: "#ccff00", borderRadius: "16px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "26px", fontWeight: 800, margin: "0 auto 20px",
                        border: "1px solid rgba(204,255,0,0.25)",
                        boxShadow: "0 0 30px rgba(204,255,0,0.12), 0 8px 16px rgba(0,0,0,0.3)",
                        letterSpacing: "-0.02em"
                    }}>
                        FF
                    </div>
                    <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "8px", letterSpacing: "-0.03em" }}>
                        Welcome Back
                    </h1>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                        Sign in to the FitFusion Admin Dashboard
                    </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Email
                        </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@fitfusion.edu" required style={inputStyle} {...inputFocusHandlers} />
                    </div>

                    <div>
                        <label style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            <span>Password</span>
                            <span style={{ color: "#ccff00", cursor: "pointer", fontWeight: 500, textTransform: "none", letterSpacing: "normal" }}>Forgot?</span>
                        </label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" required style={inputStyle} {...inputFocusHandlers} />
                    </div>

                    {errorMsg && (
                        <div style={{
                            padding: "12px", background: "rgba(255,68,68,0.08)",
                            border: "1px solid rgba(255,68,68,0.2)", borderRadius: "10px",
                            color: "#ff6b6b", fontSize: "13px", textAlign: "center"
                        }}>
                            {errorMsg}
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{
                        width: "100%", padding: "16px", marginTop: "8px",
                        background: loading ? "rgba(204,255,0,0.6)" : "linear-gradient(135deg, #ccff00, #b8e600)",
                        color: "#000", border: "none", borderRadius: "12px",
                        fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.25s ease", letterSpacing: "-0.01em",
                        boxShadow: loading ? "none" : "0 8px 24px rgba(204,255,0,0.2), 0 2px 8px rgba(204,255,0,0.1)"
                    }}
                        onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(204,255,0,0.25)"; } }}
                        onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(204,255,0,0.2), 0 2px 8px rgba(204,255,0,0.1)"; } }}>
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                {/* Bottom divider accent */}
                <div style={{
                    marginTop: "32px", textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.25)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                        <span>FitFusion</span>
                        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                    </div>
                    Campus Fitness & Wellness Platform
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
}
