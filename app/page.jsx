'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ArticleCard from './components/ArticleCard';
import SearchBar from './components/SearchBar';
import PayoutCalculator from './components/PayoutCalculator';
import ExportButtons from './components/ExportButtons';
import NewsAnalytics from './components/NewsAnalytics';
import { Newspaper } from 'lucide-react';

export default function Home() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  const [searchQuery, setSearchQuery] = useState('trending');
  const [authorFilter, setAuthorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [rate, setRate] = useState(50);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            searchQuery || 'trending'
          )}&from=${fromDate || ''}&to=${toDate || ''}&pageSize=100&page=1&sortBy=publishedAt&apiKey=20c74debb2694698a41b26f2d9849777`
        );
        const data = await res.json();

        if (data.status === 'error') {
          console.error('NewsAPI error:', data.message);
          setArticles([]);
          setAllArticles([]);
          setFilteredArticles([]);
          setTotalResults(0);
          return;
        }

        const enrichedArticles = (data.articles || []).map((a) => ({
          ...a,
          type: a.source.name.toLowerCase().includes('blog') ? 'Blog' : 'News',
        }));

        setArticles(enrichedArticles);
        setAllArticles(enrichedArticles);
        setTotalResults(data.totalResults || 0);
      } catch (err) {
        console.error('Failed to fetch news', err);
        setArticles([]);
        setAllArticles([]);
        setFilteredArticles([]);
      }
    };

    fetchNews();
  }, [searchQuery, fromDate, toDate]);

  useEffect(() => {
    if (allArticles.length === 0) {
      setFilteredArticles([]);
      return;
    }

    const filtered = allArticles.filter((article) => {
      const matchesSearch = true; // Already filtered by API

      const matchesAuthor =
        !authorFilter ||
        (article.author && article.author.toLowerCase() === authorFilter.toLowerCase());

      const matchesType = !typeFilter || article.type === typeFilter;

      const publishedDate = new Date(article.publishedAt);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const matchesDate =
        (!from || publishedDate >= from) &&
        (!to || publishedDate <= new Date(to.setHours(23, 59, 59, 999)));

      return matchesSearch && matchesAuthor && matchesType && matchesDate;
    });

    setFilteredArticles(filtered);
    setPage(1);
  }, [allArticles, searchQuery, authorFilter, typeFilter, fromDate, toDate]);

  const uniqueAuthors = [...new Set(allArticles.map((a) => a.author || 'Unknown Author'))];
  const types = ['News', 'Blog'];
  const totalPages = Math.ceil(filteredArticles.length / pageSize);
  const paginatedArticles = filteredArticles.slice((page - 1) * pageSize, page * pageSize);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Newspaper className="h-8 w-8 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-800">News Explorer</h1>
        </div>

        {/* Article count */}
        <p className="mb-4 text-gray-600">
          Showing <strong>{filteredArticles.length}</strong> of approximately{' '}
          <strong>{totalResults}</strong> articles
        </p>

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={(val) => {
            setSearchQuery(val);
            setPage(1);
          }}
        />

        {/* Filters */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-6">
          <select
            className="p-2 border rounded"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          >
            <option value="">All Authors</option>
            {uniqueAuthors.map((author, idx) => (
              <option key={idx} value={author}>
                {author}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="p-2 border rounded"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="p-2 border rounded"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* Article List */}
        <div className="grid gap-6">
          {paginatedArticles.length > 0 ? (
            paginatedArticles.map((article, index) => (
              <ArticleCard key={index} article={article} />
            ))
          ) : (
            <p className="text-gray-500">No articles found for the applied filters.</p>
          )}

          {allArticles.length === 0 && (
            <p className="text-red-600 mt-4">
              ⚠️ No articles fetched. Try changing query or date filters.
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => page > 1 && setPage((p) => p - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages || 1}
          </span>

          <button
            onClick={() => page < totalPages && setPage((p) => p + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Admin-only Section */}
        {isAdmin && (
          <>
            <NewsAnalytics articles={allArticles} />
            <PayoutCalculator articles={paginatedArticles} rate={rate} setRate={setRate} />
            <ExportButtons allArticles={allArticles} rate={rate} />
            {allArticles.length >= 100 && (
              <p className="text-red-600 mt-4">
                ⚠️ PDF/CSV export shows only the first 100 articles due to NewsAPI free-tier limit.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
