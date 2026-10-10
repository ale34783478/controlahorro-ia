// Aquí convierto los movimientos registrados en gráficas. Utilizo los mismos cálculos que el resto de la aplicación para que las cifras coincidan.
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import type { Movement } from "../types/finance";
import { money, sum } from "../utils/finance";
const colors = ["#059669", "#2563eb", "#eab308", "#8b5cf6", "#f97316", "#0891b2", "#ec4899", "#64748b", "#475569"];
// Agrupo los gastos por categoría y ordeno los resultados de mayor a menor consumo.
export function categoryData(movements: Movement[]) {
    return [...new Set(movements.filter(m => m.type === "gasto").map(m => m.category))].map(name => ({ name, value: sum(movements.filter(m => m.category === name), "gasto") })).sort((a, b) => b.value - a.value);
}
// Muestro la distribución de gastos en una gráfica circular y añado una lista con los montos.
export function CategoryChart({ movements }: {
    movements: Movement[];
}) {
    const data = categoryData(movements);
    return data.length ? <>
<div className="chart" role="img" aria-label="Distribución de gastos por categoría">
<ResponsiveContainer width="100%" height="100%">
<PieChart>
<Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={4}>{data.map((d, i) => <Cell key={d.name} fill={colors[i % colors.length]}/>)}</Pie>
<Tooltip formatter={v => money(Number(v))}/>
</PieChart>
</ResponsiveContainer>
</div>
<div className="legend">{data.map((d, i) => <div key={d.name}>
<span>
<i style={{ background: colors[i % colors.length] }}/>{d.name}</span>
<strong>{money(d.value)}</strong>
</div>)}</div>
</> : <p className="empty">Registra un gasto para ver su distribución.</p>;
}
// Agrupo los registros por mes y comparo ingresos y gastos con barras.
export function MonthlyChart({ movements }: {
    movements: Movement[];
}) {
    const months = [...new Set(movements.map(m => m.date.slice(0, 7)))].sort();
    const data = months.map(month => ({ name: month, Ingresos: sum(movements.filter(m => m.date.startsWith(month)), "ingreso"), Gastos: sum(movements.filter(m => m.date.startsWith(month)), "gasto") }));
    return <div className="chart" role="img" aria-label="Comparación de ingresos y gastos por mes">
<ResponsiveContainer width="100%" height="100%">
<BarChart data={data} barGap={8}>
<CartesianGrid strokeDasharray="3 3" vertical={false}/>
<XAxis dataKey="name"/>
<YAxis width={65}/>
<Tooltip formatter={v => money(Number(v))}/>
<Bar dataKey="Ingresos" fill="#059669" radius={[5, 5, 0, 0]}/>
<Bar dataKey="Gastos" fill="#93c5fd" radius={[5, 5, 0, 0]}/>
</BarChart>
</ResponsiveContainer>
</div>;
}
// Parto del saldo anterior al período y acumulo los ingresos y gastos de cada día; aquí todavía no descuento el ahorro apartado.
export function BalanceChart({ movements, opening = 0 }: {
    movements: Movement[];
    opening?: number;
}) {
    let balance = opening;
    const dates = [...new Set(movements.map(m => m.date))].sort();
    const data = dates.map(date => {
        const day = movements.filter(m => m.date === date);
        balance += sum(day, "ingreso") - sum(day, "gasto");
        return { date, Saldo: balance };
    });
    return <div className="chart" role="img" aria-label="Evolución del saldo de ingresos menos gastos, antes de apartar ahorro">
<ResponsiveContainer width="100%" height="100%">
<AreaChart data={data}>
<CartesianGrid strokeDasharray="3 3" vertical={false}/>
<XAxis dataKey="date"/>
<YAxis width={65}/>
<Tooltip formatter={v => money(Number(v))}/>
<Area type="monotone" dataKey="Saldo" stroke="#059669" fill="#d1fae5"/>
</AreaChart>
</ResponsiveContainer>
</div>;
}
