// import axios from "axios";
import React, { useState } from "react";

const Data = () => {
  const [data, setdata] = useState("");
  function handlClick() {
    setdata(data);
  }
  return (
    <div>
      <input
        type="text"
        name="email"
        onChange={(e) => setdata(e)}
      />
      <button onClick={handlClick}>click</button>
      <h1>{data}</h1>
    </div>
  );
};

export default Data;
