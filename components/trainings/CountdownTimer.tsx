"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: string): TimeLeft | null {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ date }: { date: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => getTimeLeft(date));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(date)), 1000);
    return () => clearInterval(id);
  }, [date]);

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-2 text-sm text-brand-fg/60">
        <Clock className="h-4 w-4" />
        <span>Event has started</span>
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-3">
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <div className="rounded-lg bg-brand-surface px-3 py-2 text-lg font-bold tabular-nums text-brand-fg">
            {String(u.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-brand-fg/60">
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}
