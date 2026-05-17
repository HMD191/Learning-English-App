"use client";

import { useState } from "react";

export default function LearningProgress() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const progressItems = [
    {
      label: "Reading",
      value: 92,
    },
    {
      label: "Writing",
      value: 78,
    },
    {
      label: "Speaking",
      value: 64,
    },
  ];

  return (
    <>
      <div className="bg-white rounded-xl border border-surface-variant shadow-sm overflow-hidden">
        <div className="p-stack-md bg-surface-container-low border-b border-surface-variant">
          <h3 className="font-headline-sm text-headline-sm">
            Learning Progress
          </h3>
        </div>

        <div className="p-stack-md space-y-6">
          {progressItems.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between text-label-sm font-label-sm">
                <span>{item.label}</span>
                <span className="text-primary">{item.value}%</span>
              </div>

              <div className="w-full h-2 bg-surface-container-low rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-stack-md border-t border-surface-variant bg-surface-container-lowest">
          <button
            type="button"
            onClick={() => setIsPopupOpen(true)}
            className="text-primary font-label-md text-label-md flex items-center gap-2 hover:underline"
          >
            Full assessment report
            {/* <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span> */}
          </button>
        </div>
      </div>

      {isPopupOpen && (
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
                Full assessment reports are not supported yet. This feature will
                be added in a future update.
              </p>

              <button
                type="button"
                onClick={() => setIsPopupOpen(false)}
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