
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Cookie, Droplet, Flame } from "lucide-react";

interface MacroProgressProps {
  title: string;
  current: number;
  goal: number;
  type: "calories" | "protein" | "carbs" | "fats";
}

const MacroProgress = ({ title, current, goal, type }: MacroProgressProps) => {
  // Calculate percentage of goal (capped at 100%)
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  
  // Config for different macro types
  const typeConfig = {
    calories: {
      icon: Flame,
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      progressColor: "bg-red-500"
    },
    protein: {
      icon: Dumbbell,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      progressColor: "bg-blue-500"
    },
    carbs: {
      icon: Cookie,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      progressColor: "bg-green-500"
    },
    fats: {
      icon: Droplet,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      progressColor: "bg-orange-500"
    }
  };
  
  const config = typeConfig[type];
  const Icon = config.icon;
  
  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${config.bgColor}`}>
            <Icon className={`w-4 h-4 ${config.textColor}`} />
          </div>
          <span className="font-medium">{title}</span>
        </div>
        <div className="text-sm font-medium">
          <span className={config.textColor}>{current}</span>
          <span className="text-gray-400"> / {goal}</span>
        </div>
      </div>
      
      <Progress 
        value={percentage} 
        className="h-2 bg-gray-100" 
        style={{ 
          backgroundImage: `linear-gradient(to right, ${config.progressColor} ${percentage}%, transparent ${percentage}%)` 
        }}
      />
      
      <div className="text-xs text-right text-gray-400">
        {percentage}% of daily goal
      </div>
    </div>
  );
};

export default MacroProgress;
