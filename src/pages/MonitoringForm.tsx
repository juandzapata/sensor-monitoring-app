import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import type { Sensor, Zone, MonitoringCreate } from '../types';
import client from '../api/client';

function MonitoringForm() {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<MonitoringCreate>({
    sensor_id: 0,
    zone_id: 0,
    fecha_instalacion: new Date().toISOString().split('T')[0],
    tipo_lectura: 'temperatura',
    valor_umbral: 0,
    valor_actual: undefined,
    estado_monitoreo: 'activo',
  });

  useEffect(() => {
    const fetchData = async () => {
      const [sensorsRes, zonesRes] = await Promise.all([
        client.get<Sensor[]>('/sensors/'),
        client.get<Zone[]>('/zones/'),
      ]);
      setSensors(sensorsRes.data);
      setZones(zonesRes.data);
      setForm((prev) => ({
        ...prev,
        sensor_id: sensorsRes.data[0]?.id ?? 0,
        zone_id: zonesRes.data[0]?.id ?? 0,
      }));
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'sensor_id' || name === 'zone_id' || name === 'valor_umbral' || name === 'valor_actual'
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      await client.post('/monitorings/', form);
      navigate('/');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response: { data: { detail: string } } };
        setError(axiosErr.response.data.detail);
      } else {
        setError('Error al crear el monitoreo');
      }
    }
  };

  if (loading) return <p className="loading">Cargando...</p>;

  return (
    <main className="app-main app-main--narrow">
      <button className="back-link" onClick={() => navigate('/')}>
        ← Volver
      </button>

      <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>
        Asignar sensor a zona
      </h1>

      {error && <div className="alert-error">{error}</div>}

      <div className="form-fields">
        <div className="form-row">
          <label className="form-label" htmlFor="sensor_id">Sensor</label>
          <select id="sensor_id" name="sensor_id" value={form.sensor_id} onChange={handleChange} className="form-select">
            {sensors.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre} ({s.tipo})</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="zone_id">Zona</label>
          <select id="zone_id" name="zone_id" value={form.zone_id} onChange={handleChange} className="form-select">
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="tipo_lectura">Tipo de lectura</label>
          <select id="tipo_lectura" name="tipo_lectura" value={form.tipo_lectura} onChange={handleChange} className="form-select">
            <option value="temperatura">Temperatura</option>
            <option value="presion">Presión</option>
            <option value="vibracion">Vibración</option>
            <option value="flujo">Flujo</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="valor_umbral">Valor umbral</label>
          <input id="valor_umbral" type="number" name="valor_umbral" value={form.valor_umbral} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="valor_actual">Valor actual (opcional)</label>
          <input id="valor_actual" type="number" name="valor_actual" onChange={handleChange} className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="estado_monitoreo">Estado</label>
          <select id="estado_monitoreo" name="estado_monitoreo" value={form.estado_monitoreo} onChange={handleChange} className="form-select">
            <option value="activo">Activo</option>
            <option value="pausado">Pausado</option>
          </select>
        </div>

        <div className="form-actions">
          <button className="btn btn--submit" onClick={handleSubmit}>
            <CheckCircle size={16} strokeWidth={2} />
            Asignar sensor
          </button>
        </div>
      </div>
    </main>
  );
}

export default MonitoringForm;
