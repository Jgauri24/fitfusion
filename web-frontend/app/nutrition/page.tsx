"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import { nutritionByMeal } from "@/lib/mockData";
import { Flame, Beef, Wheat, Droplet, Plus, X } from "lucide-react";
import api from "@/lib/api";

interface FoodItem {
    id: string;
    name: string;
    category: string;
    meal: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export default function NutritionPage() {
    const [mealFilter, setMealFilter] = useState("All");
    const meals = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [form, setForm] = useState({
        name: "", category: "Vegetarian", meal: "Breakfast",
        portion: "1 plate", calories: "", protein: "", carbs: "", fats: ""
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await api.get("/api/admin/food-items");
            setFoodItems(res.data);
        } catch (e) {
            console.error("Failed to fetch food items:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post("/api/admin/food-items", {
                ...form,
                calories: parseInt(form.calories),
                protein: parseFloat(form.protein || "0"),
                carbs: parseFloat(form.carbs || "0"),
                fats: parseFloat(form.fats || "0"),
            });
            setShowModal(false);
            setForm({ name: "", category: "Vegetarian", meal: "Breakfast", portion: "1 plate", calories: "", protein: "", carbs: "", fats: "" });
            fetchItems();
        } catch (e) {
            alert("Failed to add food item.");
        } finally {
            setSaving(false);
        }
    };

    const avgCalories = foodItems.length ? Math.round(foodItems.reduce((s, f) => s + f.calories, 0) / foodItems.length) : 0;
    const avgProtein = foodItems.length ? Math.round(foodItems.reduce((s, f) => s + f.protein, 0) / foodItems.length) : 0;
    const avgCarbs = foodItems.length ? Math.round(foodItems.reduce((s, f) => s + f.carbs, 0) / foodItems.length) : 0;
    const avgFats = foodItems.length ? Math.round(foodItems.reduce((s, f) => s + f.fats, 0) / foodItems.length) : 0;

    const filtered = mealFilter === "All" ? foodItems : foodItems.filter((f) => f.meal === mealFilter);
    const maxMealCal = nutritionByMeal.length ? Math.max(...nutritionByMeal.map((m) => m.avgCalories)) : 1;

