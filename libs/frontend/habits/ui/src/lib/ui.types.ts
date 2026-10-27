import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export interface ModalProps {
  open: boolean;
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
}

export type GlassPanelProps = HTMLAttributes<HTMLElement>;
