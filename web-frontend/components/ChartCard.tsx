import { ReactNode } from "react";

interface ChartCardProps {
    title: string;
    badge?: ReactNode;
    children: ReactNode;
    className?: string;
}

export default function ChartCard({
    title,
    badge,
    children,
    className = "",
}: ChartCardProps) {
    return (
        <div className={`chart-card ${className}`}>
            <div className="chart-card-header">
                <span className="chart-card-title">{title}</span>
                {badge && <span className="chart-card-badge">{badge}</span>}
            </div>
            {children}
        </div>
    );
}