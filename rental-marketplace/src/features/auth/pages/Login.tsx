import React, { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../../../data/types";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Load users from JSON
      const response = await fetch("/data/users.json");
      const users: User[] = await response.json();

      // Find user with matching email and password
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Store user in localStorage (without password for security)
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

        // Redirect to browse page
        navigate("/browse");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to log in. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="container my-5" style={{ maxWidth: 520 }}>
        <div className="bg-white border rounded-3 p-4">
          <h4 className="mb-3">Log in</h4>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form className="row g-3" onSubmit={handleLogin}>
            <div className="col-12">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div className="form-check">
                <input id="remember" type="checkbox" className="form-check-input" />
                <label htmlFor="remember" className="form-check-label">
                  Remember me
                </label>
              </div>
              <a href="#" className="small">
                Forgot password?
              </a>
            </div>
            <div className="col-12">
              <button className="btn btn-primary w-100" type="submit">
                Log in
              </button>
            </div>
            <div className="col-12 text-center">
              <span className="small text-secondary">
                Demo accounts: john@example.com, jane@example.com, mike@example.com
                <br />
                Password: password123
              </span>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
