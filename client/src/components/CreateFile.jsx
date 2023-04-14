import styled from "@emotion/styled";
import { Box, Button, TextField, Typography } from "@mui/material";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fileApi } from "../api/api";
// import { checkAdmin } from "./Navbar";

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
  padding: "50px 0 0",
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

const LoginButton = styled(Button)`
  text-transform: none;
  background: gray;
  :hover {
    background: #eed512;
    color: black;
  }
`;

function CreateFile() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    // let formData = new FormData();
    formData.append("filePath", file);
    formData.append("imgPath", image);
    // formData.append("imgPath", image);
    // const FileData = Object.fromEntries(formData);
    console.log(formData);
    // console.log(FileData);
    setError("");
    fileApi
      .post("/files", formData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data.data);
        window.alert("file created successfully");

        // window.alert(response.data.message);
      })
      .catch((error) => {
        setError(error.response.data.message);
        console.log(error.response.data.message);
      });
  }

  //   let isAdmin = checkAdmin();
  return (
    <Container>
      <Box marginTop={{ marginTop: "70px" }}>
        <Wrapper onSubmit={handleSubmit}>
          <Link to="/">
            {" "}
            <Image
              style={{ marginTop: "-40px" }}
              src={LogoImg}
              alt="Logo"
              srcset=""
            />{" "}
          </Link>
          <TextField
            autoComplete="false"
            required
            type="text"
            name="title"
            id="standard-basic"
            label="Enter File Name"
            variant="standard"
          />
          <TextField
            autoComplete="false"
            required
            type="text"
            name="description"
            id="standard-basic"
            label="Enter File Description"
            variant="standard"
          />
          <TextField
            autoComplete="false"
            required
            type="text"
            name="fileSize"
            id="standard-basic"
            label="Enter File size / mb"
            variant="standard"
          />
          <TextField
            autoComplete="false"
            required
            type="file"
            name="filePath"
            id="standard-basic"
            label="Select File"
            variant="standard"
            onChange={handleFileChange}
          />
          <TextField
            autoComplete="false"
            required
            type="file"
            name="imgPath"
            id="standard-basic"
            label="Select Image"
            variant="standard"
            onChange={handleImageChange}
          />
          <TextField
            autoComplete="false"
            required
            type="number"
            name="prize"
            id="standard-basic"
            label="Enter price"
            variant="standard"
          />
          <LoginButton type="submit" variant="contained">
            Create
          </LoginButton>
        </Wrapper>
      </Box>
      {error && <h1 style={{ color: "red" }}>{error}</h1>}
    </Container>
  );
}

export default CreateFile;
