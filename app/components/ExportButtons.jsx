import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ExportButtons({ allArticles, rate }) {
  const getAuthorPayoutData = () => {
    const summary = {};

    allArticles.forEach((a) => {
      const author = a.author || 'Unknown Author';
      summary[author] = (summary[author] || 0) + 1;
    });

    return Object.entries(summary).map(([author, count]) => ({
      author,
      count,
      rate,
      total: count * rate,
    }));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const data = getAuthorPayoutData();

    autoTable(doc, {
      head: [['Author Name', 'Articles', 'Rate (₹)', 'Total Payout (₹)']],
      body: data.map((row) => [
        row.author,
        row.count,
        `₹${row.rate}`,
        `₹${row.total.toFixed(2)}`
      ]),
    });

    doc.save('author-payout-summary.pdf');
  };

  const exportCSV = () => {
    const data = getAuthorPayoutData();
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Payouts');
    writeFile(wb, 'author-payout-summary.csv');
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={exportCSV}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Export CSV
      </button>
      <button
        onClick={exportPDF}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Export PDF
      </button>
    </div>
  );
}
