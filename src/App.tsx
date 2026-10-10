// Aquí organizo las rutas de la aplicación. Comparto los datos financieros entre las pantallas y uso el mismo diseño de navegación para todas.
import { BrowserRouter, Route, Routes, Link } from "react-router";
import { FinanceProvider } from "./context/FinanceContext";
import Layout from "./components/Layout";
import Inicio from "./pages/Inicio";
import SobreProyecto from "./pages/SobreProyecto";
import Dashboard from "./pages/Dashboard";
import Movimientos from "./pages/Movimientos";
import Presupuestos from "./pages/Presupuestos";
import MetasAhorro from "./pages/MetasAhorro";
import Reportes from "./pages/Reportes";
import AsistenteIA from "./pages/AsistenteIA";
export default function App() {
    return <FinanceProvider>
<BrowserRouter>
<Routes>
<Route element={<Layout />}>
<Route index element={<Inicio />}/>
<Route path="sobre-proyecto" element={<SobreProyecto />}/>
<Route path="dashboard" element={<Dashboard />}/>
<Route path="movimientos" element={<Movimientos />}/>
<Route path="presupuestos" element={<Presupuestos />}/>
<Route path="metas" element={<MetasAhorro />}/>
<Route path="reportes" element={<Reportes />}/>
<Route path="asistente" element={<AsistenteIA />}/>
<Route path="*" element={<div className="empty">
<h1>Página no encontrada</h1>
<Link className="primary" to="/">Volver al inicio</Link>
</div>}/>
</Route>
</Routes>
</BrowserRouter>
</FinanceProvider>;
}
