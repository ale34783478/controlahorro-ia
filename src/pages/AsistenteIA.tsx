// Aquí mantengo la conversación del asistente demostrativo. Muestro sus respuestas, permito usar voz y pido confirmación antes de guardar un movimiento. Esta pantalla sigue disponible por su ruta, aunque la oculto del sidebar.
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Sparkles, Send, Mic, Volume2 } from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { interpret } from "../services/assistant";
import type { Movement } from "../types/finance";
import { useSpeech } from "../hooks/useSpeech";
import { PageTitle, Panel } from "../components/ui";
type Message = {
    id: string;
    role: "user" | "assistant";
    text: string;
};
export default function AsistenteIA() {
    const { data, update, notify } = useFinance();
    const [messages, setMessages] = useState<Message[]>([{ id: "hello", role: "assistant", text: "\u00A1Hola! Soy tu asistente financiero demostrativo. Puedo ayudarte a entender tus registros y preparar movimientos para que los confirmes. \u00BFQu\u00E9 quieres hacer hoy?" }]);
    const [input, setInput] = useState("");
    const [pending, setPending] = useState<Movement>();
    const bottom = useRef<HTMLDivElement>(null);
    const speech = useSpeech(setInput, notify);
    useEffect(() => bottom.current?.scrollIntoView({ block: "nearest" }), [messages]);
    // Envío el texto al motor de reglas y añado la pregunta y la respuesta al chat. Si ya hay un movimiento pendiente, primero pido resolverlo.
    function send(text: string) {
        if (!text.trim())
            return;
        if (pending) {
            notify("Confirma o cancela el movimiento pendiente antes de continuar.");
            return;
        }
        const reply = interpret(text, data);
        setMessages(m => [...m, { id: crypto.randomUUID(), role: "user", text }, { id: crypto.randomUUID(), role: "assistant", text: reply.text }]);
        setPending(reply.movement);
        setInput("");
    }
    // Evito que el formulario recargue la página y proceso el mensaje escrito.
    function submit(e: FormEvent) {
        e.preventDefault();
        send(input);
    }
    // Guardo el movimiento solamente cuando el usuario confirma; si lo cancela, cierro la propuesta sin registrarla.
    function resolve(confirm: boolean) {
        if (confirm && pending) {
            update(d => ({ ...d, movements: [...d.movements, pending] }));
            notify("Movimiento registrado por el asistente.");
        }
        setMessages(m => [...m, { id: crypto.randomUUID(), role: "assistant", text: confirm ? "Movimiento guardado. Tus res\u00FAmenes ya se actualizaron." : "Movimiento cancelado. Puedes escribir otra instrucci\u00F3n." }]);
        setPending(undefined);
    }
    return <>
<PageTitle title="Tu asistente financiero" description="Menos dudas. Más claridad sobre tu dinero."/>
<div className="assistant-layout">
<Panel className="chat-panel">
<div className="chat-heading">
<span className="goal-icon">
<Sparkles size={23}/>
</span>
<div>
<h2>ControlAhorro IA</h2>
<small>Prototipo con reglas programadas · Sin API de IA</small>
</div>
</div>
{/* Muestro el historial y permito escuchar las respuestas si el navegador lo admite. */}
<div className="chat-messages" role="log" aria-live="polite" aria-label="Conversación">{messages.map(m => <div key={m.id} className={`message ${m.role}`}>
<small>{m.role === "user" ? "T\u00FA" : "Asistente"}</small>
<p>{m.text}</p>{m.role === "assistant" && speech.canSpeak && <button className="listen" onClick={() => speech.speak(m.text)} aria-label="Escuchar respuesta">
<Volume2 size={15}/>Escuchar</button>}</div>)}<div ref={bottom}/>
</div>{pending && <div className="confirmation">
<p>El movimiento se guardará solo con tu confirmación.</p>
<div className="actions">
<button className="primary" onClick={() => resolve(true)}>Confirmar registro</button>
<button className="secondary" onClick={() => resolve(false)}>Cancelar</button>
</div>
</div>}{/* Recibo las preguntas escritas o transcritas sin guardar movimientos automáticamente. */}
<form className="chat-input" onSubmit={submit}>
<label className="sr-only" htmlFor="chat-input">Escribe tu consulta</label>
<input id="chat-input" value={input} onChange={e => setInput(e.target.value)} placeholder="Ej. Gasté Q35 en comida" maxLength={300} disabled={!!pending}/>{speech.supported && <button type="button" className="icon-button" disabled={!!pending} onClick={speech.listening ? speech.stop : speech.start} aria-label={speech.listening ? "Detener micr\u00F3fono" : "Activar micr\u00F3fono"}>
<Mic size={20}/>
</button>}<button className="primary" disabled={!!pending || !input.trim()} aria-label="Enviar mensaje">
<Send size={18}/>
</button>
</form>
<p className="muted text-sm">{speech.supported ? (speech.listening ? "Escuchando\u2026 habla y espera la transcripci\u00F3n." : "La voz se transcribe en el campo; revisa el texto antes de enviarlo.") : "Este navegador no admite reconocimiento de voz. Contin\u00FAa mediante texto."}</p>
</Panel>
<div className="stack">
<Panel>
<h2>Prueba una consulta</h2>
{/* Ofrezco ejemplos de instrucciones que el motor de reglas puede reconocer. */}
<div className="suggestions">{["\u00BFCu\u00E1nto dinero tengo disponible?", "\u00BFCu\u00E1nto gast\u00E9 este mes?", "Registra Q50 de transporte", "Recib\u00ED Q500 de beca", "\u00BFCu\u00E1l es mi presupuesto disponible?", "Si compro algo de Q300, \u00BFcu\u00E1nto dinero me quedar\u00E1?"].map(s => <button key={s} disabled={!!pending} onClick={() => send(s)}>{s}</button>)}</div>
</Panel>
<Panel className="assistant-card">
<Sparkles size={23}/>
<h2>Asistencia transparente</h2>
<p>Este prototipo interpreta instrucciones conocidas. Consulta tus datos locales y pide aclaración si falta información.</p>
<p>El reconocimiento de billetes con cámara es una función planificada; no está disponible.</p>
</Panel>
</div>
</div>
</>;
}
