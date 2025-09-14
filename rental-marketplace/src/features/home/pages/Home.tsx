import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <main className="container my-5">
        <h1>Home Page</h1>
        <p>This is the placeholder for the homepage.</p>
      </main>
      <Footer />
    </>
  );
};

export default Home;


