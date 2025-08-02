import React, { useState } from "react";
import "../styles/createTopicModal.css";

type Props = {
  onClose: () => void;
  onCreate: (newTopic: string) => void;
};

export default function CreateTopicModal({ onClose, onCreate }: Props) {
  const [newTopic, setNewTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopic.trim()) {
      onCreate(newTopic.trim());
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Tạo chủ đề mới</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Nhập tên chủ đề"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />
          <div className="modal-actions">
            <button type="submit">Tạo</button>
            <button type="button" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
