import React from 'react';
import { Post } from '../types';
import { Calendar, Eye, Heart, ArrowUpRight } from 'lucide-react';

interface NewsCardProps {
  post: Post;
  onClick: () => void;
  onLike?: (e: React.MouseEvent) => void;
  isLiked?: boolean;
}

export default function NewsCard({ post, onClick, onLike, isLiked = false }: NewsCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Anime News':
        return 'text-pink-400 bg-pink-500/10 border-pink-500/20';
      case 'Manga News':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Reviews':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Release Dates':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      default:
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    }
  };

  const formattedDate = new Date(post.publishDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article 
      onClick={onClick}
      className="group cursor-pointer rounded-2xl glass-panel p-4 flex flex-col h-full glass-panel-hover glass-card-shine"
      id={`news-card-${post.id}`}
    >
      {/* Post Image with Badge */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-[#050505]" id={`news-card-img-container-${post.id}`}>
        <img
          src={post.imageUrl || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"}
          alt={post.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          id={`news-card-img-${post.id}`}
        />
        {/* Category Pill */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border backdrop-blur-md ${getCategoryColor(post.category)}`} id={`news-card-category-${post.id}`}>
          {post.category}
        </span>
        
        {/* Hover zoom circle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white text-xs font-semibold flex items-center gap-1">
            Read Article <ArrowUpRight className="w-3.5 h-3.5 text-pink-500" />
          </span>
        </div>
      </div>

      {/* Meta section */}
      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 mb-2.5" id={`news-card-meta-${post.id}`}>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-pink-500/70" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {post.views}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-pink-500" />
          {post.likes}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-sans text-sm md:text-base font-bold text-white group-hover:text-pink-400 line-clamp-2 leading-snug mb-2 transition-colors duration-300" id={`news-card-title-${post.id}`}>
        {post.title}
      </h3>

      {/* Short description */}
      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4 flex-grow" id={`news-card-description-${post.id}`}>
        {post.description}
      </p>

      {/* Read More button */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between" id={`news-card-footer-${post.id}`}>
        <button 
          className="text-xs font-semibold text-pink-400 group-hover:text-pink-300 flex items-center gap-1 transition-colors duration-300"
          id={`news-card-btn-${post.id}`}
        >
          Read Full Story
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        {onLike && (
          <button
            onClick={onLike}
            className={`p-1.5 rounded-lg transition-all ${
              isLiked 
                ? 'text-pink-500 bg-pink-500/10' 
                : 'text-slate-400 hover:text-pink-500 hover:bg-white/5'
            }`}
            id={`news-card-like-${post.id}`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-500' : ''}`} />
          </button>
        )}
      </div>

    </article>
  );
}
