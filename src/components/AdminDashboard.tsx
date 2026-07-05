import React, { useState, useEffect } from 'react';
import { Post, VisitorStats } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, getDocs, onSnapshot, doc as firestoreDoc, setDoc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Eye, LogOut, Image, LayoutGrid, CheckCircle2, AlertTriangle, RefreshCw, UploadCloud, X, Link } from 'lucide-react';

interface AdminDashboardProps {
  posts: Post[];
  onLogout: () => void;
}

export default function AdminDashboard({ posts, onLogout }: AdminDashboardProps) {
  // Post states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Anime News' | 'Manga News' | 'Reviews' | 'Release Dates' | 'General'>('Anime News');
  const [imageUrl, setImageUrl] = useState('');
  
  // Stats
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({ viewsCount: 1242 });

  // Control states
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlOption, setShowUrlOption] = useState(false);

  // Helper for image upload & compression/resizing
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      triggerMessage("Please select a valid image file.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Create canvas for scaling
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        // Calculate new dimensions preserving aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Get compressed Base64 JPEG (quality: 0.75)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          setImageUrl(compressedBase64);
        } else {
          setImageUrl(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Predefined Anime themed Unsplash illustration presets for easy addition
  const imagePresets = [
    { name: "Cyberpunk Cityscape", url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80" },
    { name: "Neon Mecha Helmet", url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80" },
    { name: "Japanese Torii Gate Night", url: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=800&auto=format&fit=crop&q=80" },
    { name: "Digital Abstract Art", url: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&auto=format&fit=crop&q=80" },
    { name: "Sakura Blossom Temple", url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80" },
    { name: "Cosmic Nebula Sky", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80" },
    { name: "Tech Circuit Blueprint", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80" }
  ];

  // Subscribe to visitor stats from Firestore
  useEffect(() => {
    const path = 'visitorStats/global';
    const statsDocRef = doc(db, 'visitorStats', 'global');
    
    const unsubscribe = onSnapshot(statsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setVisitorStats(docSnap.data() as VisitorStats);
      } else {
        // Initialize if doesn't exist
        setDoc(statsDocRef, { viewsCount: 152 }).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, path);
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !imageUrl) {
      triggerMessage("Please fill out all mandatory fields.", "error");
      return;
    }
    
    setIsSubmitting(true);
    setStatusMessage({ text: '', type: 'success' });

    try {
      if (editingPostId) {
        // Update existing post
        const path = `posts/${editingPostId}`;
        const postRef = doc(db, 'posts', editingPostId);
        await updateDoc(postRef, {
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          category,
          imageUrl: imageUrl.trim()
        });
        triggerMessage("Article updated successfully!", "success");
        setEditingPostId(null);
      } else {
        // Create new post
        const path = 'posts';
        const postsRef = collection(db, path);
        await addDoc(postsRef, {
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          category,
          imageUrl: imageUrl.trim(),
          publishDate: new Date().toISOString(),
          views: 0,
          likes: 0
        });

        triggerMessage("New article published instantly!", "success");
        
        // Enforce the 20 posts max threshold rule
        await enforceMaxPostsThreshold();
      }

      // Reset form fields
      setTitle('');
      setDescription('');
      setContent('');
      setImageUrl('');
    } catch (err) {
      console.error(err);
      triggerMessage("Failed to write to cloud database.", "error");
      handleFirestoreError(err, editingPostId ? OperationType.UPDATE : OperationType.CREATE, editingPostId ? `posts/${editingPostId}` : 'posts');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enforces the "total number of posts exceeds 20, automatically remove oldest post" constraint
  const enforceMaxPostsThreshold = async () => {
    const path = 'posts';
    try {
      const postsRef = collection(db, path);
      const q = query(postsRef, orderBy('publishDate', 'desc'));
      const snapshot = await getDocs(q);
      
      const allPosts: { id: string; publishDate: string }[] = [];
      snapshot.forEach((doc) => {
        allPosts.push({ id: doc.id, publishDate: doc.data().publishDate });
      });

      // If posts count exceeds 20, remove oldest ones
      if (allPosts.length > 20) {
        const postsToDelete = allPosts.slice(20); // Keep newest 20, delete rest
        for (const postToDelete of postsToDelete) {
          await deleteDoc(doc(db, 'posts', postToDelete.id));
          console.log(`Automatically removed oldest post to enforce max 20 limit: ${postToDelete.id}`);
        }
      }
    } catch (err) {
      console.error("Failed to enforce maximum post threshold:", err);
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleEditInit = (post: Post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setDescription(post.description);
    setContent(post.content || '');
    setCategory(post.category);
    setImageUrl(post.imageUrl);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to delete this article? This is completely irreversible.")) return;

    const path = `posts/${id}`;
    try {
      await deleteDoc(doc(db, 'posts', id));
      triggerMessage("Article has been deleted.", "success");
    } catch (err) {
      console.error(err);
      triggerMessage("Failed to delete article from Firestore.", "error");
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const triggerMessage = (text: string, type: string) => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage({ text: '', type: 'success' });
    }, 5000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6" id="admin-dashboard-container">
      
      {/* Dashboard Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6" id="dashboard-header-bar">
        <div>
          <h1 className="font-sans text-3xl font-black text-white">Editorial <span className="bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">Dashboard</span></h1>
          <p className="text-xs text-slate-400 font-mono mt-1">Logged in securely as Lead Editor (Junni)</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-1.5 px-4 py-2 self-start sm:self-auto rounded-xl bg-white/5 hover:bg-pink-500/10 border border-white/5 text-slate-300 hover:text-pink-400 transition-all text-xs font-semibold"
          id="dashboard-logout-btn"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Dashboard</span>
        </button>
      </div>

      {/* Stats Board Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" id="dashboard-stats-grid">
        <div className="rounded-2xl glass-panel p-5 flex items-center space-x-4 border border-pink-500/10" id="stat-posts">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-500">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono">{posts.length}</p>
            <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Live Posts</p>
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-5 flex items-center space-x-4 border border-indigo-500/10" id="stat-visitors">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono">{visitorStats.viewsCount}</p>
            <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Visitor Counter UI</p>
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-5 flex items-center space-x-4 border border-white/5" id="stat-limit">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-slate-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-mono">20</p>
            <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Max Posts Threshold</p>
          </div>
        </div>
      </div>

      {/* Editor Main Content Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8" id="dashboard-editor-grid">
        
        {/* Left Side: Publish Form (3 Cols) */}
        <div className="lg:col-span-3 space-y-6" id="dashboard-editor-form-col">
          <div className="rounded-2xl glass-panel p-6 sm:p-8 space-y-4" id="editor-form-card">
            <h3 className="font-sans text-base font-bold text-white flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Plus className="w-5 h-5 text-pink-500" />
              <span>{editingPostId ? 'Edit News Article' : 'Publish New Article'}</span>
            </h3>

            {statusMessage.text && (
              <div className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-pink-500/10 border-pink-500/20 text-pink-400'
              }`} id="editor-status-msg">
                {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-4" id="editor-publish-form">
              <div className="space-y-1.5" id="form-title-group">
                <label className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter striking headline..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 focus:bg-white/10 text-white placeholder-slate-500 text-sm rounded-xl px-4 py-2.5 border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
                  id="editor-input-title"
                />
              </div>

              <div className="space-y-4" id="form-category-image-group">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Select Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#111122] text-white text-sm rounded-xl px-4 py-2.5 border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
                    id="editor-select-category"
                  >
                    <option value="Anime News">Anime News</option>
                    <option value="Manga News">Manga News</option>
                    <option value="Reviews">Reviews</option>
                    <option value="Release Dates">Release Dates</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-slate-400 tracking-wider flex items-center justify-between">
                    <span>Featured Cover Image *</span>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="text-pink-400 hover:text-pink-500 text-[10px] font-mono flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </label>

                  {imageUrl ? (
                    <div className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video max-h-[220px] bg-black/40 flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="cursor-pointer bg-pink-600 hover:bg-pink-700 text-white text-[10px] font-mono uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all shadow-lg flex items-center gap-1.5">
                          <UploadCloud className="w-4 h-4" />
                          <span>Change File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[150px] ${
                        isDragging
                          ? 'border-pink-500 bg-pink-500/10 text-pink-400 scale-[1.01]'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/25 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                        id="image-file-input"
                      />
                      <label htmlFor="image-file-input" className="cursor-pointer flex flex-col items-center gap-2">
                        <UploadCloud className="w-9 h-9 text-pink-500/80 animate-pulse" />
                        <div className="text-xs">
                          <span className="font-bold text-pink-400">Click to upload image</span> or drag & drop
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">PNG, JPG, JPEG or WEBP (resizes automatically)</p>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsible presets & custom URL toggle */}
              <div className="pt-1" id="form-presets-container">
                <button
                  type="button"
                  onClick={() => setShowUrlOption(!showUrlOption)}
                  className="text-[10px] font-mono uppercase text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Link className="w-3.5 h-3.5 text-pink-500" />
                  <span>{showUrlOption ? 'Hide external links / presets option' : 'Or use anime preset / external URL instead'}</span>
                </button>

                {showUrlOption && (
                  <div className="mt-3 p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-4 animate-fade-in">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Custom Image URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={imageUrl.startsWith('data:') ? '' : imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-white/5 focus:bg-white/10 text-white placeholder-slate-500 text-sm rounded-xl px-4 py-2.5 border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
                        id="editor-input-image"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1">
                        <Image className="w-3.5 h-3.5 text-pink-500" />
                        <span>Predefined Presets:</span>
                      </label>
                      <div className="flex flex-wrap gap-2" id="form-presets-list">
                        {imagePresets.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setImageUrl(preset.url)}
                            className={`px-2.5 py-1 text-[10px] rounded-lg border transition-all ${
                              imageUrl === preset.url
                                ? 'text-pink-400 bg-pink-500/10 border-pink-500/30'
                                : 'text-slate-400 bg-white/5 border-white/5 hover:text-white hover:bg-white/10'
                            }`}
                            id={`preset-btn-${preset.name.toLowerCase().replace(' ', '-')}`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5" id="form-desc-group">
                <label className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Short Description * (Featured Card Summary)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter snappy 2-sentence summary description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 focus:bg-white/10 text-white placeholder-slate-500 text-sm rounded-xl p-3 border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
                  id="editor-input-description"
                />
              </div>

              <div className="space-y-1.5" id="form-content-group">
                <label className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Full Story Content (Optional)</label>
                <textarea
                  rows={6}
                  placeholder="Paste complete article copy here... Use double-newline to break paragraphs."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white/5 focus:bg-white/10 text-white placeholder-slate-500 text-sm rounded-xl p-3 border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
                  id="editor-input-content"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4" id="form-buttons-group">
                {editingPostId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPostId(null);
                      setTitle('');
                      setDescription('');
                      setContent('');
                      setImageUrl('');
                    }}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-xs font-semibold"
                    id="editor-cancel-edit-btn"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-grow flex items-center justify-center space-x-1.5 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-pink-900/20 transition-all disabled:opacity-50"
                  id="editor-submit-btn"
                >
                  <span>{isSubmitting ? 'Transmitting to Cloud...' : (editingPostId ? 'Update Article' : 'Publish Instantly')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Manage Posts Feed list (2 Cols) */}
        <div className="lg:col-span-2 space-y-6" id="dashboard-editor-manage-col">
          <div className="rounded-2xl glass-panel p-5" id="manage-posts-card">
            <h3 className="font-sans text-sm font-bold tracking-wider uppercase text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <span>Manage Articles</span>
              <span className="text-[10px] font-mono opacity-50 font-normal">({posts.length}/20 limit)</span>
            </h3>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1" id="manage-posts-list">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3 hover:border-white/10 transition-colors"
                  id={`manage-post-item-${post.id}`}
                >
                  <img
                    src={post.imageUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0 border border-white/5"
                    id={`manage-post-img-${post.id}`}
                  />
                  <div className="flex-1 min-w-0" id={`manage-post-body-${post.id}`}>
                    <h4 className="text-xs font-bold text-white truncate">{post.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{post.category}</p>
                    
                    <div className="flex items-center space-x-2 mt-2" id={`manage-post-actions-${post.id}`}>
                      <button
                        onClick={() => handleEditInit(post)}
                        className="flex items-center space-x-1 px-2 py-1 text-[9px] font-bold uppercase bg-white/5 hover:bg-pink-500/10 text-slate-300 hover:text-pink-400 rounded-md border border-white/5 hover:border-pink-500/20 transition-colors"
                        id={`manage-post-edit-btn-${post.id}`}
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="flex items-center space-x-1 px-2 py-1 text-[9px] font-bold uppercase bg-white/5 hover:bg-pink-600/15 text-slate-300 hover:text-pink-500 rounded-md border border-white/5 hover:border-pink-600/20 transition-colors"
                        id={`manage-post-delete-btn-${post.id}`}
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <div className="text-center py-10 text-slate-500" id="manage-posts-empty">
                  <p className="text-xs font-mono">No articles found in Firestore database.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
