import { useState } from 'react';
import { SectionTitle } from '../atoms/SectionTitle';
import { Button } from '../atoms/Button';
import { FormRow } from '../molecules/FormRow';

export function ConfigSidebar({ config, onConfigChange, onRun }) {
  const [permitirRotacion, setPermitirRotacion] = useState(true);
  const [piezasActivas, setPiezasActivas] = useState({
    'Pierna Delantera': true,
    'Pierna Trasera': true,
    'Pretina': true,
    'Bolsillos': true
  });

  const togglePieza = (nombre) => {
    setPiezasActivas(prev => ({...prev, [nombre]: !prev[nombre]}));
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 p-4 flex flex-col h-full overflow-y-auto shadow-sm shrink-0">
      <h2 className="text-xl font-black text-blue-800 mb-2">OptiPantalon</h2>
      
      <SectionTitle text="Dimensiones Tela" />
      <FormRow label="Ancho (cm):" value={config.ancho} min={50} max={400} step={10} 
        onChange={(v) => onConfigChange({...config, ancho: v})} />
      <FormRow label="Largo (cm):" value={config.largo} min={100} max={600} step={10} 
        onChange={(v) => onConfigChange({...config, largo: v})} />

      <SectionTitle text="Catalogo de Piezas" />
      <div className="flex flex-col gap-1.5 mb-2">
        {Object.entries(piezasActivas).map(([nombre, activa]) => (
          <label key={nombre} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600">
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
      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
        <input 
          type="checkbox" 
          checked={permitirRotacion}
          onChange={(e) => setPermitirRotacion(e.target.checked)}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        Permitir rotacion de 90 grados
      </label>

      <SectionTitle text="Parametros AG" />
      <FormRow label="Poblacion:" value={config.poblacion} min={20} max={500} step={10} 
        onChange={(v) => onConfigChange({...config, poblacion: v})} />
      <FormRow label="Generaciones:" value={config.generaciones} min={50} max={2000} step={50} 
        onChange={(v) => onConfigChange({...config, generaciones: v})} />
      <FormRow label="Tasa de cruza:" value={config.tasaCruza} min={0.1} max={1.0} step={0.05} 
        onChange={(v) => onConfigChange({...config, tasaCruza: v})} />
      <FormRow label="Tasa mutacion:" value={config.tasaMutacion} min={0.01} max={0.5} step={0.05} 
        onChange={(v) => onConfigChange({...config, tasaMutacion: v})} />

      <div className="mt-8 gap-3 flex flex-col">
        <Button onClick={onRun} variant="primary">EJECUTAR AG</Button>
        <Button variant="secondary">Exportar CSV</Button>
      </div>
    </aside>
  );
}