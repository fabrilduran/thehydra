import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import PantallaInicio from './components/PantallaInicio';
import Dashboard from './components/Dashboard';
import BuscadorTicker from './components/BuscadorTicker';
import GraficoTicker from './components/GraficoTicker';
import StockChart from './components/StockChart';
import TickerSearch from './components/TickerSearch'; // ✅ Corregido el nombre
import Login from './components/Login';
import RutaPrivada from './components/RutaPrivada';
import Layout from './components/Layout';
import Favoritos from './components/Favoritos';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<PantallaInicio />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas con Layout */}
        <Route element={<RutaPrivada><Layout /></RutaPrivada>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/buscador" element={<BuscadorTicker />} />
          <Route path="/grafico" element={<GraficoTicker />} />
          <Route path="/stockchart" element={<StockChart />} />
          <Route path="/tickersearch/:symbol?" element={<TickerSearch />} />
          <Route path="/favoritos" element={<Favoritos />} />
        </Route>

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<p className="p-4 text-center text-red-600 font-bold">Página no encontrada</p>} />
      </Routes>
    </Router>
  );
}

export default App;
