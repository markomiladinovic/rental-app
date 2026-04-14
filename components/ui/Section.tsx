type SectionProps = {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
};

export default function Section({ children, className = "", dark = false, id }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-12 md:py-16 ${dark ? "bg-midnight text-white" : "bg-white"} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-16">
        {children}
      </div>
    </section>
  );
}
