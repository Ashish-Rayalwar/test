import styled from "@emotion/styled";
import { Height } from "@mui/icons-material";
import axios from "axios";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { fileApi, orderApi } from "../api/api";

function Pay() {
  const navigate = useNavigate();
  const params = useParams();
  // const { user } = useContext(AuthContext);

  // const userId = user._id;
  // console.log(userId);
  console.log(params.id);
  const [order, setOrder] = useState({});
  const [file, setFile] = useState({});
  // const [token, setToken] = useState("");
  let count = 0;

  // let orderUrl = `http://localhost:5000/order/user/${params.id}`;
  // let data = {
  //   fileId: params.id,
  // };
  let user = localStorage.getItem("user");

  if (!user) {
    navigate("/login");
  }
  useEffect(() => {
    orderApi
      .get(`user/${params.id}`, { withCredentials: true })
      .then((responce) => {
        console.log(responce.data.data);
        setOrder(responce.data.data);
        setFile(responce.data.data.fileId);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message == "You are not loggedIn") {
          navigate("/login");
        }
      });
  }, [params.id]);

  const status = "completed";
  let token;
  async function makePayement() {
    try {
      let responce = await axios.post(
        `http://localhost:5000/order/payment/${params.id}`,
        { status },
        { withCredentials: true }
      );

      setOrder(responce.data.data);
      setFile(responce.data.data.fileId);
      localStorage.setItem("token", responce.data.token);
      // token = responce.data.token;
      console.log(responce.data.token);
    } catch (error) {
      if (error.response.data.message == "You are not loggedIn") {
        navigate("/login");
      }
      console.log(error.responce.data.message);
    }
  }
  // const [url, setUrl] = useState("");

  // console.log(token);
  async function downloadFile() {
    let token = localStorage.getItem("token");
    let orderId = params.id;
    console.log(token);
    fileApi
      .post(
        `/file/download`,
        { orderId, token },
        {
          withCredentials: true,
        }
      )
      .then((responce) => {
        console.log(responce.data.url);
        window.open(responce.data.url);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        console.log(error);
        if (error.response.data.message == "You are not loggedIn") {
          navigate("/login");
        }
      });

    // window.open(`http://localhost:5000/api/file/download/${token}`, "_blank");

    // console.log(token);
    // try {
    //   // file/download
    //   let responce = await axios.get(

    //     {
    //       withCredentials: true,
    //     }
    //   );

    //   console.log(responce);
    // const url = new window.URL(new Blob([responce.data]));
    // const url = URL.createObjectURL(responce.data);
    // const link = document.createElement("a");
    // link.href = url;
    // link.setAttribute("download", "filename.zip"); // replace 'filename' with the actual file name
    // document.body.appendChild(link);
    // link.click();
    // } catch (error) {
    // console.log(error);
    // }
  }

  // axios
  //   .post(
  //     `http://localhost:5000/order/payment/${params.id}`,
  //     { status },
  //     {
  //       withCredentials: true,
  //     }
  //   )
  //   .then((responce) => {

  //   })
  //   .catch((error) => {
  //     console.log(error.responce.data.message);
  //   });

  // console.log(JSON.stringify(order));
  // console.log(order);
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
    /* border: 1px solid gray; */
    width: auto;
    height: 55vh;
    align-items: center;
    display: flex;
    /* margin: auto; */
    text-align: center;
  `;
  const ImageContainer = styled.div`
    /* border: 1px solid gray; */
    margin: 0px 30px;
    padding: 30px;
  `;
  const Image = styled("img")({
    width: "400px",
    Height: "auto",
    marginLeft: "40px",
  });

  const RightContainer = styled.div`
    /* border: 1px solid gray; */
    width: 600px;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  `;
  // <div>
  //       <h2>Status : -- {orderData.status}</h2>
  //     </div>
  return (
    <div style={{ alignItems: "center", textAlign: "center" }}>
      <h2>Order Details</h2>
      <hr />
      <div>
        <h4>Order status :</h4>
        {order.status == "pending" ? (
          <div>
            {" "}
            <button className="btn btn-warning">{order.status}</button>{" "}
          </div>
        ) : (
          <div>
            <button className="btn btn-success">{order.status}</button>{" "}
          </div>
        )}
        <hr />
      </div>
      <Container>
        <ImageContainer>
          <Image src={file.imgPath} alt="" srcset="" />
        </ImageContainer>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <RightContainer>
            <div>
              <h1>{file.title}</h1>
            </div>
            <hr />

            {order.status == "pending" ? (
              <div>
                {" "}
                <button
                  type="submit"
                  onClick={makePayement}
                  className="btn btn-warning"
                >
                  Pay ₹{order.amount}/-
                </button>{" "}
              </div>
            ) : (
              <div>
                {" "}
                <button className="btn btn-success disabled">
                  Pay ₹{order.amount}/-
                </button>{" "}
              </div>
            )}
          </RightContainer>
          <hr />
          {order.status == "completed" ? (
            <Fragment>
              <h3>Your File is ready to download....</h3>
              <div style={{ width: "100px" }}>
                <button
                  type="submit"
                  onClick={downloadFile}
                  className="btn btn-primary btn-sm"
                >
                  Click Here
                </button>{" "}
              </div>
            </Fragment>
          ) : null}
        </div>
      </Container>
    </div>
  );
}

export default Pay;
