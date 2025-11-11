import { Wallet, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="border-gray-200 border-b">
    <div className="max-w-6xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-2 bg-primary/10 rounded-xl bg-green-200">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Finora</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Link 
            to="/accounts" 
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all duration-200 active:scale-95"
          >
            Accounts
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-green-400  hover:cursor-pointer rounded-2xl transition-all duration-200 active:scale-95 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </nav>
      </div>
    </div>
  </header>
  );
};