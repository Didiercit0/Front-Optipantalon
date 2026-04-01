import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export function FitnessChart({ data }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 flex flex-col w-full">
      <h3 className="font-bold text-slate-700 mb-4 uppercase tracking-wider text-sm">
        Evolucion Fitness
      </h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="generacion" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              domain={['auto', 'auto']}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
              labelStyle={{ color: '#64748b', marginBottom: '4px' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
            />
            <Line 
              name="Mejor"
              type="monotone" 
              dataKey="mejor" 
              stroke="#16a34a" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 5 }} 
            />
            <Line 
              name="Promedio"
              type="monotone" 
              dataKey="promedio" 
              stroke="#2563eb" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 5 }} 
            />
            <Line 
              name="Peor"
              type="monotone" 
              dataKey="peor" 
              stroke="#dc2626" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 5 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}