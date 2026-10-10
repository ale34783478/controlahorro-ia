// Aquí defino la forma de los datos que utilizo: movimientos, presupuestos, metas, aportes y preferencias. Así mantengo la misma estructura en toda la aplicación.
export const expenseCategories = ["Alimentaci\u00F3n", "Transporte", "Educaci\u00F3n", "Vivienda", "Servicios", "Salud", "Entretenimiento", "Compras", "Otros"] as const;
export const incomeCategories = ["Salario", "Beca", "Mesada", "Apoyo familiar", "Ventas", "Otros ingresos"] as const;
export type Movement = {
    id: string;
    type: "ingreso" | "gasto";
    amount: number;
    category: string;
    description: string;
    date: string;
};
export type Budget = {
    id: string;
    category: string;
    amount: number;
    month: string;
};
export type Contribution = {
    id: string;
    amount: number;
    date: string;
};
export type Goal = {
    id: string;
    name: string;
    description: string;
    target: number;
    deadline: string;
    contributions: Contribution[];
};
export type FinanceData = {
    movements: Movement[];
    budgets: Budget[];
    goals: Goal[];
    preferences: {
        largeText: boolean;
        dark: boolean;
    };
};
