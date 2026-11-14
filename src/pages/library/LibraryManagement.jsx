import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';
import { SearchFilter } from '../../components/common/SearchFilter';
import { AddBookModal } from '../../components/modals/AddBookModal';
import { IssueBookModal } from '../../components/modals/IssueBookModal';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  Library,
  BookPlus,
  BookOpen,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';

export const LibraryManagement = () => {
  const { books, bookIssues, returnBook } = useData();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'issued'
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [addBookOpen, setAddBookOpen] = useState(false);
  const [issueBookTarget, setIssueBookTarget] = useState(null);

  const categories = Array.from(new Set(books.map((b) => b.category).filter(Boolean)));

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn?.toLowerCase().includes(search.toLowerCase());

    const matchesCat = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleReturn = (issueId, title) => {
    returnBook(issueId);
    success(`"${title}" successfully checked back in to inventory!`);
  };

  const tabs = [
    { id: 'catalog', label: 'Book Catalog', icon: Library, badge: filteredBooks.length },
    { id: 'issued', label: 'Issued Books & Borrowing History', icon: BookOpen, badge: bookIssues.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Library & Learning Resources
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Academic textbooks, reference monographs, checkout tracking, and inventory availability.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={BookPlus}
          onClick={() => setAddBookOpen(true)}
        >
          Catalog New Book
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <SearchFilter
            searchValue={search}
            onSearchChange={setSearch}
            placeholder="Search books by title, author, or ISBN..."
            filters={[
              {
                id: 'cat',
                options: [
                  { value: 'all', label: 'All Categories' },
                  ...categories.map((c) => ({ value: c, label: c })),
                ],
              },
            ]}
            filterValues={{ cat: categoryFilter }}
            onFilterChange={(id, val) => setCategoryFilter(val)}
            onReset={() => {
              setSearch('');
              setCategoryFilter('all');
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((bk) => (
              <div
                key={bk.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary" size="sm">
                      {bk.category}
                    </Badge>
                    <span className="font-mono text-[11px] text-slate-400">{bk.shelf_location}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{bk.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">Author: {bk.author}</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">ISBN: {bk.isbn}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Available</span>
                    <span
                      className={`text-sm font-extrabold ${
                        bk.available_copies > 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {bk.available_copies} / {bk.total_copies} Copies
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={bk.available_copies <= 0}
                    onClick={() => setIssueBookTarget(bk)}
                  >
                    Issue Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'issued' && (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4">Borrower</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Overdue Fine</th>
                  <th className="py-3 px-4 text-right">Return Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{issue.book_title}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{issue.student_name}</td>
                    <td className="py-3 px-4 text-slate-600">{issue.issue_date}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{issue.due_date}</td>
                    <td className="py-3 px-4">
                      <Badge variant={issue.status} size="sm" dot>
                        {issue.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-600">
                      {issue.fine_amount > 0 ? formatCurrency(issue.fine_amount) : '$0.00'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {issue.status !== 'returned' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={RotateCcw}
                          onClick={() => handleReturn(issue.id, issue.book_title)}
                        >
                          Check In
                        </Button>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-xs flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Returned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      <AddBookModal
        isOpen={addBookOpen}
        onClose={() => setAddBookOpen(false)}
      />

      <IssueBookModal
        book={issueBookTarget}
        isOpen={!!issueBookTarget}
        onClose={() => setIssueBookTarget(null)}
      />
    </div>
  );
};

