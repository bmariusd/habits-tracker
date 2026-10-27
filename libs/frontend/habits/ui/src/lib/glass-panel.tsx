import type { GlassPanelProps } from './ui.types';

export function GlassPanel({ className = '', ...props }: GlassPanelProps) {
  return (
    <section
      {...props}
      className={`rounded-2xl border border-white/10 bg-white/[0.055] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl ${className}`}
    />
  );
}
