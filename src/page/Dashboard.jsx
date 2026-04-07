import { useState } from 'react';
import { ConfigSidebar } from '../components/organisms/ConfigSidebar';
import { FitnessChart } from '../components/organisms/FitnessChart';
import { optimizar } from '../api/optipantalon';

const COLORES = [
  "#E53935", "#1E88E5", "#43A047", "#FB8C00", "#8E24AA",
  "#00ACC1", "#E91E63", "#6D4C41", "#3949AB", "#00897B",
];

export default function Dashboard() {
  const [config, setConfig] = useState({
    ancho:        150,
    largoMaximo:  300,
    rotacion:     true,
    poblacion:    50,
    generaciones: 100,
    tasaCruza:    0.8,
    tasaMutacion: 0.15,
  });

  const [activeTab,  setActiveTab]  = useState(0);
  const [resultado,  setResultado]  = useState(null);
  const [cargando,   setCargando]   = useState(false);
  const [error,      setError]      = useState(null);

  const handleRunAlgorithm = async () => {
    setCargando(true);
    setError(null);
    setResultado(null);
    setActiveTab(0);
    try {
      const data = await optimizar(config);
      setResultado(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  const solucionActiva = resultado?.soluciones?.[activeTab] ?? null;

  const fitnessData = resultado?.historial_fitness?.map((h) => ({
    generacion: h.generacion,
    mejor:      h.mejor,
    promedio:   h.promedio,
    peor:       h.peor,
  })) ?? [];

  const renderCanvas = () => {
    if (cargando) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-500 text-sm">Ejecutando algoritmo genético...</span>
          </div>
        </div>
      );
    }

    if (!solucionActiva) {
      return <span className="text-slate-400">Esperando ejecucion del algoritmo...</span>;
    }

    const rollo_ancho  = resultado.rollo_ancho;
    const largo_usado  = solucionActiva.metricas.v1_largo_usado_cm;
    const largo_dibujo = Math.max(largo_usado * 1.05, 50);

    const PADDING = 20;
    const SVG_W   = 700;
    const SVG_H   = 500;
    const escalaX = (SVG_W - PADDING * 2) / rollo_ancho;
    const escalaY = (SVG_H - PADDING * 2) / largo_dibujo;

    return (
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full"
           style={{ fontFamily: "monospace" }}>

        {/* Fondo del rollo */}
        <rect x={PADDING} y={PADDING}
              width={rollo_ancho * escalaX}
              height={largo_dibujo * escalaY}
              fill="#EFF6FF" stroke="#93C5FD" strokeWidth={1.5} />

        {/* Línea punteada de largo usado */}
        <line
          x1={PADDING} y1={PADDING + largo_usado * escalaY}
          x2={PADDING + rollo_ancho * escalaX} y2={PADDING + largo_usado * escalaY}
          stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="6,3"
        />
        <text
          x={PADDING + rollo_ancho * escalaX + 4}
          y={PADDING + largo_usado * escalaY + 4}
          fontSize={9} fill="#F59E0B" fontWeight="bold"
        >
          {largo_usado.toFixed(1)} cm
        </text>

        {/* Cuadrícula */}
        {Array.from({ length: Math.floor(rollo_ancho / 10) }, (_, i) => (
          <line key={`vg${i}`}
            x1={PADDING + (i+1)*10*escalaX} y1={PADDING}
            x2={PADDING + (i+1)*10*escalaX} y2={PADDING + largo_dibujo*escalaY}
            stroke="#BFDBFE" strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.floor(largo_dibujo / 10) }, (_, i) => (
          <line key={`hg${i}`}
            x1={PADDING} y1={PADDING + (i+1)*10*escalaY}
            x2={PADDING + rollo_ancho*escalaX} y2={PADDING + (i+1)*10*escalaY}
            stroke="#BFDBFE" strokeWidth={0.5} />
        ))}

        {/* Piezas */}
        {solucionActiva.colocaciones.map((pl, i) => {
          const rx = PADDING + pl.x * escalaX;
          const ry = PADDING + pl.y * escalaY;
          const rw = pl.ancho * escalaX;
          const rh = pl.alto  * escalaY;
          const color = COLORES[i % COLORES.length];
          return (
            <g key={pl.pieza}>
              <rect x={rx} y={ry} width={rw} height={rh}
                    fill={color} fillOpacity={0.85}
                    stroke="white" strokeWidth={1.2} rx={2} />
              <foreignObject x={rx+2} y={ry+2} width={rw-4} height={rh-4}>
                <div xmlns="http://www.w3.org/1999/xhtml"
                     style={{ width:"100%", height:"100%", display:"flex",
                              alignItems:"center", justifyContent:"center",
                              textAlign:"center", fontSize:"9px", color:"white",
                              fontWeight:"bold", lineHeight:1.2, overflow:"hidden" }}>
                  {pl.pieza.replace(/_/g,"\n")}{pl.rotada?" ↻":""}
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Etiquetas ejes */}
        <text x={PADDING + (rollo_ancho*escalaX)/2} y={SVG_H-4}
              textAnchor="middle" fontSize={10} fill="#64748B">
          Ancho (cm)
        </text>
        <text x={10} y={PADDING + (largo_dibujo*escalaY)/2}
              textAnchor="middle" fontSize={10} fill="#64748B"
              transform={`rotate(-90, 10, ${PADDING+(largo_dibujo*escalaY)/2})`}>
          Largo (cm)
        </text>
      </svg>
    );
  };

  // ── Métricas ─────────────────────────────────────────────────
  const renderMetricas = () => {
    if (!solucionActiva) {
      return (
        <>
          <span className="text-slate-500 whitespace-nowrap">Fitness: <strong>—</strong></span>
          <span className="text-slate-500 whitespace-nowrap">Largo usado (V1): <strong>—</strong></span>
          <span className="text-slate-500 whitespace-nowrap">Fragmentacion (V2): <strong>—</strong></span>
          <span className="text-slate-500 whitespace-nowrap">Compacidad (V3): <strong>—</strong></span>
        </>
      );
    }

    const m = solucionActiva.metricas;

    // v2_fragmentacion: 0 = espacio vacío concentrado (bueno), 1 = muy fragmentado (malo)
    const v2 = m.v2_fragmentacion ?? 0;
    const v2Color = v2 < 0.15 ? "text-green-600" : v2 < 0.35 ? "text-amber-600" : "text-red-500";
    const v2Label = v2 < 0.15 ? "concentrado" : v2 < 0.35 ? "moderado" : "fragmentado";

    // v3_compacidad: 0 = piezas bien empaquetadas (bueno), 1 = muy dispersas (malo)
    // En el backend ahora se llama v3_compacidad (antes v3_perimetro_norm)
    const v3 = m.v3_compacidad ?? m.v3_perimetro_norm ?? 0;
    const v3Color = v3 < 0.15 ? "text-green-600" : v3 < 0.30 ? "text-amber-600" : "text-red-500";
    const v3Label = v3 < 0.15 ? "compacto" : v3 < 0.30 ? "moderado" : "disperso";

    return (
      <>
        <span className="text-slate-600 whitespace-nowrap">
          Fitness: <strong className="text-slate-800">{m.fitness.toFixed(4)}</strong>
        </span>

        <span className="text-slate-600 whitespace-nowrap">
          Largo usado (V1):{" "}
          <strong className="text-red-500">
            {m.v1_largo_usado_cm.toFixed(1)} cm
          </strong>
          <span className="text-slate-400 text-xs ml-1">
            ({(m.v1_largo_usado_norm * 100).toFixed(1)}% del rollo)
          </span>
        </span>

        {/* V2: Fragmentación — verde si está bien concentrado */}
        <span className="text-slate-600 whitespace-nowrap">
          Fragmentacion (V2):{" "}
          <strong className={v2Color}>{v2.toFixed(3)}</strong>
          <span className="text-slate-400 text-xs ml-1">({v2Label})</span>
        </span>

        {/* V3: Compacidad — antes mostraba perímetro normalizado siempre en 1.0 */}
        <span className="text-slate-600 whitespace-nowrap">
          Compacidad (V3):{" "}
          <strong className={v3Color}>{v3.toFixed(3)}</strong>
          <span className="text-slate-400 text-xs ml-1">({v3Label})</span>
        </span>
      </>
    );
  };

  // ── Tabla ─────────────────────────────────────────────────────
  const renderTabla = () => {
    if (!solucionActiva) {
      return (
        <tr>
          <td colSpan={6} className="p-4 text-center text-slate-400 text-sm">
            Sin datos — ejecuta el AG primero
          </td>
        </tr>
      );
    }
    return solucionActiva.colocaciones.map((pl, i) => (
      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
        <td className="p-3 text-slate-700 font-medium">{pl.pieza}</td>
        <td className="p-3 font-mono text-slate-500">{pl.x.toFixed(1)}</td>
        <td className="p-3 font-mono text-slate-500">{pl.y.toFixed(1)}</td>
        <td className="p-3 font-mono text-slate-500">{pl.ancho.toFixed(1)}</td>
        <td className="p-3 font-mono text-slate-500">{pl.alto.toFixed(1)}</td>
        <td className="p-3 font-mono text-slate-500">{pl.rotada ? "Sí" : "No"}</td>
      </tr>
    ));
  };

  // ── JSX principal ─────────────────────────────────────────────
  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden">

      <ConfigSidebar
        config={config}
        onConfigChange={setConfig}
        onRun={handleRunAlgorithm}
        disabled={cargando}
      />

      <main className="flex-1 flex flex-col overflow-y-auto relative">

        {/* Barra superior */}
        <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center shadow-sm gap-4">
          <div className="flex gap-2">
            {["Solución 1", "Solución 2", "Solución 3"].map((label, idx) => (
              <button key={idx} onClick={() => setActiveTab(idx)}
                      disabled={!resultado}
                      className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
                        activeTab === idx
                          ? "bg-blue-50 text-blue-800 ring-1 ring-blue-200"
                          : "bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                      }`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-4 text-xs xl:text-sm font-mono bg-slate-50 p-2.5 rounded-md border border-slate-200 overflow-x-auto max-w-full">
            {renderMetricas()}
          </div>
        </div>

        {/* Error fatal */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            ⚠ {error}
          </div>
        )}

        {/* Advertencias */}
        {resultado?.advertencias?.length > 0 && (
          <div className="mx-6 mt-4 flex flex-col gap-2">
            {resultado.advertencias.map((msg, i) => (
              <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm flex gap-2">
                <span>⚠</span><span>{msg}</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-6 flex flex-col gap-6">

          {/* Canvas */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm w-full h-[500px] flex items-center justify-center shrink-0 overflow-hidden">
            {renderCanvas()}
          </div>

          <div className="flex flex-col gap-6 w-full">

            {/* Tabla */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 flex flex-col w-full h-[350px]">
              <h3 className="font-bold text-slate-700 mb-4 uppercase tracking-wider text-sm">
                Tabla de Posiciones
              </h3>
              <div className="overflow-y-auto flex-1 border border-slate-100 rounded-md">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 sticky top-0 shadow-sm">
                    <tr>
                      <th className="p-3 border-b border-slate-200 font-semibold">Pieza</th>
                      <th className="p-3 border-b border-slate-200 font-semibold">X</th>
                      <th className="p-3 border-b border-slate-200 font-semibold">Y</th>
                      <th className="p-3 border-b border-slate-200 font-semibold">Ancho</th>
                      <th className="p-3 border-b border-slate-200 font-semibold">Alto</th>
                      <th className="p-3 border-b border-slate-200 font-semibold">Rot</th>
                    </tr>
                  </thead>
                  <tbody>{renderTabla()}</tbody>
                </table>
              </div>
            </div>

            <FitnessChart data={fitnessData} />

          </div>
        </div>
      </main>
    </div>
  );
}