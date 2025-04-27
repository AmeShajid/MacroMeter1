
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { userProfile } from "@/data/mockData";
import { motion } from "framer-motion";
import { Edit, User } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Navbar />
      
      <motion.div 
        className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="relative">
              {userProfile.profileImage ? (
                <img 
                  src={userProfile.profileImage} 
                  alt={userProfile.name} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={64} className="text-blue-500" />
                </div>
              )}
            </div>
            
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{userProfile.name}</h1>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{userProfile.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium">{userProfile.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="font-medium">{userProfile.height}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Button className="w-full sm:w-auto flex items-center justify-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Your Daily Macro Goals</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Protein</p>
              <p className="text-xl font-bold text-blue-600">150g</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Carbs</p>
              <p className="text-xl font-bold text-green-600">200g</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Fats</p>
              <p className="text-xl font-bold text-orange-600">70g</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Calories</p>
              <p className="text-xl font-bold text-red-600">2,000</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© 2025 MacroMeter. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Profile;
