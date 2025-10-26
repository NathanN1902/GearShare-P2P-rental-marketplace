import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import SearchBar from "../../../components/SearchBar";
import ToolCard from "../../../components/ToolCard";
import type { Tool, User } from "../../../data/types";

// Calculate distance between two coordinates using Haversine formula (in km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const loadTools = async () => {
      try {
        // Load current user for distance calculation
        const userJson = localStorage.getItem("currentUser");
        let user: User | null = null;
        if (userJson) {
          user = JSON.parse(userJson);
          setCurrentUser(user);
        }

        // Load tools from JSON file
        const response = await fetch("/data/tools.json");
        const jsonTools: Tool[] = await response.json();

        // Load tools from localStorage
        const storedTools = localStorage.getItem("tools");
        const localTools: Tool[] = storedTools ? JSON.parse(storedTools) : [];

        // Combine both sources
        let allTools = [...jsonTools, ...localTools];

        // Sort by distance if user is logged in
        if (user) {
          allTools.sort((a, b) => {
            const distA = calculateDistance(user.latitude, user.longitude, a.latitude, a.longitude);
            const distB = calculateDistance(user.latitude, user.longitude, b.latitude, b.longitude);
            return distA - distB;
          });
        }

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
          <div className="mb-3">
            <h2 className="h4 mb-0">Nearby Tools</h2>
          </div>

          <div className="row g-3 mb-4">
            {tools.slice(0, 12).map((tool) => (
              <div className="col-12 col-sm-6 col-lg-4" key={tool.id}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/browse" className="btn btn-primary btn-lg px-5">
              See all tools available
            </Link>
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



