export default function LoadingLearning() {
  return (
    <div className="w-full max-w-4xl bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden p-stack-lg md:p-10">
      <div className="animate-pulse space-y-stack-lg">
        <div className="flex justify-between items-center">
          <div className="h-7 w-40 bg-surface-container-high rounded-full" />
          <div className="h-3 w-48 bg-surface-container-high rounded-full" />
        </div>

        <div className="text-center space-y-stack-md py-10">
          <div className="h-12 w-72 bg-surface-container-high rounded-xl mx-auto" />
          <div className="h-5 w-96 max-w-full bg-surface-container-high rounded-lg mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          <div className="h-20 bg-surface-container-high rounded-lg" />
          <div className="h-20 bg-surface-container-high rounded-lg" />
          <div className="h-20 bg-surface-container-high rounded-lg" />
          <div className="h-20 bg-surface-container-high rounded-lg" />
        </div>
      </div>
    </div>
  );
}