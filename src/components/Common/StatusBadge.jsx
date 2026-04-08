// components/common/StatusBadge.jsx

const STATUS_MAP = {
  paid:       { bg: "success",   label: "Paid" },
  approved:   { bg: "success",   label: "Approved" },
  pending:    { bg: "warning",   label: "Pending" },
  processing: { bg: "info",      label: "Processing" },
  rejected:   { bg: "danger",    label: "Rejected" },
  cancelled:  { bg: "secondary", label: "Cancelled" },
  active:     { bg: "primary",   label: "Active" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status?.toLowerCase()] || { bg: "secondary", label: status };
  return (
    <span className={`badge rounded-pill bg-${s.bg} px-3 py-1`}>
      {s.label}
    </span>
  );
};

export default StatusBadge;