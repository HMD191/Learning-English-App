"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const ALL_TOPICS_VALUE = "all";

type CategoriesResponse = {
    statusCode: number;
    categories: string[];
};

const difficulties = [
    {
        label: "Easy",
        value: "Easy",
        description: "IELTS 5.0-",
    },
    {
        label: "Medium",
        value: "Medium",
        description: "IELTS 5.0 - 6.0",
    },
    {
        label: "Hard",
        value: "Hard",
        description: "IELTS 6.5 - 7.5",
    },
    {
        label: "Very Hard",
        value: "VeryHard",
        description: "IELTS 8.0+",
    },
];

function normalizeCategories(result: unknown): string[] {
    if (Array.isArray(result)) {
        return result.filter((item): item is string => typeof item === "string");
    }

    if (!result || typeof result !== "object") {
        return [];
    }

    const data = result as Partial<CategoriesResponse>;

    if (Array.isArray(data.categories)) {
        return data.categories.filter(
            (item): item is string => typeof item === "string"
        );
    }

    return [];
}

export default function LearningSetupPage() {
    const router = useRouter();

    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const isAllTopicsSelected = selectedCategories.includes(ALL_TOPICS_VALUE);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        if (!apiUrl) {
            setErrorMessage("Missing NEXT_PUBLIC_API_URL in .env");
            return;
        }

        try {
            setIsLoadingCategories(true);
            setErrorMessage("");

            const response = await fetch(`${apiUrl}/categories`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch categories.");
            }

            const result = await response.json();
            console.log("Categories API result:", result);

            const categoryList = normalizeCategories(result);
            console.log("Normalized categories:", categoryList);

            setCategories(categoryList);
            setSelectedCategories([]);
        } catch (error) {
            console.error("Fetch categories error:", error);
            setErrorMessage("Cannot load topics. Please try again.");
        } finally {
            setIsLoadingCategories(false);
        }
    }

    function handleToggleAllTopics() {
        setSelectedCategories([ALL_TOPICS_VALUE]);
        setErrorMessage("");
    }

    function handleToggleCategory(category: string) {
        if (isAllTopicsSelected) {
            return;
        }

        setErrorMessage("");

        setSelectedCategories((current) => {
            if (current.includes(category)) {
                return current.filter((item) => item !== category);
            }

            return [...current, category];
        });
    }

    function handleTurnOffAllTopics() {
        setSelectedCategories([]);
        setErrorMessage("");
    }

    function handleStartLearning() {
        if (selectedCategories.length === 0) {
            setErrorMessage("Please choose at least one topic before starting.");
            return;
        }

        if (!selectedDifficulty) {
            setErrorMessage("Please choose a difficulty before starting.");
            return;
        }

        const params = new URLSearchParams();

        params.set("difficulty", selectedDifficulty);

        if (!selectedCategories.includes(ALL_TOPICS_VALUE)) {
            selectedCategories.forEach((category) => {
                params.append("categories", category);
            });
        }

        router.push(`/learning/session?${params.toString()}`);
    }

    function getSelectedTopicLabel() {
        if (selectedCategories.includes(ALL_TOPICS_VALUE)) {
            return "All topics";
        }

        if (selectedCategories.length === 0) {
            return "Not selected";
        }

        return selectedCategories.join(", ");
    }

    return (
        <main className="min-h-[calc(100vh-80px)] px-4 pt-0 pb-8 md:px-8">
            <div className="mx-auto max-w-5xl">
                {errorMessage && (
                    <div className="mb-4 rounded-2xl border border-error-container bg-error-container/60 p-4 text-error">
                        {errorMessage}
                    </div>
                )}

                <section className="rounded-3xl border border-outline-variant bg-white p-5 shadow-sm md:p-7">
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <h2 className="text-xl font-bold text-on-surface">
                                Choose a topic
                            </h2>
                        </div>

                        {isLoadingCategories ? (
                            <div className="rounded-2xl bg-surface-container-low p-5 text-on-surface-variant">
                                Loading topics...
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="rounded-2xl bg-surface-container-low p-5 text-on-surface-variant">
                                No topics found.
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <button
                                    type="button"
                                    onClick={
                                        isAllTopicsSelected
                                            ? handleTurnOffAllTopics
                                            : handleToggleAllTopics
                                    }
                                    className={`rounded-2xl border p-4 text-left transition-all ${isAllTopicsSelected
                                        ? "border-primary bg-primary-container text-primary shadow-sm"
                                        : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-low"
                                        }`}
                                >
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="font-bold">All topics</span>
                                    </div>
                                </button>

                                {categories.map((category) => {
                                    const isSelected = selectedCategories.includes(category);

                                    return (
                                        <button
                                            key={category}
                                            type="button"
                                            disabled={isAllTopicsSelected}
                                            onClick={() => handleToggleCategory(category)}
                                            className={`rounded-2xl border p-4 text-left transition-all ${isSelected
                                                ? "border-primary bg-primary-container text-primary shadow-sm"
                                                : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-low"
                                                } ${isAllTopicsSelected
                                                    ? "cursor-not-allowed opacity-40 hover:bg-white"
                                                    : ""
                                                }`}
                                        >
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="font-bold">{category}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <div className="mb-4 flex items-center gap-2">
                            <h2 className="text-xl font-bold text-on-surface">
                                Choose difficulty
                            </h2>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {difficulties.map((difficulty) => {
                                const isSelected = selectedDifficulty === difficulty.value;

                                return (
                                    <button
                                        key={difficulty.value}
                                        type="button"
                                        onClick={() => setSelectedDifficulty(difficulty.value)}
                                        className={`rounded-2xl border p-4 text-left transition-all ${isSelected
                                            ? "border-primary bg-primary-container text-primary shadow-sm"
                                            : "border-outline-variant bg-white text-on-surface hover:bg-surface-container-low"
                                            }`}
                                    >
                                        <p className="font-bold">{difficulty.label}</p>
                                        <p className="mt-2 text-sm text-on-surface-variant">
                                            {difficulty.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-surface-container-low p-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="font-bold text-on-surface">Ready to start?</p>

                            <p className="text-sm text-on-surface-variant">
                                Topic:{" "}
                                <span className="font-semibold">{getSelectedTopicLabel()}</span>{" "}
                                · Difficulty:{" "}
                                <span className="font-semibold">
                                    {selectedDifficulty || "Not selected"}
                                </span>
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleStartLearning}
                            disabled={
                                selectedCategories.length === 0 ||
                                !selectedDifficulty ||
                                isLoadingCategories
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-white shadow-[0_8px_20px_rgba(66,85,255,0.22)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Start learning
                            <span className="material-symbols-outlined text-[20px]">
                                arrow_forward
                            </span>
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}