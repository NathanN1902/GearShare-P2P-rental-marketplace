import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import SearchBar from "../../../components/SearchBar";
import ToolCard from "../../../components/ToolCard";
import { TOOLS } from "../../../data/fixtures";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    // Navigate to browse page with search query
    navigate(`/browse?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <Header />

      <main className="container my-5">
        {/* Hero section */}
        <section className="text-center mb-5">
          <h1 className="mb-3">Welcome to GearShare</h1>
          <p className="lead text-muted">
            PLACEHOLDER SLOGAN
          </p>

          <div className="d-flex justify-content-center mt-4">
            <div className="w-75 w-md-50">
              <SearchBar placeholder="Search tools..." onSearch={handleSearch} />
            </div>
          </div>
        </section>

        {/* Nearby tools */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0">Nearby Tools</h2>
            <Link to="/browse" className="btn btn-outline-primary btn-sm">
              See All
            </Link>
          </div>

          <div className="row g-3">
            {TOOLS.slice(0, 6).map((tool) => (
              <div className="col-12 col-sm-6 col-lg-4" key={tool.id}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="text-center py-5 bg-light rounded">
          <h3>PLACEHOLDER CTA?</h3>
          <p className="text-muted">
            List your tool
          </p>
          <Link to="/user" className="btn btn-primary">
            List your tool
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;



