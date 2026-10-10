// Aquí reúno las piezas visuales que reutilizo: tarjetas, títulos, mensajes vacíos, barras de progreso y ventanas de formularios.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
// Envuelvo el contenido en una tarjeta con el estilo común de la aplicación.
export function Panel({ children, className = "" }: {
    children: ReactNode;
    className?: string;
}) {
    return <section className={`panel ${className}`}>{children}</section>;
}
// Muestro el título, la descripción y una acción opcional para cada pantalla.
export function PageTitle({ title, description, action }: {
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return <div className="page-title">
<div>
<p className="eyebrow">TU DINERO, CON PROPÓSITO</p>
<h1>{title}</h1>
<p className="muted">{description}</p>
</div>{action}</div>;
}
// Explico al usuario que todavía no hay datos para mostrar.
export function Empty({ children }: {
    children: ReactNode;
}) {
    return <p className="empty">{children}</p>;
}
// Represento el avance en una barra y limito su valor visual entre cero y cien.
export function Progress({ value, label }: {
    value: number;
    label: string;
}) {
    return <div className="progress" role="progressbar" aria-label={label} aria-valuenow={Math.round(Math.min(100, Math.max(0, value)))} aria-valuemin={0} aria-valuemax={100}>
<span style={{ width: `${Math.min(100, Math.max(0, value))}%` }}/>
</div>;
}
// Abro una ventana de formulario con el diálogo del navegador y devuelvo el foco al elemento anterior cuando se cierra.
export function Modal({ title, children, onClose }: {
    title: string;
    children: ReactNode;
    onClose: () => void;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        ref.current?.showModal();
        return () => previous?.focus();
    }, []);
    return <dialog ref={ref} onCancel={onClose} aria-label={title}>
<div className="modal-head">
<h2>{title}</h2>
<button className="icon-button" onClick={onClose} aria-label="Cerrar">
<X size={20}/>
</button>
</div>{children}</dialog>;
}
