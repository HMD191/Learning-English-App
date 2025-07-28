"use client";
import React, { useEffect, useState } from "react";
import "./words.css";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Word {
  english: string;
  vietnamese: string;
  type: string; // comma-separated string like: "noun, verb"
}

const WordListPage = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedWord, setEditedWord] = useState<Word | null>(null);
  const [originalEngMeaning, setOriginalEngMeaning] = useState<string | null>(null);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const res = await axios.get(`${apiUrl}/all-words`);
      const apiWords = res.data.words;

      const mappedWords: Word[] = apiWords.map((w: any) => ({
        english: w.engMeaning,
        vietnamese: w.vnMeaning,
        type: w.wordKind.join(", "),
      }));

      setWords(mappedWords);
    } catch (err) {
      console.error("❌ Error fetching words:", err);
    }
  };

  const handleDelete = async (english: string) => {
    try {
      await axios.delete(`${apiUrl}/delete-word/${english}`);
      setWords(words.filter((w) => w.english !== english));
    } catch (err) {
      console.error("❌ Error deleting word:", err);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedWord({ ...words[index] });
    setOriginalEngMeaning(words[index].english); // ✅ Fix: lưu từ gốc để gửi API
  };

  const handleSave = async () => {
    try {
      if (editedWord && originalEngMeaning) {
        await axios.put(`${apiUrl}/update-word`, {
          engMeaning: originalEngMeaning,
          newEngMeaning: editedWord.english,
          vnMeaning: editedWord.vietnamese,
          wordKind: editedWord.type.split(",").map((s) => s.trim()),
        });

        const updated = [...words];
        if (editingIndex !== null) updated[editingIndex] = editedWord;
        setWords(updated);
        setEditingIndex(null);
        setEditedWord(null);
        setOriginalEngMeaning(null);
      }
    } catch (err) {
      console.error("❌ Error updating word:", err);
    }
  };

  return (
    <div className="wordlist-container">
      <h2>Danh sách từ</h2>
      <table className="word-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>English</th>
            <th>Type</th>
            <th>Vietnamese</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {editingIndex === index ? (
                  <input
                    value={editedWord?.english || ""}
                    onChange={(e) =>
                      setEditedWord({
                        ...editedWord!,
                        english: e.target.value,
                      })
                    }
                  />
                ) : (
                  word.english
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <input
                    value={editedWord?.type || ""}
                    onChange={(e) =>
                      setEditedWord({
                        ...editedWord!,
                        type: e.target.value,
                      })
                    }
                  />
                ) : (
                  word.type
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <input
                    value={editedWord?.vietnamese || ""}
                    onChange={(e) =>
                      setEditedWord({
                        ...editedWord!,
                        vietnamese: e.target.value,
                      })
                    }
                  />
                ) : (
                  word.vietnamese
                )}
              </td>
              <td className="actions">
                {editingIndex === index ? (
                  <button onClick={handleSave}>💾</button>
                ) : (
                  <button onClick={() => handleEdit(index)}>
                    <Pencil size={16} />
                  </button>
                )}
                <button onClick={() => handleDelete(word.english)}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WordListPage;
