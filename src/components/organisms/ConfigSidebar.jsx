import { SectionTitle } from '../atoms/SectionTitle';
import { Button } from '../atoms/Button';
import { FormRow } from '../molecules/FormRow';

// Mapeo entre etiquetas del UI y nombres reales del catálogo del backend
const PIEZAS_MAP = {
  'Pierna Delantera': ['Pierna_Delantera_Izq', 'Pierna_Delantera_Der'],
  'Pierna Trasera':   ['Pierna_Trasera_Izq',   'Pierna_Trasera_Der'],
  'Pretina':          ['Pretina'],
  'Bolsillos':        ['Bolsa_Delantera_Izq', 'Bolsa_Delantera_Der',
                       'Bolsa_Trasera_Izq',   'Bolsa_Trasera_Der', 'Cierre'],
};

// Estado inicial: todas las piezas activas
const PIEZAS_INICIAL = {
  'Pierna Delantera': true,
  'Pierna Trasera':   true,
  'Pretina':          true,
  'Bolsillos':        true,
};

/**
 * Convierte el estado del UI { 'Pretina': false, ... }
 * en la lista de nombres reales que espera el backend.
 * Si todas están activas devuelve undefined (el backend usa el catálogo completo).
 */
function buildPiezasActivas(piezasUI) {
  const todasActivas = Object.values(piezasUI).every(Boolean);
  if (todasActivas) return undefined;

  return Object.entries(piezasUI)
    .filter(([, activa]) => activa)
    .flatMap(([nombre]) => PIEZAS_MAP[nombre]);
}

export function ConfigSidebar({ config, onConfigChange, onRun, disabled }) {

  // Lee el estado de piezas activas desde config (fuente de verdad única)
  // Si no existe aún, todas están activas
  const piezasUI = config.piezasUI ?? PIEZAS_INICIAL;

  const togglePieza = (nombre) => {
    const nuevasPiezas = { ...piezasUI, [nombre]: !piezasUI[nombre] };
    onConfigChange({
      ...config,
      piezasUI:      nuevasPiezas,
      piezasActivas: buildPiezasActivas(nuevasPiezas),
    });
  };

  const toggleRotacion = (e) => {
    onConfigChange({ ...config, rotacion: e.target.checked });
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 p-4 flex flex-col h-full overflow-y-auto shadow-sm shrink-0">
      <h2 className="text-xl font-black text-blue-800 mb-2">OptiPantalon</h2>

      <SectionTitle text="Dimensiones Tela" />
      <FormRow label="Ancho (cm):"  value={config.ancho}       min={50}  max={400}  step={10}
        onChange={(v) => onConfigChange({ ...config, ancho: v })} />
      <FormRow label="Largo (cm):"  value={config.largoMaximo} min={100} max={2000} step={10}
        onChange={(v) => onConfigChange({ ...config, largoMaximo: v })} />

      <SectionTitle text="Catalogo de Piezas" />
      <div className="flex flex-col gap-1.5 mb-2">
        {Object.entries(piezasUI).map(([nombre, activa]) => (
          <label key={nombre}
                 className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600">
            <input
              type="checkbox"
              checked={activa}
              onChange={() => togglePieza(nombre)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            {nombre}
          </label>
        ))}
      </div>

      <SectionTitle text="Reglas de Acomodo" />
      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer mb-2">
        <input
          type="checkbox"
          checked={config.rotacion ?? true}
          onChange={toggleRotacion}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        Permitir rotacion de 90 grados
      </label>

      <SectionTitle text="Parametros AG" />
      <FormRow label="Poblacion:"     value={config.poblacion}    min={20}   max={500}  step={10}
        onChange={(v) => onConfigChange({ ...config, poblacion: v })} />
      <FormRow label="Generaciones:"  value={config.generaciones} min={50}   max={2000} step={50}
        onChange={(v) => onConfigChange({ ...config, generaciones: v })} />
      <FormRow label="Tasa de cruza:" value={config.tasaCruza}    min={0.1}  max={1.0}  step={0.05}
        onChange={(v) => onConfigChange({ ...config, tasaCruza: v })} />
      <FormRow label="Tasa mutacion:" value={config.tasaMutacion} min={0.01} max={0.5}  step={0.05}
        onChange={(v) => onConfigChange({ ...config, tasaMutacion: v })} />

      <div className="mt-8 gap-3 flex flex-col">
        <Button onClick={onRun} variant="primary" disabled={disabled}>
          EJECUTAR AG
        </Button>
        <Button variant="secondary">Exportar CSV</Button>
      </div>
    </aside>
  );
}