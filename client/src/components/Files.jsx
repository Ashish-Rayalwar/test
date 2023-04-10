import { Typography, styled } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
// import { itemData } from "../itemData";
import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "../App";

// import Card from "@mui/material/Card";

// import CardMedia from "@mui/material/CardMedia";

// import Typography from "@mui/material/Typography";

const Image = styled("img")({
  width: 650,
  height: 370,
  margin: "10px 10px",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  filter: "contrast()",
  // boxShadow: "rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset",
  transition: "transform 0.2s ease-in-out",
  // boxShadow:
  // "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
  ":hover": {
    transition: "transform 0.2s ease-in-out",
    marginTop: "2px",
  },
});

const Files = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const { title } = useContext(CartContext);
  let url = `http://localhost:5000/api/files`;
  if (title) {
    url = `http://localhost:5000/api/files?title=${title}`;
  }

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        console.log(response.data.data);
        setImages(response.data.data);
      })
      .catch((error) => {
        setImages([]);
        console.log(error.response.data.message);
        setError(error.response.data.message);
      });
  }, [url]);

  if (images.length === 0) {
    return (
      <div>
        <h4>{error}</h4>
      </div>
    );
  } else
    return (
      <ImageList sx={{ justifyContent: "flex-start" }}>
        {images.map((item, index) => (
          <ImageListItem
            key={index}
            style={{ position: "relative", textAlign: "center" }}
          >
            <Link to={`/files/${item._id}`}>
              <Image
                src={`${item.imgPath}`}
                srcSet={`${item.imgPath}`}
                alt={item.title}
                loading="lazy"
              />
            </Link>
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "30px",
                fontSize: "18px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {item.title}
            </div>
          </ImageListItem>
        ))}
      </ImageList>
    );
};

export default Files;

// <div
//       style={{
//         display: "flex",
//         margin: "10px  10px",
//         width: "100%",
//       }}
//     >
//       <Card
//         sx={{
//           margin: "0px 10px",
//         }}
//       >
//         <CardMedia
//           sx={{
//             width: 600,
//             height: 300,
//             boxShadow: "rgba(0, 0, 0, 0.35) 0px -80px 16px -38px inset",
//           }}
//           image="https://www.decorilla.com/online-decorating/wp-content/uploads/2018/10/modern-interior-design-grey-living-room2.png"
//           title="green iguana"
//         >
//           <Box>
//             <Title gutterBottom variant="h5" component="div">
//               Modern Living Room
//             </Title>
//           </Box>
//         </CardMedia>
//       </Card>
//       <Card
//         sx={
//           {
//             //   margin: "0px 10px",
//           }
//         }
//       >
//         <CardMedia
//           sx={{
//             width: 600,
//             height: 300,
//             boxShadow: "rgba(0, 0, 0, 0.35) 0px -80px 16px -38px inset",
//           }}
//           image="https://www.decorilla.com/online-decorating/wp-content/uploads/2018/10/modern-interior-design-grey-living-room2.png"
//           title="green iguana"
//         >
//           <Box>
//             <Title gutterBottom variant="h5" component="div">
//               Modern Living Room
//             </Title>
//           </Box>
//         </CardMedia>
//       </Card>
//       <Card
//         sx={
//           {
//             //   margin: "0px 10px",
//           }
//         }
//       >
//         <CardMedia
//           sx={{
//             width: 600,
//             height: 300,
//             boxShadow: "rgba(0, 0, 0, 0.35) 0px -80px 16px -38px inset",
//           }}
//           image="https://www.decorilla.com/online-decorating/wp-content/uploads/2018/10/modern-interior-design-grey-living-room2.png"
//           title="green iguana"
//         >
//           <Box>
//             <Title gutterBottom variant="h5" component="div">
//               Modern Living Room
//             </Title>
//           </Box>
//         </CardMedia>
//       </Card>
//     </div>
