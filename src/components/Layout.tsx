import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Briefcase, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role?: 'demand' | 'supply';
}

const Layout: React.FC<LayoutProps> = ({ children, role }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600">Kejin AI</span>
              </Link>
              {role && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {role === 'demand' ? (
                    <>
                      <Link
                        to="/demand/dashboard"
                        className={`${
                          location.pathname.includes('/demand/dashboard')
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/demand/create"
                        className={`${
                          location.pathname.includes('/demand/create')
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                      >
                        Post Requirement
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/supply/square"
                        className={`${
                          location.pathname.includes('/supply/square')
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                      >
                        Task Square
                      </Link>
                      <Link
                        to="/supply/workbench"
                        className={`${
                          location.pathname.includes('/supply/workbench')
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                      >
                        Workbench
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center">
              {role ? (
                <Link
                  to="/"
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Logout</span>
                  <LogOut className="h-6 w-6" />
                </Link>
              ) : (
                <div className="flex space-x-4">
                  <span className="text-gray-500">Welcome Guest</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
