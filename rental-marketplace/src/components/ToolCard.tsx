import React from "react";
import { Link } from "react-router-dom";
import type { Tool } from "../data/types";

const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  const cover = tool.photos?.[0]?.url;

  return (
    <div className="card h-100 shadow-sm border-0">
      <Link to={`/tools/${tool.id}`} className="text-decoration-none text-reset">
        {cover ? (
          <img src={cover} className="card-img-top" alt={tool.photos[0].alt || tool.title} />
        ) : (
          <div className="ratio ratio-4x3 bg-light" />
        )}
      </Link>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h6 className="card-title mb-0">{tool.title}</h6>
          {tool.badge && (
            <span className={`badge ${tool.badge === "New" ? "text-bg-info" : "text-bg-warning"}`}>
              {tool.badge}
            </span>
          )}
        </div>
        <p className="small text-secondary mb-2">{tool.subtitle}</p>
        <div className="small text-secondary mb-2">
          <i className="bi bi-geo-alt me-1" />
          {tool.location}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="fw-semibold">${tool.priceDay}/day</div>
          <Link to={`/tools/${tool.id}`} className="btn btn-outline-primary btn-sm">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;




