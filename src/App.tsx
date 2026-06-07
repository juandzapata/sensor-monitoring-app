import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ZoneList from './pages/ZoneList';
import ZoneDetail from './pages/ZoneDetail';
import MonitoringForm from './pages/MonitoringForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ZoneList />} />
        <Route path="/zones/:id" element={<ZoneDetail />} />
        <Route path="/monitorings/new" element={<MonitoringForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;