"use client";
import React, { useEffect, useState, useRef } from "react";
import "./new_word.css";
import CreateTopicModal from "@/components/CreateTopicModal";

import { Trash2 } from "lucide-react";
import axios from "axios";
import dynamic from "next/dynamic";
import { MultiValue, components, CSSObjectWithLabel } from "react-select";


const Select = dynamic(() => import("react-select"), { ssr: false });
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const wordTypes = [
  { value: "noun", label: "Noun" },
  { value: "verb", label: "Verb" },
  { value: "adj", label: "Adj" },
  { value: "adv", label: "Adv" },
];

type OptionType = {
  value: string;
  label: string;
};

interface WordItem {
  id: number;
  english: string;
  type: string; // comma-separated values e.g., "noun,verb"
  vietnamese: string;
  category?: string;
  status?: string;
}



const NewWord = () => {

  const [words, setWords] = useState<WordItem[]>([
    { id: 1, english: "", type: "", vietnamese: "" },
  ]);
  useEffect(() => {
    fetchTopics();
  }, []);

  const [topics, setTopics] = useState<OptionType[]>([]);
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
  // ✅ Fetch danh sách chủ đề
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

  const handleAddRow = () => {
    const newId = words.length > 0 ? words[words.length - 1].id + 1 : 1;
    setWords([...words, { id: newId, english: "", type: "", vietnamese: "" }]);
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
          return {
            ...item,
            status: "Thiếu thông tin, vui lòng điền đủ 3 ô!",
          };
        }

        try {
          const res = await axios.post(`${apiUrl}/add-word`, {
            engMeaning: item.english,
            vnMeaning: item.vietnamese,
            wordKind: item.type.split(",").map((s) => s.trim()),
            category: item.category || "",
          });

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

  const customStyles = {
    indicatorSeparator: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
      ...base,
      width: "1px",
      marginRight: "1px",
      backgroundColor: "#ccc",
    }),

  };

  const handleCreateNewTopic = async (topicName: string) => {
    try {
      await axios.post(`${apiUrl}/add-category`, {
        categoryName: topicName,
      });

      const newOption = { label: topicName, value: topicName };

      setTopics([...topics, newOption]);

    } catch (error) {
      console.error("❌ Lỗi khi tạo chủ đề:", error);
      alert("Tạo chủ đề thất bại.");
    }
  };
  const extendedTopics = [
    ...topics,
    { value: "__create__", label: "➕ Tạo chủ đề mới" }
  ];

  return (
    <div className="newword-container">
      <h2>Thêm từ mới</h2>

      {words.map((item) => {
        const selectedOptions: OptionType[] = item.type
          ? item.type.split(",").map((t) => {
            const trimmed = t.trim();
            return wordTypes.find((opt) => opt.value === trimmed) || {
              value: trimmed,
              label: trimmed,
            };
          })
          : [];
        // const selectRef = useRef<any>(null);
        return (
          <div key={item.id} className="newword-card">
            <div className="newword-header">
              <span>
                {item.id}
                {item.status && (
                  <span
                    style={{
                      marginLeft: "10px",
                      color:
                        item.status.toLowerCase().includes("success") ||
                          item.status.includes("✅")
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
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter English word"
                  value={item.english}
                  onChange={(e) =>
                    handleChange(item.id, "english", e.target.value)
                  }
                />

              </div>

              <div className="input-group">
                <Select
                  isMulti
                  options={wordTypes}
                  className="custom-select-1"
                  classNamePrefix="rs-1"
                  // styles={customStyles} 
                  placeholder="Select type(s)"
                  value={selectedOptions}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  onMenuOpen={() => console.log("Menu opened")}
                  onMenuClose={() => console.log("Menu closed")}
                  
                  onChange={(newValue, actionMeta) => {
                    const selected = newValue as MultiValue<OptionType>;

                    // Cập nhật value
                    const selectedValues = selected.map((opt) => opt.value).join(", ");
                    handleChange(item.id, "type", selectedValues);

                    // Giữ menu mở nếu là hành động chọn option

                  }}


                  components={{
                    MultiValue: () => null,
                    ClearIndicator: () => null,

                    ValueContainer: ({ children, ...props }) => {
                      const selected = props.getValue() as OptionType[];
                      const labels = selected.map((opt) => opt.label).join(", ");

                      return (
                        <components.ValueContainer {...props}>
                          {/* {children} */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              height: "100%",
                              width: "100%",
                              paddingLeft: 12,
                              fontSize: 14,
                            }}
                          >
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
                            gap: 8, // khoảng cách giữa checkbox và label
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            style={{
                              width: 16,
                              height: 16,
                              margin: 0,       // loại bỏ margin mặc định
                              padding: 0,
                              verticalAlign: "middle",
                            }}
                          />
                          <label style={{
                            margin: 0,
                            padding: 0,
                            lineHeight: "1",
                          }}>{option.label}</label>
                        </div>
                      );
                    },

                  }}
                />
              </div>

              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter meaning"
                  value={item.vietnamese}
                  onChange={(e) =>
                    handleChange(item.id, "vietnamese", e.target.value)
                  }
                />

              </div>

              <div className="input-group">
                <Select
                  options={extendedTopics}
                  className="custom-select"
                  classNamePrefix="rs"
                  styles={customStyles}
                  placeholder="Select topic"
                  value={
                    item.category === "__create__"
                      ? { value: "__create__", label: "➕ Tạo chủ đề mới" }
                      : topics.find((opt) => opt.value === item.category)
                  }

                  onChange={(selected) => {
                    const option = selected as OptionType;
                    if (option?.value === "__create__") {
                      setShowCreateTopicModal(true);
                    } else {
                      handleChange(item.id, "category", option?.value || "");
                    }
                  }}
                  components={{
                    ValueContainer: ({ children, ...props }) => (
                      <components.ValueContainer {...props}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          {children}
                        </div>
                      </components.ValueContainer>
                    ),
                  }}

                />

              </div>
            </div>
          </div>
        );
      })}

      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button className="add_word-btn" onClick={handleAddRow}>
          Thêm từ
        </button>
        <button className="done-btn" onClick={handleSubmit}>
          Done
        </button>
      </div>
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

export default NewWord;
