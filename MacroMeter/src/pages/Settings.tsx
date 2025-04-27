
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { userProfile as defaultUserProfile } from "@/data/mockData";
import { 
  UserProfile, 
  SettingsData, 
  MacroGoals,
  saveUserProfile,
  getUserProfile,
  saveSettings,
  getSettings,
  saveMacroGoals,
  getMacroGoals
} from "@/models/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState<SettingsData>({
    darkMode: false,
    useMetricUnits: true,
    notificationsEnabled: false
  });
  
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [goals, setGoals] = useState<MacroGoals>({
    calories_goal: 2000,
    protein_goal: 150,
    carbs_goal: 200,
    fats_goal: 70,
    calories_current: 0,
    protein_current: 0,
    carbs_current: 0,
    fats_current: 0
  });
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingGoals, setEditingGoals] = useState(false);
  const { toast } = useToast();
  
  const profileForm = useForm<UserProfile>({
    defaultValues: profile
  });
  
  const goalsForm = useForm<Partial<MacroGoals>>({
    defaultValues: {
      calories_goal: goals.calories_goal,
      protein_goal: goals.protein_goal,
      carbs_goal: goals.carbs_goal,
      fats_goal: goals.fats_goal
    }
  });
  
  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedSettings = getSettings();
    if (storedSettings) {
      setSettings(storedSettings);
    }
    
    const storedProfile = getUserProfile();
    if (storedProfile) {
      setProfile(storedProfile);
      profileForm.reset(storedProfile);
    }
    
    const storedGoals = getMacroGoals();
    if (storedGoals) {
      setGoals(storedGoals);
      goalsForm.reset({
        calories_goal: storedGoals.calories_goal,
        protein_goal: storedGoals.protein_goal,
        carbs_goal: storedGoals.carbs_goal,
        fats_goal: storedGoals.fats_goal
      });
    }
  }, []);
  
  const handleToggle = (setting: keyof SettingsData) => {
    const updatedSettings = {
      ...settings,
      [setting]: !settings[setting]
    };
    
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
    
    const message = `${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, ' $1')} ${updatedSettings[setting] ? 'enabled' : 'disabled'}`;
    toast({
      title: "Setting Updated",
      description: message
    });
    
    // Apply dark mode if needed
    if (setting === 'darkMode') {
      document.documentElement.classList.toggle('dark', updatedSettings.darkMode);
    }
  };
  
  const onSaveProfile = (data: UserProfile) => {
    setProfile(data);
    saveUserProfile(data);
    setEditingProfile(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated."
    });
  };
  
  const onSaveGoals = (data: Partial<MacroGoals>) => {
    const updatedGoals = { ...goals, ...data };
    setGoals(updatedGoals);
    saveMacroGoals(data);
    setEditingGoals(false);
    toast({
      title: "Goals Updated",
      description: "Your macro goals have been successfully updated."
    });
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
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Settings</h1>
        
        {/* User Profile Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          
          {!editingProfile ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {profile.profileImage ? (
                  <img 
                    src={profile.profileImage} 
                    alt={profile.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg">{profile.name}</h3>
                  <p className="text-gray-500">Age: {profile.age} • Weight: {profile.weight} • Height: {profile.height}</p>
                </div>
              </div>
              
              <Button onClick={() => setEditingProfile(true)}>Edit Profile</Button>
            </div>
          ) : (
            <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    {...profileForm.register('name')}
                    defaultValue={profile.name}
                  />
                </div>
                
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    {...profileForm.register('age', { valueAsNumber: true })}
                    defaultValue={profile.age}
                  />
                </div>
                
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input 
                    id="weight" 
                    {...profileForm.register('weight')}
                    defaultValue={profile.weight}
                  />
                </div>
                
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input 
                    id="height" 
                    {...profileForm.register('height')}
                    defaultValue={profile.height}
                  />
                </div>
                
                <div>
                  <Label htmlFor="profileImage">Profile Image URL (Optional)</Label>
                  <Input 
                    id="profileImage" 
                    {...profileForm.register('profileImage')}
                    defaultValue={profile.profileImage || ''}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">Save Profile</Button>
                <Button type="button" variant="outline" onClick={() => setEditingProfile(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
        
        {/* Macro Goals Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Daily Macro Goals</h2>
          
          {!editingGoals ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Calories</p>
                  <p className="text-xl font-bold text-red-600">{goals.calories_goal}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Protein</p>
                  <p className="text-xl font-bold text-blue-600">{goals.protein_goal}g</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Carbs</p>
                  <p className="text-xl font-bold text-green-600">{goals.carbs_goal}g</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Fats</p>
                  <p className="text-xl font-bold text-orange-600">{goals.fats_goal}g</p>
                </div>
              </div>
              
              <Button onClick={() => setEditingGoals(true)}>Adjust Goals</Button>
            </div>
          ) : (
            <form onSubmit={goalsForm.handleSubmit(onSaveGoals)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories_goal">Daily Calories</Label>
                  <Input 
                    id="calories_goal" 
                    type="number" 
                    {...goalsForm.register('calories_goal', { valueAsNumber: true })}
                    defaultValue={goals.calories_goal}
                  />
                </div>
                
                <div>
                  <Label htmlFor="protein_goal">Protein (g)</Label>
                  <Input 
                    id="protein_goal" 
                    type="number" 
                    {...goalsForm.register('protein_goal', { valueAsNumber: true })}
                    defaultValue={goals.protein_goal}
                  />
                </div>
                
                <div>
                  <Label htmlFor="carbs_goal">Carbs (g)</Label>
                  <Input 
                    id="carbs_goal" 
                    type="number" 
                    {...goalsForm.register('carbs_goal', { valueAsNumber: true })}
                    defaultValue={goals.carbs_goal}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fats_goal">Fats (g)</Label>
                  <Input 
                    id="fats_goal" 
                    type="number" 
                    {...goalsForm.register('fats_goal', { valueAsNumber: true })}
                    defaultValue={goals.fats_goal}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">Save Goals</Button>
                <Button type="button" variant="outline" onClick={() => setEditingGoals(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
        
        {/* App Settings Section */}
        <div className="bg-white rounded-xl shadow-md divide-y">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-gray-500">Toggle dark theme</p>
            </div>
            <Switch 
              checked={settings.darkMode}
              onCheckedChange={() => handleToggle('darkMode')}
            />
          </div>
          
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Units</h3>
              <p className="text-sm text-gray-500">Use metric system (grams)</p>
            </div>
            <Switch 
              checked={settings.useMetricUnits}
              onCheckedChange={() => handleToggle('useMetricUnits')}
            />
          </div>
          
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-gray-500">Enable meal reminders</p>
            </div>
            <Switch 
              checked={settings.notificationsEnabled}
              onCheckedChange={() => handleToggle('notificationsEnabled')}
            />
          </div>
        </div>
        
        <div className="mt-6 p-6 bg-white rounded-xl shadow-md">
          <h3 className="font-medium mb-4">About MacroMeter</h3>
          <p className="text-gray-600">Version 1.0.0</p>
          <p className="text-gray-600 mt-2">A simple and efficient way to track your nutrition macros and achieve your fitness goals.</p>
        </div>
      </motion.div>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© 2025 MacroMeter. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Settings;
