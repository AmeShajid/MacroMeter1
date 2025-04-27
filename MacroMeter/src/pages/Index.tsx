import { useState } from "react";
import { Button } from "@/components/ui/button";
import MacroCard from "@/components/MacroCard";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { currentMeal } from "@/data/mockData";
import { macroGoals } from "@/data/mockData";  // This is causing the circular dependency

const Index = () => {
  const [isTracking, setIsTracking] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Navbar />
      
      <AnimatePresence mode="wait">
        {!isTracking ? (
          <motion.div 
            key="landing"
            className="flex flex-col items-center justify-center flex-1 px-4 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 text-center">MacroMeter</h1>
            <p className="text-xl text-gray-600 mb-10 text-center">Track your meals effortlessly</p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105"
              onClick={() => setIsTracking(true)}
            >
              Start Tracking
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            key="tracking"
            className="flex flex-col items-center py-12 px-4 flex-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Your Meal Macros</h2>
            <MacroCard data={currentMeal} />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© 2025 MacroMeter. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
