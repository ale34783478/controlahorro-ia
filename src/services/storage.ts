// Aquí leo y guardo los datos en el navegador. Reviso su estructura antes de utilizarlos y preparo registros de ejemplo cuando todavía no hay información válida.
import type { FinanceData } from "../types/finance";
import { currentMonth, today, validAmount } from "../utils/finance";
import { expenseCategories, incomeCategories } from "../types/finance";
const KEY = "controlahorro-v1";
// Preparo una demostración coherente con el mes actual y evito colocar movimientos en fechas futuras.
export function demoData(): FinanceData {
    const month = currentMonth();
    const demoDate = (day: number) => `${month}-${String(Math.min(day, Number(today().slice(8)))).padStart(2, "0")}`;
    return {
        movements: [
            { id: "d1", type: "ingreso", amount: 1800, category: "Mesada", description: "Mesada mensual", date: demoDate(1) },
            { id: "d2", type: "ingreso", amount: 750, category: "Beca", description: "Beca universitaria", date: demoDate(2) },
            ...[
                ["Alimentaci\u00F3n", 285, "Almuerzos de la semana"],
                ["Transporte", 160, "Transporte a la universidad"],
                ["Educaci\u00F3n", 220, "Libros y materiales"],
                ["Entretenimiento", 85, "Salida con amigos"],
                ["Servicios", 100, "Plan de internet"],
            ].map(([category, amount, description], i) => ({ id: `d${i + 3}`, type: "gasto" as const, amount: Number(amount), category: String(category), description: String(description), date: demoDate(i + 3) })),
        ],
        budgets: [
            { id: "b1", category: "Alimentaci\u00F3n", amount: 600, month },
            { id: "b2", category: "Transporte", amount: 300, month },
            { id: "b3", category: "Educaci\u00F3n", amount: 250, month },
            { id: "b4", category: "Entretenimiento", amount: 200, month },
        ],
        goals: [{ id: "g1", name: "Mi pr\u00F3xima laptop", description: "Una herramienta para mis estudios", target: 4500, deadline: "", contributions: [{ id: "c1", amount: 500, date: demoDate(2) }] }],
        preferences: { largeText: false, dark: false },
    };
}
const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const string = (value: unknown): value is string => typeof value === "string";
const amount = (value: unknown) => typeof value === "number" && validAmount(value);
const date = (value: unknown) => string(value) && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(new Date(`${value}T12:00:00`).getTime()) && new Date(`${value}T12:00:00`).getDate() === Number(value.slice(8));
// Compruebo los datos leídos antes de tratarlos como registros financieros válidos.
function isData(value: unknown): value is FinanceData {
    if (!record(value) || !Array.isArray(value.movements) || !Array.isArray(value.budgets) || !Array.isArray(value.goals) || !record(value.preferences))
        return false;
    return typeof value.preferences.dark === "boolean" && typeof value.preferences.largeText === "boolean" && value.movements.every(m => record(m) && string(m.id) && string(m.description) && amount(m.amount) && date(m.date) && string(m.category) && (m.type === "ingreso" ? (incomeCategories as readonly string[]).includes(m.category) : m.type === "gasto" && (expenseCategories as readonly string[]).includes(m.category))) && value.budgets.every(b => record(b) && string(b.id) && string(b.category) && (expenseCategories as readonly string[]).includes(b.category) && amount(b.amount) && string(b.month) && /^\d{4}-(0[1-9]|1[0-2])$/.test(b.month)) && value.goals.every(g => record(g) && string(g.id) && string(g.name) && string(g.description) && amount(g.target) && (g.deadline === "" || date(g.deadline)) && Array.isArray(g.contributions) && g.contributions.every(c => record(c) && string(c.id) && amount(c.amount) && date(c.date)));
}
// Intento recuperar los registros guardados. Si no existen, cargo ejemplos; si hay un error, también devuelvo una advertencia.
export function readData(): {
    data: FinanceData;
    warning: string;
} {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw)
            return { data: demoData(), warning: "" };
        const data: unknown = JSON.parse(raw);
        if (!isData(data))
            throw new Error("Datos inv\u00E1lidos");
        return { data, warning: "" };
    }
    catch {
        return { data: demoData(), warning: "No fue posible leer los datos guardados. Se carg\u00F3 la demostraci\u00F3n; revisa el almacenamiento de tu navegador." };
    }
}
// Guardo todo el estado financiero bajo una sola clave del almacenamiento local.
export function writeData(data: FinanceData) {
    localStorage.setItem(KEY, JSON.stringify(data));
}
