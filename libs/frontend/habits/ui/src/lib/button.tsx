import type { ButtonProps, ButtonVariant } from './ui.types';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-[0_6px_24px_rgba(139,92,246,0.25)] hover:from-violet-400 hover:to-fuchsia-400',
  secondary: 'border border-white/10 bg-white/[0.08] text-slate-200 hover:bg-white/[0.14]',
  quiet: 'bg-transparent text-slate-300 hover:bg-white/[0.08] hover:text-white',
  danger: 'bg-rose-400/[0.08] text-rose-200 hover:bg-rose-400/[0.16]',
};

export function Button({
  type = 'button',
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const disabledClasses = disabled
    ? 'cursor-not-allowed opacity-50'
    : 'cursor-pointer';

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116] ${variantClasses[variant]} ${disabledClasses} ${className}`}
    />
  );
}
