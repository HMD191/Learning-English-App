import LearningQueue from "@/components/home/LearningQueue";
import StatsGrid from "@/components/home/StatsGrid";
import SupplementalColumn from "@/components/home/SupplementalColumn";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import WordOfDay from "@/components/home/WordOfDay";
import UpdateNoticeBox from "@/components/home/UpdateNotice";

export default function HomePage() {
  return (
    <div className="max-w-container-max mx-auto space-y-5 2xl:space-y-stack-lg">      <WelcomeBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 2xl:gap-gutter">
        <div className="lg:col-span-2 space-y-5 2xl:space-y-gutter">
          <StatsGrid />
          
          {/* <UpdateNoticeBox /> */}
          <LearningQueue />
          <WordOfDay />
        </div>

        <SupplementalColumn />
      </div>
    </div>
  );
}