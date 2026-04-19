export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-slate-900">
            Travel<span className="text-sky-600">Sphere</span>
          </h3>
          <p className="mt-3 max-w-md text-sm text-slate-600">
            A modern travel booking platform for unforgettable stays and seamless
            experiences.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>About</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Support</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Contact</li>
            <li>Help Center</li>
            <li>Terms</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
