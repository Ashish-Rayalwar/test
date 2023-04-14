import { useParams, Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { Box, Button, Typography } from "@mui/material";

import Files from "./Files";
import Navbar, { checkAdmin } from "./Navbar";

import { AuthContext, CartContext } from "../App";
import EditFile from "./EditFile";
import { fileApi, orderApi } from "../api/api";

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
  // border: 1px solid black;
  width: 300px;
  height: auto;
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
  // const {user} = useContext(AuthContext)
  // let url = `http://localhost:5000/api/files/${params.id}`;

  const [file, setFile] = useState({});
  const [order, setOrder] = useState({});
  var isAdmin = checkAdmin();
  useEffect(() => {
    fileApi
      .get(`/files/${params.id}`)
      .then((response) => {
        console.log(response.data.data);
        setFile(response.data.data);
        localStorage.setItem("file", JSON.stringify(response.data.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params.id]);

  let navigate = useNavigate();

  // let orderUrl = `http://localhost:5000/order/file/${params.id}`;
  // let user = localStorage.getItem("user");
  function createOrder() {
    // if (!user) {
    //   navigate("/login");
    // }
    orderApi
      .post(`file/${params.id}`, null, { withCredentials: true })
      .then((response) => {
        setOrder(response.data.data);
        let orderId = response.data.data._id;

        console.log(response.data.data);
        navigate(`/order/file/${orderId}`);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message == "You are not loggedIn") {
          navigate("/login");
        }
        console.log(error.response.data.message);
      });
  }

  const DeleteFile = () => {
    let ok = window.confirm("Do you want to delete this item");
    if (ok) {
      fileApi
        .delete(`/files/${params.id}`, {
          withCredentials: true,
        })
        .then((responce) => {
          console.log(responce.data.message);
          if (responce.data.message == "file deleted successfully") {
            navigate("/");
          }
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    }
  };
  // <Navbar />
  // const isAdmin = true;

  console.log(isAdmin);
  return (
    <Container>
      <Title>{file.title}</Title>

      <br />
      <Image src={file.imgPath} />
      <br />

      <Title>{file.title} 3D Model Free Download high quality design.</Title>

      <Details>Details :- {file.description}</Details>

      <br />

      <Title>File Size :- {file.fileSize}mb</Title>
      <br />

      <Title>Cost :- ₹{file.prize}/-</Title>
      <br />

      <ButtonContainer>
        <AddToCart onClick={createOrder} variant="contained">
          BuyNow
        </AddToCart>
        {isAdmin ? (
          <>
            <Link style={{ textDecoration: "none" }} to={`/edit/${params.id}`}>
              <AddToCart variant="contained">Edit</AddToCart>
            </Link>
            <AddToCart onClick={DeleteFile} variant="contained">
              Delete
            </AddToCart>
          </>
        ) : null}
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
