// Aquí conecto las funciones de voz del navegador. Compruebo su compatibilidad, transcribo lo que escucha el micrófono y leo las respuestas cuando existe soporte.
import { useEffect, useRef, useState } from "react";
type Recognition = {
    lang: string;
    interimResults: boolean;
    onresult: ((e: {
        results: {
            [index: number]: {
                [index: number]: {
                    transcript: string;
                };
            };
        };
    }) => void) | null;
    onerror: ((e: {
        error: string;
    }) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
};
type SpeechWindow = Window & {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
};
// Preparo el micrófono si el navegador lo admite. Dejo el texto reconocido en el campo para que el usuario pueda revisarlo antes de enviarlo.
export function useSpeech(onText: (text: string) => void, onError: (text: string) => void) {
    const [listening, setListening] = useState(false);
    const ref = useRef<Recognition | null>(null);
    const browser = window as SpeechWindow;
    const Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
    useEffect(() => () => {
        ref.current?.stop();
        window.speechSynthesis?.cancel();
    }, []);
    function start() {
        if (!Constructor)
            return;
        const recognition = new Constructor();
        recognition.lang = "es-GT";
        recognition.interimResults = false;
        recognition.onresult = e => onText(e.results[0][0].transcript);
        recognition.onerror = e => {
            onError(`No se pudo reconocer la voz (${e.error}). Puedes continuar escribiendo.`);
            setListening(false);
        };
        recognition.onend = () => setListening(false);
        ref.current = recognition;
        try {
            recognition.start();
            setListening(true);
        }
        catch {
            onError("No se pudo iniciar el micr\u00F3fono. Revisa sus permisos.");
        }
    }
    return { supported: !!Constructor, listening, start, stop: () => ref.current?.stop(), canSpeak: "speechSynthesis" in window, speak: (text: string) => {
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = "es-GT";
                window.speechSynthesis.speak(utterance);
            }
        } };
}
