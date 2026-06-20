"use client";

import { Users } from "lucide-react";

interface SeatCounterProps {
  capacity: number;
  registrationCount: number;
}

export function SeatCounter({ capacity, registrationCount }: SeatCounterProps) {
  const remaining = Math.max(0, capacity - registrationCount);
  const pct = Math.min(100, (registrationCount / capacity) * 100);
  const isLow = remaining > 0 && remaining <= Math.ceil(capacity * 0.2);
  const isFull = remaining === 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-brand-fg/60">
          <Users className="h-4 w-4" />
          Seats
        </span>
        <span
          className={
            isFull
              ? "font-semibold text-red-500"
              : isLow
                ? "font-semibold text-amber-500"
                : "text-brand-fg"
          }
        >
          {isFull ? "Sold Out" : `${remaining} of ${capacity} left`}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-brand-surface">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isFull ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-brand-accent"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
