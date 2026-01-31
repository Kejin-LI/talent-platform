import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Home, 
  Wallet, 
  User, 
  Bell, 
  ChevronLeft,
  ChevronRight,
  Cookie
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { clsx } from 'clsx';

interface SupplyLayoutProps {
  children: React.ReactNode;
  isCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

const navigation = [
  { name: 'Explore', href: '/supply/square', icon: Search },
  { name: 'Home', href: '/supply/tasks', icon: Home },
  { name: 'Referrals', href: '#', icon: User }, 
  { name: 'Earnings', href: '/supply/wallet', icon: Wallet },
  { name: 'Profile', href: '/supply/profile', icon: User },
];

const SupplyLayout: React.FC<SupplyLayoutProps> = ({ children, isCollapsed: controlledCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  // Listen for resume switch event
  React.useEffect(() => {
    const handleSwitch = () => {
       navigate('/supply/profile');
    };
    
    window.addEventListener('switch-to-profile-resume', handleSwitch);
    return () => window.removeEventListener('switch-to-profile-resume', handleSwitch);
  }, [navigate]);

  const handleToggle = () => {
    const newState = !isCollapsed;
    if (onToggle) {
      onToggle(newState);
    } else {
      setInternalCollapsed(newState);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div 
        className={clsx(
          "hidden md:flex flex-col fixed inset-y-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 z-50"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4 text-gray-500" /> : <ChevronLeft className="h-4 w-4 text-gray-500" />}
        </button>

        {/* Logo */}
        <div className={clsx(
          "flex items-center h-16 flex-shrink-0 border-b border-gray-100 transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "px-6"
        )}>
          <Logo className="h-8 w-8" />
          <span className={clsx(
            "ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 transition-opacity duration-200",
            isCollapsed ? "hidden opacity-0" : "block opacity-100"
          )}>
            Kejin AI
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 px-3 space-y-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    "group flex items-center rounded-lg transition-colors relative",
                    isCollapsed ? "flex-col justify-center px-1 py-3" : "flex-row justify-start px-3 py-2",
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={clsx(
                      "flex-shrink-0 transition-colors",
                      isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500",
                      isCollapsed ? "h-6 w-6 mb-1" : "h-5 w-5 mr-3"
                    )}
                    aria-hidden="true"
                  />
                  <span className={clsx(
                    "font-medium transition-all duration-200",
                    isCollapsed ? "text-xs block" : "text-sm ml-0"
                  )}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex-shrink-0 flex flex-col items-center border-t border-gray-200 p-4 space-y-6">
          <button className="text-gray-400 hover:text-gray-500">
            <Cookie className="h-6 w-6" />
          </button>
          
          <Link
            to="/supply/messages"
            className="text-gray-400 hover:text-gray-500 group relative"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          </Link>
          
          <Link to="/supply/profile" className="flex items-center justify-center group">
             <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                <User className="h-5 w-5" />
             </div>
             {!isCollapsed && (
               <div className="ml-3 overflow-hidden">
                 <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">Alex Expert</p>
                 <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 truncate">View profile</p>
               </div>
             )}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={clsx(
          "flex flex-col flex-1 h-full overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "md:pl-20" : "md:pl-64"
        )}
      >
        <main className="flex-1 overflow-y-auto focus:outline-none p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SupplyLayout;
