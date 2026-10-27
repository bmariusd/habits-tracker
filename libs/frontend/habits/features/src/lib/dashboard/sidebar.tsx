import { useEffect, useState } from 'react';

const navigationItems = [
  { label: 'Overview', href: '#overview', icon: '▦' },
  { label: 'My habits', href: '#habits', icon: '✓' },
  { label: 'Activity', href: '#activity-title', icon: '◷' },
];

export function Sidebar() {
  const [activeHref, setActiveHref] = useState('#overview');

  useEffect(() => {
    const syncActiveLink = () => {
      setActiveHref(window.location.hash || '#overview');
    };

    syncActiveLink();
    window.addEventListener('hashchange', syncActiveLink);
    return () => window.removeEventListener('hashchange', syncActiveLink);
  }, []);

  return (
    <aside className="z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#111116]/85 p-3 backdrop-blur-2xl md:fixed md:inset-y-4 md:left-4 md:w-[72px] md:flex-col md:justify-start md:rounded-2xl md:border md:p-2.5 md:shadow-[0_20px_70px_rgba(0,0,0,0.5)]">
      <a
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/15 bg-gradient-to-br from-violet-300/20 to-fuchsia-400/10 text-sm font-bold text-white shadow-inner shadow-white/10"
        href="/"
        aria-label="Habit Grove home"
        title="Habit Grove"
      >
        h
      </a>

      <nav className="flex min-w-0 items-center gap-1 md:mt-5 md:w-full md:flex-col" aria-label="Main navigation">
        {navigationItems.map(({ label, href, icon }) => {
          const isActive = activeHref === href;

          return (
            <a
              key={href}
              className={`group grid h-10 min-w-10 place-items-center rounded-xl px-2 text-sm no-underline transition ${
                isActive
                  ? 'border border-white/15 bg-white/[0.12] text-white shadow-[0_0_22px_rgba(168,85,247,0.14)]'
                  : 'text-slate-400 hover:bg-white/[0.08] hover:text-white'
              }`}
              href={href}
              aria-label={label}
              aria-current={isActive ? 'location' : undefined}
              onClick={() => setActiveHref(href)}
              title={label}
            >
              <span aria-hidden="true">{icon}</span>
              <span className="ml-2 md:hidden">{label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
