"use client";
import React, { useEffect, useState } from "react";
import "./words.css";
import CreateTopicModal from "@/components/CreateTopicModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import axios from "axios";
import { Volume2, Pencil, Trash2 } from "lucide-react";
import Select, { components, MultiValue } from "react-select";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


interface Word {
  english: string;
  vietnamese: string;
  synonyms: string;
  type: string;
  category?: string;
}

type OptionType = { label: string; value: string };

const wordTypes: OptionType[] = [
  { value: "noun", label: "Noun" },
  { value: "verb", label: "Verb" },
  { value: "adj", label: "Adj" },
  { value: "adv", label: "Adv" },
];

const WordListPage = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [topics, setTopics] = useState<OptionType[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedWord, setEditedWord] = useState<Word | null>(null);
  const [originalEngMeaning, setOriginalEngMeaning] = useState<string | null>(null);

  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pendingDeleteWord, setPendingDeleteWord] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // const [newTopicName, setNewTopicName] = useState("");

  useEffect(() => {
    fetchWords();
    fetchTopics();
  }, []);

  const fetchWords = async () => {
  try {
    const res = await axios.get(`${apiUrl}/all-words`, {
      headers: {
        "ngrok-skip-browser-warning": "true", // 👈 thêm đúng chỗ
      },
    });

    const apiWords = res.data.words;

    const mappedWords: Word[] = apiWords.map((w: any) => ({
      english: w.engMeaning,
      vietnamese: w.vnMeaning,
      type: w.wordKind.join(", "),
      synonyms: w.synonyms,
      category: w.category || "",
    }));

    setWords(mappedWords);
  } catch (err) {
    console.error("❌ Error fetching words:", err);
  }
};


  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${apiUrl}/all-categories`);
      const topicOptions: OptionType[] = res.data.categories.map((t: string) => ({
        value: t,
        label: t,
      }));
      setTopics(topicOptions);
    } catch (err) {
      console.error("❌ Lỗi lấy chủ đề:", err);
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
    setOriginalEngMeaning(words[index].english);
  };

  const handleSave = async () => {
    try {
      if (editedWord && originalEngMeaning) {
        await axios.put(`${apiUrl}/update-word`, {
          engMeaning: originalEngMeaning,
          newEngMeaning: editedWord.english,
          vnMeaning: editedWord.vietnamese,
          synonyms: editedWord.synonyms,
          wordKind: editedWord.type.split(",").map((s) => s.trim()),
          category: editedWord.category || "",
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

  const handleCreateNewTopic = async (topicName: string) => {
    try {
      await axios.post(`${apiUrl}/add-category`, {
        categoryName: topicName,
      });

      const newOption = { label: topicName, value: topicName };

      setTopics([...topics, newOption]);
      setEditedWord({
        ...editedWord!,
        category: topicName,
      });
    } catch (error) {
      console.error("❌ Lỗi khi tạo chủ đề:", error);
      alert("Tạo chủ đề thất bại.");
    }
  };

  const extendedTopics = [
    ...topics,
    { label: "➕ Tạo chủ đề", value: "__create__" },
  ];

  const selectedTopic = extendedTopics.find(
    opt => opt.value.trim() === editedWord?.category?.trim()
  ) || null;

  console.log("DEBUG:");
  console.log("  editedWord.category =", editedWord?.category);
  console.log("  matched =", extendedTopics.find(opt => opt.value === editedWord?.category));
  console.log("  extendedTopics =", extendedTopics);

  const speakText = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";

  const voices = speechSynthesis.getVoices();
  const selectedVoice = voices.find(voice =>
    voice.lang === "en-US" && voice.name.includes("Google")
  );

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  speechSynthesis.speak(utterance);
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
            <th>Synonyms</th>
            <th>Vietnamese</th>
            <th>Category</th>
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
                      className="custom-select-2"
                      classNamePrefix="rs-2"
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
                                }}
                              />
                              <label style={{ margin: 0 }}>{option.label}</label>
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
                    value={editedWord?.synonyms || ""}
                    onChange={(e) =>
                      setEditedWord({
                        ...editedWord!,
                        synonyms: e.target.value,
                      })
                    }
                  />
                ) : (
                  word.synonyms || "N/A"
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
              <td>
                {editingIndex === index ? (
                  <div className="input-group">

                    <Select
                      options={extendedTopics}
                      className="custom-select-2"
                      classNamePrefix="rs-2"
                      placeholder="Chọn chủ đề"
                      value={selectedTopic}

                      onChange={(selected) => {
                        const selectedValue = (selected as OptionType)?.value;
                        if (selectedValue === "__create__") {
                          setShowCreateTopicModal(true);
                        } else {
                          setEditedWord({
                            ...editedWord!,
                            category: selectedValue,
                          });
                        }
                      }}
                      components={{
                        ValueContainer: ({ children, ...props }) => {
                          const selected = props.getValue() as OptionType[];
                          const label = selected[0]?.label;
                          return (
                            <components.ValueContainer {...props}>
                              <div
                                style={{ paddingLeft: "10px", fontSize: "14px" }}
                              >
                                {label || props.selectProps.placeholder}
                              </div>
                            </components.ValueContainer>
                          );
                        },
                      }}

                    />
                  </div>
                ) : (
                  word.category || "N/A"
                )}
              </td>
              <td className="actions">
                {/* Nút phát âm */}
                <button onClick={() => speakText(word.english)}>
                  <Volume2 size={16} />
                </button>
                {editingIndex === index ? (
                  <button onClick={handleSave}>💾</button>
                ) : (
                  <button onClick={() => handleEdit(index)}>
                    <Pencil size={16} />
                  </button>
                )}
                <button onClick={() => {
                  setPendingDeleteWord(word.english);
                  setShowConfirmDelete(true);
                }}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {showConfirmDelete && pendingDeleteWord && (
        <ConfirmDeleteModal
          wordToDelete={pendingDeleteWord}
          onConfirm={() => {
            handleDelete(pendingDeleteWord); // gọi xóa
            setShowConfirmDelete(false);
            setPendingDeleteWord(null);
          }}
          onCancel={() => {
            setShowConfirmDelete(false);
            setPendingDeleteWord(null);
          }}
        />
      )}
      {/* ✅ Modal tạo chủ đề */}
      {showCreateTopicModal && (
        <CreateTopicModal
          onClose={() => setShowCreateTopicModal(false)}
          onCreate={(newTopicName) => {
            handleCreateNewTopic(newTopicName); // gọi API thêm topic
            setShowCreateTopicModal(false);
          }}
        />
      )}
    </div>
  );
};

export default WordListPage;
