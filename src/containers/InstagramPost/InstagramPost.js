import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import classes from "./Instagram.module.css";
import { auth, db } from "../Firebase/Firebase";

const InstagramPost = (props) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    unsubscribe = db
      .collection("posts")
      .doc(props.postId)
      .collection("comments")
      .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });

    return () => unsubscribe();
  }, []);

  const addCommentHandler = (event) => {
    event.preventDefault();
    db.collection("posts").doc(props.postId).collection("comments").add({
      text: comment,
      username: auth.currentUser.displayName,
    });
    setComment("");
  };

  return (
    <Card className={classes.card}>
      <Card.Header>
        <div className={classes.avatarUsername}>
          <div
            className={classes.avatar}
            style={{
              background: `url(${props.avatarURL})`,
            }}
          ></div>
          <div className={classes.postUsername}>{props.postUsername}</div>
        </div>
      </Card.Header>

      <Card.Img className={classes.img} variant="top" src={props.imageURL} />

      <Card.Body className={classes.body}>
     
        <Card.Text className={classes.text}>{props.postUsername}</Card.Text>
        <Card.Text className={classes.text}>{props.caption}</Card.Text>
      </Card.Body>

      <div style={{ margin: "0", padding: "0" }}>
        {comments.map((comment) => (
          <div key={Math.random()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "2%",
              }}
            >
              <div style={{ marginLeft: "3%" }}>
                <img
                  className={classes.avatarURL}
                  style={{
                    borderRadius: "50%",
                  }}
                  src={
                    auth.currentUser.photoURL ||
                    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                  }
                  alt=""
                />
              </div>
              <div className={classes.comment}>{comment.username}</div>

              <div className={classes.username}>{comment.text}</div>
            </div>
          </div>
        ))}
      </div>
      <hr />
      <div>
        <div className={classes.textareaContainer}>
          <textarea
            value={comment}
            rows="1"
            className={`form-control ${classes.textarea}`}
            placeholder="Add a comment..."
            onChange={(e) => {
              setComment(e.target.value);
            }}
          ></textarea>

          <div>
            <button
              type="submit"
              className={classes.post}
              onClick={addCommentHandler}
              disabled={!comment}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default InstagramPost;
