"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { isSameDay, weekInterval } from "../domain/calendar";
import {
  BookingTransition,
  CafePhotoAccess,
  HostedStats,
  MonthStats,
  ProfileGaps,
  ReportClock,
} from "../domain/rules";
import { Seed } from "../domain/seed";
import {
  AppNotification,
  Booking,
  bothStudents,
  Cafe,
  PhotoSubmission,
  PhotoTaskDefinition,
  PublicStudent,
  ReportResolution,
  SafetyReport,
  StaffAccount,
  StudentID,
} from "../domain/types";

export interface BookingRepository {
  bookings: Booking[];
  booking(id: string): Booking | undefined;
  visiblePhotos(bookingID: string): PhotoSubmission[];
  confirmDate(id: string): void;
  markNoShow(id: string): void;
  confirmReport(id: string): void;
  resolveReport(id: string, outcome: ReportResolution): void;
}

export interface PartnerStoreValue extends BookingRepository {
  cafe: Cafe;
  tasks: PhotoTaskDefinition[];
  submissions: PhotoSubmission[];
  reports: SafetyReport[];
  notifications: AppNotification[];
  accounts: StaffAccount[];
  session: StaffAccount | null;
  isOwner: boolean;
  pendingReports: SafetyReport[];
  customersBroughtIn: number;
  unfinishedProfile: string[];
  signIn(id: string): void;
  signOut(): void;
  student(id: StudentID): PublicStudent | undefined;
  report(id: string): SafetyReport | undefined;
  submission(bookingID: string, taskID: string): PhotoSubmission | undefined;
  todaysBookings(now?: Date): Booking[];
  weeksBookings(now?: Date): Booking[];
  openToday(now?: Date): Booking[];
  nextWindow(now?: Date): Booking | undefined;
  stats(containing: Date): MonthStats;
  setName(name: string): void;
  setAddress(address: string): void;
  setDescription(description: string): void;
  setHours(weekday: number, openHour: number | null, closeHour: number | null): void;
  addBusyBlock(start: Date, end: Date): void;
  removeBusyBlock(id: string): void;
  addPhoto(caption: string): void;
  removePhoto(id: string): void;
  addMenuItem(name: string, pricePesos: number): void;
  removeMenuItem(id: string): void;
}

const PartnerStoreContext = createContext<PartnerStoreValue | null>(null);

