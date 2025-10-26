import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ToolCard from "../../../components/ToolCard";
import Skeleton from "../../../components/Skeleton";
import type { Tool, User } from "../../../data/types";

// Calculate distance between two coordinates using Haversine formula (in km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Browse: React.FC = () => {
  const [tools, setTools] = React.useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = React.useState<Tool[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

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
      const localTools = localStorage.getItem('tools');
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

    // Load current user for distance calculation
    const userJson = localStorage.getItem("currentUser");
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
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
    } else if (sort === "distance" && currentUser) {
      // Sort by distance from current user
      result.sort((a, b) => {
        const distA = calculateDistance(currentUser.latitude, currentUser.longitude, a.latitude, a.longitude);
        const distB = calculateDistance(currentUser.latitude, currentUser.longitude, b.latitude, b.longitude);
        return distA - distB;
      });
    }

    setFilteredTools(result);
  }, [tools, searchQuery, priceMin, priceMax, sort, currentUser]);

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
              <option value="distance" disabled={!currentUser}>
                Distance: Nearest First {!currentUser && "(Login required)"}
              </option>
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
