export default function NewWordTip() {
  return (
    <div className="p-6 bg-surface-container-low border-l-4 border-primary rounded-r-xl flex gap-stack-md">
      <span className="material-symbols-outlined text-primary">
        lightbulb
      </span>

      <div>
        <h4 className="font-bold text-on-surface">
          Pro Tip: Deep Processing
        </h4>

        <p className="text-body-sm text-on-surface-variant">
          Adding synonyms and context-rich meanings helps your brain build
          stronger neural pathways, making word recall 40% faster during exams.
        </p>
      </div>
    </div>
  );
}