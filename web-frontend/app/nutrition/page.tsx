"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import { foodItems, nutritionByMeal } from "@/lib/mockData";

export default function NutritionPage() {
    const [mealFilter, setMealFilter] = useState("All");
    const meals = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];

    const avgCalories = Math.round(
        foodItems.reduce((s, f) => s + f.calories, 0) / foodItems.length
    );
    const avgProtein = Math.round(
        foodItems.reduce((s, f) => s + f.protein, 0) / foodItems.length
    );
    const avgCarbs = Math.round(
        foodItems.reduce((s, f) => s + f.carbs, 0) / foodItems.length
    );
    const avgFats = Math.round(
        foodItems.reduce((s, f) => s + f.fats, 0) / foodItems.length
    );

    const filtered =
        mealFilter === "All"
            ? foodItems
            : foodItems.filter((f) => f.meal === mealFilter);

    const maxMealCal = Math.max(...nutritionByMeal.map((m) => m.avgCalories));

    const columns = [
        {
            key: "name",
            label: "Food Item",
            render: (f: typeof foodItems[0]) => (
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {f.name}
                </span>
            ),
        },
        {
            key: "category",
            label: "Category",
            render: (f: typeof foodItems[0]) => (
                <span className="badge badge-cyan">{f.category}</span>
            ),
        },
        {
            key: "meal",
            label: "Meal",
            render: (f: typeof foodItems[0]) => (
                <span
                    className={`badge ${f.meal === "Breakfast"
                            ? "badge-green"
                            : f.meal === "Lunch"
                                ? "badge-blue"
                                : f.meal === "Dinner"
                                    ? "badge-purple"
                                    : "badge-orange"
                        }`}
                >
                    {f.meal}
                </span>
            ),
        },
        { key: "portion", label: "Portion" },
        {
            key: "calories",
            label: "Calories",
            render: (f: typeof foodItems[0]) => (
                <span style={{ fontWeight: 600, color: "var(--orange)" }}>
                    {f.calories} kcal
                </span>
            ),
        },
        {
            key: "protein",
            label: "Protein",
            render: (f: typeof foodItems[0]) => <span>{f.protein}g</span>,
        },
        {
            key: "carbs",
            label: "Carbs",
            render: (f: typeof foodItems[0]) => <span>{f.carbs}g</span>,
        },
        {
            key: "fats",
            label: "Fats",
            render: (f: typeof foodItems[0]) => <span>{f.fats}g</span>,
        },
    ];

    return (
        <>
            <div className="page-header animate-fade-in-up">
                <h1 className="page-title">Nutrition Management</h1>
                <p className="page-subtitle">
                    Manage mess menus, track food items, and monitor nutritional intake
                </p>
            </div>

            <div className="stats-grid">
                <StatCard
                    icon="🔥"
                    label="Avg Calories"
                    value={`${avgCalories} kcal`}
                    accentColor="var(--orange)"
                    className="animate-fade-in-up stagger-1"
                />
                <StatCard
                    icon="🥩"
                    label="Avg Protein"
                    value={`${avgProtein}g`}
                    accentColor="var(--red)"
                    className="animate-fade-in-up stagger-2"
                />
                <StatCard
                    icon="🌾"
                    label="Avg Carbs"
                    value={`${avgCarbs}g`}
                    accentColor="var(--blue)"
                    className="animate-fade-in-up stagger-3"
                />
                <StatCard
                    icon="🧈"
                    label="Avg Fats"
                    value={`${avgFats}g`}
                    accentColor="var(--yellow)"
                    className="animate-fade-in-up stagger-4"
                />
            </div>

            <div className="charts-grid" style={{ marginBottom: "24px" }}>
                <ChartCard
                    title="Calories by Meal Type"
                    badge="Average"
                    className="animate-fade-in-up stagger-3"
                >
                    <div className="bar-chart">
                        {nutritionByMeal.map((m) => (
                            <div key={m.meal} className="bar-chart-item">
                                <div
                                    className="bar"
                                    style={{
                                        height: `${(m.avgCalories / maxMealCal) * 100}%`,
                                        background: m.color,
                                    }}
                                    title={`${m.avgCalories} kcal`}
                                />
                                <span className="bar-label">{m.meal}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                <ChartCard
                    title="Macronutrient Breakdown"
                    badge="Per Item Avg"
                    className="animate-fade-in-up stagger-4"
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "10px 0" }}>
                        {[
                            { label: "Protein", value: avgProtein, max: 30, color: "var(--red)" },
                            { label: "Carbs", value: avgCarbs, max: 55, color: "var(--blue)" },
                            { label: "Fats", value: avgFats, max: 25, color: "var(--yellow)" },
                        ].map((macro) => (
                            <div key={macro.label}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "8px",
                                    }}
                                >
                                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                        {macro.label}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: macro.color,
                                        }}
                                    >
                                        {macro.value}g
                                    </span>
                                </div>
                                <div className="progress-bar" style={{ height: "8px" }}>
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${(macro.value / macro.max) * 100}%`,
                                            background: macro.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            <div className="filters-row animate-fade-in-up stagger-4">
                {meals.map((meal) => (
                    <button
                        key={meal}
                        className={`filter-btn ${mealFilter === meal ? "active" : ""}`}
                        onClick={() => setMealFilter(meal)}
                    >
                        {meal}
                    </button>
                ))}
            </div>

            <div className="animate-fade-in-up stagger-5">
                <DataTable
                    title="Food Items"
                    columns={columns}
                    data={filtered}
                    searchKey="name"
                    searchPlaceholder="Search food items..."
                />
            </div>
        </>
    );
}
