// Aquí muestro el resumen financiero. Calculo ingresos y gastos del mes, saldo disponible, ahorro aportado, uso del presupuesto y avance de las metas.
import { useState } from "react";
import { Link } from "react-router";
import { ArrowDownLeft, ArrowUpRight, Plus, Wallet, PiggyBank, Sparkles, ArrowRight, CircleCheck, TriangleAlert } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { available, currentMonth, money, sum, saved, goalSaved, budgetState, dateLabel } from "../utils/finance";
import { Panel, PageTitle, Progress, Empty } from "../components/ui";
import { MonthlyChart, CategoryChart } from "../components/Charts";
import { MovementForm } from "../components/MovementForm";
export default function Dashboard() {
    const { data } = useFinance();
    const [adding, setAdding] = useState(false);
    // Selecciono el mes actual para el resumen de ingresos y gastos.
    const month = currentMonth();
    const movements = data.movements.filter(m => m.date.startsWith(month));
    const income = sum(movements, "ingreso"), expense = sum(movements, "gasto");
    const budgets = data.budgets.filter(b => b.month === month);
    // Calculo el uso del presupuesto solamente con las categorías que tienen un límite asignado.
    const allocated = budgets.reduce((s, b) => s + b.amount, 0);
    const budgetSpent = sum(movements.filter(m => budgets.some(b => b.category === m.category)), "gasto");
    const percent = allocated ? budgetSpent / allocated * 100 : 0;
    return <>
<PageTitle title="Tu resumen financiero" description="Cada decisión cuenta. Dale dirección a tu dinero." action={<button className="primary" onClick={() => setAdding(true)}>
<Plus size={18}/>Nuevo movimiento</button>}/>
<div className="month-label">{new Intl.DateTimeFormat("es-GT", { month: "long", year: "numeric" }).format(new Date(`${month}-01T12:00:00`))}<span className="badge">Actualizado con tus registros</span>
</div>
{/* Muestro los cuatro indicadores principales usando los datos compartidos. */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 stats">{[{ name: "Saldo disponible", value: available(data), icon: Wallet, detail: "Acumulado, despu\u00E9s de apartar ahorro", special: true }, { name: "Ingresos del mes", value: income, icon: ArrowDownLeft, detail: "Todo lo que recibiste" }, { name: "Gastos del mes", value: expense, icon: ArrowUpRight, detail: "Todo lo que utilizaste" }, { name: "Ahorro registrado", value: saved(data), icon: PiggyBank, detail: "Aportes expl\u00EDcitos a tus metas" }].map(s => <Panel key={s.name} className={s.special ? "stat featured" : "stat"}>
<div className="stat-top">
<span>{s.name}</span>
<s.icon size={22}/>
</div>
<strong>{money(s.value)}</strong>
<small>{s.detail}</small>
</Panel>)}</div>
{/* Organizo las gráficas, los movimientos recientes, el presupuesto y las metas. */}
<div className="dashboard-grid">
<Panel>
<div className="section-head">
<div>
<h2>Tu dinero en perspectiva</h2>
<p className="muted">Ingresos y gastos registrados</p>
</div>
<Link to="/reportes">Ver reportes <ArrowRight size={15}/>
</Link>
</div>
<div className="chart-key">
<span className="green-dot"/>Ingresos <span className="blue-dot"/>Gastos</div>
<MonthlyChart movements={data.movements}/>
</Panel>
<Panel>
<h2>¿A dónde va tu dinero?</h2>
<p className="muted">Gastos de este mes</p>
<CategoryChart movements={movements}/>
</Panel>
<Panel>
<div className="section-head">
<h2>Últimos movimientos</h2>
<Link to="/movimientos">Ver todos <ArrowRight size={15}/>
</Link>
</div>{!data.movements.length && <Empty>Aún no hay movimientos. Registra el primero.</Empty>}<div className="movement-list">{[...data.movements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(m => <div className="movement-row" key={m.id}>
<span className={`movement-icon ${m.type === "ingreso" ? "positive" : ""}`}>{m.type === "ingreso" ? <ArrowDownLeft size={18}/> : <ArrowUpRight size={18}/>}</span>
<div>
<strong>{m.description}</strong>
<small>{m.category} · {dateLabel(m.date)}</small>
</div>
<b className={m.type === "ingreso" ? "positive" : ""}>{m.type === "ingreso" ? "+" : "\u2212"}{money(m.amount)}</b>
</div>)}</div>
</Panel>
<div className="stack">
<Panel>
<div className="section-head">
<h2>Presupuesto mensual</h2>{percent >= 80 ? <TriangleAlert size={20}/> : <CircleCheck size={20} className="positive"/>}</div>
<div className="budget-total">
<strong>{percent.toFixed(0)}%</strong>
<span className="muted">utilizado en categorías asignadas</span>
</div>
<Progress value={percent} label="Presupuesto utilizado"/>
<p className="muted">{allocated ? `${money(budgetSpent)} de ${money(allocated)} · ${budgetState(percent)}` : "Define tu primer presupuesto."}</p>
<Link to="/presupuestos">Administrar presupuestos <ArrowRight size={15}/>
</Link>
</Panel>
<Panel className="assistant-card">
<Sparkles size={24}/>
<h2>Un poco de claridad, en un mensaje.</h2>
<p>Consulta tu saldo o registra un gasto con nuestro asistente demostrativo.</p>
<Link to="/asistente">Hablar con el asistente <ArrowRight size={16}/>
</Link>
</Panel>
</div>
<Panel className="goals-summary">
<div className="section-head">
<h2>Tus metas, cada vez más cerca</h2>
<Link to="/metas">Ver metas <ArrowRight size={15}/>
</Link>
</div>
<div className="grid sm:grid-cols-2 gap-6">{data.goals.map(g => <div key={g.id}>
<div className="section-head">
<strong>{g.name}</strong>
<span>{Math.min(100, goalSaved(g) / g.target * 100).toFixed(0)}%</span>
</div>
<Progress value={goalSaved(g) / g.target * 100} label={g.name}/>
<small className="muted">{money(goalSaved(g))} de {money(g.target)}</small>
</div>)}{!data.goals.length && <Empty>Crea una meta para darle propósito a tu ahorro.</Empty>}</div>
</Panel>
</div>{adding && <MovementForm onClose={() => setAdding(false)}/>}</>;
}
