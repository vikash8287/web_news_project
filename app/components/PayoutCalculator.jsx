'use client';

import { useEffect, useState } from 'react';

export default function PayoutCalculator({ articles, rate, setRate }) {
  useEffect(() => {
    const storedRate = localStorage.getItem('payoutRate');
    if (storedRate) {
      setRate(parseFloat(storedRate));
    }
  }, []);

  const handleRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    setRate(newRate);
    localStorage.setItem('payoutRate', newRate);
  };

  const blogCount = articles.filter((a) => a.type === 'Blog').length;
  const newsCount = articles.filter((a) => a.type === 'News').length;
  const total = (blogCount + newsCount) * rate;

  return (
    <div className="bg-white p-4 rounded shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-2">💸 Payout Calculator</h2>
      <div className="flex flex-col gap-2 mb-2">
        <label>Rate per Article (₹):</label>
        <input
          type="number"
          value={isNaN(rate) ? '' : rate}
          onChange={handleRateChange}
          className="border p-2 rounded"
        />
      </div>
      <p className="text-gray-700">
        Total Blogs: {blogCount}, News: {newsCount}, Total Payout: ₹{total.toFixed(2)}
      </p>
    </div>
  );
}
