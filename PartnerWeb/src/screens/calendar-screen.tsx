"use client";

import React, { useMemo, useState } from "react";
import { BookingRow, PartnerCard } from "../components/theme";
import {
  addDays,
  addMonths,
  formatAbbrevDate,
  formatCompleteDate,
  formatMonthYear,
  isSameDay,
  VERY_SHORT_WEEKDAYS,
  weekInterval,
} from "../domain/calendar";
import { useNavigation } from "../navigation/routes";
import { usePartnerStore } from "../store/partner-store";

type CalendarScope = "Month" | "Week" | "Day";
const SCOPES: CalendarScope[] = ["Month", "Week", "Day"];

export function CalendarScreen() {
  const store = usePartnerStore();
  const nav = useNavigation();
  const [scope, setScope] = useState<CalendarScope>("Month");
  const [selected, setSelected] = useState<Date>(() => new Date());

  const dayBookings = useMemo(
    () =>
      store.bookings
        .filter((b) => isSameDay(b.windowStart, selected))
        .sort((a, b) => a.windowStart.getTime() - b.windowStart.getTime()),
    [store.bookings, selected]
  );

  const monthSlots = useMemo(() => {
    const first = new Date(selected.getFullYear(), selected.getMonth(), 1);
    const daysInMonth = new Date(
      selected.getFullYear(),
      selected.getMonth() + 1,
      0
    ).getDate();
    const pad = first.getDay();
    const items: Array<{ id: number; day: Date | null }> = [];
    for (let i = 0; i < pad; i++) {
      items.push({ id: -(i + 1), day: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      items.push({
        id: d,
        day: new Date(selected.getFullYear(), selected.getMonth(), d),
      });
    }
    return items;
  }, [selected]);

  const weekDays = useMemo(() => {
    const interval = weekInterval(selected);
    return Array.from({ length: 7 }, (_, idx) => addDays(interval.start, idx));
  }, [selected]);

  return (
    <div className="px-6 pb-8 space-y-6">
      <div
        role="tablist"
        aria-label="Range"
        className="grid grid-cols-3 p-1 rounded-xl bg-partner-surface border border-partner-line"
      >
        {SCOPES.map((item) => {
          const active = scope === item;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setScope(item)}
              className={`min-h-[36px] rounded-lg text-[14px] font-semibold transition-colors ${
                active
                  ? "bg-partner-white text-partner-ink shadow-sm"
                  : "text-partner-gray"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {scope === "Month" && (
        <PartnerCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-partner-burgundy">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => setSelected((d) => addMonths(d, -1))}
                className="w-11 h-11 flex items-center justify-center rounded-lg active:bg-partner-surface"
              >
                ‹
              </button>
              <p className="text-[18px] font-bold text-partner-burgundy">
                {formatMonthYear(selected)}
              </p>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => setSelected((d) => addMonths(d, 1))}
                className="w-11 h-11 flex items-center justify-center rounded-lg active:bg-partner-surface"
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {VERY_SHORT_WEEKDAYS.map((symbol, idx) => (
                <span
                  key={idx}
                  className="text-[13px] font-semibold text-partner-gray"
                >
                  {symbol}
                </span>
              ))}
              {monthSlots.map((slot) => {
                if (!slot.day) {
                  return <div key={slot.id} className="h-10" />;
                }
                const day = slot.day;
                const count = store.bookings.filter((b) =>
                  isSameDay(b.windowStart, day)
                ).length;
                const isSelected = isSameDay(day, selected);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    aria-label={`${formatAbbrevDate(day)}, ${count} dates`}
                    onClick={() => setSelected(day)}
                    className={`min-h-[40px] rounded-[10px] flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? "bg-partner-burgundy text-partner-white"
                        : "text-partner-ink"
                    }`}
                  >
                    <span
                      className={`text-[15px] ${
                        isSelected ? "font-bold" : "font-medium"
                      }`}
                    >
                      {day.getDate()}
                    </span>
                    <span
                      className={`w-[5px] h-[5px] rounded-full ${
                        count > 0
                          ? isSelected
                            ? "bg-partner-white"
                            : "bg-partner-burgundy"
                          : "bg-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </PartnerCard>
      )}

      {scope === "Week" && (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selected);
            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelected(day)}
                className={`min-h-[56px] rounded-[14px] flex flex-col items-center justify-center gap-1 border ${
                  isSelected
                    ? "bg-partner-burgundy text-partner-white border-transparent"
                    : "bg-partner-surface text-partner-ink border-partner-line"
                }`}
              >
                <span className="text-[13px] font-medium">
                  {VERY_SHORT_WEEKDAYS[day.getDay()]}
                </span>
                <span className="text-[17px] font-bold">{day.getDate()}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-[20px] font-bold text-partner-ink">
          {formatCompleteDate(selected)}
        </h2>
        {dayBookings.length === 0 && (
          <PartnerCard>
            <p className="text-[14px] text-partner-gray">No dates this day.</p>
          </PartnerCard>
        )}
        {dayBookings.map((booking) => (
          <button
            key={booking.id}
            type="button"
            data-testid={`booking-${booking.id}`}
            onClick={() => nav.push({ kind: "booking", bookingID: booking.id })}
            className="w-full text-left block"
          >
            <BookingRow booking={booking} />
          </button>
        ))}
      </div>
    </div>
  );
}
