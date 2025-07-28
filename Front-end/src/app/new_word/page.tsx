"use client";
import React, { useState } from "react";
import "./new_word.css";
import { Trash2 } from "lucide-react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface WordItem {
  id: number;
  english: string;
  type: string;
  vietnamese: string;
  status?: string; // kết quả phản hồi từ backend
}

const NewWord = () => {
  const [words, setWords] = useState<WordItem[]>([
    { id: 1, english: "", type: "", vietnamese: "" },
  ]);

  const handleAddRow = () => {
    const newId = words.length > 0 ? words[words.length - 1].id + 1 : 1;
    setWords([
      ...words,
      { id: newId, english: "", type: "", vietnamese: "" },
    ]);
  };

  const handleDeleteRow = (id: number) => {
    setWords(words.filter((item) => item.id !== id));
  };

  const handleChange = (id: number, field: keyof WordItem, value: string) => {
    setWords(
      words.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

const handleSubmit = async () => {

  const updated = await Promise.all(
    words.map(async (item) => {

      if (!item.english || !item.vietnamese || !item.type) {
        return { ...item, status: "Thiếu thông tin, vui lòng điền đủ 3 ô!" };
      }
      
      try {
        console.log("hehe API URL:", apiUrl);

         // Gửi yêu cầu POST đến API

        const res = await axios.post(`${apiUrl}/add-word`, {
          engMeaning: item.english,
          vnMeaning: item.vietnamese,
          wordKind: item.type.split(",").map((s) => s.trim()),
        });
        
        console.log("✅ Phản hồi từ server:", res.data);

         return { ...item, status: res.data.message };
      } catch (err: any) {
        let errorMessage = "Lỗi không xác định";
        if (axios.isAxiosError(err)) {
          errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message;
        } else {
          errorMessage = String(err);
        }

        return { ...item, status: errorMessage };
      }
    })
  );

  setWords(updated);
};




  return (
    <div className="newword-container">
      <h2>Thêm từ mới</h2>

      {words.map((item) => (
        <div key={item.id} className="newword-card">
          <div className="newword-header">
            <span>
              {item.id}
              {item.status && (
                <span
                  style={{
                    marginLeft: "10px",
                    color:
                    typeof item.status === "string" &&
                    (item.status?.toLowerCase().includes("success") ||
                    item.status?.includes("✅"))
                      ? "green"
                      : "red",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                >
                  {item.status}
                </span>
              )}
            </span>
            <button
              className="delete-btn"
              onClick={() => handleDeleteRow(item.id)}
            >
              <Trash2 size={20} />
            </button>
          </div>

          <hr className="divider" />

          <div className="newword-inputs">
            <div>
              <input
                type="text"
                placeholder="Enter word"
                value={item.english}
                onChange={(e) =>
                  handleChange(item.id, "english", e.target.value)
                }
              />
              <p className="label">Từ tiếng anh</p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter word"
                value={item.type}
                onChange={(e) => handleChange(item.id, "type", e.target.value)}
              />
              <p className="label">Từ loại</p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter word"
                value={item.vietnamese}
                onChange={(e) =>
                  handleChange(item.id, "vietnamese", e.target.value)
                }
              />
              <p className="label">Nghĩa tiếng Việt</p>
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button className="add_word-btn" onClick={handleAddRow}>
          ➕ Thêm từ
        </button>
        <button className="add_word-btn" onClick={handleSubmit}>
          ✅ Done...
        </button>
      </div>
    </div>
  );
};

export default NewWord;
