export default function ArticleCard({ article }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 transition hover:shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">{article.title}</h2>
      <p className="text-sm text-gray-500 mb-2">
        {article.author || "Unknown Author"} &middot; {new Date(article.publishedAt).toLocaleDateString()}
      </p>
      <p className="text-gray-700">{article.description}</p>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 text-indigo-600 font-medium hover:underline"
      >
        Read more →
      </a>
    </div>
  );
}
