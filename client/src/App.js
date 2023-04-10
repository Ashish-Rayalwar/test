import React, { useState } from "react";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import SingleFile from "./components/SingleFile";
import Cart from "./pages/Cart";
import Home from "./pages/Home";

import { Routes, Route } from "react-router-dom";
import Pay from "./components/Pay";
// import Navbar from "./components/Navbar";

// import "./App.css";
export const CartContext = React.createContext({});
function App() {
  const [cart, setCart] = useState([]);
  const [title, setTitle] = useState("");
  function addTocart(file) {
    setCart([...new Set([...cart, file])]);
  }
  function addTitle(text) {
    setTitle(text);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addTocart,
        title,
        addTitle,
      }}
    >
      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/files/:id" element={<SingleFile />} />
          <Route path="/order" element={<Pay />} />
        </Routes>
      </div>
    </CartContext.Provider>
  );
}

export default App;
