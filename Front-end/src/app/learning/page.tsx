"use client";

import React, { useEffect, useState, useRef  } from "react";
import axios from "axios";
import "./learning.css";
import { marked } from "marked";
// import public/sounds/correct.mp3

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const LETTERS = ["a", "b", "c", "d"];

export default function LearningPage() {
  const [data, setData] = useState<any>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [mode, setMode] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  

 const hasFetched = useRef(false);

  const modeDescriptions: Record<string, string> = {
    "complete-sentence": "Điền vào chỗ trống trong câu",
    "complete-sentence-meaning": "Chọn nghĩa đúng của câu",
    "1Eng-4Vn-words": "Chọn nghĩa tiếng Việt của từ tiếng Anh",
    "1Vn-4Eng-words": "Chọn từ tiếng Anh đúng với nghĩa tiếng Việt",
    "complete-word": "Sắp xếp các chữ cái để hoàn thành từ",
    "complete-sentence-word-kind": "Chọn từ loại đúng trong câu"
  };

  const fetchQuestion = async () => {
    try {
      // setFade("fade-out");
      setIsLoading(true);

      const delay = new Promise((res) => setTimeout(res, 400)); // đảm bảo ít nhất 400ms

      const modes = [
        "complete-sentence-meaning",
        "1Eng-4Vn-words",
        "1Vn-4Eng-words",
        "complete-word",
        "complete-sentence-word-kind"
      ];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      setMode(randomMode);

      const difficultyLevels = ["easy", "medium", "hard", "veryhard"];
      const randomDifficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];

      const url =
        randomMode === "complete-sentence-meaning" || randomMode === "complete-sentence-word-kind"
          ? `${apiUrl}/learning-mode/${randomMode}?difficulty=${randomDifficulty}`
          : `${apiUrl}/learning-mode/${randomMode}`;

      // 👉 thêm headers ở đây
    const request = axios.get(url, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

      // Đợi cả API lẫn delay song song
      const [res] = await Promise.all([request, delay]);

      let questionData = res.data.questionAnswer;
      if (randomMode === "complete-word") {
        questionData.answerOptions = questionData.answerOptions.sort(
          () => Math.random() - 0.5
        );
      }

      setData(questionData);
      setSelected(null);
      setUserAnswer([]);
      setShowResult(false);
      setActiveIndices([]);
      // setFade("fade-in");
    } catch (err) {
      console.error("❌ Error fetching question:", err);
    } finally {
      setIsLoading(false); // Đặt ngoài catch để luôn chạy
    }
  };

useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchQuestion();
    }
  }, []);

const handleChoose = (index: number) => {
  if (showResult || !data) return;

  if (mode === "complete-word") {
    const selectedLetter = data.answerOptions[index];

    if (activeIndices.includes(index)) {
      // Nếu đã chọn → bỏ chọn
      const newIndices = activeIndices.filter(i => i !== index);
      const newAnswer = userAnswer.filter((_, i) => activeIndices[i] !== index);
      setActiveIndices(newIndices);
      setUserAnswer(newAnswer);
    } else {
      // Nếu chưa chọn → chọn thêm
      const newIndices = [...activeIndices, index];
      const newAnswer = [...userAnswer, selectedLetter];
      setActiveIndices(newIndices);
      setUserAnswer(newAnswer);

      if (newAnswer.join("") === data.rightAnswer || newAnswer.length >= data.rightAnswer.length) {
        setShowResult(true);

        
      }
    }
  } else {
    setSelected(index);
    setShowResult(true);

    
  }
};



  if (isLoading || !data) {
    return (
      <div className="loading-container">
        <div className="loader" /> {/* thay vì "spinner" */}
        <p>Đang tải câu hỏi...</p>
      </div>
    );
  }

  const isCompleteWordMode = mode === "complete-word";
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // bạn có thể đổi sang "en-GB" hoặc "en-AU" nếu muốn
    speechSynthesis.speak(utterance);
  };
  return (
    <div className="learning-page">
      <div className="quiz-container">
        <p className="instruction">
          {modeDescriptions[mode] || "Chế độ học"}
        </p>

        <h2 className="question-sentence">
          {isCompleteWordMode ? data.sentence : data.sentence.replace("____", "____")}
        </h2>

        {isCompleteWordMode && userAnswer.length > 0 && (
          <p className="assembled-word">{userAnswer.join("")}</p>
        )}

        <div
          className={`answer-grid ${isCompleteWordMode ? "grid-letters" : ""}`}
        >
          {data.answerOptions.map((option: string, index: number) => {
            const letter = LETTERS[index];
            const isCorrect = letter === data.rightAnswer;
            const isChosen = selected === index;

            let className = "answer-button";

            if (!isCompleteWordMode && showResult) {
              if (isCorrect) className += " correct";
              else if (isChosen) className += " wrong";
            }

            if (isCompleteWordMode && showResult) {
              const finalAnswer = userAnswer.join("");
              if (finalAnswer === data.rightAnswer) className += " correct";
              else className += " wrong";
            }
            if (isCompleteWordMode && activeIndices.includes(index)) {
              className += " selected-letter";
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => handleChoose(index)}
                disabled={showResult}
              >
                {isCompleteWordMode ? option : (
                  <>
                    <span className="answer-number">{index + 1}.</span> {option}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {showResult && (
          <>
            <div className="result-bar">
              <div className="result-row">
                <p className="result-text">
                  {isCompleteWordMode ? (
                    userAnswer.join("") === data.rightAnswer ? (
                      <>
                        🎉 Chính xác!
                        <button
                          className="speaker-button"
                          onClick={() => speakText(data.rightAnswer)}
                          title="Nghe phát âm"
                        >
                          🔊
                        </button>
                      </>
                    ) : (
                      <>
                        ❌ Sai rồi! Đáp án đúng là "<strong>{data.rightAnswer}</strong>"
                        <button
                          className="speaker-button"
                          onClick={() => speakText(data.rightAnswer)}
                          title="Nghe phát âm"
                        >
                          🔊
                        </button>
                      </>
                    )
                  ) : (
                    LETTERS[selected!] === data.rightAnswer ? (
                      "🎉 Chính xác!"
                    ) : (
                      `❌ Sai rồi! Đáp án đúng là "${data.answerOptions[LETTERS.indexOf(data.rightAnswer)]}".`
                    )
                  )}
                </p>
                <button className="next-button" onClick={fetchQuestion}>
                  Câu tiếp theo
                </button>
              </div>

              {data.explanation && (
                <div className="explanation-text"
                  dangerouslySetInnerHTML={{ __html: marked.parse(data.explanation) }}
                />
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
