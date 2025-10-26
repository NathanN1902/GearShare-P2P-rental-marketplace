import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-top py-4 mt-5">
      <div className="container d-flex flex-wrap justify-content-between small text-secondary">
        <div>&copy; {new Date().getFullYear()} GearShare</div>
        <div className="d-flex gap-3">
          <a className="link-secondary text-decoration-none" href="#">Terms</a>
          <a className="link-secondary text-decoration-none" href="#">Privacy</a>
          <a className="link-secondary text-decoration-none" href="#">Help</a>
        </div>
      </div>
    </footer>
  );
}

