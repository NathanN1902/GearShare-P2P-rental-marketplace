import React, { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../../../data/types";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      // Load existing users from JSON
      const response = await fetch("/data/users.json");
      const existingUsers: User[] = await response.json();

      // Check if email already exists
      const emailExists = existingUsers.some((u) => u.email === formData.email);
      if (emailExists) {
        setError("An account with this email already exists");
        return;
      }

      // Load users from localStorage
      const storedUsers = localStorage.getItem("users");
      const localUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if email exists in localStorage
      const localEmailExists = localUsers.some((u) => u.email === formData.email);
      if (localEmailExists) {
        setError("An account with this email already exists");
        return;
      }

      // Merge all users to get the highest ID
      const allUsers = [...existingUsers, ...localUsers];
      const maxId = allUsers.length > 0 ? Math.max(...allUsers.map((u) => u.id)) : 0;
      const newId = maxId + 1;

      // Get current date in DD-MM-YYYY format
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const formattedDate = `${dd}-${mm}-${yyyy}`;

      // Create new user with default Sydney coordinates
      // In a production app, you would use a geocoding API to get actual coordinates
      const newUser: User = {
        id: newId,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        latitude: -33.8688,  // Default to Sydney coordinates
        longitude: 151.2093,
        bio: formData.bio,
        memberSince: formattedDate,
        rating: 0,
        totalRentals: 0,
        totalListings: 0,
        verified: false,
      };

      // Save to localStorage
      const updatedLocalUsers = [...localUsers, newUser];
      localStorage.setItem("users", JSON.stringify(updatedLocalUsers));

      // Log the user in automatically
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

      // Show success message and redirect
      alert("Account created successfully!");
      navigate("/browse");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="container my-5" style={{ maxWidth: 600 }}>
        <div className="bg-white border rounded-3 p-4">
          <h4 className="mb-3">Create an Account</h4>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form className="row g-3" onSubmit={handleRegister}>
            <div className="col-12">
              <label className="form-label">Name *</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <small className="text-muted">At least 6 characters</small>
            </div>

            <div className="col-md-6">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+61 ..."
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Location *</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Bio</label>
              <textarea
                className="form-control"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="col-12">
              <button className="btn btn-primary w-100" type="submit">
                Create Account
              </button>
            </div>

            <div className="col-12 text-center">
              <span className="small text-secondary">
                Already have an account?{" "}
                <Link to="/login" className="text-primary">
                  Log in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
