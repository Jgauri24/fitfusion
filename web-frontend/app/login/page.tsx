"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/api/auth/login", { email, password });
            if (res.data.user?.role !== "ADMIN") {
                setError("Admin access only.");
                setLoading(false);
                return;
            }
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userInfo", JSON.stringify(res.data.user));
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-split">
                <div className="login-card-simple">
                    <div className="login-brand">
                        <div className="login-brand-icon">
                            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 6 L16 26 L12 26 L6 6 Z" fill="#EDEDED" />
                                <path d="M22 6 C22 12 18 15 12 15 C18 15 22 18 22 24 C22 18 26 15 32 15 C26 15 22 12 22 6 Z" fill="#0070F3" />
                            </svg>
                        </div>
                        <span className="login-brand-text">VITA</span>
                    </div>

                    <h1 className="login-heading-simple">Welcome back</h1>
                    <p className="login-sub">Sign in to the admin dashboard</p>

                    <form onSubmit={handleSubmit} className="login-form-simple">
                        <div className="login-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="admin@fitfusion.app"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="login-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {error && <div className="login-error-simple">{error}</div>}

                        <button type="submit" className="login-btn-simple" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="login-footer-simple">
                        Campus wellness intelligence by VITA
                    </p>
                </div>
            </div>

            <div className="login-image-side">
                <img src="/login-bg.png" alt="Aesthetic Abstract Fitness Data Interface" />
            </div>
        </div>
    );
}