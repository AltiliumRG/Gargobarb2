// frontend/src/pages/barber/CreateBarbershopWizard.jsx
import { useWizard } from "../../context/WizardContext";
import StepBasicInfo from "../../components/wizard/StepBasicInfo";
import StepFeatures from "../../components/wizard/StepFeatures";
import StepDesign from "../../components/wizard/StepDesign";
import StepConfirm from "../../components/wizard/StepConfirm";

function WizardSteps() {
  const { step, nextStep, prevStep, TOTAL_STEPS } = useWizard();

  const renderStep = () => {
    switch (step) {
      case 0: return <StepBasicInfo />;
      case 1: return <StepFeatures />;
      case 2: return <StepDesign />;
      case 3: return <StepConfirm />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 mx-1 rounded-full ${
              i <= step ? "bg-yellow-500" : "bg-gray-700"
            }`}
          />
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        {renderStep()}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} disabled={step === 0}>
          Atrás
        </button>
        <button onClick={nextStep}>
          {step === TOTAL_STEPS - 1 ? "Finalizar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}

export default function CreateBarbershopWizard() {
  return <WizardSteps />; // ✅ SIN PROVIDER
}
