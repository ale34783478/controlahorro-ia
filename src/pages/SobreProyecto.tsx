// Aquí presento los apartados académicos de Gabriel Velasquez con la información del prompt. Explico la relación del proyecto con la microeconomía sin inventar resultados.
import { BookOpen } from "lucide-react";
import { PageTitle, Panel } from "../components/ui";
export default function SobreProyecto() {
    return <>
<PageTitle title="Sobre el proyecto" description="Sistema de control de gastos para estudiantes universitarios."/>
<div className="academic-banner">
<BookOpen size={30}/>
<div>
<h2>ControlAhorro IA</h2>
<p>Proyecto académico de Microeconomía · Apartados correspondientes a Gabriel Velasquez</p>
<small>Redacción basada en el prompt proporcionado; no se adjuntó el documento académico original.</small>
</div>
</div>
{/* Organizo los cinco apartados académicos: introducción, problema, justificación y objetivos. */}
<article className="academic">
<Panel>
<span className="eyebrow">01 / INTRODUCCIÓN</span>
<h2>Administrar recursos para alcanzar objetivos</h2>
<p>La administración adecuada de los ingresos y gastos constituye una necesidad para los estudiantes universitarios. Muchos disponen de recursos económicos limitados, provenientes de mesadas, becas, trabajos de medio tiempo o aportes familiares, que deben distribuir entre alimentación, transporte, educación y necesidades personales.</p>
<p>ControlAhorro IA se presenta como una propuesta tecnológica que facilita el registro de movimientos financieros, la organización del ahorro y el uso responsable del dinero. Su relación con la microeconomía se encuentra en las decisiones de consumo, la administración de recursos escasos y la capacidad de compra. Contar con información clara permite reconocer prioridades y considerar el costo de oportunidad de cada decisión.</p>
</Panel>
<Panel>
<span className="eyebrow">02 / PLANTEAMIENTO DEL PROBLEMA</span>
<h2>Falta de organización financiera</h2>
<p>Los estudiantes universitarios pueden enfrentar dificultades para organizar sus recursos económicos debido a la falta de hábitos de registro, la ausencia de un presupuesto, los gastos pequeños frecuentes y el desconocimiento del dinero realmente disponible. Estas condiciones dificultan establecer prioridades económicas y distinguir entre necesidades y compras opcionales.</p>
<p>La acumulación de gastos y las compras impulsivas pueden ocasionar dificultades para cubrir compromisos académicos, reducir la capacidad de ahorro y favorecer el endeudamiento. El problema plantea la necesidad de una herramienta que permita registrar, consultar y planificar los recursos de manera sencilla.</p>
</Panel>
<Panel>
<span className="eyebrow">03 / JUSTIFICACIÓN</span>
<h2>Una herramienta accesible para decidir mejor</h2>
<p>Una aplicación web accesible puede contribuir a la administración del dinero al centralizar los registros de ingresos y gastos y presentar información comprensible sobre los recursos disponibles. Los presupuestos y las metas de ahorro pueden apoyar la planificación y el consumo responsable.</p>
<p>El beneficio económico esperado consiste en facilitar la identificación de gastos y la asignación de recursos según las prioridades del estudiante. En el ámbito social, la propuesta busca promover hábitos financieros y ampliar el acceso a herramientas de organización. El asistente mediante texto y voz, junto con las funciones de accesibilidad, puede facilitar su uso por personas con diferentes necesidades, incluyendo trabajadores, familias, adultos mayores y personas con discapacidad visual.</p>
<p>El prototipo permite demostrar la propuesta. No se presentan estadísticas, estudios de mercado ni resultados de evaluación reales.</p>
</Panel>
<Panel>
<span className="eyebrow">04 / OBJETIVO GENERAL</span>
<h2>Organización financiera con apoyo tecnológico</h2>
<p>Proponer una herramienta tecnológica denominada ControlAhorro IA que facilite a los estudiantes universitarios la administración de sus ingresos, gastos y metas de ahorro mediante funciones interactivas, herramientas accesibles y asistencia inteligente.</p>
</Panel>
<Panel>
<span className="eyebrow">05 / OBJETIVOS ESPECÍFICOS</span>
<h2>Del problema al prototipo</h2>
<ol>{["Identificar las principales dificultades que enfrentan los estudiantes universitarios al administrar sus recursos econ\u00F3micos.", "Dise\u00F1ar una interfaz que facilite el registro y clasificaci\u00F3n de ingresos y gastos.", "Establecer herramientas para crear presupuestos y metas de ahorro.", "Incorporar funciones de asistencia mediante voz, texto y herramientas de accesibilidad.", "Evaluar, mediante un prototipo funcional, c\u00F3mo la propuesta podr\u00EDa apoyar la organizaci\u00F3n financiera y las decisiones econ\u00F3micas personales."].map(t => <li key={t}>{t}</li>)}</ol>
</Panel>
</article>
</>;
}
