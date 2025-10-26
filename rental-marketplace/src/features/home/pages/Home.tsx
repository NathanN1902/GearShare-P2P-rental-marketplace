import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import SearchBar from "../../../components/SearchBar";
import ToolCard from "../../../components/ToolCard";
import type { Tool } from "../../../data/types";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const loadTools = async () => {
      try {
        // Load tools from JSON file
        const response = await fetch("/data/tools.json");
        const jsonTools: Tool[] = await response.json();

        // Load tools from localStorage
        const storedTools = localStorage.getItem("tools");
        const localTools: Tool[] = storedTools ? JSON.parse(storedTools) : [];

        // Combine both sources
        const allTools = [...jsonTools, ...localTools];
        setTools(allTools);
      } catch (error) {
        console.error("Error loading tools:", error);
      }
    };

    loadTools();
  }, []);

  // const [tools, setTools] = React.useState([]);

  // React.useEffect(() => {
  //   fetch('/data/tools.json')
  //     .then(res => res.json())
  //     .then(data => setTools(data))
  //     .catch(err => console.error(err));
  // }, []);

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
            Looking to rent something short term? You've come to the right place!
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
            {tools.slice(0, 12).map((tool) => (
              <div className="col-12 col-sm-6 col-lg-4" key={tool.id}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="text-center py-5 bg-light rounded">
          <h3>Ready to rent out your tools?</h3>
          <p className="text-muted">
            It is so easy!
          </p>
          <Link to="/list" className="btn btn-primary">
            List your tool
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;



