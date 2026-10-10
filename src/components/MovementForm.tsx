// Aquí muestro el formulario para crear o editar un ingreso o gasto. Valido sus datos antes de actualizar los registros compartidos.
import { useState } from "react";
import type { FormEvent } from "react";
import { useFinance } from "../context/FinanceContext";
import { expenseCategories, incomeCategories } from "../types/finance";
import type { Movement } from "../types/finance";
import { today, validAmount } from "../utils/finance";
import { Modal } from "./ui";
export function MovementForm({ movement, onClose }: {
    movement?: Movement;
    onClose: () => void;
}) {
    const { update, notify } = useFinance();
    const [type, setType] = useState<Movement["type"]>(movement?.type ?? "gasto");
    const [category, setCategory] = useState(movement?.category ?? "Alimentaci\u00F3n");
    const [error, setError] = useState("");
    // Leo el formulario, reviso monto, descripción y fecha, y luego creo el movimiento o reemplazo el que estoy editando.
    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const amount = Number(f.get("amount"));
        const date = String(f.get("date"));
        const description = String(f.get("description")).trim();
        if (!validAmount(amount) || !description || !date || date > today()) {
            setError("Revisa el monto (positivo, hasta dos decimales), la descripci\u00F3n y la fecha, que no puede ser futura.");
            return;
        }
        const item: Movement = { id: movement?.id ?? crypto.randomUUID(), type, category, amount, date, description };
        update(d => ({ ...d, movements: movement ? d.movements.map(m => m.id === movement.id ? item : m) : [...d.movements, item] }));
        notify(movement ? "Movimiento actualizado." : "Movimiento registrado.");
        onClose();
    }
    return <Modal title={movement ? "Editar movimiento" : "Nuevo movimiento"} onClose={onClose}>
<form onSubmit={submit} className="form">
<label>Tipo<select value={type} onChange={e => {
        const t = e.target.value as Movement["type"];
        setType(t);
        setCategory(t === "gasto" ? "Alimentaci\u00F3n" : "Mesada");
    }}>
<option value="gasto">Gasto</option>
<option value="ingreso">Ingreso</option>
</select>
</label>
<label>Monto (Q)<input name="amount" type="number" min="0.01" max="10000000" step="0.01" required defaultValue={movement?.amount} autoFocus/>
</label>
<label>Categoría<select value={category} onChange={e => setCategory(e.target.value)}>{(type === "gasto" ? expenseCategories : incomeCategories).map(c => <option key={c}>{c}</option>)}</select>
</label>
<label>Descripción<input name="description" maxLength={160} required defaultValue={movement?.description} placeholder="¿En qué utilizaste tu dinero?"/>
</label>
<label>Fecha<input name="date" type="date" required max={today()} defaultValue={movement?.date ?? today()}/>
</label>{error && <p role="alert" className="error">{error}</p>}<div className="actions">
<button type="button" className="secondary" onClick={onClose}>Cancelar</button>
<button className="primary">Guardar movimiento</button>
</div>
</form>
</Modal>;
}
