import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ToolCard from "../../../components/ToolCard";
import { fetchTools } from "../api";
import type { Tool } from "../../../data/types";

const Browse: React.FC = () => {
  const [tools, setTools] = React.useState<Tool[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchTools();
        if (alive) setTools(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Header />
      <main className="container my-5">
        <section className="mb-4 text-center">
          <h1 className="mb-3">Browse Tools</h1>
          <p className="text-muted">Explore all available tools for rent in your area.</p>
        </section>

        {loading ? (
          <div className="text-center text-secondary">Loading…</div>
        ) : (
          <div className="row g-3">
            {tools.map((tool) => (
              <div className="col-12 col-sm-6 col-lg-4" key={tool.id}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Browse;




