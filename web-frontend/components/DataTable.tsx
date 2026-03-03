"use client";

import { useState, ReactNode } from "react";
import { Search } from "lucide-react";

interface Column {
    key: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (item: any) => ReactNode;
}

interface DataTableProps {
    title: string;
    columns: Column[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    searchKey?: string;
    searchPlaceholder?: string;
    filters?: React.ReactNode;
}

export default function DataTable({
    title,
    columns,
    data,
    searchKey,
    searchPlaceholder = "Search...",
    filters,
}: DataTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = data.filter((item) => {
        if (!searchQuery || !searchKey) return true;
        const value = item[searchKey];
        if (!value) return false;
        return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="table-card">
            <div className="table-header">
                <div>
                    <h3 className="table-title">{title}</h3>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {filters}
                    {searchKey && (
                        <div className="table-search">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder={searchPlaceholder || "Search..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="table-overflow">
                <table>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, idx) => (
                            <tr key={idx}>
                                {columns.map((col) => (
                                    <td key={col.key}>
                                        {col.render
                                            ? col.render(item)
                                            : String(item[col.key] ?? "")}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}