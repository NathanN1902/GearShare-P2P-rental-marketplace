import React from "react";
import { useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ToolCard from "../../../components/ToolCard";
import { TOOLS } from "../../../data/fixtures";
import { Tool } from "../../../data/types";

const List: React.FC = () => {
  const [form, setForm] = useState<{
    title: string;
    description: string;
    price: string;
    location: string;
    image: string | null;
  }>({
    title: "",
    description: "",
    price: "",
    location: "",
    image: null,
  });

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
    // Submit form logic here
    const newTool: Tool ={
      id: Date.now().toString(),
      title: form.title,
      subtitle: form.description,
      location: form.location,
      priceDay: parseFloat(form.price),
    };

    console.log("New Tool Listed:", newTool);
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
                <label className="form-label fw-semibold">Title</label>
                <input
                  className="form-control"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter item title"
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
                  placeholder="Enter item description"
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
                  placeholder="Enter item price per day"
                />  
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Location</label>
                <input
                  className="form-control"
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter suburb or postcode"
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
