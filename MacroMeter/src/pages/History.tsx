import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HistoryItem from "@/components/HistoryItem";
import { getMealHistory, addToMealHistory } from "@/data/mockData";
import { motion } from "framer-motion";
import { MacroData } from "@/models/types";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mealHistory, setMealHistory] = useState<MacroData[]>([]);

  useEffect(() => {
    // Load meal history from localStorage when component mounts
    const savedHistory = getMealHistory();
    setMealHistory(savedHistory);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Navbar />
      
      <motion.div 
        className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Meal History</h1>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search meals..."
            className="w-full p-3 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          {mealHistory
            .filter(item => item.food_name.toLowerCase().includes(searchTerm.toLowerCase()))
            .length > 0 ? (
            mealHistory
              .filter(item => item.food_name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((meal, index) => (
                <HistoryItem 
                  key={`${meal.food_name}-${meal.date}-${index}`} 
                  data={meal} 
                />
              ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? `No meals found matching "${searchTerm}"` : 
                'No meal history found. Start tracking to see your meals here.'}
            </div>
          )}
        </div>
      </motion.div>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© 2025 MacroMeter. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default History;
