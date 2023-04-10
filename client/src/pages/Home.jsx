import React from "react";
import Navbar from "../components/Navbar";
import Files from "../components/Files";

// import Login from "../components/Login";
// import SignUp from "../components/Signup";

const Home = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div style={{ marginTop: "90px" }}>
        <Files />
      </div>
    </div>
  );
};

export default Home;
