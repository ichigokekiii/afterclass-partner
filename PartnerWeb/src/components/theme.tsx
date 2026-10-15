"use client";

import React from "react";
import { DateWindow } from "../domain/rules";
import { Booking, SafetyReport, reportResolutionTitle } from "../domain/types";

export const MockMedia = {
  avatarAsset(name: string): string {
    const lower = name.toLowerCase();
    switch (lower) {
      case "jennie":
      case "marco":
      case "aria":
      case "luis":
      case "sofia":
      case "isabel":
      case "noah":
        return `/assets/avatar-${lower}.jpg`;
      default:
        return "/assets/avatar-jennie.jpg";
    }
  },

  photoAsset(label: string): string {
    const lower = label.toLowerCase();
    if (lower.includes("exterior")) return "/assets/photo-exterior.jpg";
    if (lower.includes("seating")) return "/assets/photo-seating.jpg";
    if (lower.includes("together")) return "/assets/photo-together.jpg";
    if (lower.includes("cup") || lower.includes("order")) {
      return "/assets/photo-cups.jpg";
    }
    if (lower.includes("reference")) return "/assets/photo-reference.jpg";
    if (lower.includes("recreation")) return "/assets/photo-recreation.jpg";
    return "/assets/photo-exterior.jpg";
  },
};

export function PartnerCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full text-left p-4 bg-partner-white rounded-[20px] border border-partner-line shadow-[0_2px_8px_rgba(0,0,0,0.03)] ${className}`}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({
  title,
  onClick,
  testId,
}: {
  title: string;
  onClick: () => void;
  testId?: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className="w-full min-h-[56px] px-4 py-3.5 rounded-[16px] bg-partner-burgundy text-partner-white text-[16px] font-semibold text-center leading-snug shadow-[0_4px_8px_rgba(74,21,37,0.18)] active:opacity-90 transition-opacity"
    >
      {title}
    </button>
  );
}

export function SecondaryButton({
  title,
  onClick,
  testId,
}: {
  title: string;
  onClick: () => void;
  testId?: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className="w-full min-h-[56px] px-4 py-3.5 rounded-[16px] bg-partner-white text-partner-burgundy text-[16px] font-semibold text-center leading-snug border-[1.5px] border-partner-burgundy/35 active:bg-partner-surface transition-colors"
    >
      {title}
    </button>
  );
}

export function BottomActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-[57px] left-0 right-0 z-20 w-full bg-partner-white border-t border-partner-line px-6 pt-3 pb-2 space-y-3">
      {children}
    </div>
  );
}

export function StatusChip({
  title,
  urgent = false,
  resolved = false,
}: {
  title: string;
  urgent?: boolean;
  resolved?: boolean;
}) {
  let styleClass = "text-partner-ink bg-partner-surface";
  if (resolved) {
    styleClass = "text-partner-green bg-partner-green/[0.16]";
  } else if (urgent) {
    styleClass = "text-partner-burgundy bg-partner-burgundy/[0.14]";
  }

  return (
    <span
      aria-label={title}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-semibold leading-none whitespace-nowrap ${styleClass}`}
    >
      {title}
    </span>
  );
}

export function StudentAvatar({
  name,
  side = 48,
}: {
  name: string;
  side?: number;
}) {
  return (
    <img
      src={MockMedia.avatarAsset(name)}
      alt={name}
      aria-label={name}
      style={{ width: side, height: side }}
      className="rounded-full object-cover border-2 border-partner-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] shrink-0"
    />
  );
}

export function MockPhotoTile({
  label,
  height = 156,
}: {
  label: string;
  height?: number;
}) {
  return (
    <div
      style={{ height }}
      className="relative w-full overflow-hidden rounded-[16px] border border-partner-line bg-partner-surface"
    >
      <img
        src={MockMedia.photoAsset(label)}
        alt={label}
        className="w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5">
        <span className="text-[14px] font-semibold text-partner-white line-clamp-2">
          {label}
        </span>
      </div>
    </div>
  );
}

export function BookingRow({ booking }: { booking: Booking }) {
  return (
    <PartnerCard>
      <div className="flex items-center gap-3.5">
        <div className="flex items-center -space-x-2.5 shrink-0">
          <StudentAvatar name={booking.students.first.firstName} side={44} />
          <StudentAvatar name={booking.students.second.firstName} side={44} />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-[17px] font-bold text-partner-ink leading-tight">
            {booking.students.first.firstName} and{" "}
            {booking.students.second.firstName}
          </p>
          <p className="text-[14px] text-partner-gray leading-snug">
            {DateWindow.label(booking.windowStart, booking.windowEnd)}
          </p>
        </div>
        <div className="shrink-0">
          {booking.state.kind === "scheduled" && (
            <StatusChip title="Scheduled" />
          )}
          {booking.state.kind === "completed" && (
            <StatusChip title="Completed" resolved />
          )}
          {booking.state.kind === "noShow" && <StatusChip title="No-show" />}
        </div>
      </div>
    </PartnerCard>
  );
}

export function ReportRow({ report }: { report: SafetyReport }) {
  const isPending = report.status.kind === "reported";
  let statusTitle = "Reported";
  if (report.status.kind === "confirmed") {
    statusTitle = "Confirmed by café";
  } else if (report.status.kind === "resolved") {
    statusTitle = reportResolutionTitle(report.status.outcome);
  }

  return (
    <PartnerCard>
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[17px] font-bold text-partner-ink leading-tight">
            {report.placeInCafe}
          </p>
          <p className="text-[14px] text-partner-gray leading-snug">
            {statusTitle}
          </p>
        </div>
        {isPending && <StatusChip title="Urgent" urgent />}
      </div>
    </PartnerCard>
  );
}
