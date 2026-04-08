

// import { Search } from "lucide-react";

// const TableSearch = ({ value, onChange, placeholder = "Search…" }) => (
//   <div className="input-group" style={{ maxWidth: 360 }}>
//     <span className="input-group-text bg-white border-end-0">
//       <Search size={16} className="text-muted" />
//     </span>
//     <input
//       type="text"
//       value={value}
//       onChange={e => onChange(e.target.value)}
//       className="form-control border-start-0 ps-0"
//       placeholder={placeholder}
//     />
//   </div>
// );

// export default TableSearch;


import { Search } from "lucide-react";

const TableSearch = ({ value, onChange, onSearch, placeholder = "Search…" }) => {
  const handler = onChange ?? onSearch; // accept either prop name

  return (
    <div className="input-group" style={{ maxWidth: 360 }}>
      <span className="input-group-text bg-white border-end-0">
        <Search size={16} className="text-muted" />
      </span>
      <input
        type="text"
        value={value}
        onChange={e => handler(e.target.value)}
        className="form-control border-start-0 ps-0"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TableSearch;