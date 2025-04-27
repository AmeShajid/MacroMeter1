import { MacroData, UserProfile, MacroGoals, SettingsData } from "../models/types";
import dishMacros from '/Users/ameshajid/Downloads/MacroMeter1/dish_macros.json';

export const currentMeal: MacroData = {
  food_name: dishMacros.DishName,
  weight: `${dishMacros.Weight_g}g`,
  calories: dishMacros.Macros.calories.toString(),
  protein: `${dishMacros.Macros.protein_g}g`,
  carbs: `${dishMacros.Macros.carbs_g}g`,
  fats: `${dishMacros.Macros.fat_g}g`
};

export const mealHistory: MacroData[] = [
  {
    ...currentMeal,
    date: new Date().toISOString().split('T')[0]
  }
];

export const macroGoals: MacroGoals = {
  calories_goal: 2000,
  protein_goal: 150,
  carbs_goal: 200,
  fats_goal: 70,
  calories_current: parseInt(currentMeal.calories),
  protein_current: parseInt(currentMeal.protein),
  carbs_current: parseInt(currentMeal.carbs),
  fats_current: parseInt(currentMeal.fats)
};

export const userProfile: UserProfile = {
  name: "Alex Johnson",
  age: 32,
  weight: "75kg",
  height: "178cm",
  profileImage: "https://i.pravatar.cc/300"
};

export const settings: SettingsData = {
  darkMode: false,
  useMetricUnits: true,
  notificationsEnabled: true
};
