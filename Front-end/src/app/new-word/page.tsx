import NewWordForm from "@/components/new-word/NewWordForm";
import NewWordTip from "@/components/new-word/NewWordTip";

export default function NewWordPage() {
  return (
    <div className="max-w-container-max mx-auto space-y-stack-lg">
      {/* <div>
        <h1 className="font-display-lg text-[48px] leading-[56px] font-bold text-primary tracking-[-0.02em]">
          Add New Word
        </h1>

        <p className="text-body-md text-on-surface-variant mt-2">
          Expand your vocabulary by adding new entries to your learning deck.
        </p>
      </div> */}

      <NewWordForm />

      <NewWordTip />
    </div>
  );
}