import styled from "@emotion/styled";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fileApi } from "../api/api";

function Admin() {
  const [allData, setAllData] = useState([]);
  //   const [userData, setUserData] = useState({})

  useEffect(() => {
    fileApi
      .get("/admin", { withCredentials: true })
      .then((responce) => {
        setAllData(responce.data.data);
        console.log(responce.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100vw;
  `;

  const Sell = styled.div`
    width: 250px;
    height: 110px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    background-color: #f5f5f5;
    text-align: center;
    display: flex;
    flex-direction: column;
    margin: 30px;
  `;

  const Details = styled.div`
    width: 600px;
    height: 600px;
    border: 1px solid grey;
    margin-left: 350px;
    display: flex;
    flex-direction: column;
  `;

  let sum = 0;
  {
    allData.map((x) => {
      sum += x.amount;
    });
  }
  return (
    <Container>
      <Sell>
        <h2 style={{ marginTop: "1  3px" }}>
          Total Profit <h3> ₹{sum}/- </h3>
        </h2>
      </Sell>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {allData.map((x, i) => (
          <Link
            to={`/files/${x.fileId._id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                // alignItems: "center",
                // border: "1px solid black",
                color: "black",
                textDecoration: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                width: "600px",
                height: "auto",
                margin: "10px",
                textAlign: "start",
                padding: "20px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                backgroundColor: "#F5F5F5",
              }}
            >
              <h4> User Name :- {x.userId.name}</h4>
              <h4> User Email :- {x.userId.email}</h4>

              <h4> File name :- {x.fileId.title}/-</h4>

              <h4> Purchased At :- {x.createdAt}</h4>

              <img
                src={x.fileId.imgPath}
                style={{ width: 200, height: "auto" }}
              />
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}

export default Admin;
