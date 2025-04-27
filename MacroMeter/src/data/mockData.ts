import { MacroData, UserProfile } from "../models/types";
import dishMacros from '/Users/ameshajid/Downloads/MacroMeter1/dish_macros.json';

// Function to get meal history from localStorage
export const getMealHistory = (): MacroData[] => {
  const savedHistory = localStorage.getItem('mealHistory');
  return savedHistory ? JSON.parse(savedHistory) : [];
};

// Function to add a meal to history
export const addToMealHistory = (meal: MacroData) => {
  const mealWithDate = {
    ...meal,
    date: new Date().toISOString().split('T')[0]
  };
  const currentHistory = getMealHistory();
  const updatedHistory = [mealWithDate, ...currentHistory]; // Add new meal at the start
  localStorage.setItem('mealHistory', JSON.stringify(updatedHistory));
  return updatedHistory;
};

// Current meal from dish_macros.json
export const currentMeal: MacroData = {
  food_name: dishMacros.DishName,
  weight: `${dishMacros.Weight_g}g`,
  calories: dishMacros.Macros.calories.toString(),
  protein: `${dishMacros.Macros.protein_g}g`,
  carbs: `${dishMacros.Macros.carbs_g}g`,
  fats: `${dishMacros.Macros.fat_g}g`
};

// Automatically add current meal to history when it changes
if (currentMeal.food_name) {
  addToMealHistory(currentMeal);
}

// macroGoals export
export const macroGoals = {
  calories_goal: 2000,
  protein_goal: 150,
  carbs_goal: 200,
  fats_goal: 70,
  calories_current: parseInt(dishMacros.Macros.calories),
  protein_current: parseInt(dishMacros.Macros.protein_g),
  carbs_current: parseInt(dishMacros.Macros.carbs_g),
  fats_current: parseInt(dishMacros.Macros.fat_g)
};

// Add userProfile export
export const userProfile: UserProfile = {
  name: "Alex Johnson",
  age: 32,
  weight: "75kg",
  height: "178cm",
  profileImage: "https://i.pravatar.cc/300"
};
