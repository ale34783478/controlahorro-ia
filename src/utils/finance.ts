// Aquí reúno los cálculos y formatos financieros para que todas las pantallas muestren resultados coherentes. Sumo los montos en centavos para reducir errores con decimales.
import type { FinanceData, Movement } from "../types/finance";
// Obtengo la fecha local del navegador para registrar los movimientos sin cambiar de día por la conversión a UTC.
export const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
// Tomo el año y el mes actual para seleccionar los registros del resumen mensual.
export const currentMonth = () => today().slice(0, 7);
// Muestro los montos con el formato de quetzales de Guatemala.
export const money = (value: number) => new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(value);
// Presento las fechas de forma legible; uso el mediodía para evitar cambios de día al interpretarlas.
export const dateLabel = (date: string) => new Intl.DateTimeFormat("es-GT", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
// Sumo solamente los movimientos del tipo solicitado y trabajo en centavos.
export const sum = (items: Movement[], type: Movement["type"]) => items.filter(m => m.type === type).reduce((s, m) => s + Math.round(m.amount * 100), 0) / 100;
// Sumo los aportes registrados en todas las metas; no considero el saldo libre como ahorro.
export const saved = (data: FinanceData) => data.goals.reduce((s, g) => s + g.contributions.reduce((a, c) => a + Math.round(c.amount * 100), 0), 0) / 100;
// Resto los gastos y los aportes de ahorro de los ingresos acumulados para obtener el dinero disponible.
export const available = (data: FinanceData) => Math.round((sum(data.movements, "ingreso") - sum(data.movements, "gasto") - saved(data)) * 100) / 100;
// Calculo el dinero aportado a una meta específica.
export const goalSaved = (goal: FinanceData["goals"][number]) => goal.contributions.reduce((s, c) => s + Math.round(c.amount * 100), 0) / 100;
// Distingo un presupuesto seguro, cercano al límite o agotado según el porcentaje utilizado.
export const budgetState = (percent: number) => percent >= 100 ? "Superado o agotado" : percent >= 80 ? "Cerca del l\u00EDmite" : "Dentro del presupuesto";
// Acepto montos positivos hasta el límite permitido y con un máximo de dos decimales.
export const validAmount = (value: number) => Number.isFinite(value) && value > 0 && value <= 10000000 && Math.abs(value * 100 - Math.round(value * 100)) < 0.000001;
