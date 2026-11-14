import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Inbox } from 'lucide-react';

export const Table = ({
  columns = [],
  data = [],
  keyField = 'id',
  itemsPerPage = 10,
  emptyMessage = 'No records found matching your criteria.',
  emptyTitle = 'No Records',
  className = '',
  loading = false,
  showPagination = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = showPagination ? data.slice(startIndex, endIndex) : data;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className={`w-full overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-card ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75">
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`py-3.5 px-4 font-semibold text-xs text-slate-600 uppercase tracking-wider ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  } ${col.headerClassName || ''}`}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium">Loading database records...</span>
                  </div>
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800">{emptyTitle}</h4>
                    <p className="text-xs text-slate-500 mt-1">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((row, rowIdx) => (
                <tr
                  key={row[keyField] || rowIdx}
                  className="hover:bg-slate-50/70 transition-colors duration-150"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className={`py-3.5 px-4 text-slate-700 align-middle ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      } ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {showPagination && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <span className="font-semibold text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</span>
            <span>to</span>
            <span className="font-semibold text-slate-900">{endIndex}</span>
            <span>of</span>
            <span className="font-semibold text-slate-900">{totalItems}</span>
            <span>records</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={validCurrentPage === 1}
                onClick={() => handlePageChange(1)}
                className="p-1 rounded-lg hover:bg-slate-200/80 disabled:opacity-40 disabled:hover:bg-transparent text-slate-600 transition-colors"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={validCurrentPage === 1}
                onClick={() => handlePageChange(validCurrentPage - 1)}
                className="p-1 rounded-lg hover:bg-slate-200/80 disabled:opacity-40 disabled:hover:bg-transparent text-slate-600 transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-800">
                {validCurrentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={validCurrentPage === totalPages}
                onClick={() => handlePageChange(validCurrentPage + 1)}
                className="p-1 rounded-lg hover:bg-slate-200/80 disabled:opacity-40 disabled:hover:bg-transparent text-slate-600 transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={validCurrentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
                className="p-1 rounded-lg hover:bg-slate-200/80 disabled:opacity-40 disabled:hover:bg-transparent text-slate-600 transition-colors"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

