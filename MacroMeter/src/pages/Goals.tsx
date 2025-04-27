import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MacroProgress from "@/components/MacroProgress";
import { macroGoals as defaultMacroGoals, getMealHistory } from "@/data/mockData";
import { motion } from "framer-motion";
import { getMacroGoals, MacroGoals } from "@/models/types";
import { format, isToday, isYesterday } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Goals = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [macroGoals, setMacroGoals] = useState<MacroGoals>(defaultMacroGoals);
  const [dailyMacros, setDailyMacros] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });
  
  // Format the selected date for display
  const formattedDate = format(selectedDate, "MMMM d, yyyy");
  
  const dateLabels = {
    today: "Today",
    yesterday: "Yesterday",
    other: formattedDate
  };
  
  const displayDate = isToday(selectedDate) 
    ? dateLabels.today 
    : isYesterday(selectedDate)
    ? dateLabels.yesterday
    : dateLabels.other;
  
  // Load goals from localStorage on component mount
  useEffect(() => {
    const storedGoals = getMacroGoals();
    if (storedGoals) {
      setMacroGoals(storedGoals);
    }
  }, []);
  
  // Calculate daily macros based on selected date and meal history
  useEffect(() => {
    // Format the selected date to match the format in meal history
    const dateString = format(selectedDate, "yyyy-MM-dd");
    
    // Get meals from localStorage and filter for the selected date
    const mealHistory = getMealHistory();
    const mealsForDate = mealHistory.filter(meal => meal.date === dateString);
    
    // Calculate totals
    const totals = mealsForDate.reduce((acc, meal) => {
      return {
        calories: acc.calories + parseFloat(meal.calories),
        protein: acc.protein + parseFloat(meal.protein || "0"),
        carbs: acc.carbs + parseFloat(meal.carbs || "0"),
        fats: acc.fats + parseFloat(meal.fats || "0")
      };
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    });
    
    setDailyMacros(totals);
  }, [selectedDate]);
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(selectedDate.getDate() - 1);
    setSelectedDate(previousDay);
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    
    // Don't allow selecting dates in the future
    if (nextDay <= new Date()) {
      setSelectedDate(nextDay);
    }
  };
  
  // Set to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Navbar />
      
      <motion.div 
        className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Daily Goals</h1>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          {/* Date navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToPreviousDay}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-xl font-bold">{displayDate}</h2>
              {!isToday(selectedDate) && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm text-blue-600"
                  onClick={goToToday}
                >
                  Return to Today
                </Button>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextDay}
              disabled={isToday(selectedDate)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <h2 className="text-xl font-bold mb-6">Daily Progress</h2>
          
          <MacroProgress 
            title="Calories" 
            current={dailyMacros.calories} 
            goal={macroGoals.calories_goal}
            type="calories"
          />
          
          <MacroProgress 
            title="Protein" 
            current={dailyMacros.protein} 
            goal={macroGoals.protein_goal}
            type="protein"
          />
          
          <MacroProgress 
            title="Carbs" 
            current={dailyMacros.carbs} 
            goal={macroGoals.carbs_goal}
            type="carbs"
          />
          
          <MacroProgress 
            title="Fats" 
            current={dailyMacros.fats} 
            goal={macroGoals.fats_goal}
            type="fats"
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Nutrition Summary</h2>
          <p className="text-gray-500 mb-6">Your nutritional intake for {displayDate.toLowerCase()}.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Calories</p>
              <p className="text-xl font-bold text-red-600">
                {dailyMacros.calories} / {macroGoals.calories_goal}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Protein</p>
              <p className="text-xl font-bold text-blue-600">
                {dailyMacros.protein}g / {macroGoals.protein_goal}g
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Carbs</p>
              <p className="text-xl font-bold text-green-600">
                {dailyMacros.carbs}g / {macroGoals.carbs_goal}g
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Fats</p>
              <p className="text-xl font-bold text-orange-600">
                {dailyMacros.fats}g / {macroGoals.fats_goal}g
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/settings">
              <Button variant="outline">Adjust Daily Goals</Button>
            </Link>
          </div>
        </div>
      </motion.div>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© 2025 MacroMeter. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Goals;
