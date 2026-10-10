# ControlAhorro IA

Frontend académico del curso de Microeconomía: sistema de control de gastos para estudiantes universitarios. Desarrollado sobre el proyecto Vite existente, sin backend ni variables de entorno.

## Ejecución local

Con Node.js compatible con la versión de Vite instalada (consulta `node_modules/vite/package.json`, campo `engines`):

```sh
npm install
npm run dev
```

Las dependencias ya están instaladas en este proyecto; no hace falta reinstalarlas. Abre la dirección que Vite muestra en la terminal. En PowerShell, si la política de ejecución bloquea `npm.ps1`, usa `npm.cmd run dev`.

```sh
npm run build
npm run preview
node scripts/test-finance.mjs
```

`build` verifica TypeScript y genera `dist`. `preview` sirve esa compilación para revisión local. Las pruebas verifican cálculos, aportes, comandos del asistente, confirmación, semáforo y persistencia.

## Funcionalidades

- Inicio con presentación del problema, solución, beneficios y vista previa calculada con los registros actuales.
- Sobre el proyecto: introducción, planteamiento del problema, justificación, objetivo general y cinco objetivos específicos correspondientes a Gabriel Velasquez. Se redactaron a partir del prompt: no se proporcionó el documento académico original.
- Dashboard: ingresos y gastos del mes actual, saldo acumulado disponible, ahorro aportado, uso de presupuestos, últimos movimientos y metas.
- Movimientos: crear, editar, eliminar con confirmación, buscar, filtrar por tipo y categoría y ordenar por fecha. Montos positivos con hasta dos decimales; fechas sin registros futuros.
- Presupuestos mensuales por categoría: guardar también actualiza el límite existente. Verde <80%, amarillo 80–99%, rojo >=100%; estados acompañados de texto e iconos.
- Metas: crear, editar, eliminar con confirmación, aportar, ver historial y progreso. Fecha límite opcional.
- Reportes por período: ingresos/gastos mensuales, categorías y evolución del saldo. Gráficas Recharts con información actualizada y resúmenes textuales.
- Asistente basado en reglas: consultas, recomendaciones sencillas, simulación de compra y preparación de movimientos con confirmación explícita.
- Web Speech API: micrófono cuando el navegador lo ofrece y lectura de respuestas cuando existe síntesis de voz. La transcripción se revisa antes de enviarse.
- Menú móvil, etiquetas accesibles, foco visible, navegación por teclado, texto ampliable y modo oscuro persistente.
- Datos de demostración coherentes con el mes actual y restablecimiento con confirmación.

## Modelo financiero

Todos los montos se muestran en quetzales (GTQ). Los totales de registros se suman en centavos para reducir errores de punto flotante.

- **Saldo disponible = ingresos acumulados − gastos acumulados − aportes de ahorro.**
- **Ahorro registrado = suma de aportes explícitos a las metas.** No se convierte automáticamente el saldo en ahorro.
- Aportar aparta dinero disponible; no crea un gasto de consumo. El aporte no puede superar el saldo disponible. Eliminar una meta devuelve sus aportes al saldo.
- Los gastos se pueden registrar aunque produzcan un saldo negativo: la herramienta debe reflejar gastos reales. Editar o eliminar ingresos también puede producir saldo negativo.
- Ingresos y gastos del dashboard corresponden al mes actual; saldo y ahorro son acumulados.
- El uso global del presupuesto compara gastos de categorías con límite asignado contra el total asignado. Los gastos sin presupuesto aparecen en el total de gastos, pero no en ese porcentaje.
- La evolución del saldo del reporte es ingresos menos gastos antes de apartar ahorro, e incluye el saldo inicial anterior al período. El gráfico lo indica explícitamente.

## Ejemplos para el asistente

- `Registra Q50 de transporte`
- `Gasté Q35 en comida`
- `Recibí Q500 de beca`
- `¿Cuánto dinero tengo disponible?`
- `¿Cuánto gasté este mes?`
- `¿Cuánto gasté en alimentación?`
- `¿Cuál es mi presupuesto disponible?`
- `Si compro algo de Q300, ¿cuánto dinero me quedará?`

Si falta el monto o la categoría, pide repetir la instrucción completa con esa información. No utiliza IA generativa ni inventa datos. El motor está separado en `src/services/assistant.ts` para poder reemplazarlo posteriormente.

## Persistencia y límites

Los registros y preferencias se guardan en `localStorage` bajo `controlahorro-v1`, en el navegador y origen actuales. No hay cuentas, sincronización entre dispositivos, conexión bancaria, pagos ni credenciales. Limpiar el almacenamiento puede borrar todos los datos. Cambiar de puerto/origen también cambia el almacenamiento disponible.

El chat es temporal; los movimientos confirmados sí persisten. Los errores de lectura o escritura se notifican. Si el almacenamiento no es válido se carga la demostración. La voz requiere soporte real y permisos; algunos navegadores usan servicios propios de reconocimiento y pueden necesitar conexión. La identificación de billetes mediante cámara es únicamente una función futura.

## Estructura y tecnologías

React + TypeScript + Vite, Tailwind CSS mediante `@tailwindcss/vite`, React Router, Lucide React y Recharts. Sin nuevas dependencias.

- `src/pages`: vistas de cada módulo.
- `src/components`: navegación, UI, formularios, gráficas y manejo de errores.
- `src/context`: estado compartido y preferencias.
- `src/services`: persistencia y motor del asistente.
- `src/hooks`: integración con voz.
- `src/types` y `src/utils`: modelos y cálculos financieros.
- `scripts/test-finance.mjs`: comprobaciones de lógica usando TypeScript instalado y Node.

## Despliegue posterior en Vercel

1. Sube este proyecto a un repositorio e impórtalo en Vercel.
2. Selecciona Vite, comando de compilación `npm run build` y directorio de salida `dist`.
3. No agregues variables de entorno; el prototipo no las necesita.
4. Conserva `vercel.json`: reescribe las rutas de la aplicación a `index.html` para permitir abrir y recargar rutas como `/metas` y `/reportes`.
5. Comprueba navegación, formularios y persistencia desde escritorio y teléfono.

No se realizó ningún despliegue. La persistencia de la versión desplegada será independiente de los datos guardados en localhost.

## Cómo organizo la configuración

Explico estos archivos aquí porque JSON no admite comentarios:

- En `package.json` defino las dependencias y los comandos para iniciar, compilar y revisar el proyecto.
- En `tsconfig.json` conecto las configuraciones de TypeScript de la aplicación y de las herramientas.
- En `tsconfig.app.json` configuro la revisión de tipos del código React y detecto variables o parámetros sin usar.
- En `tsconfig.node.json` configuro la revisión del archivo de Vite que se ejecuta con Node.
- En `.oxlintrc.json` defino las reglas de revisión de código de Oxlint.
- En `vercel.json` dirijo las rutas de la aplicación a `index.html` para permitir recargar sus pantallas al desplegar.
- Conservo `package-lock.json` como registro automático de las versiones instaladas; no lo comento ni lo edito manualmente.
