import { useEffect } from "react";
import { useWizard } from "../../context/WizardContext";
import StepBasicInfo from "../../components/wizard/StepBasicInfo";
import StepDesign from "../../components/wizard/StepDesign";
import StepConfirm from "../../components/wizard/StepConfirm";

function WizardSteps() {
  const { step, nextStep, prevStep, TOTAL_STEPS, resetWizard } = useWizard();

  useEffect(() => {
    resetWizard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderStep = () => {
    switch (step) {
      case 0: return <StepBasicInfo />;
      case 1: return <StepDesign />;
      case 2: return <StepConfirm />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 w-full">
      <div className="flex mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 mx-1 rounded-full ${i <= step ? "bg-yellow-500" : "bg-gray-700"
              }`}
          />
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
            className="px-8 py-2 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-lg"
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
