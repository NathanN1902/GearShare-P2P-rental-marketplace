import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import type { User as UserType } from "../../../data/types";

type UploadFile = File | null;

const User: React.FC = () => {
  const navigate = useNavigate();
  type TabName = "profile" | "listings" | "reviews" | "messages" | "settings";
  const [activeTab, setActiveTab] = useState<TabName>("profile");

  // User profile data
  const [user, setUser] = useState<UserType | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    // Load logged-in user from localStorage
    const currentUserJson = localStorage.getItem("currentUser");
    if (!currentUserJson) {
      // No user logged in, redirect to login
      navigate("/login");
      return;
    }

    const currentUser: UserType = JSON.parse(currentUserJson);
    setUser(currentUser);
    setName(currentUser.name);
    setEmail(currentUser.email);
    setPhone(currentUser.phone);
    setLocation(currentUser.location);
    setBio(currentUser.bio);
  }, [navigate]);

  // Identity / verification
  const [progress, setProgress] = useState(60); // verification progress (dummy)
  const [idFront, setIdFront] = useState<UploadFile>(null);
  const [idBack, setIdBack] = useState<UploadFile>(null);

  // Settings toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [showOnline, setShowOnline] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  function handleSubmitProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    // Update user in localStorage
    const updatedUser = {
      ...user,
      name,
      email,
      phone,
      location,
      bio,
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    alert("Profile updated successfully!");
  }

  function handleSubmitVerification(e: React.FormEvent) {
    e.preventDefault();
    alert("Submitted for verification (placeholder)");
    setProgress(100);
  }

  return (
    <>
      <Header />

      <main className="container my-4">
        {/* Top bar */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <Link to="/browse" className="btn btn-light border">
            <i className="bi bi-arrow-left" /> Back
          </Link>
          <div className="ms-auto">
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1" />
              Logout
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body d-flex align-items-start gap-3">
            <div
              className="rounded-circle bg-light border"
              style={{ width: 72, height: 72 }}
            />
            <div className="flex-grow-1">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <h5 className="mb-0">{user?.name || "Loading..."}</h5>
                <span className="badge text-bg-secondary">Member</span>
                <span className="badge text-bg-success">
                  <i className="bi bi-shield-check me-1" />
                  Verified
                </span>
                <span className="badge text-bg-light border text-muted">
                  {user?.location || ""}
                </span>
              </div>
              <div className="text-secondary small mt-2">
                <i className="bi bi-geo-alt me-1" />
                {user?.location || ""} • Member since {user?.memberSince ? new Date(user.memberSince).getFullYear() : ""} • {user?.totalRentals || 0} completed rentals • {user?.totalListings || 0} listings
              </div>
            </div>
          </div>
        </div>

        {/* Tabs (visual only) */}
        <ul className="nav nav-tabs small mb-3">
          <li className="nav-item">
            <span className="nav-link active">Profile</span>
          </li>
          <li className="nav-item">
            <span className="nav-link">Listings</span>
          </li>
          <li className="nav-item">
            <span className="nav-link">Reviews</span>
          </li>
          <li className="nav-item">
            <span className="nav-link">Settings</span>
          </li>
        </ul>

        {activeTab === "messages" && (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Messages</h6>
                <Link to="/messages" className="btn btn-primary btn-sm">
                  Open Full Messenger
                </Link>
              </div>
              <p className="text-secondary">View and manage your conversations.</p>
            </div>
          </div>
        )}

        {/* Main sections */}
        <div className="row g-4">
          {/* Left column: Profile form */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="mb-3">Profile Details</h6>
                <form className="row g-3" onSubmit={handleSubmitProfile}>
                  <div className="col-12">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-control"
                      placeholder="+61 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Location</label>
                    <input
                      className="form-control"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Skills</label>
                    <input className="form-control" placeholder="e.g., Carpentry" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Preferred radius</label>
                    <input className="form-control" placeholder="10 km" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Availability</label>
                    <input className="form-control" placeholder="Weekends" />
                  </div>

                  <div className="col-12">
                    <button className="btn btn-primary" type="submit">
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right column: Verification + Settings */}
          <div className="col-lg-4">
            {/* Verification */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="mb-0">Verification</h6>
                  <span className="badge text-bg-warning">In progress</span>
                </div>

                <div className="small text-secondary mb-2">
                  Complete profile verification.
                </div>

                <div className="progress mb-3" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                  <div className="progress-bar" style={{ width: `${progress}%` }}>
                    {progress}%
                  </div>
                </div>

                {/* Avatar placeholders */}
                <div className="row g-3 mb-3">
                  {[1, 2, 3].map((i) => (
                    <div className="col-4" key={i}>
                      <div className="bg-light rounded d-flex flex-column align-items-center justify-content-center p-3 border">
                        <div className="rounded-circle bg-white border mb-2" style={{ width: 40, height: 40 }} />
                        <div className="small text-secondary">Connect</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ID uploads */}
                <form onSubmit={handleSubmitVerification}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small">Government ID (front)</label>
                      <div className="input-group">
                        <input
                          className="form-control"
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => setIdFront(e.target.files?.[0] ?? null)}
                        />
                        <button className="btn btn-outline-secondary" type="button" disabled={!idFront}>
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small">Government ID (back)</label>
                      <div className="input-group">
                        <input
                          className="form-control"
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => setIdBack(e.target.files?.[0] ?? null)}
                        />
                        <button className="btn btn-outline-secondary" type="button" disabled={!idBack}>
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="col-12">
                      <button className="btn btn-dark w-100" type="submit">
                        Submit for Verification
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Settings */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="mb-3">Account Settings</h6>

                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <div className="fw-semibold small">Email notifications</div>
                    <div className="text-secondary small">Booking updates & messages</div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={notifEmail}
                      onChange={(e) => setNotifEmail(e.target.checked)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <div className="fw-semibold small">SMS notifications</div>
                    <div className="text-secondary small">Time-sensitive alerts</div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={notifSMS}
                      onChange={(e) => setNotifSMS(e.target.checked)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <div className="fw-semibold small">Two-factor authentication</div>
                    <div className="text-secondary small">Extra login security</div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={twoFA}
                      onChange={(e) => setTwoFA(e.target.checked)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center py-2">
                  <div>
                    <div className="fw-semibold small">Show online status</div>
                    <div className="text-secondary small">Display when you’re active</div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={showOnline}
                      onChange={(e) => setShowOnline(e.target.checked)}
                    />
                  </div>
                </div>

                <hr />
                <button className="btn btn-outline-danger w-100">
                  Deactivate Account (placeholder/optional)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default User;
