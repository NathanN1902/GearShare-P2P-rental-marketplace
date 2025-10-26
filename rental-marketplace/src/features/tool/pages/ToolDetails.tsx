import React, { useMemo, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ToolCard from "../../../components/ToolCard";
import { TOOLS } from "../../../data/fixtures";
import emailjs from "@emailjs/browser";


// Dummy data, logic to be implemented later

type ToolPhoto = { id: string; url: string; alt: string };

const dummyPhotos: ToolPhoto[] = [
  { id: "1", url: "", alt: "Tool photo 1" },
  { id: "2", url: "", alt: "Tool photo 2" },
  { id: "3", url: "", alt: "Tool photo 3" },
  { id: "4", url: "", alt: "Tool photo 4" },
];

const mockTool = {
  id: "1",
  title: "Hammer Drill Kit",
  subtitle: "Hammer Drill Kit",
  location: "Sydney, NSW",
  priceDay: 25,
  rating: 4.8,
  reviewsCount: 16,
  photos: dummyPhotos,
  description:
    "Powerful hammer drill kit. Placeholder description for the tool use.",
  specs: [
    { label: "Spec 1", value: "100" },
    { label: "Spec 2", value: "200" },
    { label: "Spec 3", value: "300" },
    { label: "Spec 4", value: "400" },
  ],
  features: [
    "Loren impsum dolor sit amet",
    "Loren impsum dolor sit amet",
    "Loren impsum dolor sit amet",
    "Loren impsum dolor sit amet",
  ],
  host: {
    name: "Nathan Nguyen",
    city: "Sydney, NSW",
    memberSince: "2023",
    verified: true,
  },
};

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_p0d535w";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_yhzo20s";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "w0oJ4GnkMzxRRUwt6";

const ToolDetails: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  // Logic for related tool to be implemented later
  const related = useMemo(() => TOOLS.slice(0, 4), []);

  function sendEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      .then(() => {
        alert("Booking request sent. Check your email.");
        form.reset();
      })
      .catch((err) => {
        console.error("EmailJS error", err);
        alert("Failed to send booking email.");
      });
  }

  return (
    <>
      <Header />

      <main className="container my-4">
        {/* Title / meta row */}
        <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
          <div>
            <h2 className="mb-1">{mockTool.title}</h2>
            <div className="text-secondary small">
              <i className="bi bi-geo-alt me-1" />
              {mockTool.location} •{" "}
              <i className="bi bi-star-fill me-1 text-warning" />
              {mockTool.rating} ({mockTool.reviewsCount} reviews)
            </div>
          </div>
          <div className="ms-auto d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-heart" /> Save
            </button>
            <button className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-share" /> Share
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* Left: gallery + content */}
          <div className="col-lg-8">
            {/* Gallery */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                {/* Main image (carousel style without images; using placeholders) */}
                <div className="ratio ratio-16x9 bg-light rounded position-relative">
                  {/* Prev/Next controls (fake) */}
                  <button
                    className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-2"
                    aria-label="Previous"
                    onClick={() =>
                      setActiveIdx((i) => (i - 1 + mockTool.photos.length) % mockTool.photos.length)
                    }
                  >
                    <i className="bi bi-chevron-left" />
                  </button>
                  <button
                    className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-2"
                    aria-label="Next"
                    onClick={() =>
                      setActiveIdx((i) => (i + 1) % mockTool.photos.length)
                    }
                  >
                    <i className="bi bi-chevron-right" />
                  </button>

                  {/* Placeholder for photo of tool */}
                  <div className="d-flex align-items-center justify-content-center h-100 w-100 text-secondary">
                    <div>
                      <div className="text-center fw-semibold mb-1">
                        Photo {activeIdx + 1} / {mockTool.photos.length}
                      </div>
                      <div className="small text-center">
                        (Placeholder image area)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="d-flex gap-2 mt-3">
                  {mockTool.photos.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`border rounded ratio ratio-1x1 bg-light ${i === activeIdx ? "border-primary" : ""}`}
                      style={{ width: 72 }}
                      onClick={() => setActiveIdx(i)}
                      aria-label={`Show photo ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="mt-4">
              <h5 className="mb-2">About this tool</h5>
              <p className="text-secondary">{mockTool.subtitle}</p>
              <p>{mockTool.description}</p>
            </section>

            {/* Specs */}
            <section className="mt-4">
              <h5 className="mb-3">Specifications</h5>
              <div className="row g-3">
                {mockTool.specs.map((s) => (
                  <div className="col-6 col-md-4" key={s.label}>
                    <div className="bg-white border rounded p-3 h-100">
                      <div className="text-secondary small">{s.label}</div>
                      <div className="fw-semibold">{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Features */}
            <section className="mt-4">
              <h5 className="mb-3">Features</h5>
              <ul className="list-unstyled">
                {mockTool.features.map((f) => (
                  <li className="d-flex align-items-start gap-2 mb-2" key={f}>
                    <i className="bi bi-check2-circle text-success mt-1" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Host */}
            <section className="mt-4">
              <h5 className="mb-3">Hosted by {mockTool.host.name}</h5>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-light" style={{ width: 56, height: 56 }} />
                <div>
                  <div className="fw-semibold">{mockTool.host.name}</div>
                  <div className="small text-secondary">
                    {mockTool.host.city} • Member since {mockTool.host.memberSince}{" "}
                    {mockTool.host.verified && (
                      <span className="ms-1 badge text-bg-success align-middle">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-outline-secondary">Contact Host</button>
                <button className="btn btn-outline-secondary">View Profile</button>
              </div>
            </section>

            {/* Reviews */}
            <section className="mt-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Reviews</h5>
                <div className="small text-secondary">
                  <i className="bi bi-star-fill text-warning me-1" />
                  {mockTool.rating} • {mockTool.reviewsCount} reviews
                </div>
              </div>

              {[1, 2, 3].map((i) => (
                <div className="card border-0 shadow-sm mb-3" key={i}>
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="rounded-circle bg-light" style={{ width: 36, height: 36 }} />
                      <div className="small">
                        <div className="fw-semibold">Reviewer #{i}</div>
                        <div className="text-secondary">March 2025</div>
                      </div>
                    </div>
                    <div className="small text-secondary mb-2">
                      <i className="bi bi-star-fill text-warning" />
                      <i className="bi bi-star-fill text-warning" />
                      <i className="bi bi-star-fill text-warning" />
                      <i className="bi bi-star-fill text-warning" />
                      <i className="bi bi-star text-warning" />
                    </div>
                    <p className="mb-0">
                      Review 1: Lorem ipsum dolor sit amet.
                    </p>
                    <div className="mt-2">
                      <button className="btn btn-sm btn-outline-secondary">Helpful</button>
                    </div>
                  </div>
                </div>
              ))}

              <button className="btn btn-light w-100">Show All Reviews</button>
            </section>

            {/* Related */}
            <section className="mt-5">
              <h5 className="mb-3">You might also like</h5>
              <div className="row g-3">
                {related.map((t) => (
                  <div className="col-12 col-sm-6" key={t.id}>
                    <ToolCard tool={t} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: booking card */}
          <aside className="col-lg-4">
            <form onSubmit={sendEmail}>
              <div className="bg-white border rounded-3 p-3 position-sticky" style={{ top: 16 }}>
                <div className="d-flex align-items-baseline justify-content-between">
                  <div className="fs-4 fw-semibold">${mockTool.priceDay}</div>
                  <div className="small text-secondary">per day</div>
                </div>

                <div className="row g-2 mt-3">
                  <div className="col-6">
                    <label className="form-label small">Start</label>
                    <input name="start_date" type="date" className="form-control" />
                  </div>
                  <div className="col-6">
                    <label className="form-label small">End</label>
                    <input name="end_date" type="date" className="form-control" />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="form-label small">Your name</label>
                  <input name="renter_name" className="form-control" placeholder="Your full name" />
                </div>

                <div className="mt-2">
                  <label className="form-label small">Your email</label>
                  <input name="renter_email" className="form-control" placeholder="you@example.com" type="email" />
                </div>

                <div className="mt-2">
                  <label className="form-label small">Message to host (optional)</label>
                  <textarea name="message" className="form-control" rows={2} placeholder="Hi! I'm interested in renting…" />
                </div>

                {/* hidden fields passed to template */}
                <input type="hidden" name="tool_title" value={mockTool.title} />
                <input type="hidden" name="host_name" value={mockTool.host.name} />
                {/* add host_email if available in mockTool.host.email */}
                <input type="hidden" name="host_email" value={(mockTool.host as any).email || ""} />

                <button type="submit" className="btn btn-dark w-100 mt-3">Book Instantly</button>
                <button type="button" className="btn btn-outline-secondary w-100 mt-2">Message Host</button>

                <hr className="my-3" />
                <div className="small text-secondary">
                  Free cancellation within 24 hours of booking request.
                </div>
              </div>
            </form>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ToolDetails;



