const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.post("/events", (req, res) => {
  const event = req.body;

  axios.post("http://posts-clusterip-srv:4000/events", event);
  // axios.post("http://localhost:4001/events", event);

  if (event.type === "PostCreated") {
    axios.post("http://query-clusterip-srv:4002/events/posts", event.data);
  }

  if (event.type === "CommentCreated") {
    console.log("event", event);
    //query-service
    axios.post(
      `http://query-clusterip-srv:4002/events/posts/${event.data.postId}/comments`,
      { data: event.data.comment }
    );
    //moderation-service
    axios.post(`http://moderation-srv:4005/events/comments`, { data: event });
  }

  if (event.type === "CommentModerated") {
    axios.put(
      `http://comments-clusterip-srv:4001/posts/${event.data.postId}/comments/${event.data.comment.id}`,
      {
        ...event.data,
      }
    );
  }

  if (event.type === "CommentUpdated") {
    axios.put(
      `http://query-clusterip-srv:4002/events/posts/${event.data.postId}/comments`,
      {
        data: event.data.comments,
      }
    );
  }

  res.send("OK!!");
});

app.listen(4003, () => {
  console.log("Server listening on 4003...");
});
