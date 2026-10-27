import { Button, Modal } from '@org/ui';
import type { HabitFormDialogProps } from '../habits-feature.types';
import { HabitForm } from '../forms/habit-form';

export function HabitFormDialog({
  open,
  habit,
  isSaving,
  error,
  onClose,
  onSubmit,
}: HabitFormDialogProps) {
  const isEditing = habit !== null;

  return (
    <Modal open={open} labelledBy="habit-form-title" onClose={onClose}>
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
          {isEditing ? 'UPDATE YOUR ROUTINE' : 'MAKE IT A ROUTINE'}
        </p>
        <h2 id="habit-form-title" className="mt-2 text-2xl font-semibold tracking-tight text-white">
          {isEditing ? 'Edit habit' : 'Add a new habit'}
        </h2>
        <p className="mb-5 mt-1 text-sm text-slate-400">
          {isEditing
            ? 'Update the details you want to change.'
            : 'Start with something small you can return to.'}
        </p>
        {open && (
          <HabitForm
            key={habit?.id ?? 'new-habit'}
            habit={habit}
            isSaving={isSaving}
            error={error}
            submitLabel={isEditing ? 'Save changes' : 'Create habit'}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        )}
      </div>
    </Modal>
  );
}
