'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function NewsAnalytics({ articles }) {
  // 📊 Data: articles per author
  const authorDataMap = {};
  articles.forEach((a) => {
    const author = a.author || 'Unknown Author';
    authorDataMap[author] = (authorDataMap[author] || 0) + 1;
  });

  const authorData = Object.entries(authorDataMap).map(([name, count]) => ({
    name,
    count,
  }));

  // 🥧 Data: articles by type
  const typeData = [
    { name: 'News', value: articles.filter((a) => a.type === 'News').length },
    { name: 'Blog', value: articles.filter((a) => a.type === 'Blog').length },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-10">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">📈 News Analytics</h2>

      {/* Bar Chart: Articles per Author */}
      <div className="w-full h-64 mb-10">
        <h3 className="font-medium text-gray-700 mb-2">Articles per Author</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={authorData.slice(0, 10)} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart: Articles by Type */}
      <div className="w-full h-72">
        <h3 className="font-medium text-gray-700 mb-2">Articles by Type</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={typeData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {typeData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
