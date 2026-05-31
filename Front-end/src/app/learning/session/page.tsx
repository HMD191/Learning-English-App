import { Suspense } from "react";
import LearningPage from "@/components/learning/LearningPage";
import LoadingLearning from "@/components/learning/LoadingLearning";

export default function LearningSessionPage() {
  return (
    <Suspense fallback={<LoadingLearning />}>
      <LearningPage />
    </Suspense>
  );
}