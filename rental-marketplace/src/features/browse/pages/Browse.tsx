import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ToolCard from "../../../components/ToolCard";
import Skeleton from "../../../components/Skeleton";

interface Tool {
  id: number;
  name: string;
  description: string;
  price: number;
  rate: string;
  category: string;
  image: string;
  owner: string;
  ownerId: number;
}

const Browse: React.FC = () => {
  const [tools, setTools] = React.useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = React.useState<Tool[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [priceMin, setPriceMin] = React.useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = React.useState<number | undefined>(undefined);
  const [sort, setSort] = React.useState<string>("");

  const loadTools = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Load from JSON file
      const response = await fetch('/data/tools.json');
      const jsonTools = await response.json();
      
      // Load from localStorage (newly added tools)
      const localTools = localStorage.getItem('userTools');
      const userTools = localTools ? JSON.parse(localTools) : [];
      
      // Combine both
      const allTools = [...jsonTools, ...userTools];
      setTools(allTools);
      setFilteredTools(allTools);
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

  React.useEffect(() => {
    let result = [...tools];

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (priceMin !== undefined) {
      result = result.filter(tool => tool.price >= priceMin);
    }
    if (priceMax !== undefined) {
      result = result.filter(tool => tool.price <= priceMax);
    }

    // Sort
    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredTools(result);
  }, [tools, searchQuery, priceMin, priceMax, sort]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceMin(undefined);
    setPriceMax(undefined);
    setSort("");
  };

  return (
    <>
      <Header />
      <main className="container my-5">
        <section className="mb-4 text-center">
          <h1 className="mb-3">Browse Tools</h1>
          <p className="text-muted">Search, filter by price, and sort results.</p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mb-4 row justify-content-center gy-2 gx-3 align-items-center"
        >
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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

          <div className="col-12 col-md-3">
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort by…</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
            </select>
          </div>

          <div className="col-12 col-md-1 d-flex gap-2 justify-content-center">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>
        </form>

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

        {!loading && !error && filteredTools.length === 0 && (
          <div className="text-center text-secondary">No tools found.</div>
        )}

        {!loading && !error && filteredTools.length > 0 && (
          <div className="row g-3">
            {filteredTools.map((tool) => (
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
