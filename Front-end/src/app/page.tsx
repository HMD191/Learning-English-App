import LearningQueue from "@/components/home/LearningQueue";
import StatsGrid from "@/components/home/StatsGrid";
import SupplementalColumn from "@/components/home/SupplementalColumn";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import WordOfDay from "@/components/home/WordOfDay";

export default function HomePage() {
  return (
    <div className="max-w-container-max mx-auto space-y-stack-lg">
      <WelcomeBanner />

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 space-y-gutter">
          <LearningQueue />
          <WordOfDay />
        </div>

        <SupplementalColumn />
      </div>
    </div>
  );
}