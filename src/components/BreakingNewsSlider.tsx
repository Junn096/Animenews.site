import { Post } from '../types';
import { Flame, Star } from 'lucide-react';

interface BreakingNewsSliderProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export default function BreakingNewsSlider({ posts, onPostClick }: BreakingNewsSliderProps) {
  const breakingPosts = posts.filter(post => post.isBreaking || post.isFeatured);
  
  if (!breakingPosts.length) return null;

  return (
    <div className="w-full bg-white/5 border-y border-white/10 py-3 mb-8 relative overflow-hidden backdrop-blur-md" id="breaking-news-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        
        {/* Label badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-wider mr-4 shrink-0 shadow-lg shadow-pink-500/5 animate-pulse" id="breaking-badge">
          <Flame className="w-3.5 h-3.5 text-pink-500" />
          <span>Breaking</span>
        </div>

        {/* Marquee Container */}
        <div className="flex-1 overflow-hidden relative w-full" id="breaking-marquee-container">
          <div className="flex space-x-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer" id="breaking-marquee">
            {/* Repeated to fill and loop smoothly */}
            {[...breakingPosts, ...breakingPosts].map((post, index) => (
              <span
                key={`${post.id}-${index}`}
                onClick={() => onPostClick(post)}
                className="inline-flex items-center space-x-2 text-xs md:text-sm text-slate-300 hover:text-pink-400 font-medium transition-colors"
                id={`breaking-item-${post.id}-${index}`}
              >
                <Star className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-500/20" />
                <span>{post.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">({new Date(post.publishDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
              </span>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
