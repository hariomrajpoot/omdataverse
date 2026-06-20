import type { Metadata } from "next";
import { getTrainings } from "@/lib/content";
import { TrainingHero } from "@/components/trainings/TrainingHero";
import { TrainingGrid } from "@/components/trainings/TrainingGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trainings & Workshops",
  description:
    "Hands-on workshops led by practitioners. Learn Microsoft Fabric, Azure AI, Databricks, and modern data engineering—from fundamentals to advanced patterns.",
};

export default async function TrainingsPage() {
  const trainings = await getTrainings();

  return (
    <div>
      <TrainingHero />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <TrainingGrid trainings={trainings} />
      </section>
    </div>
  );
}
