"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function WelcomeBanner() {
  const [username, setUsername] = useState("");
  const [draftName, setDraftName] = useState("");
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("english-master-username");

    if (savedName && savedName.trim()) {
      setUsername(savedName);
    } else {
      setIsNameModalOpen(true);
    }
  }, []);

  function handleSaveName() {
    const trimmedName = draftName.trim();

    if (!trimmedName) return;

    localStorage.setItem("english-master-username", trimmedName);
    setUsername(trimmedName);
    setIsNameModalOpen(false);
  }

  function handleChangeName() {
    setDraftName(username);
    setIsNameModalOpen(true);
  }

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 bg-white p-5 2xl:p-stack-lg rounded-xl shadow-sm border border-surface-variant relative overflow-hidden">          <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-[clamp(28px,2.4vw,40px)] leading-[1.12] font-bold tracking-[-0.03em] text-on-surface mb-2">                Welcome back, {username || "friend"}!
            </h2>

            <button
              type="button"
              onClick={handleChangeName}
              className="mt-1 text-[12px] font-semibold text-primary hover:underline whitespace-nowrap"
            >
              Change name
            </button>
          </div>

          <p className="text-[clamp(15px,1.2vw,16px)] leading-[1.55] text-on-surface-variant max-w-md mb-5">              You&apos;ve mastered 12 new words this week. Keep the momentum
            going and reach your daily goal of 20 words.
          </p>

          <Link
            href="/learning"
            className="inline-flex bg-primary-container text-on-primary-container px-5 py-2.5 rounded-lg font-label-md text-label-md items-center gap-2 hover:shadow-lg transition-shadow"            >
            <span className="material-symbols-outlined">play_circle</span>
            Start Lesson
          </Link>
        </div>

          <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-20 pointer-events-none bg-gradient-to-l from-primary-container to-transparent" />

          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-primary-container/20 rotate-12">
            auto_stories
          </span>
        </div>

        <div className="lg:col-span-4 bg-primary text-on-primary p-5 2xl:p-stack-lg rounded-xl shadow-sm flex flex-col justify-between">          <div>
          <h3 className="font-headline-sm text-headline-sm mb-1">
            Daily Streak
          </h3>
          <p className="text-primary-fixed text-sm">You are on fire!</p>
        </div>

          <div className="flex items-center justify-center py-4">
            <span className="text-[clamp(52px,4vw,72px)] leading-none font-bold">14</span>
            <span
              className="material-symbols-outlined text-4xl ml-2 text-primary-fixed-dim"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              local_fire_department
            </span>
          </div>

          <p className="text-center font-label-sm text-label-sm">
            3 days to next milestone
          </p>
        </div>
      </section>

      {isNameModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-outline-variant shadow-[0_20px_50px_rgba(0,0,0,0.16)] overflow-hidden">
            <div className="p-6">
              <h3 className="text-[20px] leading-7 font-bold text-on-surface">
                What should we call you?
              </h3>

              <p className="mt-2 text-[14px] leading-6 text-on-surface-variant">
                Enter your name to personalize your home page.
              </p>

              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSaveName();
                  }
                }}
                className="mt-4 w-full h-11 rounded-xl border border-outline-variant bg-surface-container-low px-4 text-[15px] text-on-surface placeholder:text-on-surface-variant/60 form-input-focus"
                placeholder="e.g. Inzy"
                autoFocus
              />

              <button
                type="button"
                onClick={handleSaveName}
                disabled={!draftName.trim()}
                className="mt-5 w-full rounded-xl bg-primary px-5 py-2.5 text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save name
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}