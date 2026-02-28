"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import api from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="grid min-h-screen w-full lg:grid-cols-[45%_55%]" style={{ backgroundColor: "#000000" }}>
            {/* =================== LEFT PANEL (FORM) =================== */}
            <div className="flex flex-col items-center justify-center relative px-6 py-12 lg:px-12 z-10 w-full">
                <div 
                    className="w-full max-w-[420px] rounded-[24px] p-10 lg:p-12 animate-fade-in-up"
                    style={{
                        backgroundColor: "#141416",
                        border: "1px solid #232325",
                        boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.8)",
                    }}
                >
                    {/* macOS-style dots */}
                    <div className="flex gap-2.5 mb-10">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff5f56" }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ffbd2e" }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#27c93f", boxShadow: "0 0 8px rgba(39, 201, 63, 0.6)" }} />
                    </div>

                    <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white tracking-tight mb-2">
                        Login
                    </h1>
                    <p className="text-sm font-medium mb-10" style={{ color: "#a1a1a6" }}>
                        Welcome back to FitFusion Admin
                    </p>

                    <form onSubmit={handleLogin} className="flex flex-col w-full text-left" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {/* Email Input */}
                        <div className="relative flex items-center group">
                            <Mail 
                                size={18} 
                                className="absolute left-4 pointer-events-none transition-colors duration-200 z-[2]"
                                style={{ color: "#636366" }}
                                id="mail-icon"
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@fitfusion.com"
                                required
                                className="w-full rounded-xl text-sm text-white focus:outline-none transition-all duration-200"
                                style={{
                                    padding: "16px 16px 16px 48px",
                                    backgroundColor: "#1c1c1e",
                                    border: "1.5px solid #2c2c2e",
                                }}
                                onFocus={(e) => {
                                    document.getElementById('mail-icon')!.style.color = '#c8ff00';
                                    e.target.style.borderColor = "#c8ff00";
                                    e.target.style.boxShadow = "0 0 0 1px #c8ff00, 0 0 16px rgba(200, 255, 0, 0.1)";
                                    e.target.style.backgroundColor = "#202022";
                                }}
                                onBlur={(e) => {
                                    document.getElementById('mail-icon')!.style.color = '#636366';
                                    e.target.style.borderColor = "#2c2c2e";
                                    e.target.style.boxShadow = "none";
                                    e.target.style.backgroundColor = "#1c1c1e";
                                }}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative flex items-center group">
                            <Lock 
                                size={18} 
                                className="absolute left-4 pointer-events-none transition-colors duration-200 z-[2]"
                                style={{ color: "#636366" }}
                                id="lock-icon"
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-xl text-sm text-white focus:outline-none transition-all duration-200"
                                style={{
                                    padding: "16px 48px 16px 48px",
                                    backgroundColor: "#1c1c1e",
                                    border: "1.5px solid #2c2c2e",
                                    letterSpacing: showPassword ? "normal" : "2px",
                                    fontFamily: showPassword ? "inherit" : "monospace"
                                }}
                                onFocus={(e) => {
                                    document.getElementById('lock-icon')!.style.color = '#c8ff00';
                                    e.target.style.borderColor = "#c8ff00";
                                    e.target.style.boxShadow = "0 0 0 1px #c8ff00, 0 0 16px rgba(200, 255, 0, 0.1)";
                                    e.target.style.backgroundColor = "#202022";
                                }}
                                onBlur={(e) => {
                                    document.getElementById('lock-icon')!.style.color = '#636366';
                                    e.target.style.borderColor = "#2c2c2e";
                                    e.target.style.boxShadow = "none";
                                    e.target.style.backgroundColor = "#1c1c1e";
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 p-1.5 transition-colors rounded-lg flex items-center justify-center cursor-pointer z-[2]"
                                style={{ color: "#636366" }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#a1a1a6"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#636366"}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between mt-1">
                            <label className="flex items-center gap-2 text-[13px] cursor-pointer" style={{ color: "#a1a1a6" }}>
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded cursor-pointer" 
                                    style={{ accentColor: "#c8ff00" }} 
                                />
                                <span>Remember me</span>
                            </label>
                            <a 
                                href="#" 
                                className="text-[13px] font-semibold transition-all duration-200"
                                style={{ color: "#c8ff00", textDecoration: "none" }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "#d8ff3a"; e.currentTarget.style.textDecoration = "underline"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "#c8ff00"; e.currentTarget.style.textDecoration = "none"; }}
                            >
                                Forgot password?
                            </a>
                        </div>

                        {/* Error Message */}
                        {errorMsg && (
                            <div 
                                className="py-3 px-4 rounded-xl text-[13px] text-center font-medium animate-fade-in-up"
                                style={{ backgroundColor: "rgba(255, 107, 107, 0.1)", border: "1px solid rgba(255, 107, 107, 0.2)", color: "#ff6b6b" }}
                            >
                                {errorMsg}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full rounded-xl text-[15px] font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center"
                            style={{ 
                                marginTop: "12px",
                                padding: "16px",
                                backgroundColor: "#c8ff00", 
                                color: "#000000",
                                boxShadow: "0 8px 24px rgba(200, 255, 0, 0.15)",
                                border: "none",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#d8ff3a"; }}
                            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#c8ff00"; }}
                        >
                            {loading ? "Authenticating..." : "LOGIN"}
                        </button>

                        <p className="text-center text-[13px] mt-2" style={{ color: "#a1a1a6" }}>
                            Don&apos;t have an account?{" "}
                            <a 
                                href="#" 
                                className="font-semibold transition-colors"
                                style={{ color: "#ffffff", textDecoration: "none" }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#c8ff00"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#ffffff"}
                            >
                                Contact Support
                            </a>
                        </p>
                    </form>
                </div>

                <div className="absolute bottom-8 left-0 right-0 text-center text-xs font-medium" style={{ color: "#636366" }}>
                    © 2025 FitFusion Technologies. All rights reserved.
                </div>
            </div>

            {/* =================== RIGHT PANEL (IMAGE) =================== */}
            <div className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: "#0a0a0a", borderLeft: "1px solid #1c1c1e" }}>
                {/* Subtle grid background */}
                <div 
                    className="absolute inset-0 opacity-20" 
                    style={{ 
                        backgroundImage: "radial-gradient(circle, #c8ff00 1px, transparent 1px)", 
                        backgroundSize: "28px 28px" 
                    }} 
                />

                {/* The illustration */}
                <img
                    src="/bg2_.png"
                    alt="Fitness Illustration"
                    className="relative z-10 w-full h-auto max-h-[85vh] object-contain animate-fade-in-up"
                    style={{
                        animationDelay: "0.2s",
                        filter: "drop-shadow(0 0 60px rgba(200, 255, 0, 0.1))"
                    }}
                />

                {/* Motivational Quote at Bottom */}
                <div 
                    className="absolute bottom-12 left-12 right-12 z-20 flex gap-4 items-start animate-fade-in-up"
                    style={{ animationDelay: "0.5s" }}
                >
                    <div className="w-1.5 min-h-[50px] rounded-full shrink-0" style={{ backgroundColor: "#c8ff00", boxShadow: "0 0 12px rgba(200, 255, 0, 0.4)" }} />
                    <div className="flex flex-col gap-1.5">
                        <p className="text-[22px] font-bold italic leading-snug tracking-tight" style={{ color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                            &ldquo;The only bad workout is the one that didn&apos;t happen.&rdquo;
                        </p>
                        <p className="text-sm font-bold tracking-widest uppercase" style={{ color: "#c8ff00" }}>
                            — FitFusion Philosophy
                        </p>
                    </div>
                </div>

                {/* Ambient glow effects */}
                <div 
                    className="absolute pointer-events-none rounded-full"
                    style={{ 
                        top: "25%", right: "-100px", width: "400px", height: "400px", 
                        backgroundColor: "rgba(200, 255, 0, 0.05)", filter: "blur(120px)" 
                    }} 
                />
                <div 
                    className="absolute pointer-events-none rounded-full"
                    style={{ 
                        bottom: "-150px", left: "-150px", width: "500px", height: "500px", 
                        backgroundColor: "rgba(200, 255, 0, 0.03)", filter: "blur(150px)" 
                    }} 
                />
            </div>
        </div>
    );
}
