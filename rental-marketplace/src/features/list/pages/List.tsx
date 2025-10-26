import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ToolCard from "../../../components/ToolCard";
import { Tool, User } from "../../../data/types";

const List: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    price: string;
    category: string;
    image: string | null;
  }>({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    // Check if user is logged in
    const userJson = localStorage.getItem("currentUser");
    if (!userJson) {
      // Redirect to login if not logged in
      alert("Please log in to list a tool");
      navigate("/login");
      return;
    }
    setCurrentUser(JSON.parse(userJson));
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm({ ...form, image: reader.result as string})
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please log in to list a tool");
      navigate("/login");
      return;
    }

    // Create new tool with proper structure
    const newTool: Tool = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      rate: "per day",
      category: form.category,
      image: form.image || "",
      owner: currentUser.name,
      ownerId: currentUser.id,
    };

    // Load existing tools from localStorage
    const storedTools = localStorage.getItem("tools");
    const existingTools: Tool[] = storedTools ? JSON.parse(storedTools) : [];

    // Add new tool and save back to localStorage
    const updatedTools = [...existingTools, newTool];
    localStorage.setItem("tools", JSON.stringify(updatedTools));

    // Update user's listing count
    const updatedUser = {
      ...currentUser,
      totalListings: currentUser.totalListings + 1,
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    console.log("New Tool Listed:", newTool);
    alert(`Tool "${form.name}" listed successfully!`);

    // Navigate to browse page to see the new listing
    navigate("/browse");
  };




  return (
    <>
      <Header />

      <main className="container my-5">
        {/* Page heading */}
        <section className="mb-4 text-center">
          <h1 className="mb-3">List Your Tool</h1>
          <p className="text-muted">
            Add your tools to the marketplace.
          </p>
        </section>

        {/*  creating a listing  */}
        <section >   
          {/* left side column */}
          <div className="d-flex flex-column flex-lg-row gap-4"> 
            <form className="flex-fill p-4 border rounded bg-light"
              onSubmit={handleSubmit}
            >  
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter tool name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <input
                  className="form-control"
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter tool description"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Price</label>
                <input
                  className="form-control"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price per day"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Category</label>
                <input
                  className="form-control"
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g., Power Tools, Garden Tools"
                />
              </div>
              

                <label className="form-label">Picture</label>
                <div className="input-group">
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleImageChange}
                  />
                  <button 
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setForm({ ...form, image: null })}
                    >
                      Clear
                  </button>
                </div>

                <button className="btn btn-primary mt-3" type="submit">
                  Submit
                </button>
            </form>


            {/* Right side column */}
            <div className="flex-fill d-flex flex-column align-items-center p-4 border rounded bg-light "> 
              
              <p className="text-muted mb-3">Image Preview</p>

              <div
                className="border rounded d-flex align-items-center justify-content-center bg-light"
                style={{
                  width: "400px",
                  height: "300px",
                  overflow: "hidden",
                }}
              >
                <img
                  id="previewImage"
                  src={
                    form.image ||
                    "https://via.placeholder.com/400x300?text=No+Image+Selected"
                  }
                  alt="Preview"
                  className="img-fluid rounded border"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", 
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};
export default List;
