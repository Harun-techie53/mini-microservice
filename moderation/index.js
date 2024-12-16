const axios = require("axios");
const express = require("express");
const app = express();

app.use(express.json());

app.post("/events/comments", (req, res) => {
  const event = req.body.data;
  const regex = /orange/i;

  console.log("event", event);

  if (regex.test(event.data.comment.content)) {
    axios.post(`http://event-bus-srv:4003/events`, {
      type: "CommentModerated",
      data: {
        postId: event.data.postId,
        comment: {
          ...event.data.comment,
          status: "rejected",
        },
      },
    });
  } else {
    axios.post(`http://event-bus-srv:4003/events`, {
      type: "CommentModerated",
      data: {
        postId: event.data.postId,
        comment: {
          ...event.data.comment,
          status: "approved",
        },
      },
    });
  }

  res.send({});
});

app.listen(4005, () => {
  console.log("Server listening on 4005...");
});
