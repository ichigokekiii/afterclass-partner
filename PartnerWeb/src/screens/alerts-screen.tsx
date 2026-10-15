"use client";

import React from "react";
import {
  BottomActionBar,
  PartnerCard,
  PrimaryButton,
  ReportRow,
  StatusChip,
  StudentAvatar,
} from "../components/theme";
import { formatAbbrevDateTime } from "../domain/calendar";
import { LiveLocationCopy, ReportClock } from "../domain/rules";
import { AppNotification, NotificationKind, SafetyReport } from "../domain/types";
import { useNavigation } from "../navigation/routes";
import { usePartnerStore } from "../store/partner-store";

function kindTitle(kind: NotificationKind): string {
  switch (kind) {
    case "weekAhead":
      return "7 days before";
    case "dayOf":
      return "Day of the date";
    case "report":
      return "Safety report";
  }
}

export function AlertsScreen() {
  const store = usePartnerStore();
  const nav = useNavigation();

  const renderInboxCard = (note: AppNotification) => {
    const booking = note.bookingID
      ? store.booking(note.bookingID)
      : undefined;
    return (
      <PartnerCard>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-bold text-partner-burgundy">
              {kindTitle(note.kind)}
            </span>
            {note.kind === "report" ? (
              <StatusChip title="Urgent" urgent />
            ) : (
              <span className="text-[14px] text-partner-gray">
                {formatAbbrevDateTime(note.fireDate)}
              </span>
            )}
          </div>
          <p className="text-[17px] font-bold text-partner-ink leading-snug">
            {note.title}
          </p>
          <p className="text-[17px] text-partner-ink leading-snug">
            {note.body}
          </p>
          {booking && (
            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="flex items-center -space-x-2">
                <StudentAvatar
                  name={booking.students.first.firstName}
                  side={32}
                />
                <StudentAvatar
                  name={booking.students.second.firstName}
                  side={32}
                />
              </div>
              <span className="text-[14px] text-partner-gray">
                {booking.students.first.firstName} and{" "}
                {booking.students.second.firstName}
              </span>
            </div>
          )}
        </div>
      </PartnerCard>
    );
  };

  return (
    <div className="px-6 pb-8 space-y-6">
      <section className="space-y-3">
        <h2 className="text-[20px] font-bold text-partner-ink">Reports</h2>
        {store.reports.map((report) => (
          <button
            key={report.id}
            type="button"
            data-testid={`alert-report-${report.id}`}
            onClick={() => nav.push({ kind: "report", reportID: report.id })}
            className="w-full text-left block"
          >
            <ReportRow report={report} />
          </button>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-[20px] font-bold text-partner-ink">Inbox</h2>
        {store.notifications.map((note) => {
          if (note.reportID) {
            const reportID = note.reportID;
            return (
              <button
                key={note.id}
                type="button"
                onClick={() => nav.push({ kind: "report", reportID })}
                className="w-full text-left block"
              >
                {renderInboxCard(note)}
              </button>
            );
          }
          if (note.bookingID) {
            const bookingID = note.bookingID;
            return (
              <button
                key={note.id}
                type="button"
                onClick={() => nav.push({ kind: "booking", bookingID })}
                className="w-full text-left block"
              >
                {renderInboxCard(note)}
              </button>
            );
          }
          return <div key={note.id}>{renderInboxCard(note)}</div>;
        })}
      </section>
    </div>
  );
}

export function ReportDetailScreen({ reportID }: { reportID: string }) {
  const store = usePartnerStore();
  const report = store.report(reportID);

  if (!report) {
    return (
      <div className="px-6 py-4">
        <p className="text-[17px] text-partner-ink">
          This report is no longer on the list.
        </p>
      </div>
    );
  }

  const reporter = store.student(report.reporterID);
  const isConfirmed = report.status.kind === "confirmed";
  const isResolved = report.status.kind === "resolved";
  const pin = ReportClock.pin(report, new Date());

  const renderStep = (title: string, done: boolean, resolved: boolean) => (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
          done
            ? "bg-partner-burgundy text-partner-white"
            : "border border-partner-gray text-transparent"
        }`}
      >
        ✓
      </span>
      {resolved ? (
        <StatusChip title={title} resolved />
      ) : (
        <span
          className={`text-[17px] ${
            done ? "text-partner-ink" : "text-partner-gray"
          }`}
        >
          {title}
        </span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-[calc(100dvh-120px)] justify-between">
      <div className="px-6 pb-8 space-y-6">
        <PartnerCard>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {reporter ? (
                <>
                  <StudentAvatar name={reporter.firstName} side={52} />
                  <div className="space-y-1">
                    <p className="text-[18px] font-bold text-partner-ink">
                      {reporter.firstName}
                    </p>
                    <p className="text-[17px] text-partner-ink">
                      {report.placeInCafe}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-[26px] font-bold text-partner-ink">
                  {report.placeInCafe}
                </p>
              )}
            </div>
            <div className="space-y-2.5 pt-1">
              {renderStep("Reported", true, false)}
              {renderStep(
                "Confirmed by café",
                isConfirmed || isResolved,
                false
              )}
              {renderStep("Student safely left", isResolved, isResolved)}
            </div>
          </div>
        </PartnerCard>

        {pin ? (
          <div
            data-testid="report-location"
            aria-label={LiveLocationCopy.statusTitle}
          >
            <PartnerCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-partner-burgundy"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                  </svg>
                  <p className="text-[18px] font-bold text-partner-ink">
                    {LiveLocationCopy.statusTitle}
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className="w-full h-[140px] rounded-[16px] bg-gradient-to-br from-partner-surface to-partner-line/60 flex items-center justify-center"
                >
                  <div className="w-11 h-11 rounded-full bg-partner-burgundy text-partner-white flex items-center justify-center shadow-md">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                    </svg>
                  </div>
                </div>

                <p className="text-[17px] text-partner-ink">
                  {LiveLocationCopy.placeLine(
                    store.cafe.name,
                    report.placeInCafe
                  )}
                </p>
                <p className="text-[14px] text-partner-gray">
                  {LiveLocationCopy.subtitle(store.cafe.name)}
                </p>
                <p className="text-[14px] font-semibold text-partner-burgundy">
                  Sharing until {formatAbbrevDateTime(pin.expiresAt)}
                </p>
              </div>
            </PartnerCard>
          </div>
        ) : isConfirmed ? (
          <p
            data-testid="location-ended"
            className="text-[17px] text-partner-ink"
          >
            Location share ended.
          </p>
        ) : null}

        <section className="space-y-3">
          <h3 className="text-[20px] font-bold text-partner-ink">Audit</h3>
          {report.audit.map((entry) => (
            <PartnerCard key={entry.id}>
              <div className="space-y-1">
                <p className="text-[17px] text-partner-ink">{entry.action}</p>
                <p className="text-[14px] text-partner-gray">
                  {formatAbbrevDateTime(entry.at)}
                </p>
              </div>
            </PartnerCard>
          ))}
        </section>
      </div>

      {report.status.kind === "reported" && (
        <BottomActionBar>
          <PrimaryButton
            title="Confirm report"
            testId="confirm-report"
            onClick={() => store.confirmReport(report.id)}
          />
        </BottomActionBar>
      )}

      {report.status.kind === "confirmed" && (
        <BottomActionBar>
          <PrimaryButton
            title="Student safely left"
            testId="resolve-report"
            onClick={() => store.resolveReport(report.id, "safelyLeft")}
          />
        </BottomActionBar>
      )}
    </div>
  );
}
