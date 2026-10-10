// Aquí mantengo los datos compartidos de la aplicación. Cuando una pantalla cambia un registro, las demás reciben el mismo estado actualizado.
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { FinanceData } from "../types/finance";
import { demoData, readData, writeData } from "../services/storage";
type ContextValue = {
    data: FinanceData;
    update: (fn: (d: FinanceData) => FinanceData) => void;
    notice: string;
    notify: (s: string) => void;
    reset: () => void;
};
const FinanceContext = createContext<ContextValue | null>(null);
// Cargo el estado inicial una vez y ofrezco los datos y las acciones a todas las pantallas.
export function FinanceProvider({ children }: {
    children: ReactNode;
}) {
    const [initial] = useState(readData);
    const [data, setData] = useState(initial.data);
    const [notice, notify] = useState(initial.warning);
    // Guardo los cambios automáticamente y aviso si el navegador no permite escribirlos.
    useEffect(() => {
        try {
            writeData(data);
        }
        catch {
            notify("No se pudieron guardar los cambios. El almacenamiento puede estar lleno o deshabilitado.");
        }
    }, [data]);
    // Aplico el modo oscuro y el texto ampliado según las preferencias guardadas.
    useEffect(() => {
        document.documentElement.classList.toggle("dark", data.preferences.dark);
        document.documentElement.classList.toggle("large-text", data.preferences.largeText);
    }, [data.preferences]);
    return <FinanceContext.Provider value={{ data, update: setData, notice, notify, reset: () => {
            setData(demoData());
            notify("Datos de demostraci\u00F3n restablecidos.");
        } }}>{children}</FinanceContext.Provider>;
}
// Facilito el acceso al estado compartido y detecto si un componente se usa fuera de su proveedor.
export function useFinance() {
    const value = useContext(FinanceContext);
    if (!value)
        throw new Error("Falta FinanceProvider");
    return value;
}
