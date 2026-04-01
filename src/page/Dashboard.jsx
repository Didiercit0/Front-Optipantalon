import { useState } from 'react';
import { ConfigSidebar } from '../components/organisms/ConfigSidebar';
import { FitnessChart } from '../components/organisms/FitnessChart';

export default function Dashboard() {
  const [config, setConfig] = useState({
    ancho: 150,
    largo: 200,
    poblacion: 80,
    generaciones: 200,
    tasaCruza: 0.8,
    tasaMutacion: 0.15
  });

  const [activeTab, setActiveTab] = useState(0);

  const mockHistorial = Array.from({ length: 50 }, (_, i) => {
    const decaimiento = Math.max(0.5, 1.5 - Math.log(i + 1) * 0.15);
    return {
      generacion: i + 1,
      mejor: Number((decaimiento - 0.1).toFixed(4)),
      promedio: Number((decaimiento + 0.2).toFixed(4)),
      peor: Number((decaimiento + 0.6 + (Math.random() * 0.2)).toFixed(4))
    };
  });

  const handleRunAlgorithm = () => {
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden">
      
      <ConfigSidebar 
        config={config} 
        onConfigChange={setConfig} 
        onRun={handleRunAlgorithm} 
      />

      <main className="flex-1 flex flex-col overflow-y-auto relative">
        
        <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center shadow-sm gap-4">
          <div className="flex gap-2">
            {["Solucion 1", "Solucion 2", "Solucion 3"].map((label, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
                  activeTab === idx 
                    ? 'bg-blue-50 text-blue-800 ring-1 ring-blue-200' 
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-4 text-xs xl:text-sm font-mono bg-slate-50 p-2.5 rounded-md border border-slate-200 overflow-x-auto max-w-full">
            <span className="text-slate-600 whitespace-nowrap">
              Fitness: <strong className="text-slate-800">0.8432</strong>
            </span>
            <span className="text-slate-600 whitespace-nowrap">
              Desperdicio (V1): <strong className="text-red-500">14.6%</strong>
            </span>
            <span className="text-slate-600 whitespace-nowrap">
              Fragmentacion (V2): <strong className="text-amber-600">0.24</strong>
            </span>
            <span className="text-slate-600 whitespace-nowrap">
              Perimetro (V3): <strong className="text-blue-600">850 cm</strong>
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm w-full h-[500px] flex items-center justify-center shrink-0">
             <span className="text-slate-400">Esperando ejecucion del algoritmo...</span>
          </div>

          <div className="flex flex-col gap-6 w-full">
            
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 flex flex-col w-full h-[350px]">
              <h3 className="font-bold text-slate-700 mb-4 uppercase tracking-wider text-sm">Tabla de Posiciones</h3>
              <div className="overflow-y-auto flex-1 border border-slate-100 rounded-md">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 sticky top-0 shadow-sm">
                    <tr>
                      <th className="p-3 border-b border-slate-200 font-semibold">Pieza</th>
                      <th className="p-3 border-b border-slate-200 font-semibold">X</th>
                      <th className="p-3 border-b border-slate-200 font-semibold">Y</th>
                      <th className="p-3 border-b border-slate-200 font-semibold">Ancho</th>
                      <th className="p-3 border-b border-slate-200 font-semibold">Alto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-slate-700 font-medium">Pierna_Delantera_Izq</td>
                      <td className="p-3 font-mono text-slate-500">10.0</td>
                      <td className="p-3 font-mono text-slate-500">20.0</td>
                      <td className="p-3 font-mono text-slate-500">30.0</td>
                      <td className="p-3 font-mono text-slate-500">60.0</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-slate-700 font-medium">Pierna_Delantera_Der</td>
                      <td className="p-3 font-mono text-slate-500">45.0</td>
                      <td className="p-3 font-mono text-slate-500">20.0</td>
                      <td className="p-3 font-mono text-slate-500">30.0</td>
                      <td className="p-3 font-mono text-slate-500">60.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <FitnessChart data={mockHistorial} />

          </div>

        </div>
      </main>
    </div>
  );
}