

import { useState } from 'react';

const usePagination = (initialSize = 10) => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialSize);

  const goTo  = (p, max) => setPage(Math.min(Math.max(1, p), max));
  const next  = (max)    => setPage(p => (p < max ? p + 1 : p));
  const prev  = ()       => setPage(p => (p > 1   ? p - 1 : p));
  const reset = ()       => setPage(1);

  return { page, pageSize, setPage, goTo, next, prev, reset };
};

export default usePagination;