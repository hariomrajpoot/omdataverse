import type { Training } from "@/types";
import { TrainingCard } from "./TrainingCard";

export function TrainingGrid({ trainings }: { trainings: Training[] }) {
  if (trainings.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-brand-fg/60">
          No upcoming trainings at the moment.&nbsp;Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {trainings.map((t) => (
        <TrainingCard key={t._id ?? t.slug} training={t} />
      ))}
    </div>
  );
}
