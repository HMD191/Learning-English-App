import Achievements from "./Achievements";
import LearningProgress from "./LearningProgress";

export default function SupplementalColumn() {
  return (
    <div className="lg:col-span-1 space-y-gutter">
      <LearningProgress />
      <Achievements />
    </div>
  );
}