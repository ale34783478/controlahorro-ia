// Aquí administro las metas de ahorro y sus aportes. Aparto del saldo solamente el dinero que el usuario confirma, y muestro el progreso de cada objetivo.
import { useState } from "react";
import type { FormEvent } from "react";
import { Plus, Pencil, Trash2, Flag, Check } from "lucide-react";
import type { Goal } from "../types/finance";
import { useFinance } from "../context/FinanceContext";
import { available, money, goalSaved, today, dateLabel, validAmount } from "../utils/finance";
import { PageTitle, Panel, Modal, Progress, Empty } from "../components/ui";
export default function MetasAhorro() {
    const { data, update, notify } = useFinance();
    const [editing, setEditing] = useState<Goal | null | undefined>();
    const [contributing, setContributing] = useState<Goal>();
    const [error, setError] = useState("");
    // Valido y guardo la meta; al editarla, conservo los aportes que ya recibió.
    function save(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget), target = Number(f.get("target")), name = String(f.get("name")).trim(), deadline = String(f.get("deadline"));
        if (!validAmount(target) || !name || (deadline && deadline < today())) {
            setError("Revisa el nombre, el objetivo positivo y la fecha l\u00EDmite (hoy o posterior).");
            return;
        }
        const g: Goal = { id: editing?.id ?? crypto.randomUUID(), name, description: String(f.get("description")).trim(), target, deadline, contributions: editing?.contributions ?? [] };
        update(d => ({ ...d, goals: editing ? d.goals.map(x => x.id === g.id ? g : x) : [...d.goals, g] }));
        notify("Meta guardada.");
        setEditing(undefined);
    }
    // Compruebo que el aporte sea válido y no supere el saldo disponible antes de añadirlo a la meta.
    function contribute(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget), amount = Number(f.get("amount"));
        if (!validAmount(amount) || amount > available(data)) {
            setError("El aporte debe ser positivo y no superar el saldo disponible.");
            return;
        }
        update(d => ({ ...d, goals: d.goals.map(g => g.id === contributing?.id ? { ...g, contributions: [...g.contributions, { id: crypto.randomUUID(), amount, date: today() }] } : g) }));
        notify("Aporte registrado y apartado del saldo disponible.");
        setContributing(undefined);
    }
    return <>
<PageTitle title="Metas de ahorro" description="Los grandes planes empiezan con pequeños aportes." action={<button className="primary" onClick={() => {
        setError("");
        setEditing(null);
    }}>
<Plus size={18}/>Nueva meta</button>}/>
{/* Explico cuánto dinero se puede aportar y cómo afecta al saldo. */}
<p className="info">Disponible para aportar: <strong>{money(available(data))}</strong>. El ahorro se aparta del saldo; no se registra como gasto de consumo. Al eliminar una meta, sus aportes vuelven al saldo disponible.</p>
<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">{data.goals.map(g => {
            const amount = goalSaved(g), percent = amount / g.target * 100;
            return <Panel key={g.id}>
<div className="section-head">
<span className="goal-icon">
<Flag size={23}/>
</span>
<div className="actions">
<button className="icon-button" aria-label={`Editar ${g.name}`} onClick={() => {
                setError("");
                setEditing(g);
            }}>
<Pencil size={17}/>
</button>
<button className="icon-button" aria-label={`Eliminar ${g.name}`} onClick={() => {
                    if (window.confirm("\u00BFEliminar la meta y devolver sus aportes al saldo disponible?")) {
                        update(d => ({ ...d, goals: d.goals.filter(x => x.id !== g.id) }));
                        notify("Meta eliminada. Los aportes vuelven al saldo disponible.");
                    }
                }}>
<Trash2 size={17}/>
</button>
</div>
</div>
<h2 className="mt-5">{g.name}</h2>
<p className="muted">{g.description || "Tu pr\u00F3ximo objetivo financiero"}</p>
<div className="budget-total">
<strong>{money(amount)}</strong>
<span>de {money(g.target)}</span>
</div>
<Progress value={percent} label={g.name}/>
<p className="status">{percent >= 100 ? <>
<Check size={18}/>Meta completada</> : `${percent.toFixed(1)}% de avance`}</p>{g.deadline && <p className="muted">Fecha límite: {dateLabel(g.deadline)}{g.deadline < today() && percent < 100 ? " \u00B7 Plazo vencido" : ""}</p>}<button className="secondary full" onClick={() => {
                setError("");
                setContributing(g);
            }}>
<Plus size={16}/>Registrar aporte</button>
<details>
<summary>{g.contributions.length} aportes registrados</summary>{g.contributions.map(c => <p key={c.id}>{dateLabel(c.date)} · {money(c.amount)}</p>)}</details>
</Panel>;
        })}</div>{!data.goals.length && <Empty>Aún no tienes metas. Crea tu primer objetivo.</Empty>}{editing !== undefined && <Modal title={editing ? "Editar meta" : "Nueva meta"} onClose={() => setEditing(undefined)}>
<form className="form" onSubmit={save}>
<label>Nombre<input name="name" required maxLength={80} defaultValue={editing?.name} autoFocus/>
</label>
<label>Descripción (opcional)<input name="description" maxLength={200} defaultValue={editing?.description}/>
</label>
<label>Objetivo (Q)<input name="target" type="number" min="0.01" max="10000000" step="0.01" required defaultValue={editing?.target}/>
</label>
<label>Fecha límite (opcional)<input name="deadline" type="date" min={today()} defaultValue={editing?.deadline}/>
</label>{error && <p className="error" role="alert">{error}</p>}<button className="primary">Guardar meta</button>
</form>
</Modal>}{contributing && <Modal title={`Aportar a ${contributing.name}`} onClose={() => setContributing(undefined)}>
<form className="form" onSubmit={contribute}>
<p>Disponible: {money(available(data))}</p>
<label>Aporte (Q)<input autoFocus required name="amount" type="number" min="0.01" max={Math.max(0, available(data))} step="0.01"/>
</label>{error && <p className="error" role="alert">{error}</p>}<button className="primary">Confirmar aporte</button>
</form>
</Modal>}</>;
}
