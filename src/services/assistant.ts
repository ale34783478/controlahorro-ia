// Aquí interpreto las instrucciones del asistente con reglas programadas. Consulto los datos actuales y preparo movimientos, pero no los guardo sin la confirmación del usuario.
import type { FinanceData, Movement } from "../types/finance";
import { available, currentMonth, money, sum, today, validAmount } from "../utils/finance";
export type Reply = {
    text: string;
    movement?: Movement;
};
// Normalizo el texto para reconocer comandos aunque tengan mayúsculas o tildes, y consulto los movimientos del mes actual.
export function interpret(input: string, data: FinanceData): Reply {
    const text = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const month = data.movements.filter(m => m.date.startsWith(currentMonth()));
    const match = text.match(/(?:q\s*)?(-?\d+(?:[.,]\d+)?)/);
    const amount = match ? Number(match[1].replace(",", ".")) : 0;
    const category = [["Alimentaci\u00F3n", "comida|alimentacion|almuerzo|cena|desayuno"], ["Transporte", "transporte|bus|taxi"], ["Educaci\u00F3n", "educacion|libro|material"], ["Vivienda", "vivienda|alquiler"], ["Servicios", "servicio|internet|luz|agua"], ["Salud", "salud|medicina"], ["Entretenimiento", "entretenimiento|cine"], ["Compras", "compras|ropa"], ["Otros ingresos", "otros ingresos"], ["Otros", "otros"], ["Beca", "beca"], ["Mesada", "mesada"], ["Salario", "salario|sueldo"], ["Apoyo familiar", "apoyo familiar|familia"], ["Ventas", "venta"]].find(([, pattern]) => new RegExp(pattern).test(text))?.[0];
    // Simulo una compra restando su monto del saldo, sin guardar ningún movimiento.
    if (/si compro|si gasto|quedaria|quedara/.test(text))
        return { text: validAmount(amount) ? `Después de una compra de ${money(amount)}, te quedarían ${money(available(data) - amount)} disponibles.${amount > available(data) ? " La compra supera tu saldo disponible." : ""}` : "\u00BFQu\u00E9 monto tendr\u00EDa la compra? Repite tu consulta con el monto." };
    // Consulto cuánto queda en cada presupuesto del mes.
    if (/presupuesto/.test(text)) {
        const budgets = data.budgets.filter(b => b.month === currentMonth());
        return { text: budgets.length ? budgets.map(b => `${b.category}: ${money(b.amount - sum(month.filter(m => m.category === b.category), "gasto"))} disponibles.`).join(" ") : "A\u00FAn no tienes presupuestos para este mes." };
    }
    // Respondo con los gastos del mes o de la categoría identificada.
    if (/cuanto gaste|cuanto he gastado|gastos del mes/.test(text))
        return { text: `${category ? `En ${category.toLowerCase()}` : "Este mes"} has gastado ${money(sum(category ? month.filter(m => m.category === category) : month, "gasto"))}.` };
    // Consulto el saldo real después de apartar los aportes de ahorro.
    if (/disponible|saldo|cuanto dinero tengo/.test(text))
        return { text: `Tienes ${money(available(data))} disponibles, después de apartar tus aportes de ahorro. Ingresos del mes: ${money(sum(month, "ingreso"))}; gastos: ${money(sum(month, "gasto"))}.` };
    // Doy un consejo sencillo según la relación entre ingresos y gastos.
    if (/recomienda|consejo|ahorrar/.test(text))
        return { text: sum(month, "gasto") > sum(month, "ingreso") ? "Tus gastos del mes superan tus ingresos. Revisa los gastos opcionales y define l\u00EDmites por categor\u00EDa." : "Define l\u00EDmites para alimentaci\u00F3n y transporte; aparta aportes para tus metas cuando tengas saldo disponible." };
    // Preparo un registro solamente si reconozco un monto y una categoría compatibles; la confirmación se realiza en la pantalla del chat.
    if (/registra|gaste|recibi|ingreso|gasto/.test(text)) {
        if (!validAmount(amount))
            return { text: "Necesito un monto positivo con hasta dos decimales. Repite la instrucci\u00F3n completa, por ejemplo: \u00ABGast\u00E9 Q35 en comida\u00BB." };
        if (!category)
            return { text: "\u00BFCu\u00E1l es la categor\u00EDa? Repite la instrucci\u00F3n con monto y categor\u00EDa: \u00ABRegistra Q50 de transporte\u00BB." };
        const income = ["Beca", "Mesada", "Salario", "Apoyo familiar", "Ventas", "Otros ingresos"].includes(category);
        if ((/recibi|ingreso/.test(text) && !income) || (/gaste|gasto/.test(text) && income))
            return { text: "El tipo y la categor\u00EDa no coinciden. Usa una categor\u00EDa de ingreso para dinero recibido o de gasto para compras." };
        const movement: Movement = { id: crypto.randomUUID(), type: income ? "ingreso" : "gasto", amount, category, description: input.trim().slice(0, 160), date: today() };
        return { text: `¿Confirmas registrar un ${movement.type} de ${money(amount)} en ${category}?`, movement };
    }
    return { text: "No pude interpretar esa solicitud. Puedo consultar saldo, gastos y presupuestos, simular una compra o preparar un movimiento. Prueba \u00AB\u00BFCu\u00E1nto gast\u00E9 este mes?\u00BB." };
}
