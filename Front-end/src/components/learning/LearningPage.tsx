"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import LearningTips from "./LearningTips";
import LoadingLearning from "./LoadingLearning";
import QuizCard from "./QuizCard";
import { LearningMode, QuestionData } from "./types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const modes: LearningMode[] = [
  "complete-sentence-meaning",
  "1Eng-4Vn-words",
  "1Vn-4Eng-words",
  "complete-word",
  "complete-sentence-word-kind",
];

const difficultyLevels = ["Easy", "Medium", "Hard", "VeryHard"];

export default function LearningPage() {
  const searchParams = useSearchParams();

  const difficulty = searchParams.get("difficulty") ?? "Easy";
  const categories = searchParams.getAll("categories");
  const [data, setData] = useState<QuestionData | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [mode, setMode] = useState<LearningMode>("1Eng-4Vn-words");
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchQuestion();
    }
  }, []);

  async function fetchQuestion() {
    if (!apiUrl) {
      setErrorMessage("Missing NEXT_PUBLIC_API_URL in .env");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const randomMode = modes[Math.floor(Math.random() * modes.length)];

      setMode(randomMode);

      const endpointByMode: Record<LearningMode, string> = {
        "complete-sentence": "/learning/fill-in-the-blank/meaning",
        "complete-sentence-meaning": "/learning/fill-in-the-blank/meaning",
        "1Eng-4Vn-words": "/learning/multiple-choice/eng-to-vn",
        "1Vn-4Eng-words": "/learning/multiple-choice/vn-to-eng",
        "complete-word": "/learning/spelling",
        "complete-sentence-word-kind": "/learning/fill-in-the-blank/word-kind",
      };

      const endpoint = endpointByMode[randomMode];

      // const url = `${apiUrl}${endpoint}?difficulty=${difficulty}&topic=${topic}`;
      const params = new URLSearchParams();

      params.set("difficulty", difficulty);

      categories.forEach((category) => {
        params.append("categories", category);
      });

      const url = `${apiUrl}${endpoint}?${params.toString()}`;
      console.log("Learning API URL:", url);

      const delay = new Promise((resolve) => setTimeout(resolve, 400));

      const request = fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      const [response] = await Promise.all([request, delay]);

      if (!response.ok) {
        throw new Error("Failed to fetch question.");
      }

      const result = await response.json();

      const questionData: QuestionData = result.questionAnswer;

      if (randomMode === "complete-word") {
        questionData.answerOptions = [...questionData.answerOptions].sort(
          () => Math.random() - 0.5
        );
      }

      setData(questionData);
      setSelected(null);
      setUserAnswer([]);
      setShowResult(false);
      setActiveIndices([]);
      // setQuestionNumber((current) => Math.min(current + 1, 20));
    } catch (error) {
      console.error("Fetch question error:", error);
      setErrorMessage("Cannot load question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleNextQuestion() {
    setQuestionNumber((current) => Math.min(current + 1, 20));
    await fetchQuestion();
  }

  function handleChoose(index: number) {
    if (showResult || !data) return;

    if (mode === "complete-word") {
      const selectedLetter = data.answerOptions[index];

      if (activeIndices.includes(index)) {
        const selectedPosition = activeIndices.indexOf(index);
        const nextIndices = activeIndices.filter((item) => item !== index);
        const nextAnswer = userAnswer.filter(
          (_, answerIndex) => answerIndex !== selectedPosition
        );

        setActiveIndices(nextIndices);
        setUserAnswer(nextAnswer);
        return;
      }

      const nextIndices = [...activeIndices, index];
      const nextAnswer = [...userAnswer, selectedLetter];

      setActiveIndices(nextIndices);
      setUserAnswer(nextAnswer);

      if (
        nextAnswer.join("") === data.rightAnswer ||
        nextAnswer.length >= data.rightAnswer.length
      ) {
        const isCorrect = nextAnswer.join("") === data.rightAnswer;
        const audio = new Audio(
          isCorrect ? "/sound/correct.mp3" : "/sound/wrong.mp3"
        );

        audio.volume = 0.7;
        audio.play().catch((error) => {
          console.error("Play spelling sound error:", error);
        });

        setShowResult(true);
      }

      return;
    }

    setSelected(index);
    setShowResult(true);
  }

  function speakText(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(
      (voice) => voice.lang === "en-US" && voice.name.includes("Google")
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    speechSynthesis.speak(utterance);
  }

  return (
    <div className="max-w-container-max mx-auto min-h-[calc(100vh-140px)] flex flex-col justify-center items-center px-3 md:px-0 pb-24 md:pb-0">    {/* <LearningHeader /> */}

      {errorMessage && (
        <div className="w-full max-w-5xl mb-4 rounded-2xl border border-error-container bg-error-container/60 p-4 text-error">
          {errorMessage}
        </div>
      )}

      {isLoading || !data ? (
        <LoadingLearning />
      ) : (
        <QuizCard
          data={data}
          mode={mode}
          selected={selected}
          showResult={showResult}
          userAnswer={userAnswer}
          activeIndices={activeIndices}
          questionNumber={questionNumber}
          totalQuestions={20}
          onChoose={handleChoose}
          onNext={handleNextQuestion}
          onSpeak={speakText}
        />
      )}

      <LearningTips />
    </div>
  );
}