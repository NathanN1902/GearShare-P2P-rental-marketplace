import React from "react";
import { Link } from "react-router-dom";
import type { Tool } from "../data/types";

const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  return (
    <div className="card h-100 shadow-sm border-0">
      <Link to={`/tools/${tool.id}`} className="text-decoration-none text-reset">
        {tool.image ? (
          <img src={tool.image} className="card-img-top" alt={tool.name} style={{height: "250px", objectFit: "contain", backgroundColor: "#f8f9fa"}} />
        ) : (
          <div className="ratio ratio-4x3 bg-light" />
        )}
      </Link>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h6 className="card-title mb-0">{tool.name}</h6>
          <span className="badge text-bg-secondary">{tool.category}</span>
        </div>
        <p className="small text-secondary mb-2">{tool.description}</p>
        <div className="small text-secondary mb-2">
          <i className="bi bi-person me-1" />
          {tool.owner}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="fw-semibold">${tool.price}/{tool.rate}</div>
          <Link to={`/tools/${tool.id}`} className="btn btn-outline-primary btn-sm">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