export function PartnerStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialSnapshot = useMemo(() => Seed.snapshot(new Date()), []);

  const [cafe, setCafe] = useState<Cafe>(initialSnapshot.cafe);
  const [bookings, setBookings] = useState<Booking[]>(initialSnapshot.bookings);
  const [tasks] = useState<PhotoTaskDefinition[]>(initialSnapshot.tasks);
  const [submissions] = useState<PhotoSubmission[]>(
    initialSnapshot.submissions
  );
  const [reports, setReports] = useState<SafetyReport[]>(
    initialSnapshot.reports
  );
  const [notifications] = useState<AppNotification[]>(
    initialSnapshot.notifications
  );
  const [accounts] = useState<StaffAccount[]>(initialSnapshot.accounts);
  const [session, setSession] = useState<StaffAccount | null>(null);

  const isOwner = session?.role === "owner";

  const pendingReports = useMemo(
    () => reports.filter((r) => r.status.kind === "reported"),
    [reports]
  );

  const customersBroughtIn = useMemo(
    () => HostedStats.customers(bookings),
    [bookings]
  );

  const unfinishedProfile = useMemo(
    () => ProfileGaps.unfinished(cafe),
    [cafe]
  );

  const signIn = useCallback(
    (id: string) => {
      const account = accounts.find((a) => a.id === id) ?? accounts[0] ?? null;
      setSession(account);
    },
    [accounts]
  );

  const signOut = useCallback(() => {
    setSession(null);
  }, []);

  const booking = useCallback(
    (id: string) => bookings.find((b) => b.id === id),
    [bookings]
  );

  const student = useCallback(
    (id: StudentID) => {
      for (const b of bookings) {
        for (const s of bothStudents(b.students)) {
          if (s.id === id) return s;
        }
      }
      return undefined;
    },
    [bookings]
  );

  const report = useCallback(
    (id: string) => reports.find((r) => r.id === id),
    [reports]
  );

  const submission = useCallback(
    (bookingID: string, taskID: string) =>
      submissions.find(
        (s) => s.bookingID === bookingID && s.taskID === taskID
      ),
    [submissions]
  );

  const visiblePhotos = useCallback(
    (bookingID: string) => CafePhotoAccess.visible(submissions, bookingID),
    [submissions]
  );

  const todaysBookings = useCallback(
    (now: Date = new Date()) =>
      bookings
        .filter((b) => isSameDay(b.windowStart, now))
        .sort((a, b) => a.windowStart.getTime() - b.windowStart.getTime()),
    [bookings]
  );

  const weeksBookings = useCallback(
    (now: Date = new Date()) => {
      const interval = weekInterval(now);
      return bookings
        .filter(
          (b) =>
            b.windowStart.getTime() >= interval.start.getTime() &&
            b.windowStart.getTime() < interval.end.getTime()
        )
        .filter((b) => !isSameDay(b.windowStart, now))
        .sort((a, b) => a.windowStart.getTime() - b.windowStart.getTime());
    },
    [bookings]
  );

  const openToday = useCallback(
    (now: Date = new Date()) =>
      todaysBookings(now).filter((b) => b.state.kind === "scheduled"),
    [todaysBookings]
  );

  const nextWindow = useCallback(
    (now: Date = new Date()) => {
      const open = openToday(now);
      return open[0];
    },
    [openToday]
  );

  const stats = useCallback(
    (containing: Date) => HostedStats.month(bookings, containing),
    [bookings]
  );

  const confirmDate = useCallback((id: string) => {
    const now = new Date();
    setBookings((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index === -1) return prev;
      const updated = BookingTransition.complete(prev[index]!, now);
      if (!updated) return prev;
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  }, []);

  const markNoShow = useCallback((id: string) => {
    const now = new Date();
    setBookings((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index === -1) return prev;
      const updated = BookingTransition.noShow(prev[index]!, now);
      if (!updated) return prev;
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  }, []);

  const confirmReport = useCallback(
    (id: string) => {
      const now = new Date();
      const actor = session?.name ?? "Staff";
      setReports((prev) => {
        const index = prev.findIndex((r) => r.id === id);
        if (index === -1) return prev;
        const updated = ReportClock.confirm(
          prev[index]!,
          now,
          cafe.latitude + 0.0004,
          cafe.longitude + 0.0002,
          actor
        );
        if (!updated) return prev;
        const next = [...prev];
        next[index] = updated;
        return next;
      });
    },
    [cafe.latitude, cafe.longitude, session?.name]
  );

  const resolveReport = useCallback(
    (id: string, outcome: ReportResolution) => {
      const now = new Date();
      const actor = session?.name ?? "Staff";
      setReports((prev) => {
        const index = prev.findIndex((r) => r.id === id);
        if (index === -1) return prev;
        const updated = ReportClock.resolve(prev[index]!, now, outcome, actor);
        if (!updated) return prev;
        const next = [...prev];
        next[index] = updated;
        return next;
      });
    },
    [session?.name]
  );

  const setName = useCallback(
    (name: string) => {
      if (!isOwner) return;
      setCafe((prev) => ({ ...prev, name }));
    },
    [isOwner]
  );

  const setAddress = useCallback(
    (address: string) => {
      if (!isOwner) return;
      setCafe((prev) => ({ ...prev, address }));
    },
    [isOwner]
  );

  const setDescription = useCallback(
    (description: string) => {
      if (!isOwner) return;
      setCafe((prev) => ({ ...prev, description }));
    },
    [isOwner]
  );

  const setHours = useCallback(
    (weekday: number, openHour: number | null, closeHour: number | null) => {
      if (!isOwner) return;
      setCafe((prev) => ({
        ...prev,
        hours: prev.hours.map((h) =>
          h.weekday === weekday ? { ...h, openHour, closeHour } : h
        ),
      }));
    },
    [isOwner]
  );

  const addBusyBlock = useCallback(
    (start: Date, end: Date) => {
      if (!isOwner || start.getTime() >= end.getTime()) return;
      const id = `busy-${Math.floor(start.getTime() / 1000)}`;
      setCafe((prev) => {
        if (prev.busy.some((b) => b.id === id)) return prev;
        return {
          ...prev,
          busy: [...prev.busy, { id, start, end }],
        };
      });
    },
    [isOwner]
  );

  const removeBusyBlock = useCallback(
    (id: string) => {
      if (!isOwner) return;
      setCafe((prev) => ({
        ...prev,
        busy: prev.busy.filter((b) => b.id !== id),
      }));
    },
    [isOwner]
  );

  const addPhoto = useCallback(
    (caption: string) => {
      if (!isOwner) return;
      const trimmed = caption.trim();
      if (!trimmed) return;
      setCafe((prev) => ({
        ...prev,
        gallery: [
          ...prev.gallery,
          { id: `photo-${prev.gallery.length}-${trimmed}`, caption: trimmed },
        ],
      }));
    },
    [isOwner]
  );

  const removePhoto = useCallback(
    (id: string) => {
      if (!isOwner) return;
      setCafe((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((p) => p.id !== id),
      }));
    },
    [isOwner]
  );

  const addMenuItem = useCallback(
    (name: string, pricePesos: number) => {
      if (!isOwner || pricePesos <= 0) return;
      const trimmed = name.trim();
      if (!trimmed) return;
      setCafe((prev) => ({
        ...prev,
        menu: [
          ...prev.menu,
          {
            id: `menu-${prev.menu.length}-${trimmed}`,
            name: trimmed,
            pricePesos,
          },
        ],
      }));
    },
    [isOwner]
  );

  const removeMenuItem = useCallback(
    (id: string) => {
      if (!isOwner) return;
      setCafe((prev) => ({
        ...prev,
        menu: prev.menu.filter((m) => m.id !== id),
      }));
    },
    [isOwner]
  );

  const value = useMemo<PartnerStoreValue>(
    () => ({
      cafe,
      bookings,
      tasks,
      submissions,
      reports,
      notifications,
      accounts,
      session,
      isOwner,
      pendingReports,
      customersBroughtIn,
      unfinishedProfile,
      signIn,
      signOut,
      booking,
      student,
      report,
      submission,
      visiblePhotos,
      todaysBookings,
      weeksBookings,
      openToday,
      nextWindow,
      stats,
      confirmDate,
      markNoShow,
      confirmReport,
      resolveReport,
      setName,
      setAddress,
      setDescription,
      setHours,
      addBusyBlock,
      removeBusyBlock,
      addPhoto,
      removePhoto,
      addMenuItem,
      removeMenuItem,
    }),
    [
      cafe,
      bookings,
      tasks,
      submissions,
      reports,
      notifications,
      accounts,
      session,
      isOwner,
      pendingReports,
      customersBroughtIn,
      unfinishedProfile,
      signIn,
      signOut,
      booking,
      student,
      report,
      submission,
      visiblePhotos,
      todaysBookings,
      weeksBookings,
      openToday,
      nextWindow,
      stats,
      confirmDate,
      markNoShow,
      confirmReport,
      resolveReport,
      setName,
      setAddress,
      setDescription,
      setHours,
      addBusyBlock,
      removeBusyBlock,
      addPhoto,
      removePhoto,
      addMenuItem,
      removeMenuItem,
    ]
  );

  return (
    <PartnerStoreContext.Provider value={value}>
      {children}
    </PartnerStoreContext.Provider>
  );
}

export function usePartnerStore(): PartnerStoreValue {
  const ctx = useContext(PartnerStoreContext);
  if (!ctx) {
    throw new Error("usePartnerStore must be used inside PartnerStoreProvider");
  }
  return ctx;
}
