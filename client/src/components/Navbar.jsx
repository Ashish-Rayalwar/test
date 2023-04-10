import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { AppBar, Badge } from "@mui/material";
import { Refresh, ShoppingCartOutlined } from "@mui/icons-material";
import React, { useContext } from "react";
import { CartContext } from "../App";

const logo = require("../images/logo.png");
const Container = styled(AppBar)`
  height: 60px;
  background-color: #f5f5f5;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  top: 0;
  left: 0;
  width: 100%;
  position: fixed;
`;

const Wrapper = styled.div`
  padding: 8px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Language = styled.div`
  font-size: 17px;
  cursor: pointer;
  color: #7d8182;
`;
const SearchContainer = styled.div`
  /* border: 2px solid rgb(0,109,50); */
  color: #7d8182;
  border: 1px solid black;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px;
`;

const Input = styled.input`
  color: #7d8182;
  border: none;
  outline: none;
  background: none;
  width: 200px;
  font-size: large;
  height: 30px;
`;
const Center = styled.div`
  text-align: center;
  flex: 1;
`;

const Logo = styled.div`
  cursor: pointer;
  /* width: 70px; */
  /* margin-left: 20px; */
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const MenuItem = styled.div`
  margin-left: 50px;
  font-size: 14px;
  cursor: pointer;
`;
const Head3 = styled.h2`
  margin-top: 5px;
  color: #7d8182;
  font-size: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

const Navbar = () => {
  const { cart, title, addTitle } = useContext(CartContext);
  let map = new Map();
  for (let i = 0; i < cart.length; i++) {
    if (!map.has(cart[i]._id)) {
      map.set(cart[i]._id);
    }
  }
  let size = map.size;

  return (
    <Container>
      <Wrapper>
        <Left>
          <Language>
            <h3>Search</h3>
          </Language>
          <SearchContainer>
            <Input onChange={(e) => addTitle(e.target.value)} />
            <SearchIcon />
          </SearchContainer>
        </Left>

        <Center>
          <Logo>
            <Link to="/">
              <img style={{ width: "110px" }} src={logo} alt="logo" srcset="" />
            </Link>
          </Logo>
        </Center>
        <Right>
          <MenuItem>
            <Head3>
              <Link
                style={{
                  textDecoration: "none",
                  color: "gray",
                }}
                to="/signup"
              >
                SignUp
              </Link>
            </Head3>
          </MenuItem>
          <MenuItem>
            <Head3>
              <Link
                style={{
                  textDecoration: "none",
                  color: "gray",
                }}
                to="/login"
              >
                LogIn
              </Link>
            </Head3>
          </MenuItem>
          <MenuItem>
            <Badge badgeContent={size} color="secondary">
              <Link to="/cart" style={{ textDecoration: "none" }}>
                <ShoppingCartOutlined style={{ color: "gray" }} />{" "}
              </Link>
            </Badge>
          </MenuItem>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
