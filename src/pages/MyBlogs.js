import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import "../App.css"; // General app styles
import UserContext from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCommentDots, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Notyf } from "notyf";
export default function MyBlogs() {
    const notyf = new Notyf();
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State to track the search term
  const [navigateTo, setNavigateTo] = useState(null); // State for navigation

  const fetchData = async () => {
    const fetchUrl = `https://blog-app-api-anep.onrender.com/posts/getMyPosts`;
    const res = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Filter posts based on the search term
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigate = (postId) => {
    setNavigateTo(`/posts/${postId}`);
  };

  const handleDeletePost = (postId) => {
    fetch(`https://blog-app-api-anep.onrender.com/posts/deletePost/${postId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)

        if(data.message === 'Post deleted successfully'){
            notyf.success("Post successfully deleted")
            fetchData();
        } else  {
            notyf.error("Error deleting Post")
            fetchData();
        }
    })
  };

  if (navigateTo) {
    return <Navigate to={navigateTo} />;
  }

  return (
    <>
      {/* Section with background image and welcome message */}
      <Container className="welcome-section" fluid>
        <h3 className="home-title">
          My Posts
        </h3>
      </Container>

      {/* Search Bar */}
      <Container className="py-4 d-flex align-items-center">
        <div className="position-relative w-100">
          <FontAwesomeIcon
            icon={faSearch}
            className="position-absolute top-50 start-0 translate-middle-y ms-3"
            style={{ zIndex: 1 }}
          />
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: "35px", // Space for the icon
              borderRadius: "50px", // Optional: rounded corners
              width: "100%", // Ensure the input takes full width
              display: "inline-block", // Ensures it doesn't overflow
            }}
          />
        </div>
      </Container>

      {/* Add Post Button */}
      <Container className="py-2">
        <Button
          onClick={() => setNavigateTo('/posts/add-post')}
          className="d-block btn-add-post"
        >
          Add Post
        </Button>
      </Container>

      {/* Posts Section */}
      <Container className="py-4">
        {filteredPosts.length === 0 ? (
          <div className="no-posts-message">
            <p>You have no posts, Click Add Post to start posting!</p>
          </div>
        ) : (
          <Row className="g-4">
            {filteredPosts.map((post) => (
              <Col lg={12} sm={12} key={post._id}>
                <Card className="card-container">
                  <Row className="g-0">
                    {/* Image Column */}
                    <Col xs={12} md={6} className="d-flex align-items-center">
                      <img
                        src={post.img || "https://via.placeholder.com/300"}
                        alt={post.title}
                        className="card-img-container"
                      />
                    </Col>

                    {/* Details Column */}
                    <Col xs={12} md={6} className="card-details">
                      <Card.Body>
                        <div className="d-flex align-items-center mb-3">
                          <img
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            alt={post.author.name}
                            className="author-profile"
                          />
                          <div className="author-info">
                            <h6>{post.author.name}</h6>
                            <small>{post.author.email}</small>
                          </div>
                        </div>
                        <Card.Title className="card-title">{post.title}</Card.Title>
                        <Card.Text className="card-text">
                          {post.content.length > 100
                            ? post.content.slice(0, 100) + "..."
                            : post.content}
                        </Card.Text>

                        {/* Continue Reading Link */}
                        <div
                          className="continue-reading"
                          onClick={() => handleNavigate(post._id)}
                        >
                          View Post
                        </div>
                        <hr style={{ width: "100%" }} />

                        {/* Comments Section */}
                        <div className="d-flex align-items-center mt-2">
                          <FontAwesomeIcon
                            icon={faCommentDots}
                            className="comment-icon"
                          />
                          <span className="ms-2">{post.comments.length}</span>
                          <Button
                            className="btn-post-edit mx-4"
                            onClick={() => setNavigateTo(`/posts/edit-post/${post._id}`)}
                          >
                            <FontAwesomeIcon icon={faEdit} /> Edit
                          </Button>
                          <Button
                          className="btn-post-delete"
                          onClick={() => handleDeletePost(post._id)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} /> Delete
                          </Button>
                        </div>

                        {/* Edit and Delete Buttons */}
                        <div className="d-flex mt-2">
                          
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}
