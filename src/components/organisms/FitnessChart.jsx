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

const TooltipPersonalizado = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const encontrar = (key) => payload.find((p) => p.dataKey === key);
  const peor      = encontrar("peor");
  const promedio  = encontrar("promedio");
  const mejor     = encontrar("mejor");

  return (
    <div style={{
      background: "white",
      borderRadius: "8px",
      padding: "10px 14px",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      fontSize: "13px",
      lineHeight: "1.8",
    }}>
      <p style={{ color: "#64748b", marginBottom: "4px", fontWeight: 600 }}>
        Gen {label}
      </p>
      {peor && (
        <p style={{ color: peor.color, fontWeight: "bold" }}>
          Peor : {peor.value.toFixed(6)}
        </p>
      )}
      {promedio && (
        <p style={{ color: promedio.color, fontWeight: "bold" }}>
          Promedio : {promedio.value.toFixed(6)}
        </p>
      )}
      {mejor && (
        <p style={{ color: mejor.color, fontWeight: "bold" }}>
          Mejor : {mejor.value.toFixed(6)}
        </p>
      )}
    </div>
  );
};

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
            <Tooltip content={<TooltipPersonalizado />} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              payload={[
                { value: "Peor",     type: "circle", color: "#dc2626" },
                { value: "Promedio", type: "circle", color: "#2563eb" },
                { value: "Mejor",    type: "circle", color: "#16a34a" },
              ]}
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
              name="Mejor"
              type="monotone"
              dataKey="mejor"
              stroke="#16a34a"
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