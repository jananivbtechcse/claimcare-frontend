
const Normalise = (raw) => {
  if (!raw) return { items: [], totalCount: 0 };
  if (Array.isArray(raw)) return { items: raw, totalCount: raw.length };

  const items =
    raw?.$values ??
    raw?.items?.$values ??
    raw?.items ??
    raw?.data?.$values ??
    raw?.data ??
    [];

  return {
    items: Array.isArray(items) ? items : [],
    totalCount: raw?.totalCount ?? raw?.total ?? items.length ?? 0,
  };
};

export default Normalise;