import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '1rem' }}>
        ← Volver
      </button>
      <h1>Asignar sensor a zona</h1>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #ef4444', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', color: '#991b1b' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Sensor
          <select name="sensor_id" value={form.sensor_id} onChange={handleChange} style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px' }}>
            {sensors.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre} ({s.tipo})</option>
            ))}
          </select>
        </label>

        <label>
          Zona
          <select name="zone_id" value={form.zone_id} onChange={handleChange} style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px' }}>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.nombre}</option>
            ))}
          </select>
        </label>

        <label>
          Tipo de lectura
          <select name="tipo_lectura" value={form.tipo_lectura} onChange={handleChange} style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px' }}>
            <option value="temperatura">Temperatura</option>
            <option value="presion">Presión</option>
            <option value="vibracion">Vibración</option>
            <option value="flujo">Flujo</option>
          </select>
        </label>

        <label>
          Valor umbral
          <input type="number" name="valor_umbral" value={form.valor_umbral} onChange={handleChange} style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px' }} />
        </label>

        <label>
          Valor actual (opcional)
          <input type="number" name="valor_actual" onChange={handleChange} style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px' }} />
        </label>

        <label>
          Estado
          <select name="estado_monitoreo" value={form.estado_monitoreo} onChange={handleChange} style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px' }}>
            <option value="activo">Activo</option>
            <option value="pausado">Pausado</option>
          </select>
        </label>

        <button onClick={handleSubmit} style={{ padding: '10px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>
          Asignar
        </button>
      </div>
    </div>
  );
}

export default MonitoringForm;