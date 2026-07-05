import { Post } from '../types';
import { Calendar, Eye, Heart, Flame, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  post: Post | null;
  onClick: () => void;
}

export default function HeroBanner({ post, onClick }: HeroBannerProps) {
  if (!post) {
    return (
      <div className="w-full aspect-[21/9] rounded-3xl glass-panel flex items-center justify-center animate-pulse" id="hero-banner-placeholder">
        <span className="text-slate-400 font-mono text-sm">Loading Featured Story...</span>
      </div>
    );
  }

  const formattedDate = new Date(post.publishDate).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div 
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-3xl border border-white/10 cursor-pointer shadow-2xl bg-[#050505]"
      id="hero-banner-container"
    >
      {/* Cinematic Cover Image */}
      <div className="absolute inset-0" id="hero-banner-img-overlay-container">
        <img
          src={post.imageUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80"}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02] filter brightness-[0.45]"
          id="hero-banner-img"
        />
        {/* Colorful glowing spot to augment visual depth */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-pink-500/20 blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-purple-900/15 blur-[150px] mix-blend-screen pointer-events-none" />
      </div>

      {/* Modern Gradient Shading for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-[#050505]/10 to-transparent" />

      {/* Content layout */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col justify-end h-[420px] md:h-[500px] lg:h-[560px]" id="hero-banner-content">
        
        {/* Sticky tags */}
        <div className="flex flex-wrap items-center gap-3 mb-4" id="hero-banner-badges">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-pink-600/20">
            <Flame className="w-3 h-3 fill-white" />
            <span>FEATURED STORY</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
            {post.category}
          </span>
        </div>

        {/* Big Heading */}
        <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white max-w-4xl tracking-tighter leading-tight group-hover:text-pink-400 transition-colors duration-300" id="hero-banner-title">
          {post.title}
        </h1>

        {/* Summary Description */}
        <p className="text-sm md:text-base text-gray-300 max-w-2xl font-light leading-relaxed mt-4 line-clamp-2 md:line-clamp-3" id="hero-banner-description">
          {post.description}
        </p>

        {/* Footer Meta & Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-white/5" id="hero-banner-footer">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400" id="hero-banner-meta">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-pink-500" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {post.views} Views
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-500" />
              {post.likes} Likes
            </span>
          </div>

          <button className="flex items-center space-x-2 px-5 py-2.5 self-start sm:self-auto rounded-full bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-pink-900/20 transition-all duration-300 group-hover:translate-x-1" id="hero-banner-cta-btn">
            <span>Read Article</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
