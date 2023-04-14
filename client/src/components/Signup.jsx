import React, { useState } from "react";
import "./login.css";
import { Box, TextField, Button, styled, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { userApi } from "../api/api";

const LogoImg = require("../images/logo.png");
const Container = styled(Box)`
  box-shadow: rgba(136, 165, 191, 0.48) 6px 2px 16px 0px,
    rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;
  width: 400px;
  height: auto;
  margin: auto;
  background-color: #f5f5f5;
`;

const Image = styled("img")({
  cursor: "pointer",
  width: 200,
  margin: "auto",
  display: "flex",
  padding: "40px 0 0",
});

const Wrapper = styled("form")({
  padding: "25px 35px",
  display: "flex",
  backgroundColor: "transparent",
  flex: 1,
  flexDirection: "column",
  "& > div, & > button, & > p": {
    marginTop: "20px",
  },
});

const SignupButton = styled(Button)`
  text-transform: none;
  background: gray;
  :hover {
    background: #eed512;
    color: black;
  }
`;

const LoginButton = styled(Button)`
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  text-transform: none;
  background: #ececec;
  color: black;
  :hover {
    background: #eed512;
    color: black;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  }
`;

const SignUp = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    const userCredentials = Object.fromEntries(formData);
    console.log(formData);
    setError("");
    userApi
      .post("/signup", userCredentials)
      .then((response) => {
        console.log(response.data.data);
        window.alert(response.data.message);
        navigate("/login");
      })
      .catch((error) => {
        setError(error.response.data.message);
        console.log(error.response.data.message);
      });
  }

  return (
    <Container>
      <Box marginTop={{ marginTop: "55px" }}>
        <Wrapper onSubmit={handleSubmit}>
          <Link to="/">
            <Image src={LogoImg} alt="Logo" srcset="" />
          </Link>
          <TextField
            id="standard-basic"
            label="Enter name"
            variant="standard"
            required
            name="name"
            type="text"
          />
          <TextField
            id="standard-basic"
            label="Enter email"
            variant="standard"
            required
            name="email"
            type="email"
          />
          <TextField
            id="standard-basic"
            label="Enter password"
            variant="standard"
            required
            name="password"
            type="password"
          />
          <SignupButton type="submit" variant="contained">
            SignUp
          </SignupButton>
          <Typography style={{ textAlign: "center", color: "gray" }}>
            OR
          </Typography>
          <LoginButton>
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontWeight: "bold",
              }}
              to="/login"
            >
              LogIn
            </Link>
          </LoginButton>
        </Wrapper>
      </Box>
      {error && <h1 style={{ color: "red" }}>{error}</h1>}
    </Container>
  );
};

export default SignUp;
