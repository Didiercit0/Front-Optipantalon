export function SectionTitle({ text }) {
  return (
    <div className="mb-3 mt-5">
      <div className="h-px bg-blue-100 w-full mb-2"></div>
      <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider">{text}</h3>
    </div>
  );
}