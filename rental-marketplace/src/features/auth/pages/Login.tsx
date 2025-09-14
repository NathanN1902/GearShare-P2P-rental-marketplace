import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <>
      <Header />
      <div className="container my-5" style={{ maxWidth: 520 }}>
        <div className="bg-white border rounded-3 p-4">
          <h4 className="mb-3">Log in</h4>
          <form
            className="row g-3"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Dummy login — integrate with your backend later.");
            }}
          >
            <div className="col-12">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" required />
            </div>
            <div className="col-12">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" required />
            </div>
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div className="form-check">
                <input id="remember" type="checkbox" className="form-check-input" />
                <label htmlFor="remember" className="form-check-label">Remember me</label>
              </div>
              <a href="#" className="small">Forgot password?</a>
            </div>
            <div className="col-12">
              <button className="btn btn-primary w-100" type="submit">Log in</button>
            </div>
            <div className="col-12 text-center">
              <span className="small text-secondary">No account?</span>{" "}
              <Link to="/user" className="small">Go to user page (placeholder)</Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
