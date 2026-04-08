

import React from 'react';

const Paginator = ({ page, totalPages, totalCount, pageSize, onPageChange }) => {
  if (!totalCount || totalCount === 0 || totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, totalCount);

 
  const range = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
      range.push(i);
    }
  }

  const withEllipsis = [];
  let last = null;
  for (const p of range) {
    if (last && p - last > 1) withEllipsis.push("...");
    withEllipsis.push(p);
    last = p;
  }

  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top flex-wrap gap-2">
      <span className="text-muted small">
        Showing {start} to {end} of {totalCount} records
      </span>

      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>

        {withEllipsis.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="text-muted px-1">...</span>
          ) : (
            <button
              key={p}
              className={`btn btn-sm ${p === page ? "btn-primary" : "btn-outline-secondary"}`}
              style={{ minWidth: 34 }}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Paginator;