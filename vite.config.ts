// Aquí activo React y Tailwind en Vite para desarrollar la aplicación y generar su versi?n de producci?n.
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
