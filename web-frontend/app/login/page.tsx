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
        <div className="login-page">
            <div className="login-card-simple">
                {/* Brand */}
                <div className="login-brand">
                    <div className="login-brand-icon">FF</div>
                    <span className="login-brand-text">FitFusion</span>
                </div>

                <h1 className="login-heading-simple">Welcome back</h1>
                <p className="login-sub">Sign in to your admin dashboard</p>

                <form onSubmit={handleLogin} className="login-form-simple">
                    <div className="login-group">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="login-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <a href="#" className="login-forgot-simple">Forgot password?</a>

                    {errorMsg && <div className="login-error-simple">{errorMsg}</div>}

                    <button type="submit" disabled={loading} className="login-btn-simple">
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="login-footer-simple">
                        Don&apos;t have an account?{" "}
                        <a href="#">Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
}