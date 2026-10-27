import type { DashboardIntroProps } from '../habits-feature.types';

export function DashboardIntro({ habitCount }: DashboardIntroProps) {
  return (
    <section className="mb-4 mt-2 flex flex-wrap items-center justify-between gap-4 px-1">
      <div>
        <p className="text-[10px] font-bold tracking-[0.16em] text-violet-200/55">
          YOUR PERSONAL DASHBOARD
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Good things take <span className="text-fuchsia-200">practice.</span>
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Build a life you love, one habit at a time.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 shadow-[0_12px_35px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-fuchsia-300/10 text-lg text-fuchsia-200">
          ✦
        </span>
        <span>
          <strong className="block text-base leading-5 text-white">
            {habitCount}{' '}
            <small className="text-xs font-medium text-slate-300">
              {habitCount === 1 ? 'habit' : 'habits'}
            </small>
          </strong>
          <small className="text-[10px] text-slate-400">in your routine</small>
        </span>
      </div>
    </section>
  );
}
