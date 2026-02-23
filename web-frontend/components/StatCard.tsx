import { ReactNode } from "react";

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    trend?: { value: string; direction: "up" | "down" };
    accentColor?: string;
    className?: string;
}

export default function StatCard({
    icon,
    label,
    value,
    trend,
    accentColor,
    className = "",
}: StatCardProps) {
    return (
        <div
            className={`stat-card ${className}`}
            style={{ "--card-accent": accentColor } as React.CSSProperties}
        >
            <div className="stat-card-header">
                <div
                    className="stat-card-icon"
                    style={
                        accentColor
                            ? {
                                background: `${accentColor}15`,
                                color: accentColor,
                            }
                            : undefined
                    }
                >
                    {icon}
                </div>
                {trend && (
                    <div className={`stat-card-trend ${trend.direction}`}>
                        {trend.direction === "up" ? "↑" : "↓"} {trend.value}
                    </div>
                )}
            </div>
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
        </div>
    );
}
