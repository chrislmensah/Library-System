interface RemoveConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function RemoveConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Remove",
  onCancel,
  onConfirm,
}: RemoveConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <h2 className="font-display text-base text-ink">{title}</h2>
        <p className="mt-2 font-sans text-sm text-ink/60">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-2 font-sans text-sm font-medium text-ink/70 hover:bg-ivory-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-4 py-2 font-sans text-sm font-medium text-white hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}