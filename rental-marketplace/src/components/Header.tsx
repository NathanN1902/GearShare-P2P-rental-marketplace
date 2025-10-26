import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const checkUser = () => {
      const userJson = localStorage.getItem("currentUser");
      if (userJson) {
        const user = JSON.parse(userJson);
        setIsLoggedIn(true);
        setUserName(user.name);
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    checkUser();
    // Listen for storage changes (in case user logs in/out in another tab)
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

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
            <li className="nav-item"><Link to="/list" className="nav-link">List</Link></li>
            {isLoggedIn && (
              <li className="nav-item"><Link to="/user" className="nav-link">Profile</Link></li>
            )}
          </ul>
          {isLoggedIn ? (
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary small">Welcome, {userName}</span>
              <Link to="/user" className="btn btn-outline-primary">My Account</Link>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline-primary">Log in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

