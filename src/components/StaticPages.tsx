interface StaticPagesProps {
  pageId: 'about' | 'privacy' | 'terms' | 'disclaimer';
}

export default function StaticPages({ pageId }: StaticPagesProps) {
  const renderContent = () => {
    switch (pageId) {
      case 'about':
        return (
          <div className="space-y-6" id="static-about-content">
            <h1 className="font-sans text-3xl font-black text-white">About <span className="bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">AnimeNews.site</span></h1>
            <p className="text-slate-300">
              AnimeNews.site is a leading independent news publication dedicated entirely to the global anime, manga, and Japanese pop-culture industry. Established in 2026, our team of passionate editors and researchers strive to deliver the fastest, most precise, and visually stunning coverage of upcoming anime titles, industry shifts, release dates, and manga chapter reviews.
            </p>
            <h3 className="font-sans text-lg font-bold text-white pt-4">Our Vision</h3>
            <p className="text-slate-300">
              We believe in treating anime journalism with the respect and premium layout design it truly deserves. No clutter, no pop-up advertisement spam—just beautiful glassmorphism typography, blazing fast load times, and authentic reporting designed explicitly for Otakus worldwide.
            </p>
            <h3 className="font-sans text-lg font-bold text-white pt-4">Our Commitment</h3>
            <p className="text-slate-300">
              We stand for architectural honesty, pristine visual consistency, and absolute integrity. Every review, analysis, and news brief is thoroughly vetted before publishing, with secure user integrations backed by Google sign-in and cloud persistence to connect our readers seamlessly.
            </p>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6" id="static-privacy-content">
            <h1 className="font-sans text-3xl font-black text-white">Privacy <span className="bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">Policy</span></h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase">Effective Date: July 4, 2026</p>
            <p className="text-slate-300">
              At AnimeNews.site, we take your privacy very seriously. This Privacy Policy details what information we collect when you browse our website, sign in using Google Auth, or interact with our comment streams.
            </p>
            <h3 className="font-sans text-lg font-bold text-white pt-4">1. Information We Collect</h3>
            <p className="text-slate-300">
              When you authenticate via Google Sign-In, we collect your displayName, email address, and photoURL as provided by the Google Identity provider. We do not store or process passwords. When you submit comments or contact form requests, we store that user-authored content inside our Firebase Firestore database.
            </p>
            <h3 className="font-sans text-lg font-bold text-white pt-4">2. Cookies & Analytics</h3>
            <p className="text-slate-300">
              We use secure cookies and browser local storage to maintain session states and user preferences (such as bookmarked articles). Basic analytical cookies may be placed to track general visitor counts securely.
            </p>
            <h3 className="font-sans text-lg font-bold text-white pt-4">3. Data Integrity</h3>
            <p className="text-slate-300">
              Your personal profile data is never sold, leased, or distributed to any third party. Your information is strictly utilized to provide customized interactive features (such as bookmarks, likes, and comments) on our application.
            </p>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-6" id="static-terms-content">
            <h1 className="font-sans text-3xl font-black text-white">Terms & <span className="bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">Conditions</span></h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase">Last Updated: July 4, 2026</p>
            <p className="text-slate-300">
              Welcome to AnimeNews.site. By accessing or using our website, you agree to comply with and be bound by the following Terms & Conditions. If you do not agree, please do not use our services.
            </p>
            <h3 className="font-sans text-lg font-bold text-white pt-4">1. Copyright & Intellectual Property</h3>
            <p className="text-slate-300">
              All editorial articles, designs, custom glassmorphic code elements, and graphics are the intellectual property of AnimeNews.site. Unauthorised syndication, copying, or mirroring of our articles is strictly prohibited. Image assets displayed are for illustrative purposes and remain copyrighted by their respective production houses or creators.
            </p>
            <h3 className="font-sans text-lg font-bold text-white pt-4">2. User Conduct & Interactive Comments</h3>
            <p className="text-slate-300">
              By using our interactive comments system, you agree not to post any hateful language, explicit spoilers without tags, commercial promotions, or abusive text. We reserve the absolute right to remove any comments or terminate bookmarks for users who violate these guidelines.
            </p>
            <h3 className="font-sans text-lg font-bold text-white pt-4">3. Revisions and Errata</h3>
            <p className="text-slate-300">
              While we strive for absolute accuracy, the news published on AnimeNews.site may contain technical, typographical, or photographic errors. We may make changes to the materials contained on the website at any time without notice.
            </p>
          </div>
        );
      case 'disclaimer':
        return (
          <div className="space-y-6" id="static-disclaimer-content">
            <h1 className="font-sans text-3xl font-black text-white">Legal <span className="bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">Disclaimer</span></h1>
            <p className="text-slate-300">
              All information provided on AnimeNews.site is for general informational and entertainment purposes only. While we make every single effort to verify leaks and updates, rumor articles and predictions should not be considered objective, finalized facts until official press releases are issued by the respective production companies.
            </p>
            <h3 className="font-sans text-lg font-bold text-white pt-4">External Image Credits</h3>
            <p className="text-slate-300">
              Any character illustrations, anime stills, and manga scans displayed on AnimeNews.site are utilized strictly under Fair Use for review, educational criticism, and reporting purposes. The intellectual rights of these titles belong entirely to their respective authors, publishers, and animation studios (e.g. Shueisha, Kodansha, Aniplex, MAPPA, ufotable, TOHO, etc.).
            </p>
            <p className="text-slate-300">
              AnimeNews.site is an independent publication and is not officially affiliated, associated, or endorsed by any of the aforementioned studios or publishers.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <article className="max-w-3xl mx-auto rounded-3xl glass-panel p-8 sm:p-12 shadow-2xl leading-relaxed text-sm sm:text-base border border-white/5 animate-fade-in" id={`static-page-${pageId}`}>
      {renderContent()}
    </article>
  );
}
