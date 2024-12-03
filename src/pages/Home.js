import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import "../App.css"; // General app styles
import UserContext from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCommentDots } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State to track the search term
  const [navigateTo, setNavigateTo] = useState(null); // State for navigation

  const fetchData = () => {
    let fetchUrl = `https://blog-app-api-anep.onrender.com/posts/getPosts`;
    fetch(fetchUrl, {
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data || []);
      });
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

  if (navigateTo) {
    return <Navigate to={navigateTo} />;
  }

  return (
    <>
      {/* Section with background image and welcome message */}
      <Container className="welcome-section" fluid>
        <h3 className="home-title">
          WELCOME <span className="home-span">TO</span> BLOGSPOT
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

      {/* Posts Section */}
      <Container className="py-4">
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
                        Continue Reading &gt;
                      </div>
                      <hr style={{ width: "100%" }} />

                      {/* Comments Section */}
                      <div className="d-flex align-items-center mt-2">
                        <FontAwesomeIcon
                          icon={faCommentDots}
                          className="comment-icon"
                        />
                        <span className="ms-2">{post.comments.length}</span>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
