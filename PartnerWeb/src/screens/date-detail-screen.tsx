"use client";

import React from "react";
import {
  BottomActionBar,
  MockPhotoTile,
  PartnerCard,
  PrimaryButton,
  SecondaryButton,
  StatusChip,
  StudentAvatar,
} from "../components/theme";
import { DateWindow } from "../domain/rules";
import { Booking, bothStudents, isBothInside, StudentID } from "../domain/types";
import { useNavigation } from "../navigation/routes";
import { usePartnerStore } from "../store/partner-store";

function checkInLine(booking: Booking): string {
  if (isBothInside(booking)) return "Both students are inside.";
  const count = booking.checkedInStudentIDs.length;
  if (count === 1) return "One student is inside.";
  return "Neither student is inside yet.";
}

export function DateDetailScreen({ bookingID }: { bookingID: string }) {
  const store = usePartnerStore();
  const nav = useNavigation();
  const booking = store.booking(bookingID);

  if (!booking) {
    return (
      <div className="px-6 py-4">
        <p className="text-[17px] text-partner-ink">
          This date is no longer on the list.
        </p>
      </div>
    );
  }

  const bothIn = isBothInside(booking);
  const visibleList = store.visiblePhotos(booking.id);

  return (
    <div className="flex flex-col min-h-[calc(100dvh-120px)] justify-between">
      <div className="px-6 pb-8 space-y-6">
        <PartnerCard>
          <div className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-[26px] font-bold text-partner-ink leading-tight">
                {booking.students.first.firstName} and{" "}
                {booking.students.second.firstName}
              </h2>
              <div className="shrink-0">
                {booking.state.kind === "scheduled" && (
                  <StatusChip title="Scheduled" />
                )}
                {booking.state.kind === "completed" && (
                  <StatusChip title="Completed" resolved />
                )}
                {booking.state.kind === "noShow" && (
                  <StatusChip title="No-show" />
                )}
              </div>
            </div>

            <p className="text-[16px] font-semibold text-partner-burgundy">
              {DateWindow.label(booking.windowStart, booking.windowEnd)}
            </p>

            <p
              data-testid="check-in-line"
              className="text-[17px] text-partner-ink"
            >
              {checkInLine(booking)}
            </p>

            {booking.state.kind === "completed" && (
              <p className="text-[14px] text-partner-gray">
                This date counts toward customers brought in.
              </p>
            )}
          </div>
        </PartnerCard>

        <section className="space-y-4">
          <h3 className="text-[20px] font-bold text-partner-ink">Students</h3>
          {bothStudents(booking.students).map((student) => (
            <button
              key={student.id}
              type="button"
              data-testid={`student-${student.id}`}
              onClick={() =>
                nav.push({ kind: "student", studentID: student.id })
              }
              className="w-full text-left block"
            >
              <PartnerCard>
                <div className="flex items-center gap-4">
                  <StudentAvatar name={student.firstName} side={52} />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-[18px] font-semibold text-partner-ink">
                      {student.firstName}
                    </p>
                    <p className="text-[14px] text-partner-gray">
                      {student.school}
                    </p>
                  </div>
                  {student.isVerified && (
                    <StatusChip title="Verified" resolved />
                  )}
                  <span className="text-partner-burgundy font-semibold text-sm">
                    ›
                  </span>
                </div>
              </PartnerCard>
            </button>
          ))}
        </section>

        <section className="space-y-4">
          <h3 className="text-[20px] font-bold text-partner-ink">Photos</h3>
          {store.tasks.map((task) => {
            const sub = store.submission(booking.id, task.id);
            const visible = visibleList.find((v) => v.taskID === task.id);
            return (
              <PartnerCard key={task.id}>
                <div className="space-y-4">
                  <p className="text-[17px] font-semibold text-partner-ink">
                    {task.title}
                  </p>
                  {visible ? (
                    visible.imageLabels.length > 1 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {visible.imageLabels.map((label) => (
                          <MockPhotoTile
                            key={label}
                            label={label}
                            height={140}
                          />
                        ))}
                      </div>
                    ) : (
                      visible.imageLabels.map((label) => (
                        <MockPhotoTile key={label} label={label} height={172} />
                      ))
                    )
                  ) : sub ? (
                    <p
                      data-testid={`photos-waiting-${task.id}`}
                      className="text-[17px] text-partner-ink"
                    >
                      Waiting for the students to share these photos.
                    </p>
                  ) : (
                    <p
                      data-testid={`photos-empty-${task.id}`}
                      className="text-[14px] text-partner-gray"
                    >
                      No photos for this task.
                    </p>
                  )}
                </div>
              </PartnerCard>
            );
          })}
        </section>
      </div>

      {booking.state.kind === "scheduled" && (
        <BottomActionBar>
          {bothIn ? (
            <PrimaryButton
              title="Confirm date happened"
              testId="confirm-date"
              onClick={() => store.confirmDate(booking.id)}
            />
          ) : (
            <p className="text-[14px] text-partner-gray">
              Confirm is available once both students are inside.
            </p>
          )}
          <SecondaryButton
            title="Mark no-show"
            testId="mark-no-show"
            onClick={() => store.markNoShow(booking.id)}
          />
        </BottomActionBar>
      )}
    </div>
  );
}

export function StudentProfileScreen({ studentID }: { studentID: StudentID }) {
  const store = usePartnerStore();
  const student = store.student(studentID);

  if (!student) {
    return (
      <div className="px-6 py-4">
        <p className="text-[17px] text-partner-ink">
          This profile is not available.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8 space-y-6">
      <PartnerCard>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <StudentAvatar name={student.firstName} side={84} />
            <div className="space-y-1.5">
              <h2 className="text-[32px] font-bold text-partner-ink leading-tight">
                {student.firstName}
              </h2>
              {student.isVerified && <StatusChip title="Verified" resolved />}
            </div>
          </div>
          <p className="text-[17px] text-partner-ink">{student.school}</p>
          <p className="text-[14px] text-partner-gray">
            Email, phone, ID, and emergency contact stay off this screen.
          </p>
        </div>
      </PartnerCard>
    </div>
  );
}
