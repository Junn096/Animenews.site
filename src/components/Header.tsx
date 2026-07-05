import { useState, useEffect } from 'react';
import { Menu, X, Search, LogIn, LogOut, ShieldAlert, Award, Star, Newspaper } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ currentPage, setCurrentPage, searchQuery, setSearchQuery }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Latest News', id: 'latest' },
    { name: 'Trending', id: 'trending' },
    { name: 'Anime News', id: 'anime-news' },
    { name: 'Manga News', id: 'manga-news' },
    { name: 'Release Dates', id: 'release-dates' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'About Us', id: 'about' },
    { name: 'Contact Us', id: 'contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'
    }`} id="site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')} id="logo-container">
            <div className="relative mr-2 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-400 p-[1px] shadow-lg shadow-pink-500/20">
              <div className="flex items-center justify-center w-full h-full bg-[#050505] rounded-xl">
                <Newspaper className="w-5 h-5 text-pink-500 animate-pulse" />
              </div>
            </div>
            <span className="font-sans text-xl font-bold tracking-tighter bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">
              AnimeNews.site
            </span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex relative flex-1 max-w-md mx-4" id="search-desktop-container">
            <input
              type="text"
              placeholder="Search news, reviews, manga..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentPage !== 'search') setCurrentPage('search');
              }}
              className="w-full bg-white/5 focus:bg-white/10 text-white placeholder-slate-400 text-sm rounded-full pl-10 pr-4 py-2 border border-white/10 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 focus:outline-none transition-all duration-300 backdrop-blur-md"
              id="search-desktop-input"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1" id="nav-desktop">
            {navItems.slice(0, 7).map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                  currentPage === item.id
                    ? 'text-pink-400 bg-pink-500/10 border border-pink-500/20'
                    : 'text-slate-300 hover:text-pink-400 hover:bg-white/5 border border-transparent'
                }`}
                id={`nav-item-${item.id}`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* User Profile / Admin Auth / Actions */}
          <div className="hidden sm:flex items-center space-x-3" id="user-actions">
            {/* Google Sign-in */}
            {user ? (
              <div className="flex items-center space-x-3" id="user-profile-menu">
                <div className="relative group">
                  <img
                    src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt={user.displayName || "User"}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-pink-500/50 cursor-pointer shadow-md shadow-pink-500/10"
                    id="user-avatar"
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl glass-panel p-2 shadow-2xl border border-white/10 hidden group-hover:block animate-fade-in">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center space-x-2 px-3 py-2 text-xs text-pink-400 hover:bg-pink-500/10 rounded-lg transition-colors"
                      id="logout-dropdown-btn"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all duration-300"
                id="login-btn"
              >
                <LogIn className="w-3.5 h-3.5 text-pink-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* Hidden/Direct Link to Admin Dashboard */}
            <button
              onClick={() => setCurrentPage('admin-login')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                currentPage.startsWith('admin')
                  ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-900/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:text-pink-400'
              }`}
              title="Admin Panel"
              id="admin-panel-trigger"
            >
              ADMIN
            </button>
          </div>

          {/* Mobile Hamburguer */}
          <div className="flex items-center space-x-2 lg:hidden" id="mobile-menu-trigger-container">
            {/* Search icon for mobile screen */}
            <button
              onClick={() => setCurrentPage('search')}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg sm:hidden"
              id="mobile-search-trigger"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
              id="mobile-menu-btn"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full glass-panel border-b border-white/10 shadow-2xl z-40 animate-fade-in" id="mobile-menu-drawer">
          <div className="px-4 pt-3 pb-6 space-y-2">
            
            <div className="relative w-full mb-4 sm:hidden" id="search-mobile-container">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentPage !== 'search') setCurrentPage('search');
                }}
                className="w-full bg-white/5 focus:bg-white/10 text-white placeholder-slate-400 text-sm rounded-full pl-10 pr-4 py-2 border border-white/10 focus:border-pink-500 focus:outline-none transition-all"
                id="search-mobile-input"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-pink-400 bg-pink-500/10 border-l-2 border-pink-500'
                    : 'text-slate-300 hover:text-pink-400 hover:bg-white/5'
                }`}
                id={`mobile-nav-item-${item.id}`}
              >
                {item.name}
              </button>
            ))}

            <div className="border-t border-white/5 pt-4 flex flex-col space-y-3" id="mobile-menu-footer">
              {user ? (
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/5" id="mobile-user-profile">
                  <div className="flex items-center space-x-2">
                    <img
                      src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                      alt={user.displayName || "User"}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-pink-500/50"
                      id="mobile-user-avatar"
                    />
                    <div className="truncate max-w-[150px]">
                      <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="p-2 text-pink-400 hover:bg-pink-500/10 rounded-lg transition-colors"
                    id="mobile-logout-btn"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 text-sm font-semibold text-white shadow-lg shadow-pink-900/20"
                  id="mobile-login-btn"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with Google</span>
                </button>
              )}

              <button
                onClick={() => {
                  setCurrentPage('admin-login');
                  setIsOpen(false);
                }}
                className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold hover:text-pink-400 hover:bg-white/10"
                id="mobile-admin-btn"
              >
                <ShieldAlert className="w-4 h-4 text-pink-500" />
                <span>Admin Login</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
