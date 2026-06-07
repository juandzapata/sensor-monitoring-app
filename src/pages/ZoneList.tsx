import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Radio } from 'lucide-react';
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
      setLoading(false);
    };

    fetchZones();
  }, []);

  if (loading) return <p className="loading">Cargando zonas...</p>;

  const totalSensores = zones.reduce((sum, z) => sum + z.active_sensors, 0);

  return (
    <main className="app-main">
      {/* Sistema identity banner */}
      <div className="system-banner">
        <div className="system-banner__text">
          <h2 className="system-banner__title">Sistema de Monitoreo Industrial</h2>
          <p className="system-banner__subtitle">Supervisión en tiempo real de zonas y sensores de la planta</p>
        </div>
      </div>

      {/* Summary counters */}
      <div className="summary-strip">
        <div className="summary-stat">
          <span className="summary-stat__value">{zones.length}</span>
          <span className="summary-stat__label">Zonas registradas</span>
        </div>
        <div className="summary-stat__divider" />
        <div className="summary-stat">
          <span className="summary-stat__value">{totalSensores}</span>
          <span className="summary-stat__label">Sensores activos en planta</span>
        </div>
        <div className="summary-stat__divider" />
        <div className="summary-stat">
          <span className="summary-stat__value">
            {zones.filter((z) => z.estado_operativo === 'operativa').length}
          </span>
          <span className="summary-stat__label">Zonas operativas</span>
        </div>
      </div>

      {/* List header */}
      <div className="page-header">
        <h1 className="page-title">Zonas de Monitoreo</h1>
        <button className="btn" onClick={() => navigate('/monitorings/new')}>
          + Asignar sensor
        </button>
      </div>

      {/* Empty state */}
      {zones.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">
          <Radio size={48} strokeWidth={1.5} />
        </div>
          <h3 className="empty-state__title">No hay zonas registradas</h3>
          <p className="empty-state__desc">
            Aún no se han configurado zonas de monitoreo en el sistema.
            Contacta al administrador para añadir zonas.
          </p>
        </div>
      )}

      {/* Zone cards */}
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

          {zone.descripcion && (
            <p className="card-description">{zone.descripcion}</p>
          )}

          <div className="card-footer">
            <span className="card-meta card-meta--icon">
              <MapPin size={13} strokeWidth={2} />
              {zone.ubicacion}
            </span>
            <span className="card-sensor-count">
              <strong>{zone.active_sensors}</strong>{' '}
              sensor{zone.active_sensors !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>
      ))}
    </main>
  );
}

export default ZoneList;
