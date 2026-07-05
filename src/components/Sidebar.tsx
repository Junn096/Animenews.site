import { Post } from '../types';
import { Calendar, Eye, Flame, Award, Heart } from 'lucide-react';

interface SidebarProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Sidebar({ posts, onPostClick, selectedCategory, setSelectedCategory, currentPage, setCurrentPage }: SidebarProps) {
  // Sort posts by date for latest list
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 4);

  // Sort posts by views/likes for trending list
  const trendingPosts = [...posts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  const categories = [
    'All News',
    'Anime News',
    'Manga News',
    'Reviews',
    'Release Dates'
  ];

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    if (currentPage !== 'home') {
      setCurrentPage('home');
    }
    // Scroll smoothly to latest post grid
    const gridElement = document.getElementById('latest-posts-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="space-y-8" id="sidebar-container">
      
      {/* Category Pills Widget */}
      <div className="rounded-2xl glass-panel p-5" id="sidebar-categories-widget">
        <h3 className="font-sans text-sm font-bold tracking-wider uppercase text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Award className="w-4 h-4 text-pink-500" />
          <span>Categories</span>
        </h3>
        <div className="flex flex-col space-y-1.5" id="sidebar-categories-list">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat || (cat === 'All News' && !selectedCategory);
            const count = cat === 'All News' 
              ? posts.length 
              : posts.filter(p => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'text-pink-400 bg-pink-500/10 border border-pink-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-pink-400 hover:bg-white/5 border border-transparent'
                }`}
                id={`sidebar-cat-btn-${cat.toLowerCase().replace(' ', '-')}`}
              >
                <span>{cat}</span>
                <span className="font-mono text-[10px] opacity-70 bg-white/5 px-2 py-0.5 rounded-full">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending News Widget */}
      <div className="rounded-2xl glass-panel p-5" id="sidebar-trending-widget">
        <h3 className="font-sans text-sm font-bold tracking-wider uppercase text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Flame className="w-4 h-4 text-pink-500" />
          <span>Trending News</span>
        </h3>
        <div className="space-y-4" id="sidebar-trending-list">
          {trendingPosts.map((post, idx) => (
            <div 
              key={post.id}
              onClick={() => onPostClick(post)}
              className="flex items-start gap-3 cursor-pointer group"
              id={`sidebar-trending-item-${post.id}`}
            >
              <div className="font-sans text-2xl font-black text-pink-500/20 group-hover:text-pink-500/70 transition-colors shrink-0 w-6 leading-none mt-1">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-pink-400">
                  {post.category}
                </span>
                <h4 className="text-xs font-semibold text-white group-hover:text-pink-400 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-0.5">
                    <Eye className="w-2.5 h-2.5" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Heart className="w-2.5 h-2.5 text-pink-500" />
                    {post.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest News Widget */}
      <div className="rounded-2xl glass-panel p-5" id="sidebar-latest-widget">
        <h3 className="font-sans text-sm font-bold tracking-wider uppercase text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Calendar className="w-4 h-4 text-pink-500" />
          <span>Latest Updates</span>
        </h3>
        <div className="space-y-4.5" id="sidebar-latest-list">
          {latestPosts.map((post) => (
            <div 
              key={post.id}
              onClick={() => onPostClick(post)}
              className="flex gap-3 cursor-pointer group items-center"
              id={`sidebar-latest-item-${post.id}`}
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#050505] shrink-0 border border-white/5" id={`sidebar-latest-img-container-${post.id}`}>
                <img
                  src={post.imageUrl || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80"}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  id={`sidebar-latest-img-${post.id}`}
                />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-white group-hover:text-pink-400 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(post.publishDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
