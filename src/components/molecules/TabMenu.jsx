export function TabMenu({ activeTab, onSelectTab, labels = [" Solución 1", "Solución 2", "Solución 3"] }) {
  return (
    <div className="flex gap-2 border-b border-slate-200 pb-2 mb-4">
      {labels.map((label, idx) => (
        <button
          key={idx}
          onClick={() => onSelectTab(idx)}
          className={`px-4 py-2 text-sm font-bold rounded-t-md transition-colors ${
            activeTab === idx 
              ? 'bg-blue-50 border-b-2 border-blue-600 text-blue-800' 
              : 'bg-white text-slate-400 hover:bg-slate-50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}