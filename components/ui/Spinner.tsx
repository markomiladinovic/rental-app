export default function Spinner({ text = "Učitavanje..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-ocean/20 border-t-ocean rounded-full animate-spin mb-4" />
      <p className="text-muted text-sm">{text}</p>
    </div>
  );
}
