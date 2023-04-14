import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import SingleFile from "./components/SingleFile";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Cookies from "js-cookie";
import { Routes, Route, useNavigate } from "react-router-dom";
import Pay from "./components/Pay";
import Navbar from "./components/Navbar";
import MyOrders from "./components/MyOrders";
import CreateFile from "./components/CreateFile";
import EditFile from "./components/EditFile";
import Admin from "./components/Admin";
import NotFound from "./components/NotFound";

const CheckAdmin = (children) => {
  const navigate = useNavigate();

  useEffect(() => {
    let user = localStorage.getItem("user");

    user = JSON.parse(user);

    if (user) {
      if (user.role != "admin") {
        return navigate("/");
      }
    } else {
      return navigate("/");
    }
  }, []);

  return children.children;
};
const CheckLogin = (children) => {
  const navigate = useNavigate();

  useEffect(() => {
    let user = localStorage.getItem("user");

    if (!user) {
      return navigate("/");
    }
  }, []);

  return children.children;
};
export const CartContext = React.createContext({});
export const AuthContext = React.createContext({});
function App() {
  const [cart, setCart] = useState([]);
  const [title, setTitle] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  function addTocart(file) {
    setCart([...new Set([...cart, file])]);
  }
  function addTitle(text) {
    setTitle(text);
  }

  function logout() {
    setUser(null);
    localStorage.clear();
    navigate("/");
  }

  function loginScuccess(token) {
    localStorage.setItem("user", JSON.stringify(token));
    // let user = localStorage.getItem("user");
    setUser(token);
  }

  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: Boolean(user), logout, loginScuccess }}
    >
      <CartContext.Provider
        value={{
          cart,
          addTocart,
          title,
          addTitle,
        }}
      >
        <div style={{ marginTop: "80px" }}>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/files/:id" element={<SingleFile />} />
            <Route
              path="/order/file/:id"
              element={
                <CheckLogin>
                  <Pay />{" "}
                </CheckLogin>
              }
            />
            <Route
              path="/orders"
              element={
                <CheckLogin>
                  {" "}
                  <MyOrders />
                </CheckLogin>
              }
            />

            <Route
              path="/create"
              element={
                <CheckAdmin>
                  <CreateFile />
                </CheckAdmin>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <CheckAdmin>
                  <EditFile />
                </CheckAdmin>
              }
            />
            <Route
              path="/admin"
              element={
                <CheckAdmin>
                  <Admin />
                </CheckAdmin>
              }
            />
          </Routes>
        </div>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
