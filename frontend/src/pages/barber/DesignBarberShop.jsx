import ColorPicker from "../../components/barber/ColorPicker";
import FontSelector from "../../components/barber/FontSelector";
import LayoutSelector from "../../components/barber/LayoutSelector";
import BarberPreview from "../../components/barber/BarberPreview";

export default function DesignBarberShop() {
  return (
    <div className="grid grid-cols-2 gap-6">
      
      {/* Editor */}
      <div className="space-y-4">
        <ColorPicker />
        <FontSelector />
        <LayoutSelector />
      </div>

      {/* Preview en vivo */}
      <div className="bg-white rounded">
        <BarberPreview />
      </div>
    </div>
  );
}
