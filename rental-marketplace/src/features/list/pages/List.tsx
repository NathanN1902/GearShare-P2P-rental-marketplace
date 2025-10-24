import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ToolCard from "../../../components/ToolCard";
import { TOOLS } from "../../../data/fixtures";

const List: React.FC = () => {
  return (
    <>
      <Header />

      <main className="container my-5">
        {/* Page heading */}
        <section className="mb-4 text-center">
          <h1 className="mb-3">LIST  Tools</h1>
          <p className="text-muted">
            Add your tools to the marketplace.
          </p>
        </section>

        {/*  creating a listing  */}
        <section >   
          {/* left side column */}
          <div className="d-flex flex-column flex-lg-row gap-4"> 
            <form className="flex-fill p-4 border rounded bg-light">  
              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter item title"
                />  
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter item description"
                />  
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Price</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder="Enter item price per day"
                />  
              </div>              <div className="mb-3">
                <label className="form-label fw-semibold">Location</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter suburb or postcode"
                />  
              </div>
                <label className="form-label">Picture</label>
                <div className="input-group">
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*,application/pdf"
                  
                    />
                  <button className="btn btn-outline-secondary" type="button" >
                   Clear
                  </button>
                </div>

            </form>


            {/* Right side column */}
            <div className="flex-fill d-flex flex-column align-items-center p-4 border rounded bg-light "> 
              
              <p className="text-muted mb-3">Image Preview</p>
              <img id="previewImage" src="https://via.placeholder.com/300x200?text=No+Image" 
                  alt="No Image Preview"
                  className="img-fluid rounded border" 
                  />




            </div>
 
          </div>



        </section>




        {/* Tool grid */}
        {/* <section>
          <div className="row g-3">
            {TOOLS.map((tool) => (
              <div className="col-12 col-sm-6 col-lg-4" key={tool.id}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </section> */}
      </main>

      <Footer />
    </>
  );
};

export default List;


