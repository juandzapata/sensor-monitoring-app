import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
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

  if (loading) return <p className="loading">Cargando...</p>;

  return (
    <main className="app-main">
      <button className="back-link" onClick={() => navigate('/')}>
        ← Volver
      </button>

      <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>
        Sensores de la zona
      </h1>

      {sensors.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No hay sensores activos en esta zona.</p>
      )}

      {sensors.map((sensor) => {
        const monitoring = getMonitoring(sensor.id);
        const supera =
          monitoring &&
          monitoring.valor_actual !== null &&
          monitoring.valor_actual > monitoring.valor_umbral;

        return (
          <div key={sensor.id} className={`card${supera ? ' card--alert' : ''}`}>
            <div className="card-header">
              <span className="card-title">{sensor.nombre}</span>
              {monitoring && (
                <span className={monitoring.estado_monitoreo === 'activo' ? 'badge badge--ok' : 'badge badge--neutral'}>
                  {monitoring.estado_monitoreo}
                </span>
              )}
            </div>

            <p className="card-meta">
              {sensor.fabricante} · {sensor.tipo}
            </p>

            {monitoring && (
              <div className="card-body">
                <p><strong>Tipo de lectura:</strong> {monitoring.tipo_lectura}</p>
                <p><strong>Umbral:</strong> {monitoring.valor_umbral}</p>
                <p>
                  <strong>Valor actual:</strong>{' '}
                  <span className={supera ? 'value--danger' : ''}>
                    {monitoring.valor_actual ?? 'Sin lectura'}
                  </span>
                  {supera && (
                    <span className="threshold-warning">
                      <AlertTriangle size={13} strokeWidth={2.5} />
                      Supera el umbral
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </main>
  );
}

export default ZoneDetail;
