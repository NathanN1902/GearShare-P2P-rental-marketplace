import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { fetchToolById } from "../../browse/api";
import type { Tool, User } from "../../../data/types";

// EmailJS configuration - you'll need to set these up at emailjs.com
const EMAILJS_SERVICE_ID = "service_YOUR_ID"; // Replace with your service ID
const EMAILJS_TEMPLATE_ID = "template_YOUR_ID"; // Replace with your template ID
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Replace with your public key

interface Booking {
  id: number;
  toolId: number;
  toolName: string;
  ownerId: number;
  ownerName: string;
  renterId: number;
  renterName: string;
  renterEmail: string;
  startDate: string;
  endDate: string;
  pricePerDay: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "rejected";
  createdAt: string;
}

const ToolDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = React.useState<Tool | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [bookingSubmitted, setBookingSubmitted] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    // Check if user is logged in
    const userJson = localStorage.getItem("currentUser");
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }

    if (!id) return;
    let alive = true;
    (async () => {
      try {
        const data = await fetchToolById(id);
        console.log("Fetched tool data:", data);
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

  const calculateDays = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // At least 1 day
  };

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if user is logged in
    if (!currentUser) {
      alert("Please log in to request a booking");
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    const days = calculateDays(startDate, endDate);
    const totalPrice = days * tool.price;

    // Create booking object
    const newBooking: Booking = {
      id: Date.now(),
      toolId: tool.id,
      toolName: tool.name,
      ownerId: tool.ownerId,
      ownerName: tool.owner,
      renterId: currentUser.id,
      renterName: currentUser.name,
      renterEmail: currentUser.email,
      startDate: startDate,
      endDate: endDate,
      pricePerDay: tool.price,
      totalPrice: totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      // Save to localStorage (since we can't write to JSON directly from browser)
      const existingBookings = localStorage.getItem("bookings");
      const bookings: Booking[] = existingBookings ? JSON.parse(existingBookings) : [];
      bookings.push(newBooking);
      localStorage.setItem("bookings", JSON.stringify(bookings));

      // Send email notification to owner using EmailJS
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: "owner@example.com", // TODO: Replace with actual owner email
            tool_name: tool.name,
            renter_name: currentUser.name,
            renter_email: currentUser.email,
            start_date: startDate,
            end_date: endDate,
            days: days,
            price_per_day: tool.price,
            total_price: totalPrice,
            owner_name: tool.owner,
          },
          EMAILJS_PUBLIC_KEY
        );

        setBookingSubmitted(true);
        alert(`Booking request submitted successfully! Total: $${totalPrice} for ${days} day(s). The owner will be notified via email.`);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Still save the booking even if email fails
        setBookingSubmitted(true);
        alert(`Booking request saved! Total: $${totalPrice} for ${days} day(s). (Note: Email notification failed - you may need to configure EmailJS)`);
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to submit booking. Please try again.");
    }
  };

  // Debug logging
  console.log("Current tool state:", tool);
  console.log("Tool image value:", tool?.image);
  console.log("Tool image type:", typeof tool?.image);

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
              {tool.image && tool.image.trim() !== "" ? (
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                  onError={(e) => {
                    console.error("Image failed to load:", tool.image);
                    e.currentTarget.style.display = "none";
                  }}
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

                {bookingSubmitted ? (
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle me-2"></i>
                    Booking request submitted! The owner will contact you soon.
                  </div>
                ) : !currentUser ? (
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Please <Link to="/login">log in</Link> to request a booking.
                  </div>
                ) : currentUser.id === tool.ownerId ? (
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    This is your own tool. You cannot book your own tools.
                    <br />
                    <Link to="/browse" className="btn btn-outline-primary btn-sm mt-2">
                      Browse Other Tools
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleBooking}>
                    <div className="mb-3 p-3 bg-light rounded">
                      <div className="small text-secondary mb-1">Booking as:</div>
                      <div className="fw-semibold">{currentUser.name}</div>
                      <div className="small text-secondary">{currentUser.email}</div>
                    </div>

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

                    {startDate && endDate && (
                      <div className="alert alert-info mb-3">
                        <strong>Total: ${calculateDays(startDate, endDate) * tool.price}</strong>
                        <br />
                        ({calculateDays(startDate, endDate)} day(s) × ${tool.price}/day)
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100">
                      Request Booking
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description section */}
        <section className="mt-5">
          <h5>Description</h5>
          <p>{tool.description || "No description provided."}</p>
        </section>

        {/* Location Map section */}
        <section className="mt-5">
          <h5>Location</h5>
          <p className="text-muted">
            <i className="bi bi-geo-alt me-2"></i>
            {tool.location}
          </p>
          <div className="border rounded overflow-hidden" style={{ height: "400px" }}>
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${tool.longitude - 0.01},${tool.latitude - 0.01},${tool.longitude + 0.01},${tool.latitude + 0.01}&layer=mapnik&marker=${tool.latitude},${tool.longitude}`}
              allowFullScreen
              title="Tool Location Map"
            ></iframe>
          </div>
          <p className="text-muted small mt-2">
            * This is an approximate location for privacy. Exact address will be shared after booking confirmation.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ToolDetails;
