export interface MacroData {
  food_name: string;
  weight: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  date?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: string;
  height: string;
  profileImage?: string;
}

export interface MacroGoals {
  calories_goal: number;
  protein_goal: number;
  carbs_goal: number;
  fats_goal: number;
  calories_current: number;
  protein_current: number;
  carbs_current: number;
  fats_current: number;
}

export interface SettingsData {
  darkMode: boolean;
  useMetricUnits: boolean;
  notificationsEnabled: boolean;
}

// Functions to manage user data in localStorage
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  const profile = localStorage.getItem('userProfile');
  return profile ? JSON.parse(profile) : null;
};

export const saveMacroGoals = (goals: Partial<MacroGoals>): void => {
  const currentGoals = getMacroGoals() || {
    calories_goal: 2000,
    protein_goal: 150,
    carbs_goal: 200,
    fats_goal: 70,
    calories_current: 0,
    protein_current: 0,
    carbs_current: 0,
    fats_current: 0
  };
  
  const updatedGoals = { ...currentGoals, ...goals };
  localStorage.setItem('macroGoals', JSON.stringify(updatedGoals));
};

export const getMacroGoals = (): MacroGoals | null => {
  const goals = localStorage.getItem('macroGoals');
  return goals ? JSON.parse(goals) : null;
};

export const saveSettings = (settings: SettingsData): void => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

export const getSettings = (): SettingsData | null => {
  const settings = localStorage.getItem('settings');
  return settings ? JSON.parse(settings) : null;
};
