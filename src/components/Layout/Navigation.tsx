import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FolderOpen, Sparkles, Download, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/projects', icon: FolderOpen, label: 'My Stories' },
    { path: '/upsells', icon: Sparkles, label: 'Enhance' },
    { path: '/view', icon: Download, label: 'Export & Share' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="shadow-sm border-b" style={{ backgroundColor: '#FAF7F2', borderBottomColor: '#E5D5D8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Heart className="h-8 w-8" style={{ color: '#8f1133' }} />
              <span className="text-xl font-serif font-bold" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
                Before I <em style={{ color: '#8f1133' }}>Go</em>
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors`}
                  style={
                    isActive(path)
                      ? { backgroundColor: '#F5E6EA', color: '#8f1133' }
                      : { color: '#6B5B73' }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive(path)) {
                      e.currentTarget.style.color = '#3A3A3A';
                      e.currentTarget.style.backgroundColor = '#F0EBE8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(path)) {
                      e.currentTarget.style.color = '#6B5B73';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatarUrl}
                alt={user?.name}
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm font-medium hidden sm:block" style={{ color: '#3A3A3A' }}>
                {user?.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 transition-colors"
              style={{ color: '#6B5B73' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8f1133'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6B5B73'}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t" style={{ borderTopColor: '#E5D5D8' }}>
        <div className="flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={
                isActive(path)
                  ? { color: '#8f1133' }
                  : { color: '#6B5B73' }
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}