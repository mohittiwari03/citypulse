import { Newspaper } from "lucide-react";

function SingleCard({ article, index }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 bg-slate-900/35 border border-blue-500/10 hover:border-blue-500/30 rounded-2xl transition-all duration-200 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="text-xs font-semibold text-blue-400 mb-1">
        {article.source}
      </div>

      <h3 className="text-sm font-medium text-white leading-snug line-clamp-1 group-hover:text-blue-300 transition-colors">
        {article.title}
      </h3>
    </a>
  );
}

export default function NewsCard({ articles, city }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper size={18} className="text-blue-400" />
        <h2 className="font-semibold text-white text-base">
          Latest from {city}
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {articles.map((article, i) => (
          <SingleCard key={i} article={article} index={i} />
        ))}
      </div>
    </div>
  );
}
