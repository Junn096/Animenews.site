import React, { useState, useEffect } from 'react';
import { Post } from './types';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, onSnapshot, query, orderBy, addDoc, getDocs, doc, setDoc, increment } from 'firebase/firestore';
import { initialPosts } from './data/initialPosts';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Flame, ArrowRight, Library, Sparkles, AlertCircle } from 'lucide-react';

// Sub-components
import Header from './components/Header';
import Footer from './components/Footer';
import HeroBanner from './components/HeroBanner';
import BreakingNewsSlider from './components/BreakingNewsSlider';
import NewsCard from './components/NewsCard';
import Sidebar from './components/Sidebar';
import PostView from './components/PostView';
import ContactPage from './components/ContactPage';
import StaticPages from './components/StaticPages';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All News');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('adminToken');
  });

  // Track page loads (Global Visitor Counter UI)
  useEffect(() => {
    const incrementVisitorStats = async () => {
      const path = 'visitorStats/global';
      try {
        const statsRef = doc(db, 'visitorStats', 'global');
        await setDoc(statsRef, {
          viewsCount: increment(1)
        }, { merge: true });
      } catch (err) {
        console.error("Failed to increment global views:", err);
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    };
    incrementVisitorStats();
  }, []);

  // Fetch real-time posts from Firestore and seed if empty
  useEffect(() => {
    const path = 'posts';
    const postsRef = collection(db, path);
    const q = query(postsRef, orderBy('publishDate', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetched: Post[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Post);
      });

      if (fetched.length === 0) {
        // Automatically seed initial posts when database is empty
        console.log("Seeding Firestore with initial posts...");
        try {
          for (const post of initialPosts) {
            await addDoc(postsRef, post);
          }
        } catch (err) {
          console.error("Seeding failed:", err);
          handleFirestoreError(err, OperationType.CREATE, path);
        }
      } else {
        setPosts(fetched);
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, []);


  // Sync admin session token
  const handleAdminLogin = (token: string) => {
    sessionStorage.setItem('adminToken', token);
    setAdminToken(token);
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('adminToken');
    setAdminToken(null);
    setCurrentPage('home');
  };

  const handlePostSelect = (post: Post) => {
    setActivePost(post);
    setCurrentPage('post-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter posts depending on category and currentPage
  const getFilteredPosts = () => {
    let list = [...posts];

    // Page-specific routing filters
    if (currentPage === 'latest') {
      // Show all, sorted by date (already sorted)
    } else if (currentPage === 'trending') {
      list = list.sort((a, b) => b.views - a.views);
    } else if (currentPage === 'anime-news') {
      list = list.filter(p => p.category === 'Anime News');
    } else if (currentPage === 'manga-news') {
      list = list.filter(p => p.category === 'Manga News');
    } else if (currentPage === 'release-dates') {
      list = list.filter(p => p.category === 'Release Dates');
    } else if (currentPage === 'reviews') {
      list = list.filter(p => p.category === 'Reviews');
    } else if (currentPage === 'search') {
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        list = list.filter(p => 
          p.title.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
    } else if (currentPage === 'home') {
      // Filter by sidebar selectedCategory pill
      if (selectedCategory && selectedCategory !== 'All News') {
        list = list.filter(p => p.category === selectedCategory);
      }
    }

    return list;
  };

  const filteredPosts = getFilteredPosts();
  const featuredPost = posts.find(p => p.isFeatured) || posts[0] || null;

  // Render Page Content Switcher with animations
  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-12" id="home-view">
            
            {/* Hero banner for the primary story */}
            <section id="hero-section">
              <HeroBanner post={featuredPost} onClick={() => featuredPost && handlePostSelect(featuredPost)} />
            </section>

            {/* Main grid containing posts feed and widgets sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="home-main-layout">
              
              {/* Left Column: Feed Grid (8 Cols) */}
              <main className="lg:col-span-8 space-y-8" id="latest-posts-grid">
                <div className="flex items-center justify-between border-b border-white/5 pb-4" id="feed-header">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-pink-500" />
                    <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                      {selectedCategory === 'All News' ? 'Latest Feed' : selectedCategory}
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{filteredPosts.length} Articles</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="news-grid-container">
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <NewsCard post={post} onClick={() => handlePostSelect(post)} />
                    </motion.div>
                  ))}

                  {filteredPosts.length === 0 && (
                    <div className="col-span-full py-16 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/10" id="empty-feed-card">
                      <Library className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm font-medium">No articles matched the criteria.</p>
                      <button
                        onClick={() => setSelectedCategory('All News')}
                        className="mt-4 px-4 py-2 text-xs bg-pink-500/10 border border-pink-500/20 text-pink-400 font-semibold rounded-lg hover:bg-pink-500 hover:text-white transition-all"
                        id="reset-filter-btn"
                      >
                        Reset Filter
                      </button>
                    </div>
                  )}
                </div>
              </main>

              {/* Right Column: Sidebar (4 Cols) */}
              <div className="lg:col-span-4" id="home-sidebar-col">
                <Sidebar 
                  posts={posts} 
                  onPostClick={handlePostSelect} 
                  selectedCategory={selectedCategory} 
                  setSelectedCategory={setSelectedCategory}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>

            </div>

          </div>
        );

      case 'latest':
      case 'trending':
      case 'anime-news':
      case 'manga-news':
      case 'release-dates':
      case 'reviews':
      case 'search':
        const pageTitle = {
          'latest': 'Latest Otaku Updates',
          'trending': 'Hot & Trending News',
          'anime-news': 'Anime News Bulletin',
          'manga-news': 'Manga News & Releases',
          'release-dates': 'Upcoming Release Schedules',
          'reviews': 'Official Critics Reviews',
          'search': 'Search Portal'
        }[currentPage] || 'News Stream';

        return (
          <div className="space-y-8 animate-fade-in" id="feed-page-container">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4" id="page-header-container">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-white">{pageTitle}</h1>
                <p className="text-xs text-slate-400 font-mono mt-1">Real-time coverage synced with cloud Firestore</p>
              </div>
              {currentPage === 'search' && (
                <div className="relative w-full max-w-sm" id="page-search-container">
                  <input
                    type="text"
                    placeholder="Search titles or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 focus:bg-white/10 text-white placeholder-slate-500 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
                    id="page-search-input"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="page-grid-container">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <NewsCard post={post} onClick={() => handlePostSelect(post)} />
                </motion.div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="col-span-full py-16 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/10" id="page-empty-card">
                  <Library className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm font-medium">No results found.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'post-detail':
        return activePost ? (
          <PostView post={activePost} onBack={() => setCurrentPage('home')} />
        ) : (
          <div className="text-center py-12" id="invalid-post-view">
            <AlertCircle className="w-10 h-10 text-pink-500 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Post could not be retrieved.</p>
          </div>
        );

      case 'about':
      case 'privacy':
      case 'terms':
      case 'disclaimer':
        return <StaticPages pageId={currentPage as any} />;

      case 'contact':
        return <ContactPage />;

      case 'admin-login':
        return <AdminLogin onLoginSuccess={handleAdminLogin} setCurrentPage={setCurrentPage} />;

      case 'admin-dashboard':
        return adminToken ? (
          <AdminDashboard posts={posts} onLogout={handleAdminLogout} />
        ) : (
          <AdminLogin onLoginSuccess={handleAdminLogin} setCurrentPage={setCurrentPage} />
        );

      default:
        // 404 Fallback
        return (
          <div className="text-center py-24 space-y-4 animate-fade-in" id="404-container">
            <h1 className="font-display text-7xl font-black text-pink-500/80 tracking-widest animate-pulse">404</h1>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Void Protocol Initiated</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              The page you are looking for has been swallowed by the dark dimensional rift. Let's return you safely.
            </p>
            <button
              onClick={() => setCurrentPage('home')}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-pink-600 hover:bg-pink-700 rounded-xl shadow-lg transition-colors"
              id="return-home-btn"
            >
              Return Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 relative overflow-hidden flex flex-col justify-between" id="app-wrapper">
      
      {/* Dynamic ambient background neon circles */}
      <div className="neon-glow-bg top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20" />
      <div className="neon-glow-bg bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/20 animate-[pulseGlow_20s_infinite_ease-in-out_2s]" />
      
      <div>
        {/* Navigation Bar */}
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Breaking News Marquee */}
        <div className="pt-24" id="breaking-news-wrapper">
          <BreakingNewsSlider posts={posts} onPostClick={handlePostSelect} />
        </div>

        {/* Core Layout Main Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10" id="main-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + (activePost?.id || '')}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              id="active-view-motion"
            >
              {renderPageContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Element */}
      <Footer setCurrentPage={setCurrentPage} />

    </div>
  );
}
