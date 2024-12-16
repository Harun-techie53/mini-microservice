const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.get("/all", (req, res) => {
  res.status(200).json({
    data: posts,
  });
});

app.post("/", (req, res) => {
  const id = randomBytes(4).toString("hex");

  posts[id] = { id, ...req.body };

  axios.post("http://event-bus-srv:4003/events", {
    type: "PostCreated",
    data: { id, ...req.body },
  });

  res.status(201).json({
    data: posts[id],
  });
});

app.post("/events", (req, res) => {
  console.log("Event Type", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("Server listening on port 4000...");
});
