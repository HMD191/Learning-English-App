type DeleteWordModalProps = {
  wordToDelete: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteWordModal({
  wordToDelete,
  onCancel,
  onConfirm,
}: DeleteWordModalProps) {
  if (!wordToDelete) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm px-margin-mobile">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
        <div className="px-gutter pt-gutter pb-stack-md">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Delete Word
          </h2>

          <p className="text-body-md text-on-surface-variant mt-2">
            Are you sure you want to delete{" "}
            <span className="font-bold text-on-surface">{wordToDelete}</span>?
          </p>
        </div>

        <div className="px-gutter py-gutter flex items-center justify-end gap-stack-md">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-lg font-label-md text-label-md bg-error text-on-error hover:opacity-90 shadow-sm transition-all active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}