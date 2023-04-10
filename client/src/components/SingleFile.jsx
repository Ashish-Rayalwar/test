import { useParams, Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { Box, Button, Typography } from "@mui/material";

import Files from "./Files";
import Navbar from "./Navbar";

import { CartContext } from "../App";

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: self-start;
`;

const Title = styled("h2")({
  fontFamily: "sans-serif",
  margin: "20px 20px",
});

const Image = styled("img")({
  width: "800px",
  Height: "auto",
  margin: "20px 20px",
  boxShadow:
    "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
});

const Details = styled(Typography)`
  width: 600px;
  height: 300px;
  margin: 20px 20px;
`;

const ButtonContainer = styled(Box)`
  display: flex;

  justify-content: space-around;
`;
const AddToCart = styled(Button)`
  margin: 20px 20px;
  text-transform: none;
  background: gray;
  :hover {
    background: #eed512;
    color: black;
  }
`;
const SingleFile = () => {
  const params = useParams();
  const { addTocart } = useContext(CartContext);

  let url = `http://localhost:5000/api/files/${params.id}`;

  //   if (title) {
  //     url = `http://localhost:5000/api/files?title=${title}`;
  //   }

  const [file, setFile] = useState({});
  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        console.log(response.data.data);
        setFile(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params.id, url]);

  let navigate = useNavigate();
  let orderUrl = `http://localhost:5000/order/file/${params.id}`;

  const [order, setOrder] = useState({});
  const setFileLocal = () => {
    localStorage.setItem("file", JSON.stringify(file, null, 2));
    axios
      .post(orderUrl, null, { withCredentials: true })
      .then((response) => {
        console.log(response.data.data);
        setOrder(response.data.data);
        localStorage.setItem(
          "order",
          JSON.stringify(response.data.data, null, 2)
        );
        navigate(`/order`);
      })
      .catch((error) => {
        // window.alert(error.response.data.message);
        if (error.response.data.message === "You are not loggedIn") {
          navigate("/login");
        }
        console.log(error.response.data.message);
      });
  };

  return (
    <Container>
      <Navbar />
      <Title>{file.title}</Title>

      <br />
      <Image src={file.imgPath} />
      <br />

      <Title>{file.title} 3D Model Free Download high quality design.</Title>

      <Details>Details :- {file.description}</Details>
      <br />
      <br />

      <Title>File Size :- {file.fileSize}mb</Title>
      <br />

      <Title>Cost :- ₹{file.prize}/-</Title>
      <br />

      <ButtonContainer>
        <AddToCart onClick={() => addTocart(file)} variant="contained">
          AddToCart
        </AddToCart>

        <AddToCart onClick={setFileLocal} variant="contained">
          BuyNow
        </AddToCart>
      </ButtonContainer>
      <br />

      <Title>More Files</Title>
      <br />
      <button>
        <Files />
      </button>

      <br />
    </Container>
  );
};

export default SingleFile;
