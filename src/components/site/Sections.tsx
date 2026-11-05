import { whyChooseUs, processSteps, industries } from "@/lib/content";

export function WhyGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {whyChooseUs.map(({ icon: Icon, title, text }) => (
        <div key={title} className="rounded-2xl border bg-card p-6 shadow-card">
          <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-bold">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        </div>
      ))}
    </div>
  );
}

export function ProcessGrid({ steps = processSteps }: { steps?: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.title} className="relative rounded-2xl border bg-card p-6 shadow-card">
          <span className="text-gradient text-4xl font-extrabold">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function IndustryGrid({ limit }: { limit?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {industries.slice(0, limit).map(({ icon: Icon, name, text }) => (
        <div key={name} className="card-lift rounded-2xl border bg-card p-6">
          <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
          <h3 className="mt-4 font-bold">{name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        </div>
      ))}
    </div>
  );
}
