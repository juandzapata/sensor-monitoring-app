import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import type { Zone, Sensor } from '../types';

interface ZoneWithCount extends Zone {
  active_sensors: number;
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

  if (loading) return <p>Cargando zonas...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Zonas de Monitoreo</h1>
        <button onClick={() => navigate('/monitorings/new')}>
          + Asignar sensor
        </button>
      </div>

      {zones.map((zone) => (
        <div
          key={zone.id}
          onClick={() => navigate(`/zones/${zone.id}`)}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>{zone.nombre}</h2>
            <span style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              backgroundColor:
                zone.estado_operativo === 'operativa' ? '#d1fae5' :
                zone.estado_operativo === 'mantenimiento' ? '#fef3c7' : '#fee2e2',
              color:
                zone.estado_operativo === 'operativa' ? '#065f46' :
                zone.estado_operativo === 'mantenimiento' ? '#92400e' : '#991b1b',
            }}>
              {zone.estado_operativo}
            </span>
          </div>
          <p style={{ color: '#666', margin: '0.5rem 0' }}>{zone.ubicacion}</p>
          <p style={{ margin: 0 }}>
            <strong>{zone.active_sensors}</strong> sensor{zone.active_sensors !== 1 ? 'es' : ''} activo{zone.active_sensors !== 1 ? 's' : ''}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ZoneList;