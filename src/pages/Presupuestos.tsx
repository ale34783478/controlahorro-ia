// Aquí asigno límites de gasto por categoría y mes. Comparo cada límite con los gastos registrados y muestro su estado con texto, iconos y colores.
import { useState } from "react";
import type { FormEvent } from "react";
import { CircleCheck, TriangleAlert, Trash2 } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { expenseCategories } from "../types/finance";
import { currentMonth, money, sum, budgetState, validAmount } from "../utils/finance";
import { PageTitle, Panel, Progress, Empty } from "../components/ui";
export default function Presupuestos() {
    const { data, update, notify } = useFinance();
    const [month, setMonth] = useState(currentMonth());
    // Guardo el límite del mes seleccionado; si la categoría ya tiene presupuesto, lo actualizo.
    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget), amount = Number(f.get("amount")), category = String(f.get("category"));
        if (!validAmount(amount) || !month) {
            notify("Selecciona un mes y un monto positivo con hasta dos decimales.");
            return;
        }
        update(d => ({ ...d, budgets: [...d.budgets.filter(b => !(b.category === category && b.month === month)), { id: crypto.randomUUID(), category, amount, month }] }));
        notify("Presupuesto guardado.");
        e.currentTarget.reset();
    }
    const budgets = data.budgets.filter(b => b.month === month);
    return <>
<PageTitle title="Presupuestos" description="Pon límites a tus gastos y espacio a tus prioridades."/>
{/* Ofrezco el formulario para elegir un mes, una categoría y su límite. */}
<Panel>
<form className="filters" onSubmit={submit}>
<label>Mes<input type="month" required value={month} onChange={e => setMonth(e.target.value)}/>
</label>
<label>Categoría<select name="category">{expenseCategories.map(c => <option key={c}>{c}</option>)}</select>
</label>
<label>Límite mensual (Q)<input name="amount" required type="number" min="0.01" max="10000000" step="0.01"/>
</label>
<button className="primary">Guardar límite</button>
</form>
<p className="muted">Guardar una categoría existente actualiza su límite. Seguro: menos de 80%; alerta: 80–99%; agotado o superado: 100% o más.</p>
</Panel>
<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">{budgets.map(b => {
            const spent = sum(data.movements.filter(m => m.category === b.category && m.date.startsWith(month)), "gasto"), percent = spent / b.amount * 100;
            return <Panel key={b.id} className={percent >= 100 ? "budget danger" : percent >= 80 ? "budget warning" : "budget"}>
<div className="section-head">
<h2>{b.category}</h2>
<button className="icon-button" aria-label={`Eliminar presupuesto de ${b.category}`} onClick={() => {
                    if (window.confirm("\u00BFEliminar este presupuesto?"))
                        update(d => ({ ...d, budgets: d.budgets.filter(x => x.id !== b.id) }));
                }}>
<Trash2 size={18}/>
</button>
</div>
<p className="status">{percent >= 80 ? <TriangleAlert size={17}/> : <CircleCheck size={17}/>} {budgetState(percent)}</p>
<div className="budget-total">
<strong>{money(spent)}</strong>
<span>de {money(b.amount)}</span>
</div>
<Progress label={b.category} value={percent}/>
<div className="section-head">
<span>{percent.toFixed(1)}% utilizado</span>
<strong>{money(b.amount - spent)} disponible</strong>
</div>
</Panel>;
        })}</div>{!budgets.length && <Empty>No hay presupuestos para este mes. Define un límite arriba.</Empty>}</>;
}
