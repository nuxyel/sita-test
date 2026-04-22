interface DeleteDialogProps {
  open: boolean;
  productName: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteDialog = ({
  open,
  productName,
  loading = false,
  onCancel,
  onConfirm
}: DeleteDialogProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="dialog-backdrop">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
        <p className="dialog__eyebrow">Delete Product</p>
        <h2 id="delete-dialog-title">Remove {productName} from the catalog?</h2>
        <p className="dialog__body">This will delete the product permanently.</p>
        <div className="dialog__actions">
          <button type="button" className="button button--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
