export default function TopNav() {
  return (
    <header className="grid items-center px-margin-desktop py-4 w-full z-50 bg-surface  shadow-sm grid-cols-2 lg:grid-cols-12">
      <div className="flex items-center justify-start lg:col-span-1"></div>
      <div className="flex items-center justify-start lg:col-span-8">
        <div className="relative hidden lg:block w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-label-md focus:outline-none focus:ring-2 focus:ring-primary-container w-full" 
            placeholder="Search words or lessons..." 
            type="text" 
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 lg:col-span-3">
        <button className="p-2 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <img
        src="/image/ava.jpg"
        alt="User avatar"
        className="w-8 h-8 rounded-full border border-primary-container object-cover bg-gray-200"
      />
      </div>
    </header>
  );
}