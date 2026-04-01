export function Button({ children, onClick, variant = 'primary', disabled = false }) {
  const baseStyle = "w-full py-2 px-4 rounded font-bold transition-colors shadow-sm flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300",
    secondary: "bg-slate-700 hover:bg-slate-800 text-white",
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}