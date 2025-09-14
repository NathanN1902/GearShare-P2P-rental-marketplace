import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const User: React.FC = () => {
  return (
    <>
      <Header />
      <main className="container my-5">
        <h1>User Page</h1>
        <p>This is the placeholder for the user page.</p>
      </main>
      <Footer />
    </>
  );
};

export default User;
