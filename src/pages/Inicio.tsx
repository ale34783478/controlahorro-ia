// Aquí presento ControlAhorro IA, el problema que busca resolver y sus beneficios. La vista previa utiliza los datos actuales de la aplicación.
import { Link } from "react-router";
import { ArrowRight, Wallet, ChartNoAxesCombined, Flag, Sparkles, Accessibility, NotebookPen, Check } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { available, money, currentMonth, sum } from "../utils/finance";
import { Panel } from "../components/ui";
import { MonthlyChart } from "../components/Charts";
export default function Inicio() {
    const { data } = useFinance();
    const month = data.movements.filter(m => m.date.startsWith(currentMonth()));
    return <>
{/* Presento el mensaje principal y una vista previa con los registros reales. */}
<section className="hero-section">
<div>
<span className="hero-badge">
<span className="green-dot"/>Finanzas claras. Futuro con propósito.</span>
<h1>Tu dinero.<br />Tus decisiones.<br />
<em>Un mejor futuro.</em>
</h1>
<p>La vida universitaria ya tiene suficientes retos. Organiza tus gastos, construye hábitos y acércate a tus metas con ControlAhorro IA.</p>
<div className="actions flex-wrap">
<Link className="primary" to="/dashboard">Comenzar a utilizar <ArrowRight size={18}/>
</Link>
<Link className="secondary" to="/sobre-proyecto">Conocer el proyecto</Link>
</div>
<div className="hero-points">
<span>
<Check size={16}/>Sin cuentas ni contraseñas</span>
<span>
<Check size={16}/>Todo en quetzales</span>
</div>
</div>
<div className="hero-preview">
<div className="preview-top">
<span className="brand-mark">
<Wallet size={20}/>
</span>
<strong>Mi panorama financiero</strong>
<span className="badge">Vista real</span>
</div>
<div className="preview-balance">
<span>Saldo disponible</span>
<strong>{money(available(data))}</strong>
<small>Un paso más cerca de tus objetivos</small>
</div>
<div className="grid grid-cols-2 gap-4 my-5">
<div>
<p className="muted">Ingresos del mes</p>
<h2>{money(sum(month, "ingreso"))}</h2>
</div>
<div>
<p className="muted">Gastos del mes</p>
<h2>{money(sum(month, "gasto"))}</h2>
</div>
</div>
<MonthlyChart movements={data.movements}/>
<div className="preview-note">
<Sparkles size={17}/>Un buen hábito empieza con un registro.</div>
</div>
</section>
{/* Explico las dificultades que busca resolver el proyecto. */}
<section className="landing-section">
<p className="eyebrow">UN RETO COTIDIANO</p>
<h2>¿A dónde se fue mi dinero?</h2>
<p className="section-intro">Entre el transporte, los almuerzos y los materiales de estudio, los gastos pequeños se acumulan. Sin un registro ni un presupuesto, es difícil saber cuánto queda y decidir qué es prioritario.</p>
<div className="grid md:grid-cols-3 gap-5 mt-8">{[["Gastos que pasan desapercibidos", "Las compras peque\u00F1as y frecuentes pueden reducir tus recursos sin que lo notes."], ["Decisiones sin un plan", "La falta de presupuesto favorece compras impulsivas y dificulta cubrir necesidades acad\u00E9micas."], ["Metas que se posponen", "Sin conocer tu dinero disponible, ahorrar se vuelve un objetivo dif\u00EDcil de mantener."]].map(([title, text], i) => <Panel key={title}>
<span className="number">0{i + 1}</span>
<h3>{title}</h3>
<p className="muted">{text}</p>
</Panel>)}</div>
</section>
<section className="landing-section">
<p className="eyebrow">UNA SOLUCIÓN A TU ALCANCE</p>
<h2>Más organización. Más posibilidades.</h2>
<p className="section-intro">Una herramienta accesible para registrar tus recursos, analizar tus hábitos y tomar decisiones de consumo responsables.</p>
<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">{[{ icon: NotebookPen, title: "Ingresos y gastos", text: "Registra, clasifica y consulta cada movimiento.", to: "/movimientos" }, { icon: Wallet, title: "Presupuestos claros", text: "Asigna l\u00EDmites y reconoce cu\u00E1ndo necesitas ajustar.", to: "/presupuestos" }, { icon: Flag, title: "Metas de ahorro", text: "Convierte tus planes en aportes y avances concretos.", to: "/metas" }, { icon: ChartNoAxesCombined, title: "Reportes financieros", text: "Comprende tus gastos con gr\u00E1ficos de tus registros.", to: "/reportes" }, { icon: Sparkles, title: "Asistente por voz y texto", text: "Consulta y prepara movimientos con instrucciones conocidas.", to: "/asistente" }, { icon: Accessibility, title: "Dise\u00F1ado para incluir", text: "Navegaci\u00F3n por teclado, texto ampliable y voz seg\u00FAn compatibilidad.", to: "/sobre-proyecto" }].map(f => <Panel key={f.title}>
<span className="goal-icon">
<f.icon size={24}/>
</span>
<h3>{f.title}</h3>
<p className="muted">{f.text}</p>
<Link to={f.to}>Explorar <ArrowRight size={15}/>
</Link>
</Panel>)}</div>
</section>
{/* Invito al usuario a probar el panel financiero. */}
<section className="landing-cta">
<div>
<p className="eyebrow">EL PRIMER PASO ES TUYO</p>
<h2>Haz que tu dinero acompañe tus planes.</h2>
<p>Prueba el prototipo, conoce tus prioridades y construye el hábito de ahorrar.</p>
</div>
<Link className="primary" to="/dashboard">Probar ControlAhorro IA <ArrowRight size={18}/>
</Link>
</section>
</>;
}
