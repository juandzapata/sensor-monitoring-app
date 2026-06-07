import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Sensor, Monitoring } from '../types';
import client from '../api/client';

function ZoneDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [monitorings, setMonitorings] = useState<Monitoring[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [sensorsRes, monitoringsRes] = await Promise.all([
        client.get<Sensor[]>(`/zones/${id}/sensors`),
        client.get<Monitoring[]>(`/monitorings/?zone_id=${id}`),
      ]);
      setSensors(sensorsRes.data);
      setMonitorings(monitoringsRes.data);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const getMonitoring = (sensorId: number) =>
    monitorings.find((m) => m.sensor_id === sensorId);

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '1rem' }}>
        ← Volver
      </button>
      <h1>Sensores de la zona</h1>

      {sensors.length === 0 && <p>No hay sensores activos en esta zona.</p>}

      {sensors.map((sensor) => {
        const monitoring = getMonitoring(sensor.id);
        const supera =
          monitoring &&
          monitoring.valor_actual !== null &&
          monitoring.valor_actual > monitoring.valor_umbral;

        return (
          <div
            key={sensor.id}
            style={{
              border: `2px solid ${supera ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: supera ? '#fef2f2' : '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{sensor.nombre}</h2>
              {monitoring && (
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  backgroundColor: monitoring.estado_monitoreo === 'activo' ? '#d1fae5' : '#f3f4f6',
                  color: monitoring.estado_monitoreo === 'activo' ? '#065f46' : '#6b7280',
                }}>
                  {monitoring.estado_monitoreo}
                </span>
              )}
            </div>

            <p style={{ color: '#666', margin: '0.5rem 0' }}>
              {sensor.fabricante} · {sensor.tipo}
            </p>

            {monitoring && (
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Tipo de lectura:</strong> {monitoring.tipo_lectura}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Umbral:</strong> {monitoring.valor_umbral}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Valor actual:</strong>{' '}
                  <span style={{ color: supera ? '#ef4444' : 'inherit', fontWeight: supera ? 'bold' : 'normal' }}>
                    {monitoring.valor_actual ?? 'Sin lectura'}
                  </span>
                  {supera && ' ⚠️ Supera el umbral'}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ZoneDetail;