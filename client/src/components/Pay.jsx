import styled from "@emotion/styled";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Pay() {
  const navigate = useNavigate();
  const params = useParams();
  const [order, setOrder] = useState({});
  const fileData = localStorage.getItem("file");
  const orderData = localStorage.getItem("order");
  //   {
  //   "_id": "6431914409569017e98eba06",
  //   "title": "Modern Bedroom 3",
  //   "description": "3ds max vray",
  //   "fileSize": "200",
  //   "prize": 4000,
  //   "imgPath": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/abc/master_bedroom_interior_design_1641210145_853463c6_progressive.jpg",
  //   "isDeleted": false,
  //   "createdAt": "2023-04-08T16:07:32.410Z",
  //   "updatedAt": "2023-04-08T16:07:32.410Z",
  //   "__v": 0
  // }
  // {
  //   "userId": "6433e4e016a27dfe09b9337f",
  //   "fileId": "6431914409569017e98eba06",
  //   "status": "pending",
  //   "amount": 4000,
  //   "_id": "64340e6617680132814b624a",
  //   "createdAt": "2023-04-10T13:25:58.653Z",
  //   "updatedAt": "2023-04-10T13:25:58.653Z",
  //   "__v": 0
  // }

  const Container = styled.div`
    display: flex;
  `;

  return (
    <div>
      <h1>Order Details</h1>

      <div>Order Details File Name OrderId prize FIle size</div>

      <div>image</div>
    </div>
  );
}
// <pre>{JSON.stringify(order, null, 2)}</pre>

export default Pay;
