import { Button, Modal } from '@org/ui';
import type { ArchiveHabitDialogProps } from '../habits-feature.types';

export function ArchiveHabitDialog({
  open,
  habit,
  isArchiving,
  error,
  onClose,
  onConfirm,
}: ArchiveHabitDialogProps) {
  return (
    <Modal open={open} labelledBy="archive-habit-title" onClose={onClose}>
      <div className="relative p-6 sm:p-8">
        <Button
          variant="quiet"
          className="absolute right-4 top-4 min-h-8 w-8 px-0 text-xl"
          aria-label="Close dialog"
          onClick={onClose}
        >
          ×
        </Button>
        <p className="text-xs font-bold tracking-[0.16em] text-violet-200/65">
          HABIT SETTINGS
        </p>
        <h2 id="archive-habit-title" className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Archive habit?
        </h2>

          <div className="my-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-violet-200/10 bg-violet-300/[0.1] text-lg text-violet-100">
            ✓
          </span>
          <strong className="text-sm text-white">{habit?.name}</strong>
        </div>

        <p className="text-sm leading-6 text-slate-300/75">
          This removes the habit from your active list. Its history will be kept.
        </p>
        {error && (
          <p className="mt-3 text-sm text-rose-200" role="alert">
            Could not archive habit: {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2 border-t border-white/10 pt-4">
          <Button variant="quiet" disabled={isArchiving} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={isArchiving}
            onClick={onConfirm}
          >
            {isArchiving ? 'Archiving…' : 'Archive habit'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
