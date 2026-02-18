"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownProps {
  targetDate: Date;
  isDark?: boolean;
}

function getTimeLeft(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return null;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

function getTimeSince(target: Date) {
  const now = new Date();
  const diff = now.getTime() - target.getTime();

  if (diff < 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days >= 365) {
    const years = Math.floor(days / 365);
    return { type: "years" as const, value: years };
  }

  return { type: "days" as const, value: days };
}

export function Countdown({ targetDate, isDark = false }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);
  const [timeSince, setTimeSince] = useState<ReturnType<typeof getTimeSince>>(null);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const left = getTimeLeft(targetDate);
      if (left) {
        setTimeLeft(left);
        setTimeSince(null);
      } else {
        setTimeLeft(null);
        setTimeSince(getTimeSince(targetDate));
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="flex justify-center gap-2 sm:gap-3 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-14 h-16 sm:w-16 sm:h-20 rounded-lg animate-pulse ${
              isDark ? "bg-white/20" : "bg-stone-200"
            }`}
          />
        ))}
      </div>
    );
  }

  const textClass = isDark ? "text-white" : "text-stone-800";
  const labelClass = isDark ? "text-white/80" : "text-stone-500";
  const boxClass = isDark
    ? "bg-white/15 backdrop-blur-sm border-white/30"
    : "bg-white/80 border-champagne-200 shadow-sm";

  // Date à venir
  if (timeLeft) {
    const units = [
      { value: timeLeft.days, label: "jours" },
      { value: timeLeft.hours, label: "heures" },
      { value: timeLeft.minutes, label: "min" },
      { value: timeLeft.seconds, label: "sec" },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-6 sm:mt-8"
      >
        <p
          className={`text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 ${labelClass}`}
        >
          Dans
        </p>
        <div className="flex justify-center gap-2 sm:gap-4">
          {units.map(({ value, label }) => (
            <div
              key={label}
              className={`flex flex-col items-center min-w-[56px] sm:min-w-[64px] py-3 px-2 rounded-xl border ${boxClass}`}
            >
              <span
                className={`font-serif text-2xl sm:text-3xl md:text-4xl font-light tabular-nums ${textClass}`}
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {String(value).padStart(2, "0")}
              </span>
              <span className={`text-[10px] sm:text-xs mt-1 font-medium ${labelClass}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Date passée
  if (timeSince) {
    const text =
      timeSince.type === "years"
        ? timeSince.value === 1
          ? "Cela fait 1 an que nous nous sommes mariés"
          : `Cela fait ${timeSince.value} ans que nous nous sommes mariés`
        : timeSince.value === 0
          ? "C'était aujourd'hui !"
          : timeSince.value === 1
            ? "Cela fait 1 jour que nous nous sommes mariés"
            : `Cela fait ${timeSince.value} jours que nous nous sommes mariés`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-6 sm:mt-8"
      >
        <p
          className={`text-sm sm:text-base font-serif font-light ${textClass}`}
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {text}
        </p>
      </motion.div>
    );
  }

  return null;
}
