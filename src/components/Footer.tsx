import { Newspaper, Github, Twitter, Youtube, ArrowUp, Send } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerNav = [
    { name: 'Home', id: 'home' },
    { name: 'About Us', id: 'about' },
    { name: 'Contact Us', id: 'contact' },
    { name: 'Privacy Policy', id: 'privacy' },
    { name: 'Terms & Conditions', id: 'terms' },
    { name: 'Disclaimer', id: 'disclaimer' },
  ];

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-[#050505] pt-16 pb-8" id="site-footer">
      {/* Decorative neon gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/5 pb-12">
          
          {/* Column 1: Branding */}
          <div className="md:col-span-2 space-y-4" id="footer-branding-col">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')} id="footer-logo">
              <div className="relative mr-2 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-400 p-[1px] shadow-lg shadow-pink-500/10">
                <div className="flex items-center justify-center w-full h-full bg-[#050505] rounded-lg">
                  <Newspaper className="w-4 h-4 text-pink-500" />
                </div>
              </div>
              <span className="font-sans text-lg font-bold tracking-tighter bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">
                AnimeNews.site
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your ultimate premium platform for breaking anime news, manga releases, reviews, and exclusive release dates. Designed for Otakus who demand speed, style, and precision.
            </p>
            <div className="flex space-x-3 pt-2" id="footer-socials">
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-300 hover:text-pink-400 border border-white/5 hover:border-pink-500/30 transition-all duration-300" id="footer-social-twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-300 hover:text-pink-400 border border-white/5 hover:border-pink-500/30 transition-all duration-300" id="footer-social-youtube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-300 hover:text-pink-400 border border-white/5 hover:border-pink-500/30 transition-all duration-300" id="footer-social-github">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4" id="footer-nav-col">
            <h4 className="font-sans text-sm font-semibold tracking-wider uppercase text-white">Navigation</h4>
            <ul className="space-y-2 text-sm" id="footer-nav-links-list">
              {footerNav.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setCurrentPage(item.id);
                      window.scrollTo(0, 0);
                    }}
                    className="text-slate-400 hover:text-pink-400 transition-colors py-1 block text-left"
                    id={`footer-link-${item.id}`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Policy / Legal Links */}
          <div className="space-y-4" id="footer-legal-col">
            <h4 className="font-sans text-sm font-semibold tracking-wider uppercase text-white">Legal Information</h4>
            <ul className="space-y-2 text-sm" id="footer-legal-links-list">
              {footerNav.slice(3).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setCurrentPage(item.id);
                      window.scrollTo(0, 0);
                    }}
                    className="text-slate-400 hover:text-pink-400 transition-colors py-1 block text-left"
                    id={`footer-link-${item.id}`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500" id="footer-bottom">
          <p id="footer-copyright">
            Copyright © {new Date().getFullYear()} <span className="text-slate-400">AnimeNews.site</span>. All rights reserved.
          </p>
          <div className="flex items-center space-x-2" id="footer-back-to-top-container">
            <span className="text-slate-400">Back to Top</span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-300 hover:text-pink-400 border border-white/5 hover:border-pink-500/20 transition-all duration-300"
              id="back-to-top-btn"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
