const express = require("express");
const cors = require("cors");
const app = express();

const posts = {};

app.use(express.json());
app.use(cors());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events/posts", (req, res) => {
  const event = req.body;

  posts[event.id] = { id: event.id, title: event.title, comments: [] };

  res.send("Successful!!");
});

app.post("/events/posts/:id/comments", (req, res) => {
  const postId = req.params.id;

  const post = posts[postId];

  post.comments.push(req.body.data);

  posts[postId] = post;

  res.send("Successful!!");
});

app.put("/events/posts/:id/comments", (req, res) => {
  const postId = req.params.id;

  posts[postId].comments = req.body.data;

  res.send({});
});

app.listen(4002, () => {
  console.log("Server listening on 4002...");
});
