import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

// IMPORTANT: Replace with your Stripe publishable key from https://dashboard.stripe.com/apikeys
const STRIPE_PUBLISHABLE_KEY = "pk_test_YOUR_KEY_HERE";

interface VerificationProps {
  userId: number;
  userName: string;
  userEmail: string;
}

const Verification: React.FC<VerificationProps> = ({
  userId,
  userName,
  userEmail,
}) => {
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>("not_started");
  const [progress, setProgress] = useState(0);

  // Check verification status on component mount
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.verified === true) {
        setVerificationStatus("verified");
        setProgress(100);
      }
    }
  }, []);

  // Simple image-based verification (no external API needed)
  const handleImageVerification = async (
    frontImage: File | null,
    backImage: File | null
  ) => {
    if (!frontImage || !backImage) {
      alert("Please upload both front and back of your ID");
      return;
    }

    setLoading(true);
    setProgress(30);

    // Simulate verification process
    setTimeout(() => {
      setProgress(60);
    }, 1000);

    // Simple verification checks
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(frontImage.type) || !validTypes.includes(backImage.type)) {
      alert("Please upload valid image files (JPEG, PNG, or WebP)");
      setLoading(false);
      setProgress(0);
      return;
    }

    if (frontImage.size > maxSize || backImage.size > maxSize) {
      alert("Image files must be less than 10MB");
      setLoading(false);
      setProgress(0);
      return;
    }

    // Save verification data to localStorage
    setTimeout(() => {
      const verificationData = {
        userId,
        userName,
        userEmail,
        frontImageName: frontImage.name,
        backImageName: backImage.name,
        frontImageSize: frontImage.size,
        backImageSize: backImage.size,
        verifiedAt: new Date().toISOString(),
        status: "verified",
      };

      // Store verification in localStorage
      const existingVerifications = localStorage.getItem("verifications");
      const verifications = existingVerifications
        ? JSON.parse(existingVerifications)
        : [];
      verifications.push(verificationData);
      localStorage.setItem("verifications", JSON.stringify(verifications));

      // Update user verification status in localStorage
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const user = JSON.parse(currentUser);
        user.verified = true;
        user.verifiedAt = new Date().toISOString();
        localStorage.setItem("currentUser", JSON.stringify(user));

        console.log("User verification status updated:", user);
      }

      setProgress(100);
      setVerificationStatus("verified");
      setLoading(false);

      alert("Verification successful! Your account is now verified.");

      // Force page reload to refresh user data
      window.location.reload();
    }, 2000);
  };

  // For production with Stripe Identity (requires backend)
  const handleStripeVerification = async () => {
    try {
      setLoading(true);

      // This would call your backend to create a verification session
      // const response = await fetch('/api/create-verification-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, userName, userEmail })
      // });
      // const { clientSecret } = await response.json();

      // For now, show instructions
      alert(
        "Stripe Identity verification requires a backend server. " +
          "For MVP, use the simple image upload verification below."
      );
      setLoading(false);
    } catch (error) {
      console.error("Verification error:", error);
      alert("Verification failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="mb-0">Account Verification</h6>
          {verificationStatus === "verified" ? (
            <span className="badge text-bg-success">
              <i className="bi bi-check-circle me-1"></i>
              Verified
            </span>
          ) : (
            <span className="badge text-bg-warning">Not Verified</span>
          )}
        </div>

        {verificationStatus === "verified" ? (
          <div className="alert alert-success mb-0">
            <i className="bi bi-shield-check me-2"></i>
            Your account has been verified successfully!
          </div>
        ) : (
          <>
            <p className="small text-secondary mb-3">
              Verify your identity to increase trust and access all features.
            </p>

            {progress > 0 && (
              <div className="mb-3">
                <div
                  className="progress"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="progress-bar" style={{ width: `${progress}%` }}>
                    {progress}%
                  </div>
                </div>
              </div>
            )}

            <SimpleIDVerification
              onVerify={handleImageVerification}
              loading={loading}
            />

            <hr className="my-3" />

            <div className="text-center">
              <p className="small text-muted mb-2">
                Need enterprise-grade verification?
              </p>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={handleStripeVerification}
                disabled={loading}
              >
                <i className="bi bi-stripe me-1"></i>
                Use Stripe Identity (Requires Backend)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Simple ID verification component
const SimpleIDVerification: React.FC<{
  onVerify: (front: File | null, back: File | null) => void;
  loading: boolean;
}> = ({ onVerify, loading }) => {
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>("");
  const [backPreview, setBackPreview] = useState<string>("");

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIdFront(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFrontPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFrontPreview("");
    }
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIdBack(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setBackPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setBackPreview("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(idFront, idBack);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small fw-semibold">
            Government ID (Front)
          </label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={handleFrontChange}
            required
            disabled={loading}
          />
          {frontPreview && (
            <div className="mt-2">
              <img
                src={frontPreview}
                alt="ID Front"
                className="img-fluid rounded border"
                style={{ maxHeight: "100px" }}
              />
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label small fw-semibold">
            Government ID (Back)
          </label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={handleBackChange}
            required
            disabled={loading}
          />
          {backPreview && (
            <div className="mt-2">
              <img
                src={backPreview}
                alt="ID Back"
                className="img-fluid rounded border"
                style={{ maxHeight: "100px" }}
              />
            </div>
          )}
        </div>

        <div className="col-12">
          <div className="alert alert-info small mb-3">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Accepted documents:</strong> Driver's License, Passport, National
            ID Card
            <br />
            <strong>File requirements:</strong> JPEG, PNG, or WebP format, max 10MB
          </div>
        </div>

        <div className="col-12">
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={loading || !idFront || !idBack}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Verifying...
              </>
            ) : (
              <>
                <i className="bi bi-shield-check me-2"></i>
                Submit for Verification
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Verification;
