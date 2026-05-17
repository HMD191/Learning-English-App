export default function TopNav() {
  return (
    <header className="grid items-center px-gutter lg:px-margin-desktop py-3 w-full z-50 bg-white/90 backdrop-blur-md border-b border-outline-variant/70 grid-cols-2 lg:grid-cols-12">
      <div className="flex items-center justify-start lg:col-span-1">
        <span className="md:hidden font-bold text-primary text-lg">
          English Master
        </span>
      </div>

      <div className="flex items-center justify-start lg:col-span-8">
        <div className="relative hidden lg:block w-full max-w-xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[21px]">
            search
          </span>

          <input
            className="w-full h-11 pl-11 pr-4 bg-surface-container-low border border-transparent rounded-full text-label-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            placeholder="Search words or lessons..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 lg:col-span-3">
        {/* <button
  type="button"
  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low font-label-md text-label-md transition-colors"
>
  <span className="material-symbols-outlined text-[20px]">
    add
  </span>
  Add Word
</button> */}

        <button
          type="button"
          className="relative h-10 w-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-error" />
        </button>

        <img
          src="/image/ava.jpg"
          alt="User avatar"
          className="w-9 h-9 rounded-full border border-outline-variant object-cover bg-surface-container-low"
        />
      </div>
    </header>
  );
}