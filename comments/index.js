const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const comments = commentsByPostId[req.params.id] || [];
  res.status(200).json({
    data: comments,
  });
});

app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");

  const comment = { id: commentId, ...req.body, status: "pending" };

  const comments = commentsByPostId[req.params.id] || [];

  comments.push(comment);

  commentsByPostId[req.params.id] = comments;

  axios.post("http://event-bus-srv:4003/events", {
    type: "CommentCreated",
    data: {
      postId: req.params.id,
      comment,
    },
  });

  res.status(201).json({
    data: comments,
  });
});

app.put("/posts/:postId/comments/:commentId", (req, res) => {
  const data = req.body;
  console.log("moderated data", data);
  const comments = commentsByPostId[req.params.postId].map((comment) => {
    if (comment.id === data.comment.id) {
      return {
        ...comment,
        status: data.comment.status,
      };
    }

    return comment;
  });

  // console.log("updated comments", comments);

  commentsByPostId[req.params.postId] = comments;

  axios.post("http://event-bus-srv:4003/events", {
    type: "CommentUpdated",
    data: {
      postId: data.postId,
      comments,
    },
  });

  res.send("Updated");
});

app.post("/events", (req, res) => {
  console.log("Event Type", req.body.type);

  res.send({});
});

app.listen(4001, () => {
  console.log("Server listening on port 4001...");
});
