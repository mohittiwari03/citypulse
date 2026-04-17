import { ExternalLink, Newspaper } from "lucide-react";

function SingleCard({ article, index }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group card p-4 flex flex-col gap-2 hover:border-gold/50
                 transition-all duration-200 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-teal truncate">
          {article.source}
        </span>
        <ExternalLink
          size={12}
          className="text-muted group-hover:text-gold shrink-0 transition-colors"
        />
      </div>

      <h3 className="text-sm font-bold text-ink leading-snug
                     group-hover:text-gold transition-colors line-clamp-2">
        {article.title}
      </h3>

      {article.snippet && (
        <p className="text-xs text-muted leading-relaxed line-clamp-2">
          {article.snippet}
        </p>
      )}
    </a>
  );
}

export default function NewsCard({ articles, city }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper size={16} className="text-gold" />
        <h2 className="font-bold text-ink">
          Latest from{" "}
          <span className="text-gold">{city}</span>
        </h2>
        <span className="ml-auto text-xs font-mono text-muted">
          {articles.length} articles
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {articles.map((article, i) => (
          <SingleCard key={i} article={article} index={i} />
        ))}
      </div>
    </div>
  );
}
