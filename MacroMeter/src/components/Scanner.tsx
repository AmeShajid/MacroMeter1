import { addToMealHistory, currentMeal } from '@/data/mockData';

// In your scan result handler:
const handleScanResult = () => {
  // ... your existing scan logic ...
  
  // Add the scanned meal to history
  addToMealHistory(currentMeal);
};