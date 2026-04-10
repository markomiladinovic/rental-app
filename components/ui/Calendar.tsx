"use client";
import { useState } from "react";

const DAYS = ["Po", "Ut", "Sr", "Če", "Pe", "Su", "Ne"];
const MONTHS = [
  "Januar", "Februar", "Mart", "April", "Maj", "Jun",
  "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar",
];

type CalendarProps = {
  selectedDate: string;
  onSelect: (date: string) => void;
  bookedDates: Set<string>;
};

function toDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Monday = 0, Sunday = 6
  let startWeekday = firstDay.getDay() - 1;
  if (startWeekday < 0) startWeekday = 6;

  const days: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export default function Calendar({ selectedDate, onSelect, bookedDates }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = getMonthDays(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth() || viewYear > today.getFullYear();

  return (
    <div className="bg-white border border-cloud rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-9 h-9 rounded-lg border border-silver flex items-center justify-center text-subtle hover:bg-cloud transition-colors disabled:opacity-30 cursor-pointer"
        >
          ‹
        </button>
        <span className="font-heading font-semibold text-midnight">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-lg border border-silver flex items-center justify-center text-subtle hover:bg-cloud transition-colors cursor-pointer"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-muted py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} className="h-10" />;
          }

          const dateStr = toDateStr(date);
          const isPast = date < today;
          const isBooked = bookedDates.has(dateStr);
          const isSelected = dateStr === selectedDate;
          const isToday = toDateStr(today) === dateStr;
          const isDisabled = isPast || isBooked;

          return (
            <button
              key={dateStr}
              onClick={() => !isDisabled && onSelect(dateStr)}
              disabled={isDisabled}
              className={`h-10 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${isSelected
                  ? "bg-ocean text-white shadow-cta"
                  : isBooked
                    ? "bg-rose/10 text-rose/50 cursor-not-allowed"
                    : isPast
                      ? "text-silver cursor-not-allowed"
                      : isToday
                        ? "bg-ocean/10 text-ocean hover:bg-ocean/20"
                        : "text-slate-dark hover:bg-cloud"
                }
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-cloud">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-ocean" />
          <span className="text-xs text-muted">Izabrano</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-rose/30" />
          <span className="text-xs text-muted">Zauzeto</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-ocean/20" />
          <span className="text-xs text-muted">Danas</span>
        </div>
      </div>
    </div>
  );
}
