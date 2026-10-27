import type { CreateHabitRequest } from '@org/contracts';
import { Button } from '@org/ui';
import { useState, type FormEvent } from 'react';
import type { HabitFormProps } from '../habits-feature.types';

export function HabitForm({
  habit,
  isSaving,
  error,
  submitLabel,
  onSubmit,
  onCancel,
}: HabitFormProps) {
  const [name, setName] = useState(() => habit?.name ?? '');
  const [description, setDescription] = useState(() => habit?.description ?? '');
  const [trackingType, setTrackingType] = useState<'completion' | 'quantity'>(
    () => habit?.trackingType ?? 'completion',
  );
  const [targetValue, setTargetValue] = useState(() =>
    habit?.trackingType === 'quantity' ? String(habit.targetValue) : '',
  );
  const [unit, setUnit] = useState(() =>
    habit?.trackingType === 'quantity' ? habit.unit : '',
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedDescription = description.trim();
    const habitFields = {
      name: name.trim(),
      description: trimmedDescription || null,
    };

    const input: CreateHabitRequest = trackingType === 'quantity'
      ? {
          ...habitFields,
          trackingType: 'quantity',
          targetValue: Number(targetValue),
          unit: unit.trim(),
        }
      : {
          ...habitFields,
          trackingType: 'completion',
          targetValue: null,
          unit: null,
        };

    onSubmit(input);
  }

  return (
    <form className="grid gap-2" onSubmit={handleSubmit}>
      <label className="mt-2 text-xs font-semibold text-slate-300" htmlFor="habit-name">
        Habit name
      </label>
      <input
        autoFocus
        required
        id="habit-name"
        name="name"
        type="text"
        placeholder="e.g. Read before bed"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-300/50 focus:ring-4 focus:ring-violet-300/10"
      />

      <label className="mt-2 text-xs font-semibold text-slate-300" htmlFor="habit-description">
        Description <span className="font-normal text-slate-500">Optional</span>
      </label>
      <textarea
        id="habit-description"
        name="description"
        placeholder="What does this habit mean to you?"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={3}
        className="resize-y rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-300/50 focus:ring-4 focus:ring-violet-300/10"
      />

      <label className="mt-2 text-xs font-semibold text-slate-300" htmlFor="habit-tracking-type">
        How do you want to track it?
      </label>
      <select
        id="habit-tracking-type"
        name="trackingType"
        value={trackingType}
        onChange={(event) => setTrackingType(event.target.value as 'completion' | 'quantity')}
        className="rounded-lg border border-white/10 bg-[#202027] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-300/50 focus:ring-4 focus:ring-violet-300/10"
      >
        <option value="completion">Complete it each day</option>
        <option value="quantity">Reach a daily quantity</option>
      </select>

      {trackingType === 'quantity' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <label className="mt-2 text-xs font-semibold text-slate-300" htmlFor="habit-target">
              Daily target
            </label>
            <input
              required
              id="habit-target"
              name="targetValue"
              type="number"
              min="0.01"
              step="any"
              placeholder="e.g. 2"
              value={targetValue}
              onChange={(event) => setTargetValue(event.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-300/50 focus:ring-4 focus:ring-violet-300/10"
            />
          </div>
          <div className="grid gap-2">
            <label className="mt-2 text-xs font-semibold text-slate-300" htmlFor="habit-unit">
              Unit
            </label>
            <input
              required
              id="habit-unit"
              name="unit"
              type="text"
              placeholder="e.g. litres"
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-300/50 focus:ring-4 focus:ring-violet-300/10"
            />
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-rose-200" role="alert">
          Could not save habit: {error}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-2 border-t border-white/10 pt-4">
        <Button variant="quiet" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
