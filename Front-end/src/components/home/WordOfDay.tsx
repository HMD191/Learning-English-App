export default function WordOfDay() {
  return (
    <div className="border-l-4 border-primary bg-surface-container-low p-stack-lg rounded-r-xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-primary">lightbulb</span>
        <h4 className="font-headline-sm text-primary">Word of the Day</h4>
      </div>
      <p className="text-on-surface mb-2 font-bold text-lg">Eloquence <span className="text-on-surface-variant font-normal text-sm italic">/ˈel.ə.kwəns/</span></p>
      <p className="text-body-md text-on-surface-variant italic">"Fluent or persuasive speaking or writing."</p>
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary-container/10 transition-colors">Add to deck</button>
        <button className="px-4 py-2 text-on-surface-variant hover:text-primary flex items-center gap-1">
          <span className="material-symbols-outlined">volume_up</span> Listen
        </button>
      </div>
    </div>
  );
}