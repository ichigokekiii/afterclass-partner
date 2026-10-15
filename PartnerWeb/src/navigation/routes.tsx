"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { StudentID } from "../domain/types";

export type TabID = "today" | "calendar" | "alerts" | "cafe";

export type AppRoute =
  | { kind: "hours" }
  | { kind: "busy" }
  | { kind: "gallery" }
  | { kind: "menu" }
  | { kind: "preview" }
  | { kind: "billing" }
  | { kind: "booking"; bookingID: string }
  | { kind: "report"; reportID: string }
  | { kind: "student"; studentID: StudentID };

export function tabRootTitle(tab: TabID): string {
  switch (tab) {
    case "today":
      return "Today";
    case "calendar":
      return "Calendar";
    case "alerts":
      return "Alerts";
    case "cafe":
      return "Café";
  }
}

export function routeTitle(route: AppRoute): string {
  switch (route.kind) {
    case "hours":
      return "Hours";
    case "busy":
      return "Busy times";
    case "gallery":
      return "Photos";
    case "menu":
      return "Menu";
    case "preview":
      return "Preview";
    case "billing":
      return "Billing";
    case "booking":
      return "Date";
    case "report":
      return "Report";
    case "student":
      return "Profile";
  }
}

interface NavigationContextValue {
  activeTab: TabID;
  stack: AppRoute[];
  currentRoute: AppRoute | null;
  currentTitle: string;
  backTitle: string | null;
  selectTab(tab: TabID): void;
  push(route: AppRoute): void;
  pop(): void;
  resetAll(): void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

const INITIAL_STACKS: Record<TabID, AppRoute[]> = {
  today: [],
  calendar: [],
  alerts: [],
  cafe: [],
};

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabID>("today");
  const [stacks, setStacks] = useState<Record<TabID, AppRoute[]>>(INITIAL_STACKS);

  const stack = stacks[activeTab];
  const currentRoute = stack.length > 0 ? stack[stack.length - 1]! : null;

  const currentTitle = currentRoute
    ? routeTitle(currentRoute)
    : tabRootTitle(activeTab);

  const backTitle = useMemo(() => {
    if (stack.length === 0) return null;
    if (stack.length === 1) return tabRootTitle(activeTab);
    return routeTitle(stack[stack.length - 2]!);
  }, [activeTab, stack]);

  const selectTab = useCallback((tab: TabID) => {
    setActiveTab((prev) => {
      if (prev === tab) {
        setStacks((s) => ({ ...s, [tab]: [] }));
      }
      return tab;
    });
  }, []);

  const push = useCallback(
    (route: AppRoute) => {
      setStacks((prev) => ({
        ...prev,
        [activeTab]: [...prev[activeTab], route],
      }));
    },
    [activeTab]
  );

  const pop = useCallback(() => {
    setStacks((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].slice(0, -1),
    }));
  }, [activeTab]);

  const resetAll = useCallback(() => {
    setActiveTab("today");
    setStacks(INITIAL_STACKS);
  }, []);

  const value = useMemo<NavigationContextValue>(
    () => ({
      activeTab,
      stack,
      currentRoute,
      currentTitle,
      backTitle,
      selectTab,
      push,
      pop,
      resetAll,
    }),
    [activeTab, stack, currentRoute, currentTitle, backTitle, selectTab, push, pop, resetAll]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return ctx;
}
