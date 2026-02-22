"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#050505",
            backgroundImage: `
        radial-gradient(circle at 15% 50%, rgba(204, 255, 0, 0.08), transparent 25%),
        radial-gradient(circle at 85% 30%, rgba(204, 255, 0, 0.06), transparent 25%),
        url('/login_bg_gym.png')
      `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            padding: "24px",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Subtle ambient light from top */}
            <div style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80%",
                height: "20%",
                background: "linear-gradient(to bottom, rgba(204,255,0,0.05), transparent)",
                pointerEvents: "none"
            }} />

            {/* Login Card */}
            <div style={{
                position: "relative",
                zIndex: 10,
                width: "100%",
                maxWidth: "420px",
                background: "rgba(10, 10, 10, 0.65)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "24px",
                padding: "48px 40px",
                boxShadow: "0 24px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset"
            }} className="animate-fade-in-up">

                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <div style={{
                        width: "56px",
                        height: "56px",
                        background: "rgba(204, 255, 0, 0.1)",
                        color: "var(--accent)",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                        fontWeight: 800,
                        margin: "0 auto 20px auto",
                        border: "1px solid rgba(204, 255, 0, 0.3)",
                        boxShadow: "0 0 20px rgba(204, 255, 0, 0.15)"
                    }}>
                        FF
                    </div>
                    <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.02em" }}>
                        FitFusion
                    </h1>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                        Sign in to the Admin Dashboard
                    </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@fitfusion.edu"
                            required
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                background: "rgba(0, 0, 0, 0.4)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "12px",
                                color: "var(--text-primary)",
                                fontSize: "14px",
                                boxSizing: "border-box",
                                outline: "none",
                                transition: "all 0.2s ease"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "var(--accent)";
                                e.target.style.boxShadow = "0 0 0 1px var(--accent)";
                                e.target.style.background = "rgba(0, 0, 0, 0.7)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                e.target.style.boxShadow = "none";
                                e.target.style.background = "rgba(0, 0, 0, 0.4)";
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>
                            <span>Password</span>
                            <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 500, transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>Forgot?</span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                background: "rgba(0, 0, 0, 0.4)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "12px",
                                color: "var(--text-primary)",
                                fontSize: "14px",
                                boxSizing: "border-box",
                                outline: "none",
                                transition: "all 0.2s ease"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "var(--accent)";
                                e.target.style.boxShadow = "0 0 0 1px var(--accent)";
                                e.target.style.background = "rgba(0, 0, 0, 0.7)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                e.target.style.boxShadow = "none";
                                e.target.style.background = "rgba(0, 0, 0, 0.4)";
                            }}
                        />
                    </div>

                    {errorMsg && (
                        <div style={{
                            padding: "12px",
                            background: "rgba(255, 68, 68, 0.1)",
                            border: "1px solid rgba(255, 68, 68, 0.2)",
                            borderRadius: "8px",
                            color: "var(--red)",
                            fontSize: "13px",
                            textAlign: "center"
                        }}>
                            {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "16px",
                            marginTop: "12px",
                            background: "var(--accent)",
                            color: "#000",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "15px",
                            fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.8 : 1,
                            transition: "all 0.2s ease",
                            boxShadow: "0 8px 20px rgba(204, 255, 0, 0.15)"
                        }}
                        onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(204, 255, 0, 0.2)"; } }}
                        onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(204, 255, 0, 0.15)"; } }}
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

            </div>
        </div>
    );
}
