import { useEffect } from "react";
import { useWizard } from "../../context/WizardContext";
import StepBasicInfo from "../../components/wizard/StepBasicInfo";
import StepPayment from "../../components/wizard/StepPayment";
import StepDesign from "../../components/wizard/StepDesign";
import StepConfirm from "../../components/wizard/StepConfirm";

const STEP_LABELS = [
  { label: "Ubicación", icon: "📍" },
  { label: "Pagos",     icon: "💳" },
  { label: "Confirmar", icon: "✅" },
];

function WizardSteps() {
  const { step, nextStep, prevStep, TOTAL_STEPS, resetWizard, isStepValid } = useWizard();

  useEffect(() => {
    resetWizard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderStep = () => {
    switch (step) {
      case 0: return <StepBasicInfo />;
      case 1: return <StepPayment />;
      case 2: return <StepConfirm />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 w-full">
      {/* Progress Bar */}
      <div className="flex mb-3">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 mx-1 rounded-full transition-all duration-500 ${
              i <= step ? "bg-yellow-500" : "bg-gray-700"
            }`}
          />
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex mb-8">
        {STEP_LABELS.map((s, i) => (
          <div
            key={i}
            className={`flex-1 flex flex-col items-center gap-1 transition-all duration-300 ${
              i === step ? "opacity-100" : i < step ? "opacity-60" : "opacity-25"
            }`}
          >
            <span className="text-xs">{s.icon}</span>
            <span
              className={`text-[9px] uppercase tracking-widest font-black ${
                i === step ? "text-yellow-400" : "text-gray-500"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl p-4 md:p-6 w-full overflow-hidden">
        {renderStep()}
      </div>

      <div className="flex justify-between mt-8 border-t border-white/5 pt-6">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="px-6 py-2 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          Atrás
        </button>
        {step < TOTAL_STEPS - 1 && (
          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className="px-8 py-2 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}

export default function CreateBarbershopWizard() {
  return <WizardSteps />; // ✅ SIN PROVIDER
}
