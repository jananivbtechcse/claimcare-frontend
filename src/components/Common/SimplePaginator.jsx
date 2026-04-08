const SimplePaginator = ({ page, totalPages, onNext, onPrev }) => {
  
  if (!totalPages || totalPages === 0) return null;

  return (
    <div className="d-flex justify-content-between align-items-center mt-4 px-2">
      <span className="text-muted small">
        Page {page} of {totalPages}
      </span>

      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={onPrev}
          disabled={page <= 1}
        >
          ← Prev
        </button>

        <button
          className="btn btn-sm btn-primary"
          onClick={onNext}
          disabled={page >= totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default SimplePaginator;