import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import type { Zone, Sensor } from '../types';

interface ZoneWithCount extends Zone {
  active_sensors: number;
}

function badgeClass(estado: string) {
  if (estado === 'operativa') return 'badge badge--ok';
  if (estado === 'mantenimiento') return 'badge badge--warn';
  return 'badge badge--danger';
}

function ZoneList() {
  const [zones, setZones] = useState<ZoneWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchZones = async () => {
      const { data } = await client.get<Zone[]>('/zones/');

      const zonesWithCount = await Promise.all(
        data.map(async (zone) => {
          const { data: sensors } = await client.get<Sensor[]>(
            `/zones/${zone.id}/sensors`
          );
          return { ...zone, active_sensors: sensors.length };
        })
      );

      setZones(zonesWithCount);
      console.log(zonesWithCount);
      setLoading(false);
    };

    fetchZones();
  }, []);

  if (loading) return <p className="loading">Cargando zonas...</p>;

  return (
    <main className="app-main">
      <div className="page-header">
        <h1 className="page-title">Zonas de Monitoreo</h1>
        <button className="btn" onClick={() => navigate('/monitorings/new')}>
          + Asignar sensor
        </button>
      </div>

      {zones.map((zone) => (
        <div
          key={zone.id}
          className="card card--clickable"
          onClick={() => navigate(`/zones/${zone.id}`)}
        >
          <div className="card-header">
            <span className="card-title">{zone.nombre}</span>
            <span className={badgeClass(zone.estado_operativo)}>
              {zone.estado_operativo}
            </span>
          </div>
          <p className="card-meta">{zone.ubicacion}</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            <strong style={{ color: 'var(--text-h)' }}>{zone.active_sensors}</strong>{' '}
            sensor{zone.active_sensors !== 1 ? 'es' : ''} activo{zone.active_sensors !== 1 ? 's' : ''}
          </p>
        </div>
      ))}
    </main>
  );
}

export default ZoneList;
