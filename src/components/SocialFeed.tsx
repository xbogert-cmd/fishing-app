import { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw, MessageSquare } from 'lucide-react';

interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  numComments: number;
  url: string;
  selftext: string;
  created: number;
  thumbnail: string | null;
  flair: string | null;
}

const SUBREDDITS = [
  { name: 'FishingNC', label: 'NC Fishing' },
  { name: 'carolinafishing', label: 'Carolina' },
  { name: 'Fishing', label: 'General' },
  { name: 'bassfishing', label: 'Bass' },
  { name: 'saltwater', label: 'Saltwater' },
];

function timeAgo(unixSec: number): string {
  const diff = (Date.now() / 1000) - unixSec;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

async function fetchSubredditPosts(subreddit: string): Promise<RedditPost[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/hot.json?limit=8&raw_json=1`,
    { headers: { 'Accept': 'application/json' } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.data?.children ?? []).map((c: { data: {
    id: string; title: string; author: string; subreddit: string;
    score: number; num_comments: number; permalink: string;
    selftext: string; created_utc: number; thumbnail: string;
    link_flair_text: string;
  } }) => ({
    id: c.data.id,
    title: c.data.title,
    author: c.data.author,
    subreddit: c.data.subreddit,
    score: c.data.score,
    numComments: c.data.num_comments,
    url: `https://reddit.com${c.data.permalink}`,
    selftext: c.data.selftext?.slice(0, 200) ?? '',
    created: c.data.created_utc,
    thumbnail: c.data.thumbnail?.startsWith('http') ? c.data.thumbnail : null,
    flair: c.data.link_flair_text,
  }));
}

export default function SocialFeed() {
  const [activeSub, setActiveSub] = useState(0);
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async (subIndex: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSubredditPosts(SUBREDDITS[subIndex].name);
      setPosts(result);
    } catch {
      setError('Could not load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(activeSub); }, [activeSub]);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wide flex items-center gap-1">
            <MessageSquare size={11} /> Live Fishing Reports
          </div>
          <button
            onClick={() => loadPosts(activeSub)}
            disabled={loading}
            className="text-slate-500 hover:text-cyan-400 transition-colors"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1">
          {SUBREDDITS.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActiveSub(i)}
              className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                activeSub === i
                  ? 'bg-orange-600/70 text-orange-100 border border-orange-500/50'
                  : 'bg-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              r/{s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        {loading && (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-slate-700 rounded w-full mb-1" />
                <div className="h-3 bg-slate-700 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 text-center">
            <div className="text-slate-500 text-sm">{error}</div>
            <div className="text-slate-600 text-xs mt-1">Check your internet connection</div>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="p-4 text-center text-slate-500 text-sm">No posts found</div>
        )}

        {!loading && posts.map(post => (
          <a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-b border-slate-700/50 p-2.5 hover:bg-slate-700/30 transition-colors"
          >
            <div className="flex gap-2">
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt=""
                  className="w-12 h-12 rounded object-cover shrink-0 bg-slate-700"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-slate-200 text-xs font-medium leading-snug line-clamp-2 mb-1">
                  {post.title}
                </div>
                {post.flair && (
                  <span className="text-[10px] bg-slate-700 text-slate-400 px-1 py-0.5 rounded mr-1">
                    {post.flair}
                  </span>
                )}
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                  <span>↑ {post.score}</span>
                  <span>💬 {post.numComments}</span>
                  <span>u/{post.author}</span>
                  <span className="ml-auto">{timeAgo(post.created)}</span>
                  <ExternalLink size={9} className="text-slate-600" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="px-3 py-1.5 border-t border-slate-700 text-[10px] text-slate-600">
        Live data from Reddit · No Twitter/X API (requires paid access)
      </div>
    </div>
  );
}
