export interface Sensor {
  id: number;
  nombre: string;
  tipo: string;
  fabricante: string;
  fecha_fabricacion: string;
}

export interface Zone {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  estado_operativo: string;
}

export interface Monitoring {
  id: number;
  sensor_id: number;
  zone_id: number;
  fecha_instalacion: string;
  tipo_lectura: string;
  valor_umbral: number;
  valor_actual: number | null;
  estado_monitoreo: string;
}

// Solo los necesario. No se hará nada más que consultar y crear un monitoring por ahora
export interface MonitoringCreate {
  sensor_id: number;
  zone_id: number;
  fecha_instalacion: string;
  tipo_lectura: string;
  valor_umbral: number;
  valor_actual?: number;
  estado_monitoreo: string;
}