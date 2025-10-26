import React from "react";

const Skeleton: React.FC = () => {
  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="ratio ratio-4x3 bg-light rounded" />
      <div className="card-body">
        <div className="placeholder-glow">
          <span className="placeholder col-8 mb-2"></span>
          <span className="placeholder col-6 mb-2"></span>
          <span className="placeholder col-4"></span>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;