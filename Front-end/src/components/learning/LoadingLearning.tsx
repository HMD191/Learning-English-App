export default function LoadingLearning() {
  return (
    <div className="w-full max-w-4xl bg-white border border-outline-variant/70 rounded-3xl shadow-[0_8px_24px_rgba(31,41,55,0.05)] overflow-hidden">
      <div className="min-h-[420px] flex flex-col items-center justify-center px-6 py-12 text-center">
        <img
          src="/image/loading.png"
          alt="Loading question"
          className="h-45 w-45 object-contain animate-bounce"
        />

        <div className="mt-3 flex items-center gap-1">
          <span className="text-[16px] leading-6 font-semibold text-on-surface-variant">
            Loading question
          </span>

          <span className="flex gap-1 pl-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
          </span>
        </div>

        <p className="mt-2 text-[13px] leading-5 text-on-surface-variant/70">
          Preparing your next practice question.
        </p>
      </div>
    </div>
  );
}