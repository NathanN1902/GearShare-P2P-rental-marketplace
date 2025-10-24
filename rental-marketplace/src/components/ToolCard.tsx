import React from "react";
import { Link } from "react-router-dom";
import type { Tool } from "../data/types";

const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  return (
    <div className="card h-100 shadow-sm border-0">
      <Link to={`/tools/${tool.id}`} className="text-decoration-none text-reset">
        <div className="ratio ratio-4x3 bg-light rounded-top">
          {/* Placeholder for image */}
        </div>
      </Link>
      <div className="card-body">
        <h6 className="card-title">{tool.title}</h6>
        <p className="small text-secondary">{tool.subtitle}</p>
        <div className="fw-semibold">${tool.priceDay}/day</div>
      </div>
    </div>
  );
};

export default ToolCard;   // ✅ add this

