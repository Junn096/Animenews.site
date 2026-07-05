import React, { useState } from 'react';
import { Mail, Send, Twitter, Youtube, Github, CheckCircle2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);

    const path = 'contactMessages';
    try {
      // Store submission in Firestore
      const messagesRef = collection(db, path);
      await addDoc(messagesRef, {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error("Failed to send message:", err);
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6" id="contact-page-container">
      
      {/* Page Header */}
      <div className="text-center space-y-3" id="contact-header">
        <h1 className="font-sans text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Contact <span className="bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">Us</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Have an exclusive leak, feedback, or advertising inquiry? Get in touch with the AnimeNews.site editorial team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8" id="contact-content-grid">
        
        {/* Contact Info Widget (2 Cols) */}
        <div className="md:col-span-2 space-y-6" id="contact-info-col">
          <div className="rounded-2xl glass-panel p-6 space-y-4" id="direct-contact-card">
            <h3 className="font-sans text-base font-bold text-white">Direct Channel</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We aim to reply to all legitimate editorial inquiries and tip-offs within 24-48 business hours.
            </p>
            
            <div className="flex items-center space-x-3 text-slate-300 hover:text-pink-400 transition-colors pt-2" id="email-address-row">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 shrink-0">
                <Mail className="w-4 h-4 text-pink-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase text-slate-500">Official Email</p>
                <a href="mailto:junnibgmi@gmail.com" className="text-xs sm:text-sm font-semibold truncate block">
                  junnibgmi@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl glass-panel p-6 space-y-4" id="contact-socials-card">
            <h3 className="font-sans text-base font-bold text-white">Follow Our Socials</h3>
            <p className="text-xs text-slate-400">
              Stay fully informed about updates, visual previews, and upcoming releases.
            </p>
            <div className="flex space-x-3" id="contact-socials-list">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-300 hover:text-pink-400 border border-white/5 hover:border-pink-500/20 transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-300 hover:text-pink-400 border border-white/5 hover:border-pink-500/20 transition-all duration-300">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-300 hover:text-pink-400 border border-white/5 hover:border-pink-500/20 transition-all duration-300">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form Card (3 Cols) */}
        <div className="md:col-span-3 rounded-2xl glass-panel p-6 sm:p-8" id="contact-form-card">
          {success ? (
            <div className="text-center py-10 space-y-4" id="contact-form-success">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto shadow-lg shadow-pink-500/5">
                <CheckCircle2 className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="font-sans text-lg font-bold text-white">Message Transmitted!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Thank you for contacting AnimeNews.site. Your message has been safely persisted in Firestore and dispatched to our editorial staff.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-pink-600 hover:bg-pink-700 text-white shadow-lg transition-colors"
                id="reset-contact-form-btn"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" id="contact-form">
              <h3 className="font-sans text-base font-bold text-white mb-2">Send a Message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="contact-form-name-email">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 focus:bg-white/10 text-white text-sm rounded-xl px-3 py-2 border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
                    id="contact-input-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 focus:bg-white/10 text-white text-sm rounded-xl px-3 py-2 border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
                    id="contact-input-email"
                  />
                </div>
              </div>

              <div className="space-y-1.5" id="contact-form-subject">
                <label className="text-[10px] font-mono uppercase text-slate-400">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white/5 focus:bg-white/10 text-white text-sm rounded-xl px-3 py-2 border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
                  id="contact-input-subject"
                />
              </div>

              <div className="space-y-1.5" id="contact-form-message">
                <label className="text-[10px] font-mono uppercase text-slate-400">Message *</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 focus:bg-white/10 text-white text-sm rounded-xl p-3 border border-white/10 focus:border-pink-500 focus:outline-none transition-colors"
                  id="contact-input-message"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-pink-900/20 transition-all disabled:opacity-50"
                id="contact-submit-btn"
              >
                <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
