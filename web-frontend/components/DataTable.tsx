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
}

export default function DataTable({
    title,
    columns,
    data,
    searchKey,
    searchPlaceholder = "Search...",
}: DataTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = searchKey
        ? data.filter((item) =>
            String(item[searchKey])
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
        : data;

    return (
        <div className="table-container">
            <div className="table-header">
                <span className="table-title">{title}</span>
                {searchKey && (
                    <div className="table-search">
                        <span className="table-search-icon">
                            <Search size={14} />
                        </span>
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                )}
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
