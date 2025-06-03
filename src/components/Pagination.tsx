import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // 简单页码生成（最多显示7个页码，含省略号）
  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <nav className="flex gap-2 mt-6 justify-center">
      <button
        className="px-2 py-1 text-sm rounded border disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        上一页
      </button>
      {getPages().map((p, i) =>
        p === '...'
          ? <span key={i} className="px-2 py-1 text-gray-400">...</span>
          : <button
              key={i}
              className={`px-2 py-1 text-sm rounded border ${p === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}
              onClick={() => onPageChange(Number(p))}
              disabled={p === currentPage}
            >
              {p}
            </button>
      )}
      <button
        className="px-2 py-1 text-sm rounded border disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        下一页
      </button>
    </nav>
  );
} 