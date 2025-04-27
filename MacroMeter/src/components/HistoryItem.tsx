
import { useState } from "react";
import { MacroData } from "@/models/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import MacroCard from "@/components/MacroCard";
import { format, parse, isToday, isYesterday } from "date-fns";

interface HistoryItemProps {
  data: MacroData;
}

const HistoryItem = ({ data }: HistoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format the date for display
  const formatDisplayDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    
    try {
      const date = parse(dateString, "yyyy-MM-dd", new Date());
      
      if (isToday(date)) {
        return "Today";
      } else if (isYesterday(date)) {
        return "Yesterday";
      } else {
        return format(date, "MMM d, yyyy");
      }
    } catch (error) {
      return dateString;
    }
  };
  
  const displayDate = formatDisplayDate(data.date);
  
  return (
    <Card className="mb-4 overflow-hidden">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="font-medium">{data.food_name}</h3>
          <p className="text-sm text-gray-500">{displayDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-orange-500 font-medium">{data.calories} kcal</div>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t">
          <MacroCard data={data} />
        </div>
      )}
    </Card>
  );
};

export default HistoryItem;
