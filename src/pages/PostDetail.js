import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { Notyf } from "notyf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export default function PostDetail() {
  const notyf = new Notyf();
  const { user } = useContext(UserContext);
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");

  const fetchData = async () => {
    const fetchUrl = `https://blog-app-api-anep.onrender.com/posts/getPost/${postId}`;
    const res = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setPost(data);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCommentSubmit = () => {
    fetch(`https://blog-app-api-anep.onrender.com/posts/addComment/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ comment: newComment }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Comment added successfully") {
          setNewComment("");
          fetchData();
        } else {
          notyf.error(data.message || "Failed to add comment.");
        }
      })
      .catch(() => {
        notyf.error("Error adding comment.");
      });
  };

  const handleDeleteComment = (commentId) => {
    let fetchUrl = '';
    if(user.isAdmin === true) {
      fetchUrl = `https://blog-app-api-anep.onrender.com/posts/deleteCommentAdmin/${postId}/${commentId}`;
    } else {
      fetchUrl = `https://blog-app-api-anep.onrender.com/posts/deleteComment/${postId}/${commentId}`;
    }
    fetch(
      fetchUrl,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Comment deleted successfully") {
          notyf.success("Comment successfully deleted");
          fetchData();
        } else {
          notyf.error("Error deleting comment");
          fetchData();
        }
      });
  };

  const handleDeletePost = () => {
    fetch(`https://blog-app-api-anep.onrender.com/posts/deletePostAdmin/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Post deleted successfully") {
          notyf.success("Post successfully deleted");
          navigate("/posts");
        } else {
          notyf.error("Error deleting Post");
        }
      });
  };

  if (!post) return <p>Loading...</p>;

  return (
    <>
      <Container className="welcome-section" fluid></Container>
      <Container className="post-detail">
        <Row>
          <Col>
            <img src={post.img} alt={post.title} className="post-image" />
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <h1 className="post-title">{post.title}</h1>
            <div className="author-post-container">
  <h6 className="author-post">
    Author: <span>{post.author.name}</span>
  </h6>
  {user.isAdmin && (
    <Button
      className="btn-post-delete"
      onClick={() => handleDeletePost(post._id)}
    >
      <FontAwesomeIcon icon={faTrashAlt} /> Delete Post
    </Button>
  )}
</div>
<h6 className="author-post">
  Published:{" "}
  {new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.createdAt))}
</h6>
            <hr />
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="post-content">
                {paragraph}
              </p>
            ))}

            <hr />
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Comments</h3>
            {user?.id ? (
              <Form>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="comment-input"
                  />
                </Form.Group>
                <Button
                  variant="dark"
                  onClick={handleCommentSubmit}
                  className="comment-button mb-4"
                >
                  Comment
                </Button>
              </Form>
            ) : (
              <Button
                variant="secondary"
                onClick={() => navigate("/login")}
                className="login-button mb-5"
              >
                Login to comment
              </Button>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            {post.comments.map((comment) => (
              <Card key={comment._id} className="comment-card">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      alt={comment.email}
                      className="author-profile"
                    />
                    <div className="author-info">
                      <h6>{comment.email}</h6>
                      <small className="">
                        {" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(comment.createdAt))}
                      </small>
                    </div>
                  </div>
                  <Card.Text>{comment.comment}</Card.Text>
                  {(comment.userId === user?.id || user.isAdmin) && (
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteComment(comment._id)}
                      className="delete-button"
                    >
                      Delete
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
    </>
  );
}
