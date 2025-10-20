import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ToolCard from "../../../components/ToolCard";
import Skeleton from "../../../components/Skeleton";
import { fetchTools } from "../api";
import type { Tool } from "../../../data/types";

const Browse: React.FC = () => {
  const [tools, setTools] = React.useState<Tool[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const loadTools = React.useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTools(query);
      setTools(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tools");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadTools();
  }, [loadTools]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTools(searchQuery.trim());
  };

  return (
    <>
      <Header />
      <main className="container my-5">
        <section className="mb-4 text-center">
          <h1 className="mb-3">Browse Tools</h1>
          <p className="text-muted">Explore all available tools for rent in your area.</p>
        </section>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="mb-4 d-flex justify-content-center">
          <input
            type="text"
            className="form-control w-50 me-2"
            placeholder="Search tools or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Error */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Loading skeletons */}
        {loading && (
          <div className="row g-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="col-12 col-sm-6 col-lg-4" key={i}>
                <Skeleton />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && tools.length === 0 && (
          <div className="text-center text-secondary">No tools found.</div>
        )}

        {/* Render tool cards */}
        {!loading && !error && tools.length > 0 && (
          <div className="row g-3">
            {tools.map((tool) => (
              <div className="col-12 col-sm-6 col-lg-4" key={tool.id}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Browse;





