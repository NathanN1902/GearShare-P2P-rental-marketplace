import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import type { User as UserType } from "../../../data/types";
import Verification from "../components/Verification";

const User: React.FC = () => {
  const navigate = useNavigate();
  type TabName = "profile" | "listings";
  const [activeTab, setActiveTab] = useState<TabName>("profile");
  const [userTools, setUserTools] = useState<any[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);

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

    // Load user's tools from both tools.json and localStorage
    const loadUserTools = async () => {
      // Load from JSON file
      const response = await fetch("/data/tools.json");
      const jsonTools = await response.json();

      // Load from localStorage
      const storedTools = localStorage.getItem("tools");
      const localTools = storedTools ? JSON.parse(storedTools) : [];

      // Merge both sources and filter by current user
      const allTools = [...jsonTools, ...localTools];
      const myTools = allTools.filter((tool: any) => tool.ownerId === currentUser.id);
      setUserTools(myTools);
    };

    loadUserTools();

    // Load bookings for user's tools
    const storedBookings = localStorage.getItem("bookings");
    const allBookings = storedBookings ? JSON.parse(storedBookings) : [];
    const myToolBookings = allBookings.filter((booking: any) => booking.ownerId === currentUser.id);
    setUserBookings(myToolBookings);
  }, [navigate]);

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

  function handleDeleteTool(toolId: number) {
    if (!window.confirm("Are you sure you want to delete this tool listing?")) {
      return;
    }

    // Remove tool from localStorage
    const storedTools = localStorage.getItem("tools");
    const allTools = storedTools ? JSON.parse(storedTools) : [];
    const updatedTools = allTools.filter((tool: any) => tool.id !== toolId);
    localStorage.setItem("tools", JSON.stringify(updatedTools));

    // Update state to reflect the change
    setUserTools(userTools.filter((tool) => tool.id !== toolId));

    // Also remove any bookings for this tool
    const storedBookings = localStorage.getItem("bookings");
    const allBookings = storedBookings ? JSON.parse(storedBookings) : [];
    const updatedBookings = allBookings.filter((booking: any) => booking.toolId !== toolId);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    setUserBookings(updatedBookings.filter((booking: any) => booking.ownerId === user?.id));

    alert("Tool deleted successfully!");
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
                {user?.verified ? (
                  <span className="badge text-bg-success">
                    <i className="bi bi-shield-check me-1" />
                    Verified
                  </span>
                ) : (
                  <span className="badge text-bg-warning">
                    <i className="bi bi-exclamation-circle me-1" />
                    Not Verified
                  </span>
                )}
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

        {/* Tabs */}
        <ul className="nav nav-tabs small mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "listings" ? "active" : ""}`}
              onClick={() => setActiveTab("listings")}
            >
              Listings
            </button>
          </li>
        </ul>

        {/* Main sections */}
        <div className="row g-4">
          {/* Left column: Profile form or Listings */}
          <div className="col-lg-8">
            {activeTab === "profile" && (
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

                    <div className="col-12">
                      <button className="btn btn-primary" type="submit">
                        Save changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "listings" && (
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="mb-3">My Listings</h6>
                  {userTools.length === 0 ? (
                    <p className="text-secondary">You currently do not have any listed tool</p>
                  ) : (
                    <div className="list-group">
                      {userTools.map((tool) => {
                        const booking = userBookings.find((b: any) => b.toolId === tool.id);
                        return (
                          <div key={tool.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <h6 className="mb-1">{tool.name}</h6>
                                <small className="text-muted">
                                  Listed: {tool.listDate}
                                  {booking && (
                                    <>
                                      <br />
                                      Rented by: {booking.renterName} ({booking.startDate} - {booking.endDate})
                                    </>
                                  )}
                                </small>
                              </div>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteTool(tool.id)}
                              >
                                <i className="bi bi-trash me-1"></i>
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column: Verification + Settings */}
          <div className="col-lg-4">
            {/* Verification - Real Working Component */}
            {user && (
              <div className="mb-4">
                <Verification
                  userId={user.id}
                  userName={user.name}
                  userEmail={user.email}
                />
              </div>
            )}

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
