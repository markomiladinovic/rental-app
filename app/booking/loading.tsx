import Spinner from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="pt-32">
      <Spinner text="Učitavanje..." />
    </div>
  );
}