    const columns = [
        {
            key: "name", label: "Food Item",
            render: (f: FoodItem) => <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{f.name}</span>,
        },
        {
            key: "category", label: "Category",
            render: (f: FoodItem) => <span className="badge badge-cyan">{f.category}</span>,
        },
        {
            key: "meal", label: "Meal",
            render: (f: FoodItem) => (
                <span className={`badge ${f.meal === "Breakfast" ? "badge-green" : f.meal === "Lunch" ? "badge-blue" : f.meal === "Dinner" ? "badge-purple" : "badge-orange"}`}>
                    {f.meal}
                </span>
            ),
        },
        { key: "portion", label: "Portion" },
        {
            key: "calories", label: "Calories",
            render: (f: FoodItem) => <span style={{ fontWeight: 600, color: "var(--orange)" }}>{f.calories} kcal</span>,
        },
        { key: "protein", label: "Protein", render: (f: FoodItem) => <span>{f.protein}g</span> },
        { key: "carbs", label: "Carbs", render: (f: FoodItem) => <span>{f.carbs}g</span> },
        { key: "fats", label: "Fats", render: (f: FoodItem) => <span>{f.fats}g</span> },
    ];

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "10px 12px", background: "var(--bg-elevated)",
        border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)",
        fontSize: "14px", boxSizing: "border-box", outline: "none"
    };
    const labelStyle: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" };

    if (loading) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", color: "var(--text-muted)" }}>Loading nutrition data...</div>;
    }

    return (
        <>
            <div className="page-header animate-fade-in-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h1 className="page-title">Nutrition Management</h1>
                    <p className="page-subtitle">Manage mess menus, track food items, and monitor nutritional intake</p>
                </div>
                <button onClick={() => setShowModal(true)} style={{
                    padding: "10px 20px", background: "var(--accent)", color: "#000", border: "none",
                    borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "8px"
                }}>
                    <Plus size={16} /> Add Food Item
                </button>
            </div>

            <div className="stats-grid">
                <StatCard icon={<Flame size={20} />} label="Avg Calories" value={`${avgCalories} kcal`} accentColor="var(--orange)" className="animate-fade-in-up stagger-1" />
                <StatCard icon={<Beef size={20} />} label="Avg Protein" value={`${avgProtein}g`} accentColor="var(--red)" className="animate-fade-in-up stagger-2" />
                <StatCard icon={<Wheat size={20} />} label="Avg Carbs" value={`${avgCarbs}g`} accentColor="var(--blue)" className="animate-fade-in-up stagger-3" />
                <StatCard icon={<Droplet size={20} />} label="Avg Fats" value={`${avgFats}g`} accentColor="var(--yellow)" className="animate-fade-in-up stagger-4" />
            </div>

            <div className="charts-grid" style={{ marginBottom: "24px" }}>
                <ChartCard title="Calories by Meal Type" badge="Average" className="animate-fade-in-up stagger-3">
                    <div className="bar-chart">
                        {nutritionByMeal.map((m) => (
                            <div key={m.meal} className="bar-chart-item">
                                <div className="bar" style={{ height: `${(m.avgCalories / maxMealCal) * 100}%`, background: m.color }} title={`${m.avgCalories} kcal`} />
                                <span className="bar-label">{m.meal}</span>
                            </div>
                        ))}
                    </div>
                </ChartCard>

                <ChartCard title="Macronutrient Breakdown" badge="Per Item Avg" className="animate-fade-in-up stagger-4">
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "10px 0" }}>
                        {[
                            { label: "Protein", value: avgProtein, max: 30, color: "var(--red)" },
                            { label: "Carbs", value: avgCarbs, max: 55, color: "var(--blue)" },
                            { label: "Fats", value: avgFats, max: 25, color: "var(--yellow)" },
                        ].map((macro) => (
                            <div key={macro.label}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{macro.label}</span>
                                    <span style={{ fontSize: "13px", fontWeight: 600, color: macro.color }}>{macro.value}g</span>
                                </div>
                                <div className="progress-bar" style={{ height: "8px" }}>
                                    <div className="progress-bar-fill" style={{ width: `${(macro.value / macro.max) * 100}%`, background: macro.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            <div className="filters-row animate-fade-in-up stagger-4">
                {meals.map((meal) => (
                    <button key={meal} className={`filter-btn ${mealFilter === meal ? "active" : ""}`} onClick={() => setMealFilter(meal)}>
                        {meal}
                    </button>
                ))}
            </div>

            <div className="animate-fade-in-up stagger-5">
                <DataTable title="Food Items" columns={columns} data={filtered} searchKey="name" searchPlaceholder="Search food items..." />
            </div>

            {/* Add Food Item Modal */}
            {showModal && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
                    onClick={() => setShowModal(false)}>
                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "500px", boxShadow: "var(--shadow-lg)" }}
                        onClick={(e) => e.stopPropagation()} className="animate-fade-in-up">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>Add Food Item</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <div>
                                    <label style={labelStyle}>Name *</label>
                                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="e.g., Dal Rice" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Category *</label>
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                                        <option>Vegetarian</option><option>Non-Vegetarian</option><option>Beverage</option><option>Dessert</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Meal *</label>
                                    <select value={form.meal} onChange={(e) => setForm({ ...form, meal: e.target.value })} style={inputStyle}>
                                        <option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Portion *</label>
                                    <input required value={form.portion} onChange={(e) => setForm({ ...form, portion: e.target.value })} style={inputStyle} placeholder="e.g., 1 plate" />
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
                                <div><label style={labelStyle}>Calories *</label><input type="number" required value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} style={inputStyle} placeholder="kcal" /></div>
                                <div><label style={labelStyle}>Protein</label><input type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} style={inputStyle} placeholder="g" /></div>
                                <div><label style={labelStyle}>Carbs</label><input type="number" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} style={inputStyle} placeholder="g" /></div>
                                <div><label style={labelStyle}>Fats</label><input type="number" value={form.fats} onChange={(e) => setForm({ ...form, fats: e.target.value })} style={inputStyle} placeholder="g" /></div>
                            </div>
                            <button type="submit" disabled={saving} style={{
                                padding: "12px", background: "var(--accent)", color: "#000", border: "none",
                                borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                                opacity: saving ? 0.7 : 1, marginTop: "8px"
                            }}>
                                {saving ? "Adding..." : "Add Food Item"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
