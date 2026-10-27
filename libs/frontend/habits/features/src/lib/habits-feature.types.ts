import type {
  CreateHabitRequest,
  HabitDto,
  UpdateHabitRequest,
} from '@org/contracts';

export type ActiveDialog =
  | { mode: 'create' }
  | { mode: 'edit'; habit: HabitDto }
  | { mode: 'archive'; habit: HabitDto }
  | null;

export interface HabitFormDialogProps {
  open: boolean;
  habit: HabitDto | null;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (input: CreateHabitRequest) => void;
}

export interface HabitFormProps {
  habit: HabitDto | null;
  isSaving: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: (input: CreateHabitRequest) => void;
  onCancel: () => void;
}

export interface ArchiveHabitDialogProps {
  open: boolean;
  habit: HabitDto | null;
  isArchiving: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export interface DashboardHeaderProps {
  onAddHabit: () => void;
}

export interface DashboardIntroProps {
  habitCount: number;
}

export interface HabitInsightsProps {
  habits: HabitDto[];
}

export interface HabitInsightRowProps {
  icon: string;
  label: string;
  count: number;
  color: string;
  glow: string;
}

export interface HabitsDashboardProps {
  habits: HabitDto[];
  isLoading: boolean;
  loadError: string | null;
  successMessage: string | null;
  onAddHabit: () => void;
  onEditHabit: (habit: HabitDto) => void;
  onDeleteHabit: (habit: HabitDto) => void;
}

export interface HabitCardProps {
  habit: HabitDto;
  accentIndex: number;
  onEdit: (habit: HabitDto) => void;
  onDelete: (habit: HabitDto) => void;
}

export interface HabitsSectionProps {
  habits: HabitDto[];
  isLoading: boolean;
  error: string | null;
  onAddHabit: () => void;
  onEditHabit: (habit: HabitDto) => void;
  onDeleteHabit: (habit: HabitDto) => void;
}

export interface UseHabitsResult {
  habits: HabitDto[];
  isLoading: boolean;
  loadError: string | null;
  isSaving: boolean;
  isArchiving: boolean;
  mutationError: string | null;
  clearMutationError(): void;
  createHabit(input: CreateHabitRequest): Promise<boolean>;
  updateHabit(id: string, input: UpdateHabitRequest): Promise<boolean>;
  archiveHabit(id: string): Promise<boolean>;
}
