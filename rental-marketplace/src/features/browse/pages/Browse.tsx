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
  const [error, setError] = React.useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [priceMin, setPriceMin] = React.useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = React.useState<number | undefined>(undefined);

  const loadTools = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTools({
        query: searchQuery.trim(),
        priceMin,
        priceMax,
      });
      setTools(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tools");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, priceMin, priceMax]);

  React.useEffect(() => {
    loadTools();
  }, [loadTools]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTools();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceMin(undefined);
    setPriceMax(undefined);
    loadTools();
  };

  return (
    <>
      <Header />
      <main className="container my-5">
        <section className="mb-4 text-center">
          <h1 className="mb-3">Browse Tools</h1>
          <p className="text-muted">Search and filter tools by price range.</p>
        </section>

        {/* Filters */}
        <form
          onSubmit={handleSubmit}
          className="mb-4 row justify-content-center gy-2 gx-3 align-items-center"
        >
          {/* Search bar */}
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Price filters */}
          <div className="col-6 col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Min $"
              value={priceMin ?? ""}
              onChange={(e) =>
                setPriceMin(e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>

          <div className="col-6 col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Max $"
              value={priceMax ?? ""}
              onChange={(e) =>
                setPriceMax(e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>

          {/* Buttons */}
          <div className="col-12 col-md-2 d-flex gap-2 justify-content-center">
            <button type="submit" className="btn btn-primary">
              Apply
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>
        </form>

        {/* Error */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Loading */}
        {loading && (
          <div className="row g-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="col-12 col-sm-6 col-lg-4" key={i}>
                <Skeleton />
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && !error && tools.length === 0 && (
          <div className="text-center text-secondary">No tools found.</div>
        )}

        {/* Results */}
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






