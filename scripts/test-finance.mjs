// Aquí compruebo que los cálculos, el asistente y el almacenamiento funcionen como espero. Utilizo las herramientas ya instaladas y no necesito nuevas dependencias.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
// Convierto los módulos TypeScript a JavaScript en memoria para probarlos con Node.
const moduleUrl = (path, imports = {}) => {
  let code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 } }).outputText
  for (const [name, url] of Object.entries(imports)) code = code.replaceAll(`'${name}'`, `'${url}'`).replaceAll(`"${name}"`, `"${url}"`)
  return `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
}
const financeUrl = moduleUrl('../src/utils/finance.ts')
const finance = await import(financeUrl)
const typesUrl = moduleUrl('../src/types/finance.ts')
const storage = await import(moduleUrl('../src/services/storage.ts', { '../utils/finance': financeUrl, '../types/finance': typesUrl }))
const { interpret } = await import(moduleUrl('../src/services/assistant.ts', { '../utils/finance': financeUrl }))
// Uso la demostración para comprobar ingresos, gastos y ahorro con resultados conocidos.
const demo = storage.demoData()
assert.equal(finance.sum(demo.movements, 'ingreso'), 2550)
assert.equal(finance.sum(demo.movements, 'gasto'), 850)
assert.equal(finance.saved(demo), 500)
assert.equal(finance.available(demo), 1200)
assert.equal(finance.available({ ...demo, goals: [] }), 1700)
// Verifico que preparar un movimiento no modifique los datos y que confirmarlo sí cambie el saldo.
const before = JSON.stringify(demo)
const pending = interpret('Registra Q50 de transporte', demo)
assert.equal(pending.movement.amount, 50)
assert.equal(pending.movement.category, 'Transporte')
assert.equal(JSON.stringify(demo), before, 'El asistente no guarda sin confirmar')
const confirmed = { ...demo, movements: [...demo.movements, pending.movement] }
assert.equal(finance.available(confirmed), 1150)
assert.equal(interpret('Recibí Q500 de beca', demo).movement.type, 'ingreso')
assert.equal(interpret('Gasté Q35 en comida', demo).movement.category, 'Alimentación')
// Compruebo que los comandos inválidos o incompletos no produzcan movimientos.
for (const command of ['Gasté Q-50 en comida', 'Gasté Q35.999 en comida', 'Gasté Q0 en comida', 'Recibí Q50 en transporte', 'Gasté Q50', 'Gasté en comida']) assert.equal(interpret(command, demo).movement, undefined, command)
assert.ok(interpret('¿Cuánto gasté este mes?', demo).text.includes(finance.money(850)))
assert.ok(interpret('¿Cuánto gasté en alimentación?', demo).text.includes(finance.money(285)))
assert.ok(interpret('Si compro algo de Q300, ¿cuánto dinero me quedará?', demo).text.includes(finance.money(900)))
assert.equal(finance.budgetState(79), 'Dentro del presupuesto')
assert.equal(finance.budgetState(80), 'Cerca del límite')
assert.equal(finance.budgetState(100), 'Superado o agotado')
assert.equal(finance.sum([{ type: 'gasto', amount: .1 }, { type: 'gasto', amount: .2 }], 'gasto'), .3)
// Imito el almacenamiento del navegador para comprobar que puedo guardar, recuperar y detectar datos dañados.
let value = null
globalThis.localStorage = { getItem: () => value, setItem: (_key, data) => { value = data } }
storage.writeData(confirmed)
assert.deepEqual(storage.readData().data, confirmed)
value = '{bad'
assert.ok(storage.readData().warning)
console.log('Pruebas correctas: cálculos, ahorro, comandos, confirmación, límites y persistencia.')
