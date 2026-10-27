import type { CreateHabitRequest, HabitDto } from '@org/contracts';
import { useState } from 'react';
import { ArchiveHabitDialog } from './dialogs/archive-habit-dialog';
import { HabitFormDialog } from './dialogs/habit-form-dialog';
import { HabitsDashboard } from './dashboard/habits-dashboard';
import { useHabits } from './hooks/use-habits';
import type { ActiveDialog } from './habits-feature.types';

export function HabitsFeature() {
  const {
    habits,
    isLoading,
    loadError,
    isSaving,
    isArchiving,
    mutationError,
    clearMutationError,
    createHabit,
    updateHabit,
    archiveHabit,
  } = useHabits();
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function openCreateDialog() {
    clearMutationError();
    setSuccessMessage(null);
    setActiveDialog({ mode: 'create' });
  }

  function openEditDialog(habit: HabitDto) {
    clearMutationError();
    setSuccessMessage(null);
    setActiveDialog({ mode: 'edit', habit });
  }

  function openArchiveDialog(habit: HabitDto) {
    clearMutationError();
    setSuccessMessage(null);
    setActiveDialog({ mode: 'archive', habit });
  }

  function closeDialog() {
    setActiveDialog(null);
  }

  async function handleSaveHabit(input: CreateHabitRequest) {
    const dialog = activeDialog;
    const wasSaved = dialog?.mode === 'edit'
      ? await updateHabit(dialog.habit.id, input)
      : await createHabit(input);

    if (!wasSaved) return;

    setSuccessMessage(dialog?.mode === 'edit' ? 'Habit updated.' : 'Habit created.');
    closeDialog();
  }

  async function handleArchiveHabit() {
    if (activeDialog?.mode !== 'archive') return;

    const wasArchived = await archiveHabit(activeDialog.habit.id);
    if (!wasArchived) return;

    setSuccessMessage('Habit archived. Its history has been kept.');
    closeDialog();
  }

  const formHabit = activeDialog?.mode === 'edit' ? activeDialog.habit : null;
  const archiveHabitToConfirm = activeDialog?.mode === 'archive'
    ? activeDialog.habit
    : null;
  const isFormOpen = activeDialog?.mode === 'create' || activeDialog?.mode === 'edit';

  return (
    <>
      <HabitsDashboard
        habits={habits}
        isLoading={isLoading}
        loadError={loadError}
        successMessage={successMessage}
        onAddHabit={openCreateDialog}
        onEditHabit={openEditDialog}
        onDeleteHabit={openArchiveDialog}
      />

      <HabitFormDialog
        open={isFormOpen}
        habit={formHabit}
        isSaving={isSaving}
        error={mutationError}
        onClose={closeDialog}
        onSubmit={handleSaveHabit}
      />

      <ArchiveHabitDialog
        open={archiveHabitToConfirm !== null}
        habit={archiveHabitToConfirm}
        isArchiving={isArchiving}
        error={mutationError}
        onClose={closeDialog}
        onConfirm={handleArchiveHabit}
      />
    </>
  );
}
