import { Check } from "lucide-react";
import clsx from "clsx";

type Props = {
  step: number;
  setStep: (s: number) => void;
};

const STEPS = [
  { id: 1, label: "File Selection" },
  { id: 2, label: "Metadata Entry" },
  { id: 3, label: "Review & Submit" },
];

export default function WizardSteps({ step, setStep }: Props) {
  return (
    <div className="flex justify-between items-center gap-4 mb-10 w-full mx-auto">
      {STEPS.map((s, index) => {
        const isCompleted = step > s.id;
        const isCurrent = step === s.id;

        return (
          <div
            key={s.id}
            className={`flex items-center w-fit ${
              index !== STEPS.length - 1 && "flex-1"
            }`}
          >
            {/* Step Button */}
            <button
              type="button"
              disabled={!isCompleted && !isCurrent}
              onClick={() => setStep(s.id)}
              className="flex items-center gap-3 group "
            >
              {/* Circle */}
              <div
                className={clsx(
                  "flex items-center justify-center w-8 h-8 rounded-full border text-sm font-semibold transition-colors",
                  {
                    "bg-violet-600 border-violet-600 text-white cursor-pointer":
                      isCompleted || isCurrent,
                    "bg-gray-200 border-gray-300 text-gray-500":
                      !isCompleted && !isCurrent,
                  }
                )}
              >
                {isCompleted ? <Check size={16} /> : s.id}
              </div>

              {/* Label */}
              <span
                className={clsx("text-sm font-medium md:inline hidden", {
                  "text-gray-900": isCompleted || isCurrent,
                  "text-gray-400": !isCompleted && !isCurrent,
                })}
              >
                {s.label}
              </span>
            </button>

            {/* Connector Line */}
            {index !== STEPS.length - 1 && (
              <div
                className={clsx(
                  "flex-1 h-px mx-4",
                  isCompleted ? "bg-violet-600" : "bg-gray-300"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
