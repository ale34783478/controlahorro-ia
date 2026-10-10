// Aquí administro los ingresos y gastos. Permito buscar, filtrar, ordenar, editar y eliminar registros, y calculo los totales del listado visible.
import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import type { Movement } from "../types/finance";
import { money, dateLabel, sum } from "../utils/finance";
import { MovementForm } from "../components/MovementForm";
import { PageTitle, Panel, Empty } from "../components/ui";
export default function Movimientos() {
    const { data, update, notify } = useFinance();
    const [editing, setEditing] = useState<Movement | null | undefined>(undefined);
    const [search, setSearch] = useState(""), [type, setType] = useState(""), [category, setCategory] = useState(""), [order, setOrder] = useState("desc");
    // Aplico todos los filtros al mismo listado y ordeno por fecha antes de calcular sus totales.
    const rows = data.movements.filter(m => (!type || m.type === type) && (!category || m.category === category) && `${m.description} ${m.category}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())).sort((a, b) => order === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
    return <>
<PageTitle title="Movimientos" description="Un registro claro de lo que entra y lo que sale." action={<button className="primary" onClick={() => setEditing(null)}>
<Plus size={18}/>Nuevo movimiento</button>}/>
<Panel>
{/* Dejo que el usuario elija qué movimientos quiere ver y en qué orden. */}
<div className="filters">
<label>
<span>
<Search size={16}/>Buscar</span>
<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Descripción o categoría"/>
</label>
<label>Tipo<select value={type} onChange={e => setType(e.target.value)}>
<option value="">Todos</option>
<option value="ingreso">Ingresos</option>
<option value="gasto">Gastos</option>
</select>
</label>
<label>Categoría<select value={category} onChange={e => setCategory(e.target.value)}>
<option value="">Todas</option>{[...new Set(data.movements.map(m => m.category))].map(c => <option key={c}>{c}</option>)}</select>
</label>
<label>Orden<select value={order} onChange={e => setOrder(e.target.value)}>
<option value="desc">Más recientes</option>
<option value="asc">Más antiguos</option>
</select>
</label>
</div>
<p className="result-summary">{rows.length} registros · Ingresos: <strong>{money(sum(rows, "ingreso"))}</strong> · Gastos: <strong>{money(sum(rows, "gasto"))}</strong>
</p>
{/* Muestro los registros filtrados y sus botones para editar o eliminar con confirmación. */}
<div className="table-wrap">
<table>
<thead>
<tr>
<th>Descripción</th>
<th>Categoría</th>
<th>Fecha</th>
<th>Tipo</th>
<th>Monto</th>
<th>Acciones</th>
</tr>
</thead>
<tbody>{rows.map(m => <tr key={m.id}>
<td>
<strong>{m.description}</strong>
</td>
<td>{m.category}</td>
<td>{dateLabel(m.date)}</td>
<td>
<span className={`badge ${m.type === "ingreso" ? "income" : ""}`}>{m.type === "ingreso" ? "Ingreso" : "Gasto"}</span>
</td>
<td className={m.type === "ingreso" ? "positive" : ""}>{m.type === "ingreso" ? "+" : "\u2212"}{money(m.amount)}</td>
<td>
<div className="actions">
<button className="icon-button" aria-label={`Editar ${m.description}`} onClick={() => setEditing(m)}>
<Pencil size={17}/>
</button>
<button className="icon-button" aria-label={`Eliminar ${m.description}`} onClick={() => {
                if (window.confirm(`¿Eliminar «${m.description}»?`)) {
                    update(d => ({ ...d, movements: d.movements.filter(x => x.id !== m.id) }));
                    notify("Movimiento eliminado.");
                }
            }}>
<Trash2 size={17}/>
</button>
</div>
</td>
</tr>)}</tbody>
</table>
</div>{!rows.length && <Empty>No hay movimientos que coincidan. Agrega uno o modifica los filtros.</Empty>}</Panel>{editing !== undefined && <MovementForm movement={editing ?? undefined} onClose={() => setEditing(undefined)}/>}</>;
}
