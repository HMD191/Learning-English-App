"use client";

import { useState } from "react";

export default function LearningQueue() {
  const [popupMessage, setPopupMessage] = useState("");

  const lessons = [
    {
      type: "Grammar",
      title: "Passive Voice Mastery",
      description: "Mastering complex sentence structures in academic writing.",
      time: "20 mins",
      progress: "65%",
      badgeClass: "bg-secondary-container text-on-secondary-container",
    },
    {
      type: "Listening",
      title: "The Art of Debating",
      description: "Analyzing nuances in argumentative English speeches.",
      time: "15 mins",
      progress: "10%",
      badgeClass: "bg-surface-container-highest text-on-surface-variant",
    },
  ];

  function openComingSoonPopup(message: string) {
    setPopupMessage(message);
  }

  function closePopup() {
    setPopupMessage("");
  }

  return (
    <>
      <div className="space-y-gutter">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Up Next
          </h3>

          <button
            type="button"
            onClick={() =>
              openComingSoonPopup(
                "The learning schedule is not available yet. This feature will be added in a future update."
              )
            }
            className="text-primary font-label-md text-label-md border-b border-primary/30 hover:border-primary transition-all"
          >
            View Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
          {lessons.map((lesson) => (
            <button
              key={lesson.title}
              type="button"
              onClick={() =>
                openComingSoonPopup(
                  `"${lesson.title}" is not available yet. This lesson will be supported in a future update.`
                )
              }
              className="text-left bg-white p-stack-md rounded-xl border border-surface-variant shadow-sm hover:translate-y-[-4px] transition-transform cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${lesson.badgeClass}`}
                >
                  {lesson.type}
                </span>

                <span className="text-on-surface-variant text-xs">
                  {lesson.time}
                </span>
              </div>

              <h4 className="font-headline-sm text-headline-sm mb-2 text-on-surface">
                {lesson.title}
              </h4>

              <p className="text-body-sm text-on-surface-variant mb-4">
                {lesson.description}
              </p>

              <div className="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full"
                  style={{ width: lesson.progress }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {popupMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-outline-variant shadow-[0_20px_50px_rgba(0,0,0,0.16)] overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-primary">
                <span className="material-symbols-outlined">
                  construction
                </span>
              </div>

              <h3 className="text-[20px] leading-7 font-bold text-on-surface">
                Feature not available yet
              </h3>

              <p className="mt-2 text-[14px] leading-6 text-on-surface-variant">
                {popupMessage}
              </p>

              <button
                type="button"
                onClick={closePopup}
                className="mt-6 w-full rounded-xl bg-primary px-5 py-2.5 text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}