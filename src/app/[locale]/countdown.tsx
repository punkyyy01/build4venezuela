"use client";

import { useEffect, useState } from "react";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

type CountdownLabels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  complete: string;
};

type CountdownProps = {
  labels: CountdownLabels;
  targetIso: string;
};

function getRemainingParts(targetTime: number) {
  const remaining = Math.max(0, targetTime - Date.now());

  return {
    complete: remaining === 0,
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
  };
}

export function Countdown({ labels, targetIso }: CountdownProps) {
  const targetTime = new Date(targetIso).getTime();
  const [parts, setParts] = useState(() => getRemainingParts(targetTime));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setParts(getRemainingParts(targetTime));
    }, SECOND);

    return () => window.clearInterval(interval);
  }, [targetTime]);

  if (parts.complete) {
    return (
      <p className="border border-primary/70 px-4 py-3 font-mono text-sm font-bold uppercase tracking-[0.18em] text-primary">
        {labels.complete}
      </p>
    );
  }

  const units = [
    { label: labels.days, value: parts.days },
    { label: labels.hours, value: parts.hours },
    { label: labels.minutes, value: parts.minutes },
    { label: labels.seconds, value: parts.seconds },
  ];

  return (
    <div className="grid w-full grid-cols-2 gap-px bg-border sm:grid-cols-4">
      {units.map((unit) => (
        <div className="bg-background px-4 py-5 text-center" key={unit.label}>
          <p className="font-mono text-[clamp(2rem,5vw,4rem)] font-black leading-none tracking-[-0.06em] text-primary">
            {String(unit.value).padStart(2, "0")}
          </p>
          <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}
