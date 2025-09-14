import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-semibold">GearShare</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link to="/browse" className="nav-link">Browse</Link></li>
            <li className="nav-item"><Link to="/user" className="nav-link">User</Link></li>
          </ul>
          <Link to="/login" className="btn btn-outline-primary">Log in</Link>
        </div>
      </div>
    </nav>
  );
}

