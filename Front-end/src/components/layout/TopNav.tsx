"use client";
import { useState } from "react";

export default function TopNav() {

  const [isGiftOpen, setIsGiftOpen] = useState(false);
  return (
    <>
      <header className="grid grid-cols-[1fr_auto] items-center px-4 py-2 w-full z-50 bg-white/90 backdrop-blur-md border-b border-outline-variant/70 lg:px-margin-desktop lg:py-3 lg:grid-cols-12">
        <div className="flex items-center justify-start lg:col-span-1">
          <span className="md:hidden font-bold text-primary text-base">
            English Master
          </span>
        </div>

        <div className="hidden lg:flex items-center justify-center lg:col-span-8">
          <div className="relative hidden lg:block w-full max-w-[760px]">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline text-[21px]">
              search
            </span>

            <input
              className="w-full h-11 pl-11 pr-4 bg-surface-container-low border border-transparent rounded-full text-label-md font-normal text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" placeholder="Search words or lessons..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 lg:col-span-3">

          <button
            type="button"
            onClick={() => setIsGiftOpen(true)}
            className="relative h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-error" />
          </button>

          <img
            src="/image/ava.jpg"
            alt="User avatar"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-outline-variant object-cover bg-surface-container-low"
          />
        </div>
      </header>
      {isGiftOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-outline-variant shadow-[0_20px_50px_rgba(0,0,0,0.16)] overflow-hidden">
            <div className="p-6 text-center">
              <button
                type="button"
                onClick={() => setIsGiftOpen(false)}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                aria-label="Close gift popup"
              >
                {/* <span className="material-symbols-outlined text-[20px]">
                  close
                </span> */}
              </button>

              <img
                src="/image/gift.png"
                alt="Gift"
                className="mx-auto mt-2 h-40 w-40 object-contain"
              />

              <h3 className="mt-4 text-[20px] leading-7 font-bold text-on-surface">
                You have a gift!
              </h3>

              <p className="mt-2 text-[14px] leading-6 text-on-surface-variant">
                Keep learning every day to unlock more surprises.
              </p>

              <button
                type="button"
                onClick={() => setIsGiftOpen(false)}
                className="mt-5 w-full rounded-xl bg-primary px-5 py-2.5 text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity"
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