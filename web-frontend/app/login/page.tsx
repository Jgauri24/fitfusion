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
            minHeight: "100vh", 
            width: "100%",
            backgroundImage: "url('/bg_image.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>

            {/* Login Card - fully transparent */}
            <div style={{
                position: "relative",
                right: "-500px",
                zIndex: 10,
                width: "100%",
                maxWidth: "520px",
                margin: "20px",
                padding: "250px 48px",
                background: "transparent",
                border: "none",
                borderRadius: "24px",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
            }} className="animate-fade-in-up">
                    
                {/* Brand / Header */}
                <div style={{ marginBottom: "40px", textAlign: "center" }}>
                    <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#fff", marginBottom: "8px", letterSpacing: "-0.02em" }}>
                        Welcome back
                    </h1>
                    <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                        Please enter your details.
                    </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
                            E-mail
                        </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your e-mail" required style={{...inputStyle, background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)", borderRadius: "0", padding: "10px 0"}} 
                            onFocus={(e) => {
                                e.target.style.borderBottomColor = "var(--accent)";
                                e.target.style.boxShadow = "0 1px 0 0 var(--accent)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderBottomColor = "rgba(255,255,255,0.15)";
                                e.target.style.boxShadow = "none";
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
                            Password
                        </label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="•••••••" required style={{...inputStyle, background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)", borderRadius: "0", padding: "10px 0"}}
                            onFocus={(e) => {
                                e.target.style.borderBottomColor = "var(--accent)";
                                e.target.style.boxShadow = "0 1px 0 0 var(--accent)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderBottomColor = "rgba(255,255,255,0.15)";
                                e.target.style.boxShadow = "none";
                            }}
                        />
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
                            <input type="checkbox" style={{ accentColor: "var(--accent)", width: "16px", height: "16px", cursor: "pointer" }} />
                            Remember me
                        </label>
                        <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 500 }}>Forgot your password?</span>
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
                        width: "100%", padding: "16px", marginTop: "16px",
                        background: loading ? "rgba(204,255,0,0.6)" : "linear-gradient(135deg, #ccff00, #b8e600)",
                        color: "#000", border: "none", borderRadius: "12px",
                        fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.25s ease",
                        boxShadow: "0 8px 16px rgba(204,255,0,0.15)"
                    }}
                        onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 20px rgba(204,255,0,0.2)"; } }}
                        onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(204,255,0,0.15)"; } }}>
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                    
                    <div style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "16px" }}>
                        Don't have an account? <span style={{ color: "#fff", cursor: "pointer", fontWeight: 600 }}>Register here</span>
                    </div>
                </form>
            </div>
        </div>
    );
}
