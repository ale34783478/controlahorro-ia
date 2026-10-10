// Aquí construyo el diseño común: sidebar, barra superior, contenido y notificaciones. También controlo el menú móvil y las preferencias visuales.
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { Wallet, LayoutDashboard, ArrowLeftRight, ChartNoAxesCombined, Flag, Sparkles, House, BookOpen, Menu, X, Sun, Moon, Type, RotateCcw, ShieldCheck } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
// Defino las rutas y sus nombres para construir la navegación y mostrar la ubicación de la pantalla actual.
const links = [{ to: "/", label: "Inicio", icon: House }, { to: "/dashboard", label: "Resumen", icon: LayoutDashboard }, { to: "/movimientos", label: "Movimientos", icon: ArrowLeftRight }, { to: "/presupuestos", label: "Presupuestos", icon: Wallet }, { to: "/metas", label: "Metas de ahorro", icon: Flag }, { to: "/reportes", label: "Reportes", icon: ChartNoAxesCombined }, { to: "/asistente", label: "Asistente IA", icon: Sparkles }, { to: "/sobre-proyecto", label: "Sobre el proyecto", icon: BookOpen }];
export default function Layout() {
    const { data, update, notice, notify, reset } = useFinance();
    const [open, setOpen] = useState(false);
    const location = useLocation();
    // Cuando cambia la ruta, cierro el menú móvil, enfoco el contenido y regreso al inicio de la página.
    useEffect(() => {
        setOpen(false);
        document.getElementById("main-content")?.focus();
        window.scrollTo(0, 0);
    }, [location.pathname]);
    // Cambio una preferencia visual y la guardo junto con los demás datos.
    function toggle(key: "dark" | "largeText") {
        update(d => ({ ...d, preferences: { ...d.preferences, [key]: !d.preferences[key] } }));
    }
    return <div className="app-shell">
<a className="skip-link" href="#main-content">Ir al contenido</a>
{/* Construyo la barra lateral y oculto su enlace al asistente. */}
<aside className={`sidebar ${open ? "open" : ""}`}>
<Link to="/" className="brand">
<span className="brand-mark">
<Wallet size={23}/>
</span>
<span>ControlAhorro <b>IA</b>
<small>Pequeños hábitos, grandes metas</small>
</span>
</Link>
<p className="nav-label">TU ESPACIO FINANCIERO</p>
<nav aria-label="Navegación principal">{links.filter(l => l.to !== "/asistente").map(l => <NavLink key={l.to} to={l.to} end={l.to === "/"}>
<l.icon size={19}/>{l.label}{l.to === "/asistente" && <span className="mini-badge">DEMO</span>}</NavLink>)}</nav>
<div className="sidebar-bottom">
<div className="local-note">
<ShieldCheck size={23}/>
<strong>Tu espacio, tus datos</strong>
<p>Se guardan en este navegador. Al limpiar su almacenamiento pueden perderse.</p>
</div>
<button className="reset-button" onClick={() => {
            if (window.confirm("\u00BFRestablecer la demostraci\u00F3n? Se reemplazar\u00E1n todos tus registros, presupuestos y metas actuales."))
                reset();
        }}>
<RotateCcw size={16}/>Restablecer demostración</button>
<div className="profile">
<span>EV</span>
<div>
<strong>Estudiante universitario</strong>
<small>Prototipo académico</small>
</div>
</div>
</div>
</aside>{open && <button className="nav-backdrop" onClick={() => setOpen(false)} aria-label="Cerrar navegación"/>}<div className="main-shell">
{/* Muestro la ubicación actual y los controles de texto ampliado y modo oscuro. */}
<header className="topbar">
<button className="icon-button mobile-menu" aria-label={open ? "Cerrar men\u00FA" : "Abrir men\u00FA"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
<span className="breadcrumb">Mi espacio <span>/</span> {links.find(l => l.to === location.pathname)?.label ?? "P\u00E1gina"}</span>
<div className="actions">
<span className="desktop-hint">
<span className="green-dot"/>Prototipo local</span>
<button className="icon-button" aria-label="Aumentar tamaño de texto" aria-pressed={data.preferences.largeText} onClick={() => toggle("largeText")}>
<Type size={20}/>
</button>
<button className="icon-button" aria-label="Cambiar modo oscuro" aria-pressed={data.preferences.dark} onClick={() => toggle("dark")}>{data.preferences.dark ? <Sun size={20}/> : <Moon size={20}/>}</button>
<span className="avatar">EV</span>
</div>
</header>
{/* Coloco aquí la pantalla que corresponde a la ruta elegida. */}
<main id="main-content" tabIndex={-1}>
<Outlet />
</main>
<footer>ControlAhorro IA <span>Proyecto de Microeconomía · Prototipo funcional</span>
</footer>
</div>{notice && <div className="toast" role="status">
<span>{notice}</span>
<button className="icon-button" onClick={() => notify("")} aria-label="Cerrar notificación">
<X size={18}/>
</button>
</div>}</div>;
}
