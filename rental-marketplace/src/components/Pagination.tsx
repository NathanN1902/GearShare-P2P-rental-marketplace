import React from "react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center mb-0">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onChange(Math.max(1, page - 1))}
          >
            &laquo;
          </button>
        </li>

        {pages.map((p) => (
          <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
            <button
              className="page-link"
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          </li>
        ))}

        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onChange(Math.min(totalPages, page + 1))}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
