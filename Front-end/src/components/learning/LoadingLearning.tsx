export default function LoadingLearning() {
  return (
    <div className="w-full max-w-5xl bg-white border border-outline-variant/70 rounded-[28px] shadow-[0_10px_32px_rgba(31,41,55,0.06)] overflow-hidden p-6 md:p-10">
      <div className="animate-pulse space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="h-8 w-44 bg-surface-container-high rounded-full" />
          <div className="h-3 w-56 bg-surface-container-high rounded-full" />
        </div>

        <div className="text-center space-y-4 py-12">
          <div className="h-14 w-80 max-w-full bg-surface-container-high rounded-2xl mx-auto" />
          <div className="h-5 w-[420px] max-w-full bg-surface-container-high rounded-lg mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 bg-surface-container-low rounded-2xl" />
          <div className="h-24 bg-surface-container-low rounded-2xl" />
          <div className="h-24 bg-surface-container-low rounded-2xl" />
          <div className="h-24 bg-surface-container-low rounded-2xl" />
        </div>
      </div>
    </div>
  );
}