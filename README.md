# Sensor Monitoring App

Frontend del Sistema de Monitoreo Industrial de Tecnimatica. Permite supervisar zonas de la planta, ver sensores asignados y registrar nuevos monitoreos.

## Stack

- React 19 + TypeScript
- Vite
- React Router v7
- Axios
- Lucide React (iconos)

## Requisitos

- Node.js 18+
- Backend corriendo en `http://localhost:8000`

## Instalación

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción (`tsc` + Vite) |
| `npm run preview` | Previsualizar build de producción |
| `npm run lint` | ESLint sobre todo el proyecto |

## Estructura

```
src/
├── api/
│   └── client.ts          # Instancia de Axios (baseURL: localhost:8000)
├── components/
│   └── Header.tsx         # Barra superior con logo Tecnimatica
├── pages/
│   ├── ZoneList.tsx       # Home: listado de zonas con conteo de sensores
│   ├── ZoneDetail.tsx     # Detalle de zona: sensores y alertas de umbral
│   └── MonitoringForm.tsx # Formulario para asignar sensor a zona
├── types/
│   └── index.ts           # Interfaces: Sensor, Zone, Monitoring, MonitoringCreate
└── App.tsx                # Router principal
```

## Rutas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | ZoneList | Listado de zonas con estado operativo y cantidad de sensores |
| `/zones/:id` | ZoneDetail | Sensores de una zona con valores actuales y alertas de umbral |
| `/monitorings/new` | MonitoringForm | Asignar sensor a zona (crea un monitoring) |

## API esperada

El cliente apunta a `http://localhost:8000`. Endpoints consumidos:

| Método | Endpoint | Uso |
|--------|----------|-----|
| GET | `/zones/` | Listar zonas |
| GET | `/zones/:id/sensors` | Sensores de una zona |
| GET | `/monitorings/?zone_id=:id` | Monitoreos de una zona |
| GET | `/sensors/` | Listar todos los sensores |
| POST | `/monitorings/` | Crear monitoreo nuevo |

## Modelos principales

```ts
interface Sensor {
  id: number; nombre: string; tipo: string;
  fabricante: string; fecha_fabricacion: string;
}

interface Zone {
  id: number; nombre: string; descripcion: string;
  ubicacion: string; estado_operativo: string;
}

interface Monitoring {
  id: number; sensor_id: number; zone_id: number;
  fecha_instalacion: string; tipo_lectura: string;
  valor_umbral: number; valor_actual: number | null;
  estado_monitoreo: string;
}
```

## Funcionalidades

- Resumen global: total de zonas, sensores activos y zonas operativas
- Badges de estado por zona (`operativa` / `mantenimiento` / otros)
- Alerta visual en tarjeta de sensor cuando `valor_actual > valor_umbral`
- Formulario con tipos de lectura: temperatura, presión, vibración, flujo
