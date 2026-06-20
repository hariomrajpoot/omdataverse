"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, Clock, GraduationCap, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingLite {
  id: string;
  title: string;
  slug: string;
  level: string;
  duration: string;
}

const STEPS = ["Course", "Your details", "Goals"];
const EXPERIENCE = ["Beginner", "Intermediate", "Advanced"];

export function EnrollFlow({
  training,
  isAuthed,
}: {
  training: TrainingLite;
  isAuthed: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [goals, setGoals] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field =
    "w-full rounded-lg border border-brand-border/60 bg-brand-bg px-3 py-2 text-sm text-brand-fg focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent";

  if (!isAuthed) {
    const from = `/trainings/${training.slug}/register`;
    return (
      <div className="rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-8 text-center">
        <GraduationCap className="mx-auto h-8 w-8 text-brand-accent" />
        <h2 className="mt-4 text-lg font-semibold text-brand-fg">Sign in to enroll</h2>
        <p className="mt-2 text-sm text-brand-fg/70">
          Create a free account (or sign in) to register for <strong>{training.title}</strong> and
          track your enrollment.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/login?from=${encodeURIComponent(from)}`}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-accent px-5 text-sm font-semibold text-white hover:bg-brand-accent/90"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-brand-border/60 px-5 text-sm font-medium text-brand-fg hover:bg-brand-surface"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-8 text-center">
        <PartyPopper className="mx-auto h-8 w-8 text-brand-accent" />
        <h2 className="mt-4 text-lg font-semibold text-brand-fg">You&apos;re registered!</h2>
        <p className="mt-2 text-sm text-brand-fg/70">
          Your enrollment for <strong>{training.title}</strong> is in. We&apos;ll review it and
          email you with the schedule and joining details.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/account/trainings"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-accent px-5 text-sm font-semibold text-white hover:bg-brand-accent/90"
          >
            View my trainings
          </Link>
          <Link
            href="/trainings"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-brand-border/60 px-5 text-sm font-medium text-brand-fg hover:bg-brand-surface"
          >
            Browse more
          </Link>
        </div>
      </div>
    );
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainingId: training.id, phone, experience, goals }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not complete enrollment.");
        return;
      }
      setDone(true);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-brand-border/50 bg-brand-surface/60 p-6 sm:p-8">
      {/* Step indicator */}
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
                i < step
                  ? "bg-brand-accent text-white"
                  : i === step
                    ? "bg-brand-accent/15 text-brand-accent ring-1 ring-brand-accent"
                    : "bg-brand-bg text-brand-fg/50 ring-1 ring-brand-border/60",
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span className={cn("hidden text-xs sm:block", i === step ? "text-brand-fg" : "text-brand-fg/50")}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-brand-border/50" />}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-brand-fg">{training.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-brand-accent/10 px-2.5 py-1 font-semibold text-brand-accent ring-1 ring-brand-accent/20">
                  {training.level}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-bg px-2.5 py-1 text-brand-fg/70 ring-1 ring-brand-border/10">
                  <Clock className="h-3.5 w-3.5" /> {training.duration}
                </span>
              </div>
              <p className="mt-4 text-sm text-brand-fg/70">
                Confirm you&apos;d like to register for this course. Next we&apos;ll grab a couple of
                details so we can tailor the session.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-brand-fg/80">
                  WhatsApp / phone number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  className={field}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98XXXXXXXX"
                />
                <p className="mt-1 text-xs text-brand-fg/55">
                  Required — we&apos;ll message you on WhatsApp with schedule &amp; joining details.
                </p>
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-brand-fg/80">
                  Experience level
                </span>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperience(lvl)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm transition-colors",
                        experience === lvl
                          ? "border-brand-accent bg-brand-accent/10 text-brand-accent"
                          : "border-brand-border/60 text-brand-fg/70 hover:bg-brand-bg",
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label htmlFor="goals" className="mb-1 block text-sm font-medium text-brand-fg/80">
                What do you want to get out of this? (optional)
              </label>
              <textarea
                id="goals"
                rows={4}
                className={field}
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Build production dashboards for my team"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-brand-fg/70 hover:bg-brand-bg disabled:opacity-0"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 1 && phone.replace(/\D/g, "").length < 7}
            title={
              step === 1 && phone.replace(/\D/g, "").length < 7
                ? "A valid phone number is required"
                : undefined
            }
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-accent px-5 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-50"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-accent px-5 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Complete enrollment"}
          </button>
        )}
      </div>
    </div>
  );
}
