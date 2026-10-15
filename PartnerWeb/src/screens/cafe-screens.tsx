"use client";

import React, { useRef, useState } from "react";
import {
  BottomActionBar,
  MockPhotoTile,
  PartnerCard,
  PrimaryButton,
  StatusChip,
} from "../components/theme";
import {
  addDays,
  formatShortTime,
  setHourMinute,
  startOfDay,
  WEEKDAY_NAMES,
} from "../domain/calendar";
import { DateWindow, Peso } from "../domain/rules";
import {
  isDayOpen,
  tierDetail,
  tierMonthlyPesos,
  tierTitle,
} from "../domain/types";
import { AppRoute, useNavigation } from "../navigation/routes";
import { usePartnerStore } from "../store/partner-store";

export function CafeHomeScreen() {
  const store = usePartnerStore();
  const nav = useNavigation();
  const sectionsRef = useRef<HTMLDivElement | null>(null);

  const rows: Array<{
    title: string;
    route: AppRoute;
    testId?: string;
  }> = [
    { title: "Opening hours", route: { kind: "hours" } },
    { title: "Busy times", route: { kind: "busy" } },
    { title: "Photos", route: { kind: "gallery" } },
    { title: "Menu", route: { kind: "menu" } },
    { title: "Preview in the student app", route: { kind: "preview" } },
    {
      title: "Tier and billing",
      route: { kind: "billing" },
      testId: "tier-and-billing",
    },
  ];

  return (
    <div className="px-6 pb-8 space-y-6">
      <PartnerCard>
        <div className="space-y-4">
          <MockPhotoTile
            label={store.cafe.gallery[0]?.caption ?? "Exterior"}
            height={156}
          />
          <p className="text-[14px] text-partner-gray">How students see you</p>

          <label className="block space-y-2">
            <span className="text-[14px] font-semibold text-partner-ink">
              Name
            </span>
            <input
              type="text"
              value={store.cafe.name}
              onChange={(e) => store.setName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-[14px] bg-partner-surface border border-partner-line text-[17px] text-partner-ink focus:outline-none focus:border-partner-burgundy"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[14px] font-semibold text-partner-ink">
              Address
            </span>
            <input
              type="text"
              value={store.cafe.address}
              onChange={(e) => store.setAddress(e.target.value)}
              className="w-full px-4 py-3.5 rounded-[14px] bg-partner-surface border border-partner-line text-[17px] text-partner-ink focus:outline-none focus:border-partner-burgundy"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[14px] font-semibold text-partner-ink">
              Description
            </span>
            <textarea
              rows={2}
              placeholder="What should students know?"
              value={store.cafe.description}
              onChange={(e) => store.setDescription(e.target.value)}
              className="w-full px-4 py-3.5 rounded-[14px] bg-partner-surface border border-partner-line text-[17px] text-partner-ink focus:outline-none focus:border-partner-burgundy"
            />
          </label>
        </div>
      </PartnerCard>

      <div className="space-y-4">
        <button
          type="button"
          data-testid="cafe-section-menu"
          onClick={() =>
            sectionsRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
          className="w-full min-h-[44px] text-left space-y-0.5"
        >
          <p className="text-[20px] font-bold text-partner-ink">
            Choose a section
          </p>
          <p className="text-[14px] text-partner-gray">
            Hours, photos, menu, preview, billing
          </p>
        </button>

        <div id="cafe-sections" ref={sectionsRef}>
          <PartnerCard className="p-0 overflow-hidden">
            <div className="divide-y divide-partner-line px-4">
              {rows.map((row) => (
                <button
                  key={row.title}
                  type="button"
                  data-testid={row.testId ?? row.title}
                  onClick={() => nav.push(row.route)}
                  className="w-full min-h-[56px] flex items-center justify-between gap-4 text-left"
                >
                  <span className="text-[17px] font-semibold text-partner-ink">
                    {row.title}
                  </span>
                  <span className="text-partner-burgundy font-semibold text-sm">
                    ›
                  </span>
                </button>
              ))}
            </div>
          </PartnerCard>
        </div>
      </div>
    </div>
  );
}

function hourLabel(hour: number): string {
  const d = setHourMinute(new Date(), hour, 0);
  return formatShortTime(d);
}

export function HoursEditorScreen() {
  const store = usePartnerStore();

  return (
    <div className="px-6 pb-8 space-y-3">
      {store.cafe.hours.map((day) => {
        const open = isDayOpen(day);
        const dayName = WEEKDAY_NAMES[day.weekday - 1] ?? "Day";
        const openHour = day.openHour ?? 8;
        const closeHour = day.closeHour ?? 18;

        return (
          <PartnerCard key={day.weekday}>
            <div className="space-y-3">
              <label className="flex items-center justify-between gap-3 min-h-[36px] cursor-pointer">
                <span className="text-[17px] font-semibold text-partner-ink">
                  {dayName}
                </span>
                <input
                  type="checkbox"
                  checked={open}
                  onChange={(e) => {
                    if (e.target.checked) {
                      store.setHours(day.weekday, 8, 18);
                    } else {
                      store.setHours(day.weekday, null, null);
                    }
                  }}
                  className="w-5 h-5 accent-partner-burgundy"
                />
              </label>

              {open && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[16px] text-partner-ink">
                      Opens {hourLabel(openHour)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          store.setHours(
                            day.weekday,
                            Math.max(6, openHour - 1),
                            closeHour
                          )
                        }
                        className="w-9 h-9 rounded-lg border border-partner-line bg-partner-surface font-bold"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          store.setHours(
                            day.weekday,
                            Math.min(20, openHour + 1),
                            closeHour
                          )
                        }
                        className="w-9 h-9 rounded-lg border border-partner-line bg-partner-surface font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[16px] text-partner-ink">
                      Closes {hourLabel(closeHour)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          store.setHours(
                            day.weekday,
                            openHour,
                            Math.max(8, closeHour - 1)
                          )
                        }
                        className="w-9 h-9 rounded-lg border border-partner-line bg-partner-surface font-bold"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          store.setHours(
                            day.weekday,
                            openHour,
                            Math.min(23, closeHour + 1)
                          )
                        }
                        className="w-9 h-9 rounded-lg border border-partner-line bg-partner-surface font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </PartnerCard>
        );
      })}
    </div>
  );
}

export function BusyEditorScreen() {
  const store = usePartnerStore();

  const tomorrowAt = (hour: number) => {
    const tomorrow = addDays(startOfDay(new Date()), 1);
    return setHourMinute(tomorrow, hour, 0);
  };

  return (
    <div className="flex flex-col min-h-[calc(100dvh-120px)] justify-between">
      <div className="px-6 pb-8 space-y-6">
        <p className="text-[17px] text-partner-ink">
          Dates that overlap a busy block will not be offered to students.
        </p>

        {store.cafe.busy.length === 0 && (
          <p className="text-[14px] text-partner-gray">No busy blocks.</p>
        )}

        {store.cafe.busy.map((block) => (
          <PartnerCard key={block.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[17px] text-partner-ink">
                {DateWindow.label(block.start, block.end)}
              </p>
              <button
                type="button"
                onClick={() => store.removeBusyBlock(block.id)}
                className="min-h-[44px] px-2 text-[15px] font-semibold text-partner-burgundy"
              >
                Remove
              </button>
            </div>
          </PartnerCard>
        ))}
      </div>

      <BottomActionBar>
        <PrimaryButton
          title="Block tomorrow, 2:00 PM to 5:00 PM"
          onClick={() => store.addBusyBlock(tomorrowAt(14), tomorrowAt(17))}
        />
      </BottomActionBar>
    </div>
  );
}

export function GalleryEditorScreen() {
  const store = usePartnerStore();
  const [caption, setCaption] = useState("");

  return (
    <div className="px-6 pb-8 space-y-6">
      <PartnerCard>
        <div className="space-y-3">
          <p className="text-[16px] font-semibold text-partner-ink">
            New photo
          </p>
          <input
            type="text"
            placeholder="Photo caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-3.5 rounded-[14px] bg-partner-surface border border-partner-line text-[17px] text-partner-ink focus:outline-none focus:border-partner-burgundy"
          />
          <PrimaryButton
            title="Add photo"
            onClick={() => {
              store.addPhoto(caption);
              setCaption("");
            }}
          />
        </div>
      </PartnerCard>

      {store.cafe.gallery.map((photo) => (
        <PartnerCard key={photo.id}>
          <div className="space-y-3">
            <MockPhotoTile label={photo.caption} height={164} />
            <div className="flex items-center justify-between gap-3">
              <span className="text-[16px] font-semibold text-partner-ink">
                {photo.caption}
              </span>
              <button
                type="button"
                onClick={() => store.removePhoto(photo.id)}
                className="min-h-[44px] px-2 text-[15px] font-semibold text-partner-burgundy"
              >
                Remove
              </button>
            </div>
          </div>
        </PartnerCard>
      ))}
    </div>
  );
}

export function MenuEditorScreen() {
  const store = usePartnerStore();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(150);

  return (
    <div className="px-6 pb-8 space-y-6">
      <PartnerCard>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3.5 rounded-[14px] bg-partner-surface border border-partner-line text-[17px] text-partner-ink focus:outline-none focus:border-partner-burgundy"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-[17px] text-partner-ink">
              Price {Peso.string(price)}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPrice((p) => Math.max(20, p - 10))}
                className="w-10 h-10 rounded-lg border border-partner-line bg-partner-surface font-bold"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setPrice((p) => Math.min(2000, p + 10))}
                className="w-10 h-10 rounded-lg border border-partner-line bg-partner-surface font-bold"
              >
                +
              </button>
            </div>
          </div>
          <PrimaryButton
            title="Add menu item"
            onClick={() => {
              store.addMenuItem(name, price);
              setName("");
            }}
          />
        </div>
      </PartnerCard>

      {store.cafe.menu.length === 0 && (
        <p className="text-[14px] text-partner-gray">No menu items yet.</p>
      )}

      {store.cafe.menu.map((item) => (
        <PartnerCard key={item.id}>
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[17px] font-semibold text-partner-ink">
                {item.name}
              </p>
              <p className="text-[14px] text-partner-gray">
                {Peso.string(item.pricePesos)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => store.removeMenuItem(item.id)}
              className="min-h-[44px] px-2 text-[15px] font-semibold text-partner-burgundy"
            >
              Remove
            </button>
          </div>
        </PartnerCard>
      ))}
    </div>
  );
}

