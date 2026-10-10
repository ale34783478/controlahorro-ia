// Aquí capturo los errores inesperados de las pantallas y muestro una opción para recargar la aplicación.
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
export class ErrorBoundary extends Component<{
    children: ReactNode;
}, {
    failed: boolean;
}> {
    state = { failed: false };
    // Cambio al mensaje de recuperación cuando una pantalla falla.
    static getDerivedStateFromError() {
        return { failed: true };
    }
    // Dejo el detalle del error en la consola para poder revisarlo durante el desarrollo.
    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Error de ControlAhorro", error, info.componentStack);
    }
    render() {
        if (this.state.failed)
            return <main className="empty">
<h1>No se pudo mostrar la aplicación</h1>
<p>Recarga la página para volver a intentar. Si el problema continúa, revisa el almacenamiento del navegador.</p>
<button className="primary" onClick={() => window.location.reload()}>Recargar</button>
</main>;
        return this.props.children;
    }
}
