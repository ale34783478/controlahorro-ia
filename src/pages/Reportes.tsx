// Aquí analizo los movimientos del período seleccionado. Comparo ingresos y gastos, agrupo los gastos por categoría y muestro cómo evoluciona el saldo.
import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { money, currentMonth, sum } from "../utils/finance";
import { PageTitle, Panel, Empty } from "../components/ui";
import { MonthlyChart, CategoryChart, BalanceChart, categoryData } from "../components/Charts";
export default function Reportes() {
    const { data } = useFinance();
    const [from, setFrom] = useState(`${currentMonth()}-01`), [to, setTo] = useState(() => {
        const month = currentMonth();
        return `${month}-${new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0).getDate()}`;
    });
    // Reviso el rango de fechas y separo los registros del período de los anteriores.
    const valid = !!from && !!to && from <= to;
    const movements = valid ? data.movements.filter(m => m.date >= from && m.date <= to) : [];
    // Recupero los registros anteriores para calcular el saldo inicial de la gráfica.
    const earlier = data.movements.filter(m => m.date < from);
    const income = sum(movements, "ingreso"), expense = sum(movements, "gasto");
    return <>
<PageTitle title="Reportes financieros" description="Entiende tus hábitos. Toma decisiones con información."/>
<Panel>
{/* Elijo el rango de fechas que utilizaré en todos los resultados de esta pantalla. */}
<div className="filters">
<label>Desde<input type="date" value={from} onChange={e => setFrom(e.target.value)}/>
</label>
<label>Hasta<input type="date" value={to} onChange={e => setTo(e.target.value)}/>
</label>
</div>{!valid && <p className="error" role="alert">Selecciona un período válido: la fecha inicial debe ser anterior o igual a la final.</p>}<div className="grid sm:grid-cols-3 gap-5 mt-5">
<div>
<p className="muted">Ingresos del período</p>
<h2>{money(income)}</h2>
</div>
<div>
<p className="muted">Gastos del período</p>
<h2>{money(expense)}</h2>
</div>
<div>
<p className="muted">Resultado del período</p>
<h2>{money(income - expense)}</h2>
</div>
</div>
</Panel>{!movements.length && <Empty>No hay registros para este período.</Empty>}{/* Presento las comparaciones y el consumo por categoría del período seleccionado. */}
<div className="dashboard-grid mt-6">
<Panel>
<h2>Ingresos frente a gastos</h2>
<p className="muted">Verde: ingresos · Azul: gastos</p>
<MonthlyChart movements={movements}/>
<div className="legend">{[...new Set(movements.map(m => m.date.slice(0, 7)))].sort().map(month => <div key={month}>
<span>{month}</span>
<strong>{money(sum(movements.filter(m => m.date.startsWith(month)), "ingreso"))} / {money(sum(movements.filter(m => m.date.startsWith(month)), "gasto"))}</strong>
</div>)}</div>
</Panel>
<Panel>
<h2>Distribución de gastos</h2>
<CategoryChart movements={movements}/>
</Panel>
<Panel>
<h2>Evolución del saldo</h2>
<p className="muted">Saldo acumulado de ingresos menos gastos, antes de apartar ahorro. Incluye el saldo anterior al período.</p>
<BalanceChart movements={movements} opening={sum(earlier, "ingreso") - sum(earlier, "gasto")}/>
</Panel>
<Panel>
<h2>Categorías con mayor consumo</h2>
<div className="legend">{categoryData(movements).map((c, i) => <div key={c.name}>
<span>{i + 1}. {c.name}</span>
<strong>{money(c.value)}</strong>
</div>)}</div>{!categoryData(movements).length && <Empty>Sin gastos registrados.</Empty>}<p className="info">{income > 0 ? `Utilizaste ${(expense / income * 100).toFixed(1)}% de los ingresos del período.` : "No hay ingresos en este per\u00EDodo para calcular una proporci\u00F3n."} {expense > income ? "Los gastos superan los ingresos. Revisa tus prioridades y l\u00EDmites." : "Revisa tus metas antes de realizar nuevas compras."}</p>
</Panel>
</div>
</>;
}
