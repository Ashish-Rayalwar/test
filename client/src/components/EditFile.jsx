import styled from "@emotion/styled";
import { Box, Button, TextField, Typography } from "@mui/material";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
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

// const isAdmin = checkAdmin();
// if (isAdmin == false) {
//   navigate("/");
// }
function EditFile() {
  const params = useParams();
  const navigate = useNavigate();
  let fileData = localStorage.getItem("file");
  let fileId = params.id;
  console.log(fileId);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [singleFile, setSingleFileData] = useState({});

  useEffect(() => {
    fileApi
      .get(`/files/${params.id}`)
      .then((responce) => {
        console.log(responce.data.data);
        setSingleFileData(responce.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params.id]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const onChangeHandle = (e) => {
    setSingleFileData({ ...singleFile, [e.target.name]: e.target.value });
  };

  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    formData.append("filePath", file);
    formData.append("imgPath", image);

    console.log(formData);

    setError("");
    fileApi
      .put(`/files/${params.id}`, formData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data.data);
        window.alert("file updated successfully");
        // window.alert(response.data.message);
      })
      .catch((error) => {
        setError(error.response.data.message);
        console.log(error.response.data.message);
      });
  }

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
            value={singleFile.title}
            autoComplete="false"
            required
            type="text"
            name="title"
            id="standard-basic"
            // label="Enter File Name"
            variant="standard"
            onChange={onChangeHandle}
          />
          <TextField
            value={singleFile.description}
            autoComplete="false"
            required
            type="text"
            name="description"
            id="standard-basic"
            // label="Enter File Description"
            variant="standard"
            onChange={onChangeHandle}
          />
          <TextField
            value={singleFile.fileSize}
            autoComplete="false"
            required
            type="text"
            name="fileSize"
            id="standard-basic"
            // label="Enter File size / mb"
            variant="standard"
            onChange={onChangeHandle}
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
            value={singleFile.prize}
            autoComplete="false"
            required
            type="number"
            name="prize"
            id="standard-basic"
            // label="Enter price"
            variant="standard"
            onChange={onChangeHandle}
          />
          <LoginButton type="submit" variant="contained">
            Update
          </LoginButton>
        </Wrapper>
      </Box>
      {error && <h1 style={{ color: "red" }}>{error}</h1>}
    </Container>
  );
}

export default EditFile;
