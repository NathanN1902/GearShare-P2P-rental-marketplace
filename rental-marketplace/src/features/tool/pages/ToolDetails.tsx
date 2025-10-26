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
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

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

  const handleBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }
    alert(`Booking request for ${tool.name} from ${startDate} to ${endDate}`);
    // TODO: Implement actual booking logic
  };

  return (
    <>
      <Header />
      <main className="container my-5">
        <h2 className="mb-2">{tool.name}</h2>
        <p className="text-muted mb-1">
          <span className="badge text-bg-secondary me-2">{tool.category}</span>
        </p>
        <p className="text-muted mb-4">
          <i className="bi bi-person me-1" />
          Owner: {tool.owner}
        </p>

        <div className="row g-4">
          {/* Left column - Image */}
          <div className="col-lg-6">
            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: "400px" }}>
              {tool.image ? (
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                />
              ) : (
                <span className="text-secondary">No image available</span>
              )}
            </div>
          </div>

          {/* Right column - Date picker and booking */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-3">Book This Tool</h4>
                <p className="h5 text-primary mb-4">${tool.price}/{tool.rate}</p>

                <form onSubmit={handleBooking}>
                  <div className="mb-3">
                    <label htmlFor="startDate" className="form-label fw-semibold">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="endDate" className="form-label fw-semibold">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Request Booking
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Description section */}
        <section className="mt-5">
          <h5>Description</h5>
          <p>{tool.description || "No description provided."}</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ToolDetails;
