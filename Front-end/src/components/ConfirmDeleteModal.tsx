import React from "react";
import "../styles/confirmDeleteModal.css";

interface ConfirmDeleteModalProps {
  wordToDelete: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  wordToDelete,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Xác nhận xóa</h3>
        <p>Bạn có chắc muốn xóa từ: <strong>{wordToDelete}</strong> không?</p>
        <div style={{ marginTop: "1rem", display: "flex", gap: "10px" }}>
          <button onClick={onConfirm}>Xóa</button>
          <button onClick={onCancel}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
