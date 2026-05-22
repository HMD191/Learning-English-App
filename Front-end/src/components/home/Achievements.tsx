"use client";

import { useState } from "react";

export default function Achievements() {
  const [selectedAchievement, setSelectedAchievement] = useState("");

  const achievements = [
    {
      title: "Fast Learner",
      icon: "bolt",
      className: "bg-secondary-container text-on-secondary-container",
    },
    {
      title: "Perfect Quiz",
      icon: "star",
      className: "bg-surface-container-highest text-primary",
    },
    {
      title: "7 Day Streak",
      icon: "calendar_today",
      className: "bg-primary-fixed text-primary",
    },
    {
      title: "Locked Achievement",
      icon: "lock",
      className: "bg-surface-container-low text-outline opacity-50",
    },
  ];

  function closePopup() {
    setSelectedAchievement("");
  }

  return (
    <>
      <div className="hidden md:grid bg-white p-stack-md rounded-xl border border-surface-variant shadow-sm">
        <h3 className="font-label-md text-label-md font-bold mb-4">
          Achievements
        </h3>

        <div className="flex flex-wrap gap-2">
          {achievements.map((achievement) => (
            <button
              key={achievement.title}
              type="button"
              onClick={() => setSelectedAchievement(achievement.title)}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 active:scale-95 transition-transform ${achievement.className}`}
              title={achievement.title}
              aria-label={achievement.title}
            >
              <span className="material-symbols-outlined">
                {achievement.icon}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedAchievement && (
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
                Achievement details for “{selectedAchievement}” are not
                supported yet. This feature will be added in a future update.
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