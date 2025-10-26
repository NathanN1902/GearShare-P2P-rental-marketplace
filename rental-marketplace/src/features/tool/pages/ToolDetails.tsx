import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { fetchToolById } from "../../browse/api";
import type { Tool } from "../../../data/types";

const ToolDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = React.useState<Tool | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        const data = await fetchToolById(id);
        if (alive) setTool(data ?? null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="container my-5 text-center text-secondary">Loading…</main>
        <Footer />
      </>
    );
  }

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
        <h2 className="mb-2">{tool.title}</h2>
        <p className="text-muted">{tool.subtitle}</p>

        <div className="ratio ratio-16x9 bg-light rounded mb-3">
          {tool.photos?.[0]?.url ? (
            <img
              src={tool.photos[0].url}
              alt={tool.photos[0].alt || tool.title}
              className="img-fluid rounded"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          ) : (
            <span className="d-flex align-items-center justify-content-center text-secondary">
              No image
            </span>
          )}
        </div>

        <p>
          <i className="bi bi-geo-alt me-1" />
          {tool.location}
        </p>
        <p className="fw-semibold">${tool.priceDay}/day</p>

        <section className="mt-4">
          <h5>Description</h5>
          <p>{tool.description || "No description provided."}</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ToolDetails;