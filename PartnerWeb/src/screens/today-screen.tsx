"use client";

import React from "react";
import { BookingRow, PartnerCard, ReportRow } from "../components/theme";
import { addMonths, formatShortTime } from "../domain/calendar";
import { MonthStats } from "../domain/rules";
import { Booking } from "../domain/types";
import { useNavigation } from "../navigation/routes";
import { usePartnerStore } from "../store/partner-store";

export function TodayScreen() {
  const store = usePartnerStore();
  const nav = useNavigation();

  const open = store.openToday();
  const next = store.nextWindow();
  const now = new Date();
  const currentStats = store.stats(now);
  const previousStats = store.stats(addMonths(now, -1));

  const renderBookingSection = (title: string, list: Booking[]) => (
    <section className="space-y-3">
      <h2 className="text-[20px] font-bold text-partner-ink">{title}</h2>
      {list.length === 0 && (
        <PartnerCard>
          <p className="text-[14px] text-partner-gray">
            No dates in this list.
          </p>
        </PartnerCard>
      )}
      {list.map((booking) => (
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
    </section>
  );

  const renderStatCard = (stats: MonthStats) => (
    <PartnerCard>
      <div className="space-y-1.5">
        <p className="text-[17px] font-semibold text-partner-ink">
          {stats.hosted} hosted
        </p>
        <p className="text-[17px] text-partner-ink">
          {stats.completed} completed
        </p>
        <p className="text-[14px] text-partner-gray">
          {stats.customers} customers from those dates
        </p>
      </div>
    </PartnerCard>
  );

  return (
    <div className="px-6 pb-8 space-y-6">
      <div className="space-y-1">
        <p className="text-[24px] font-bold text-partner-ink leading-tight">
          {store.cafe.name}
        </p>
        {store.session && (
          <p className="text-[14px] text-partner-gray">
            Signed in as {store.session.name}
          </p>
        )}
      </div>

      <div className="w-full p-6 rounded-[24px] bg-partner-burgundy text-left shadow-[0_6px_14px_rgba(74,21,37,0.22)] space-y-2.5">
        <div className="space-y-1">
          <p className="text-[12px] font-bold tracking-[0.8px] text-partner-white/75 uppercase">
            ACTIVE SCHEDULE
          </p>
          <p className="text-[32px] font-bold text-partner-white leading-tight">
            {open.length} still open
          </p>
        </div>
        <p className="text-[17px] font-medium text-partner-white/90">
          {next
            ? `Next, ${formatShortTime(next.windowStart)}`
            : "Nothing else open today"}
        </p>
      </div>

      <PartnerCard>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-partner-burgundy/10 flex items-center justify-center shrink-0">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-partner-burgundy"
            >
              <path d="M7.5 6a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 8.25a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 18.75a6.75 6.75 0 0 1 13.5 0v.75H2.25v-.75ZM17.18 19.5v-.75a8.22 8.22 0 0 0-.62-3.13 5.25 5.25 0 0 1 6.69 5.03v.6h-6.07Z" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <p
              data-testid="customers-brought-in"
              className="text-[18px] font-bold text-partner-ink leading-snug"
            >
              {store.customersBroughtIn} customers brought in
            </p>
            <p className="text-[14px] text-partner-gray">
              2 customers per completed date
            </p>
          </div>
        </div>
      </PartnerCard>

      {renderBookingSection("Today", store.todaysBookings())}
      {renderBookingSection("This week", store.weeksBookings())}

      {store.pendingReports.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[20px] font-bold text-partner-ink">
            Pending reports
          </h2>
          {store.pendingReports.map((report) => (
            <button
              key={report.id}
              type="button"
              data-testid={`report-${report.id}`}
              onClick={() => nav.push({ kind: "report", reportID: report.id })}
              className="w-full text-left block"
            >
              <ReportRow report={report} />
            </button>
          ))}
        </section>
      )}

      {store.isOwner && store.unfinishedProfile.length > 0 && (
        <PartnerCard>
          <div className="space-y-2">
            <p className="text-[18px] font-bold text-partner-ink">
              Finish the café page
            </p>
            {store.unfinishedProfile.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-partner-burgundy shrink-0" />
                <span className="text-[14px] text-partner-gray">{item}</span>
              </div>
            ))}
          </div>
        </PartnerCard>
      )}

      <section className="space-y-3">
        <h2 className="text-[20px] font-bold text-partner-ink">This month</h2>
        {renderStatCard(currentStats)}
        <h2 className="text-[20px] font-bold text-partner-ink">Last month</h2>
        {renderStatCard(previousStats)}
      </section>
    </div>
  );
}
