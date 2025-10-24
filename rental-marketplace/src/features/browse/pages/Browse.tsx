import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ToolCard from "../../../components/ToolCard";
import { TOOLS } from "../../../data/fixtures";

const Browse: React.FC = () => {
  return (
    <>
      <Header />

      <main className="container my-5">
        {/* Page heading */}
        <section className="mb-4 text-center">
          <h1 className="mb-3">Browse Tools</h1>
          <p className="text-muted">
            Explore all available tools.
          </p>
        </section>

        {/* Tool grid */}
        <section>
          <div className="row g-3">
            {TOOLS.map((tool) => (
              <div className="col-12 col-sm-6 col-lg-4" key={tool.id}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Browse;


