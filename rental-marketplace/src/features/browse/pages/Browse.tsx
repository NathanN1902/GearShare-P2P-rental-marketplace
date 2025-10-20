import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ToolCard from "../../../components/ToolCard";
import Skeleton from "../../../components/Skeleton";
import { fetchTools, type SortOrder } from "../api";
import type { Tool } from "../../../data/types";

const Browse: React.FC = () => {
  const [tools, setTools] = React.useState<Tool[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // price filter
  const [searchQuery, setSearchQuery] = React.useState("");
  const [priceMin, setPriceMin] = React.useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = React.useState<number | undefined>(undefined);

  // sort
  const [sort, setSort] = React.useState<SortOrder | undefined>(undefined);

  const loadTools = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTools({
        query: searchQuery.trim(),
        priceMin,
        priceMax,
        sort,
      });
      setTools(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tools");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, priceMin, priceMax, sort]);

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
    setSort(undefined);
    loadTools();
  };

  return (
    <>
      <Header />
      <main className="container my-5">
        <section className="mb-4 text-center">
          <h1 className="mb-3">Browse Tools</h1>
          <p className="text-muted">Search, filter by price, and sort results.</p>
        </section>

        {/* Filters + Sort */}
        <form
          onSubmit={handleSubmit}
          className="mb-4 row justify-content-center gy-2 gx-3 align-items-center"
        >
          {/* Search */}
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Price min */}
          <div className="col-6 col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Min $"
              value={priceMin ?? ""}
              onChange={(e) =>
                setPriceMin(e.target.value ? Number(e.target.value) : undefined)
              }
              min={0}
            />
          </div>

          {/* Price max */}
          <div className="col-6 col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Max $"
              value={priceMax ?? ""}
              onChange={(e) =>
                setPriceMax(e.target.value ? Number(e.target.value) : undefined)
              }
              min={0}
            />
          </div>

          {/* Sort */}
          <div className="col-12 col-md-3">
            <select
              className="form-select"
              value={sort ?? ""}
              onChange={(e) =>
                setSort((e.target.value || undefined) as SortOrder | undefined)
              }
            >
              <option value="">Sort by…</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="newest">Newest → Oldest</option>
              <option value="oldest">Oldest → Newest</option>
            </select>
          </div>

          <div className="col-12 col-md-1 d-flex gap-2 justify-content-center">
            <button type="submit" className="btn btn-primary w-100">Apply</button>
          </div>
          <div className="col-12 col-md-2 d-flex gap-2 justify-content-center">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>
        </form>

        {/* Results */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {loading && (
          <div className="row g-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="col-12 col-sm-6 col-lg-4" key={i}>
                <Skeleton />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && tools.length === 0 && (
          <div className="text-center text-secondary">No tools found.</div>
        )}

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







