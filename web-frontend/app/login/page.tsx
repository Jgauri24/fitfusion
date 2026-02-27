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
        <div className="login-wrapper">
            {/* =================== LEFT PANEL =================== */}
            <div className="login-form-panel">
                <div className="login-card animate-fade-in-up">
                    {/* Traffic-light dots */}
                    <div className="login-dots">
                        <span className="login-dot login-dot--green" />
                        <span className="login-dot login-dot--yellow" />
                        <span className="login-dot login-dot--red" />
                    </div>

                    <h1 className="login-heading">Login</h1>
                    <p className="login-subtitle">Welcome back to FitFusion Admin</p>

                    <form onSubmit={handleLogin} className="login-form">
                        {/* Email */}
                        <div className="login-input-wrapper">
                            <Mail size={18} className="login-input-icon" />
                            <input
                                id="login-email"
                                className="login-input login-input--icon"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@fitfusion.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="login-input-wrapper">
                            <Lock size={18} className="login-input-icon" />
                            <input
                                id="login-password"
                                className="login-input login-input--icon"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="login-eye-toggle"
                            >
                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>

                        {/* Remember me + Forgot */}
                        <div className="login-options-row">
                            <label className="login-remember">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="login-forgot">Forgot password?</a>
                        </div>

                        {/* Error */}
                        {errorMsg && (
                            <div className="login-error">{errorMsg}</div>
                        )}

                        {/* Submit */}
                        <button type="submit" disabled={loading} className="login-submit">
                            {loading ? "Logging in..." : "LOGIN"}
                        </button>

                        {/* Contact Support */}
                        <p className="login-signup-text">
                            Don&apos;t have an account?{" "}
                            <a href="#" className="login-signup-link">Contact Support</a>
                        </p>
                    </form>
                </div>

                {/* Footer */}
                <div className="login-footer">
                    © 2025 FitFusion Technologies. All rights reserved.
                </div>
            </div>

            {/* =================== RIGHT PANEL =================== */}
            <div className="login-image-panel">
                <div className="login-dot-grid" />

                <img
                    src="/bg2_.png"
                    alt="Fitness Illustration"
                    className="login-image"
                />

                <div className="login-image-overlay" />

                {/* Motivational Quote */}
                <div className="login-quote">
                    <div className="login-quote-bar" />
                    <div>
                        <p className="login-quote-text">
                            &ldquo;The only bad workout is the one that didn&apos;t happen.&rdquo;
                        </p>
                        <p className="login-quote-author">— FitFusion Philosophy</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
