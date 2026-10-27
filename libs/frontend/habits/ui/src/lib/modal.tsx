import { useEffect, useRef, type MouseEvent } from 'react';
import type { ModalProps } from './ui.types';

export function Modal({ open, labelledBy, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      className="m-auto max-h-[min(90dvh,50rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#15151b]/95 p-0 text-slate-100 shadow-2xl shadow-black/50 backdrop:bg-slate-950/65 backdrop:backdrop-blur-md"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      {children}
    </dialog>
  );
}
