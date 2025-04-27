
import { useState } from "react";
import { Menu, X, Home, History, Activity, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: History, label: "History", path: "/history" },
    { icon: Activity, label: "Goals", path: "/goals" },
    { icon: Settings, label: "Settings", path: "/settings" }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">MacroMeter</Link>
          </div>
          
          {!isMobile ? (
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {navItems.map((item) => (
                <Button 
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"} 
                  className="flex items-center"
                  asChild
                >
                  <Link to={item.path}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center sm:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menu">
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="sm:hidden bg-white shadow-lg rounded-b-lg animate-fade-in">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Button 
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"} 
                className="w-full justify-start"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to={item.path}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
