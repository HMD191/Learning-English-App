"use client";
import React, { useEffect, useState } from "react";
import "./words.css";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import Select, { components, MultiValue } from "react-select";

type OptionType = { label: string; value: string };
const wordTypes: OptionType[]  = [
  { value: "noun", label: "Noun" },
  { value: "verb", label: "Verb" },
  { value: "adj", label: "Adj" },
  { value: "adv", label: "Adv" },
];

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
                    <div className="input-group">
                    <Select
                        isMulti
                        options={wordTypes}
                        value={
                        editedWord?.type
                            .split(",")
                            .map((t) => wordTypes.find((opt) => opt.value === t.trim()))
                            .filter(Boolean) as OptionType[]
                        }
                        onChange={(selected: MultiValue<OptionType>) => {
                        const selectedValues = selected.map((opt) => opt.value).join(", ");
                        setEditedWord({ ...editedWord!, type: selectedValues });
                        }}
                        className="custom-select"
                        classNamePrefix="rs"
                        placeholder="Từ loại"
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{
                        MultiValue: () => null,
                        ClearIndicator: () => null,
                        ValueContainer: ({ children, ...props }) => {
                            const selected = props.getValue() as OptionType[];
                            const labels = selected.map((opt) => opt.label).join(", ");
                            return (
                            <components.ValueContainer {...props}>
                                <div style={{ paddingLeft: "10px", fontSize: "14px" }}>
                                {labels || props.selectProps.placeholder}
                                </div>
                            </components.ValueContainer>
                            );
                        },
                        Option: ({ data, isSelected, innerRef, innerProps }) => {
                            const option = data as OptionType;
                            return (
                            <div
                                ref={innerRef}
                                {...innerProps}
                                style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "6px 10px",
                                gap: 8,
                                }}
                            >
                                <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                style={{
                                    width: 16,
                                    height: 16,
                                    margin: 0,
                                    padding: 0,
                                    verticalAlign: "middle",
                                }}
                                />
                                <label
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    lineHeight: "1",
                                }}
                                >
                                {option.label}
                                </label>
                            </div>
                            );
                        },
                        }}
                    />
                    </div>
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
