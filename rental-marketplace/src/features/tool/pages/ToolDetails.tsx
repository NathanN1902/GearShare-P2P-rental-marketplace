import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { TOOLS } from "../../../data/fixtures";

const ToolDetails: React.FC = () => {
  // Fetch tool by ID from params
  const { id } = useParams<{ id: string }>();
  const tool = TOOLS.find((t) => t.id === id);

  if (!tool) {
    return (
      <>
        <Header />
        <main className="container my-5">
          <div className="alert alert-warning">
            Tool not found. <Link to="/browse">Go back to Browse</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="container my-5">
        <div className="row">
          {/* Left column: Image placeholder */}
          <div className="col-md-6">
            <div className="ratio ratio-4x3 bg-light rounded mb-3 d-flex align-items-center justify-content-center text-secondary">
              <span>No image available</span>
            </div>
          </div>

          {/* Right column: Tool info */}
          <div className="col-md-6">
            <h2>{tool.title}</h2>
            <p className="text-muted">{tool.subtitle}</p>

            <p>
              <i className="bi bi-geo-alt me-2"></i>
              {tool.location}
            </p>

            <p className="fw-bold fs-5">${tool.priceDay}/day</p>

            <button className="btn btn-primary">Request to Rent</button>
          </div>
        </div>

        {/* Description */}
        <section className="mt-5">
          <h4>Description</h4>
          <p>
            This is a placeholder description for <strong>{tool.title}</strong>.            
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ToolDetails;


