import { useParams, Link } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { TOOLS } from "../../../data/fixtures";

export default function ToolDetails() {
  const { id } = useParams<{ id: string }>();
  const tool = TOOLS.find((t) => t.id === id);

  if (!tool) {
    return (
      <>
        <Header />
        <div className="container my-5">
          <div className="alert alert-warning">Tool not found.</div>
          <Link to="/browse" className="btn btn-primary">Back to Browse</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="container my-4">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="ratio ratio-16x9 bg-light rounded-3" />
          </div>

          <div className="col-lg-5">
            <h3 className="mb-1">{tool.title}</h3>
            <div className="text-secondary mb-2">{tool.subtitle}</div>
            <div className="mb-2"><i className="bi bi-geo-alt me-1" />{tool.location}</div>
            <div className="fs-5 fw-semibold mb-3">${tool.priceDay}/day</div>
            <p className="mb-4">{tool.description}</p>

            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="button">Request to rent</button>
              <Link to="/browse" className="btn btn-outline-secondary">Back to Browse</Link>
            </div>

            <hr className="my-4" />

            <div>
              <h6 className="mb-2">Owner</h6>
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-light me-3" style={{ width: 44, height: 44 }} />
                <div>
                  <div className="fw-semibold">User #{tool.ownerId}</div>
                  <div className="small text-secondary">Joined 2024 • Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
