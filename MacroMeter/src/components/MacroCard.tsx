
import { Dumbbell, Cookie, Droplet } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MacroData {
  food_name: string;
  weight: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
}

interface MacroCardProps {
  data: MacroData;
}

const MacroCard = ({ data }: MacroCardProps) => {
  return (
    <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg rounded-xl animate-fade-in">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-gray-900">{data.food_name}</h2>
        <p className="text-gray-500">{data.weight}</p>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="text-center">
          <span className="text-3xl font-bold text-orange-500">{data.calories}</span>
          <span className="text-gray-500 ml-1">kcal</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-2 bg-blue-100 rounded-full">
            <Dumbbell className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-sm text-gray-500">Protein</span>
          <span className="text-lg font-semibold text-blue-600">{data.protein}</span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div className="p-2 bg-green-100 rounded-full">
            <Cookie className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-sm text-gray-500">Carbs</span>
          <span className="text-lg font-semibold text-green-600">{data.carbs}</span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div className="p-2 bg-orange-100 rounded-full">
            <Droplet className="w-6 h-6 text-orange-600" />
          </div>
          <span className="text-sm text-gray-500">Fats</span>
          <span className="text-lg font-semibold text-orange-600">{data.fats}</span>
        </div>
      </div>
    </Card>
  );
};

export default MacroCard;
