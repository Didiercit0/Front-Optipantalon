export function FormRow({ label, value, min, max, step, onChange }) {
  return (
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm text-slate-600">{label}</label>
      <input 
        type="number" 
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 p-1 text-right text-sm font-bold text-blue-700 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}