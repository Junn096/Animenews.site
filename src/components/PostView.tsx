import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { Calendar, Eye, Heart, ArrowLeft, Send, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, updateDoc, increment, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';

interface Comment {
  id: string;
  postId: string;
  userName: string;
  userPhoto: string;
  text: string;
  createdAt: any; // Firestore Timestamp
}

interface PostViewProps {
  post: Post;
  onBack: () => void;
}

export default function PostView({ post, onBack }: PostViewProps) {
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const currentUser = auth.currentUser;

  // Track page view count in Firestore
  useEffect(() => {
    const incrementViews = async () => {
      const path = `posts/${post.id}`;
      try {
        const postRef = doc(db, 'posts', post.id);
        await updateDoc(postRef, {
          views: increment(1)
        });
      } catch (err) {
        console.error("Failed to increment views:", err);
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    };
    incrementViews();
  }, [post.id]);

  // Subscribe to comments for this post
  useEffect(() => {
    const path = 'comments';
    const commentsRef = collection(db, path);
    const q = query(
      commentsRef,
      where('postId', '==', post.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Comment[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Comment);
      });

      // Sort client-side to avoid composite index requirements
      fetched.sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt instanceof Date ? a.createdAt.getTime() : (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : 0));
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt instanceof Date ? b.createdAt.getTime() : (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : 0));
        return timeB - timeA;
      });

      setComments(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [post.id]);

  const handleLike = async () => {
    if (hasLiked) return;
    const path = `posts/${post.id}`;
    try {
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        likes: increment(1)
      });
      setLikes(prev => prev + 1);
      setHasLiked(true);
    } catch (err) {
      console.error("Failed to like post:", err);
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    if (!currentUser) {
      alert("Please sign in with Google in the header to write comments!");
      return;
    }

    const path = 'comments';
    try {
      const commentsRef = collection(db, path);
      await addDoc(commentsRef, {
        postId: post.id,
        userName: currentUser.displayName || 'Anonymous Reader',
        userPhoto: currentUser.photoURL || '',
        text: commentText.trim(),
        createdAt: new Date()
      });
      setCommentText('');
    } catch (err) {
      console.error("Failed to post comment:", err);
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <article className="max-w-4xl mx-auto space-y-8 py-6" id="post-view-article">
      
      {/* Back button & Action Header */}
      <div className="flex items-center justify-between" id="post-view-navigation">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold"
          id="post-back-btn"
        >
          <ArrowLeft className="w-4 h-4 text-pink-500" />
          <span>Back to News Feed</span>
        </button>
        
        <div className="flex items-center space-x-2" id="post-actions">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2.5 rounded-xl border transition-all ${
              isBookmarked 
                ? 'bg-pink-500/10 border-pink-500/30 text-pink-400' 
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Bookmark Article"
            id="post-bookmark-btn"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-pink-500' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title="Share Article"
            id="post-share-btn"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Featured Banner Card */}
      <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 bg-[#050505]" id="post-view-image-banner">
        <img
          src={post.imageUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80"}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-[0.65]"
          id="post-view-image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
        <span className="absolute bottom-6 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md border backdrop-blur-md text-pink-400 bg-pink-500/10 border-pink-500/20" id="post-view-category">
          {post.category}
        </span>
      </div>

      {/* Title & Metadata */}
      <div className="space-y-4" id="post-view-header-details">
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400" id="post-view-meta">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            {new Date(post.publishDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {post.views + 1} Views
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-pink-500" />
            {likes} Likes
          </span>
        </div>

        <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight" id="post-view-title">
          {post.title}
        </h1>
      </div>

      {/* Main post text content */}
      <div className="rounded-2xl glass-panel p-6 sm:p-10 text-slate-300 leading-relaxed text-sm sm:text-base space-y-6" id="post-view-content-panel">
        <p className="font-semibold text-white text-base sm:text-lg border-l-4 border-pink-500 pl-4 py-1 italic bg-pink-500/[0.02] rounded-r-lg" id="post-view-summary">
          {post.description}
        </p>
        
        {/* Render simulated news article paragraphs or actual content if exists */}
        {post.content ? (
          <div className="space-y-4" id="post-custom-content">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <div className="space-y-6" id="post-generated-content">
            <p>
              The anime industry is witnessing an unprecedented growth this season, with major studios like MAPPA, ufotable, and Wit leading the charge with next-generation high-fidelity visual production. Industry analysts suggest that this spike is largely driven by strong streaming performance and high global demand, particularly in North American and Southeast Asian markets.
            </p>
            <p>
              In recent interviews, senior production coordinators highlighted the challenges of balancing tight schedules with creative freedom, emphasizing the role of digital compositing and mixed 3D elements in delivering the highly dynamic fight sequences modern fans expect. Speculation is high that several classic titles may receive legacy revivals in the coming months, building upon the massive success of current franchises.
            </p>
            <p>
              Keep your browsers locked on AnimeNews.site for immediate notifications and analysis. Comment below to share your theories on how this release will affect the current power scaling or franchise hierarchy!
            </p>
          </div>
        )}

        {/* Interaction section at end of post */}
        <div className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4" id="post-view-interact-bar">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              hasLiked
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20 cursor-default'
                : 'bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:bg-pink-600 hover:text-white hover:border-transparent'
            }`}
            id="post-like-action-btn"
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
            <span>{hasLiked ? 'Liked!' : 'Like Article'}</span>
          </button>

          <span className="text-xs text-slate-500 font-mono">
            Category: <strong className="text-pink-400">{post.category}</strong>
          </span>
        </div>
      </div>

      {/* Interactive Comments Engine with Firestore */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 space-y-6" id="comments-section">
        <h3 className="font-sans text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
          <MessageSquare className="w-5 h-5 text-pink-500" />
          <span>Comments ({comments.length})</span>
        </h3>

        {/* Comment input form */}
        <form onSubmit={handleSendComment} className="flex gap-4 items-start" id="comment-form">
          <img
            src={currentUser?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
            alt="Current User"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full border border-white/10"
            id="comment-avatar"
          />
          <div className="flex-1 space-y-3" id="comment-input-area">
            <textarea
              rows={3}
              placeholder={currentUser ? "Add to the discussion..." : "Please sign in with Google above to comment!"}
              disabled={!currentUser}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-white/5 focus:bg-white/10 text-white placeholder-slate-500 text-sm rounded-xl p-3 border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
              id="comment-textarea"
            />
            {currentUser ? (
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold shadow-lg shadow-pink-950/20 transition-colors"
                id="comment-submit-btn"
              >
                <span>Post Comment</span>
                <Send className="w-3 h-3" />
              </button>
            ) : (
              <p className="text-[10px] text-slate-500" id="comment-signin-reminder">
                Sign-In requires clicking the <strong>Sign In</strong> button on the header of the page.
              </p>
            )}
          </div>
        </form>

        {/* Comments Feed List */}
        <div className="space-y-4 pt-4" id="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5" id={`comment-item-${comment.id}`}>
                <img
                  src={comment.userPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                  alt={comment.userName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full border border-white/5 shrink-0"
                  id={`comment-item-avatar-${comment.id}`}
                />
                <div className="space-y-1 flex-1 min-w-0" id={`comment-item-body-${comment.id}`}>
                  <div className="flex items-center justify-between gap-2" id={`comment-item-header-${comment.id}`}>
                    <span className="text-xs font-semibold text-white truncate">{comment.userName}</span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {comment.createdAt ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words" id={`comment-item-text-${comment.id}`}>
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-500" id="no-comments-indicator">
              <p className="text-xs font-mono">No comments yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>

    </article>
  );
}
