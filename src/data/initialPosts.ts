import { Post } from '../types';

export const initialPosts: Omit<Post, 'id'>[] = [
  {
    title: "Chainsaw Man Season 2 Official Teaser Released: Reze Arc Confirmed!",
    description: "MAPPA has dropped a breathtaking trailer confirming the return of Denji, and introducing the mysterious bomb devil girl, Reze.",
    category: "Anime News",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    views: 1420,
    likes: 382,
    isTrending: true,
    isFeatured: true,
    isBreaking: true
  },
  {
    title: "Solo Leveling Sequel Series 'Ragnarok' Webtoon Adaptation Announced",
    description: "Fans of Sung Jinwoo rejoice! The official sequel focusing on his son, Sung Suho, is officially receiving a high-budget anime adaptation.",
    category: "Anime News",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    views: 950,
    likes: 240,
    isTrending: true,
    isFeatured: false,
    isBreaking: false
  },
  {
    title: "Demon Slayer: Infinity Castle Movie Trilogy Sets Release Windows",
    description: "ufotable reveals scheduling details for the three-part theatrical event of the final, action-packed Infinity Castle arc.",
    category: "Release Dates",
    imageUrl: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=800&auto=format&fit=crop&q=80",
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    views: 2310,
    likes: 710,
    isTrending: true,
    isFeatured: false,
    isBreaking: true
  },
  {
    title: "Jujutsu Kaisen Final Volume Reaches Milestone 100 Million Copies",
    description: "Gege Akutami's dark fantasy masterpiece concludes its historic run, solidifying itself as one of the best-selling manga of all time.",
    category: "Manga News",
    imageUrl: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&auto=format&fit=crop&q=80",
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    views: 3100,
    likes: 950,
    isTrending: false,
    isFeatured: false,
    isBreaking: false
  },
  {
    title: "Bleach: Thousand-Year Blood War Part 3 Review - Absolute Visual Feast",
    description: "The conflict intensifies as Ichigo faces Yhwach. Studio Pierrot's production elevates the source material to cinematic levels.",
    category: "Reviews",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    views: 1840,
    likes: 490,
    isTrending: false,
    isFeatured: false,
    isBreaking: false
  },
  {
    title: "One Piece Manga Enters 'Elbaf Island' Arc - What to Expect",
    description: "Eiichiro Oda launches the highly anticipated giant warriors arc. Here are the top 5 lore revelations we expect to see.",
    category: "Manga News",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    views: 4200,
    likes: 1350,
    isTrending: true,
    isFeatured: true,
    isBreaking: false
  },
  {
    title: "Kaiju No. 8 Season 2 Reveals New Defense Force Captains",
    description: "The official website details the voice cast and aesthetic designs for the upcoming captains joining the fight against Kaiju threat.",
    category: "Anime News",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    views: 1210,
    likes: 290,
    isTrending: false,
    isFeatured: false,
    isBreaking: false
  }
];
