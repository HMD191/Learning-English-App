export default function AllWordsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter">
      <div>
        <nav className="flex items-center gap-2 text-label-sm text-outline mb-2">
          <span>Library</span>
          <span className="material-symbols-outlined text-[12px]">
            chevron_right
          </span>
          <span className="text-on-surface-variant">All Words</span>
        </nav>

        <h1 className="font-display-lg text-[40px] leading-[64px] font-bold text-primary tracking-[-0.03em]">
          Word Bank
        </h1>

        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage your personal collection of vocabulary and academic terms.
        </p>
      </div>

      <div className="flex items-center gap-stack-sm overflow-x-auto pb-2 md:pb-0">
        <button className="flex items-center gap-2 bg-surface border border-outline-variant px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-all">
          <span className="material-symbols-outlined text-[20px]">
            filter_list
          </span>
          Filter
        </button>

        <button className="flex items-center gap-2 bg-surface border border-outline-variant px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-all">
          <span className="material-symbols-outlined text-[20px]">
            sort
          </span>
          Sort
        </button>

        <button className="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-[20px]">
            download
          </span>
          Export
        </button>
      </div>
    </div>
  );
}