export function CafePreviewScreen() {
  const store = usePartnerStore();
  const [showMenu, setShowMenu] = useState(false);

  const openDays = store.cafe.hours.filter(isDayOpen);
  const hoursLine =
    openDays.length === 0
      ? "Hours not set"
      : `Open on ${openDays.length} days`;

  return (
    <div className="px-6 pb-8 space-y-6">
      <MockPhotoTile
        label={store.cafe.gallery[0]?.caption ?? store.cafe.name}
        height={220}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[32px] font-bold text-partner-ink leading-tight">
            {store.cafe.name}
          </h2>
          {store.cafe.tier === "senior" && (
            <StatusChip title="Featured" resolved />
          )}
        </div>

        <p className="text-[14px] text-partner-gray">{hoursLine}</p>

        {store.cafe.description.length > 0 && (
          <p className="text-[17px] text-partner-ink">
            {store.cafe.description}
          </p>
        )}

        <div className="grid grid-cols-2 p-1 rounded-xl bg-partner-surface border border-partner-line">
          <button
            type="button"
            onClick={() => setShowMenu(false)}
            className={`min-h-[36px] rounded-lg text-[14px] font-semibold ${
              !showMenu
                ? "bg-partner-white text-partner-ink shadow-sm"
                : "text-partner-gray"
            }`}
          >
            Photos
          </button>
          <button
            type="button"
            onClick={() => setShowMenu(true)}
            className={`min-h-[36px] rounded-lg text-[14px] font-semibold ${
              showMenu
                ? "bg-partner-white text-partner-ink shadow-sm"
                : "text-partner-gray"
            }`}
          >
            Menu
          </button>
        </div>

        {showMenu ? (
          <div className="space-y-3">
            {store.cafe.menu.length === 0 && (
              <p className="text-[14px] text-partner-gray">No menu yet.</p>
            )}
            {store.cafe.menu.map((item) => (
              <PartnerCard key={item.id}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[17px] text-partner-ink">
                    {item.name}
                  </span>
                  <span className="text-[17px] font-semibold text-partner-ink">
                    {Peso.string(item.pricePesos)}
                  </span>
                </div>
              </PartnerCard>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {store.cafe.gallery.length === 0 && (
              <p className="text-[14px] text-partner-gray">No photos yet.</p>
            )}
            {store.cafe.gallery.map((photo) => (
              <MockPhotoTile
                key={photo.id}
                label={photo.caption}
                height={164}
              />
            ))}
          </div>
        )}

        <PartnerCard>
          <div className="space-y-1.5">
            <p className="text-[18px] font-bold text-partner-ink">Location</p>
            <p className="text-[17px] text-partner-ink">{store.cafe.address}</p>
            <p className="text-[14px] text-partner-gray">
              Shown on the map in the student app
            </p>
          </div>
        </PartnerCard>
      </div>
    </div>
  );
}

export function BillingScreen() {
  const store = usePartnerStore();
  const customers = store.customersBroughtIn;
  const pct = Math.min(100, (Math.min(customers, 500) / 500) * 100);

  return (
    <div className="px-6 pb-8 space-y-6">
      <PartnerCard>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[26px] font-bold text-partner-ink">
              {tierTitle(store.cafe.tier)}
            </h2>
            <StatusChip title="Active tier" resolved />
          </div>
          <p className="text-[17px] text-partner-ink">
            {tierDetail(store.cafe.tier)}
          </p>
          <p className="text-[18px] font-bold text-partner-burgundy">
            {Peso.string(tierMonthlyPesos(store.cafe.tier))} a month
          </p>
        </div>
      </PartnerCard>

      <PartnerCard>
        <div className="space-y-3">
          <p
            data-testid="billing-customers"
            aria-label={`${customers} of 500 customers`}
            className="text-[26px] font-bold text-partner-ink"
          >
            {customers} of 500 customers
          </p>
          <div className="w-full h-2.5 rounded-full bg-partner-surface overflow-hidden border border-partner-line">
            <div
              style={{ width: `${pct}%` }}
              className="h-full bg-partner-burgundy rounded-full transition-all"
            />
          </div>
          <p className="text-[17px] text-partner-ink">
            {customers < 500
              ? "Free until 500 customers. Then the monthly fee starts."
              : "Monthly billing has started."}
          </p>
        </div>
      </PartnerCard>

      <p className="text-[14px] text-partner-gray">
        This screen does not take payment.
      </p>
    </div>
  );
}
