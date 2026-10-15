"use client";

import React from "react";
import { AlertsScreen, ReportDetailScreen } from "../screens/alerts-screen";
import {
  BillingScreen,
  BusyEditorScreen,
  CafeHomeScreen,
  CafePreviewScreen,
  GalleryEditorScreen,
  HoursEditorScreen,
  MenuEditorScreen,
} from "../screens/cafe-screens";
import { CalendarScreen } from "../screens/calendar-screen";
import {
  DateDetailScreen,
  StudentProfileScreen,
} from "../screens/date-detail-screen";
import { SignInScreen } from "../screens/sign-in-screen";
import { TodayScreen } from "../screens/today-screen";
import { usePartnerStore } from "../store/partner-store";
import { AppRoute, TabID, useNavigation } from "./routes";

function RouteDestination({ route }: { route: AppRoute }) {
  switch (route.kind) {
    case "hours":
      return <HoursEditorScreen />;
    case "busy":
      return <BusyEditorScreen />;
    case "gallery":
      return <GalleryEditorScreen />;
    case "menu":
      return <MenuEditorScreen />;
    case "preview":
      return <CafePreviewScreen />;
    case "billing":
      return <BillingScreen />;
    case "booking":
      return <DateDetailScreen bookingID={route.bookingID} />;
    case "report":
      return <ReportDetailScreen reportID={route.reportID} />;
    case "student":
      return <StudentProfileScreen studentID={route.studentID} />;
  }
}

function TabRoot({ tab }: { tab: TabID }) {
  switch (tab) {
    case "today":
      return <TodayScreen />;
    case "calendar":
      return <CalendarScreen />;
    case "alerts":
      return <AlertsScreen />;
    case "cafe":
      return <CafeHomeScreen />;
  }
}

function TabIcon({ id }: { id: TabID }) {
  switch (id) {
    case "today":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case "calendar":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "alerts":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "cafe":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M3 9l1.5-5h15L21 9" />
          <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
          <path d="M5 12v8h14v-8" />
        </svg>
      );
  }
}

export function PartnerAppShell() {
  const store = usePartnerStore();
  const nav = useNavigation();

  if (!store.session) {
    return <SignInScreen />;
  }

  const tabs: Array<{ id: TabID; label: string; badge?: number }> = [
    { id: "today", label: "Today" },
    { id: "calendar", label: "Calendar" },
    {
      id: "alerts",
      label: "Alerts",
      badge: store.pendingReports.length,
    },
    ...(store.isOwner ? [{ id: "cafe" as const, label: "Café" }] : []),
  ];

  const isRoot = nav.currentRoute === null;

  return (
    <div className="min-h-dvh flex flex-col bg-partner-white text-partner-ink">
      <header
        aria-label="Navigation bar"
        className="sticky top-0 z-20 bg-partner-white/95 backdrop-blur border-b border-partner-line/60"
      >
        {isRoot ? (
          <div className="px-6 pt-3 pb-2.5 flex items-center justify-between min-h-[52px]">
            <h1 className="text-[28px] font-bold text-partner-ink">
              {nav.currentTitle}
            </h1>
            {nav.activeTab === "today" && (
              <button
                type="button"
                data-testid="sign-out"
                onClick={() => {
                  nav.resetAll();
                  store.signOut();
                }}
                className="min-h-[44px] px-2 text-[15px] font-semibold text-partner-burgundy"
              >
                Sign out
              </button>
            )}
          </div>
        ) : (
          <div className="px-4 py-2 flex items-center justify-between min-h-[48px]">
            <button
              type="button"
              data-testid={`nav-back-${nav.backTitle}`}
              onClick={() => nav.pop()}
              className="min-h-[44px] px-2 flex items-center gap-1 text-[16px] font-semibold text-partner-burgundy"
            >
              <span aria-hidden="true">‹</span>
              <span>{nav.backTitle}</span>
            </button>
            <h1 className="text-[17px] font-semibold text-partner-ink">
              {nav.currentTitle}
            </h1>
            <div className="w-16" />
          </div>
        )}
      </header>

      <main className="flex-1 pt-4 pb-20">
        {nav.currentRoute ? (
          <RouteDestination route={nav.currentRoute} />
        ) : (
          <TabRoot tab={nav.activeTab} />
        )}
      </main>

      <nav
        aria-label="Tab bar"
        className="fixed bottom-0 left-0 right-0 z-30 bg-partner-white border-t border-partner-line px-2 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="flex items-stretch justify-around max-w-lg mx-auto">
          {tabs.map((tab) => {
            const active = nav.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-testid={`tab-${tab.label}`}
                onClick={() => nav.selectTab(tab.id)}
                className={`relative flex-1 min-h-[56px] py-1.5 flex flex-col items-center justify-center gap-0.5 text-[12px] font-semibold transition-colors ${
                  active ? "text-partner-burgundy" : "text-partner-gray"
                }`}
              >
                <TabIcon id={tab.id} />
                <span className="text-[11px] font-semibold">{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span
                    data-testid={`badge-${tab.label}`}
                    className="absolute top-1.5 right-1/4 min-w-[18px] h-[18px] px-1 rounded-full bg-partner-burgundy text-partner-white text-[11px] font-bold flex items-center justify-center"
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
