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
        <div className="login-wrapper">
            {/* Left — Form Panel */}
            <div className="login-form-panel">
                <div className="login-card">
                    {/* Decorative dots */}
                    <div className="login-dots">
                        <span className="login-dot login-dot--green" />
                        <span className="login-dot login-dot--yellow" />
                        <span className="login-dot login-dot--red" />
                    </div>

                    <h1 className="login-heading">Login</h1>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="login-field">
                            <label className="login-label" htmlFor="login-email">
                                Email address
                            </label>
                            <input
                                id="login-email"
                                className="login-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label className="login-label" htmlFor="login-password">
                                Password
                            </label>
                            <input
                                id="login-password"
                                className="login-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <a href="#" className="login-forgot">
                            Forgot your password?
                        </a>

                        {errorMsg && (
                            <div className="login-error">{errorMsg}</div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="login-submit"
                        >
                            {loading ? "Logging in..." : "LOGIN"}
                        </button>

                        <p className="login-signup-text">
                            Don&apos;t have account?{" "}
                            <a href="#" className="login-signup-link">
                                Sign up
                            </a>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right — Image Panel */}
            <div className="login-image-panel">
                {/* Dot grid decoration */}
                <div className="login-dot-grid" />

                {/* Sports illustration */}
                <img
                    src="/sports_login.png"
                    alt="Sports & Fitness Illustration"
                    className="login-image"
                />

                {/* Overlay gradient */}
                <div className="login-image-overlay" />
            </div>
        </div>
    );
}