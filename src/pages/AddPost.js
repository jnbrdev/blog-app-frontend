import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { Notyf } from "notyf";

export default function AddPost() {
  const notyf = new Notyf();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [img, setImg] = useState("");
  const [content, setContent] = useState("");

  const handlePostSubmit = () => {
    fetch(`https://blog-app-api-anep.onrender.com/posts/addPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ 
        title, 
        content, 
        author: { name: author, email: null }, 
        img 
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        notyf.success("Post added successfully!");
        navigate("/posts"); // Navigate to posts list or relevant page
      })
      .catch(() => {
        notyf.error("Error adding post.");
      });
  };

  return (
    <>
      <Container  fluid>
        <Row>
          <Col md={8} className="mx-auto mt-5">
            <Card>
              <Card.Body>
                <h2 className="text-center">Add New Post</h2>
                <Form>
                  {/* Title Input */}
                  <Form.Group controlId="formTitle" className="mb-4">
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                    />
                  </Form.Group>

                  {/* Author Input */}
                  <Form.Group controlId="formAuthor" className="mb-4">
                    <Form.Label>Author</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter author name" 
                      value={author} 
                      onChange={(e) => setAuthor(e.target.value)} 
                    />
                  </Form.Group>

                  {/* Image Link Input */}
                  <Form.Group controlId="formImg" className="mb-4">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter image URL" 
                      value={img} 
                      onChange={(e) => setImg(e.target.value)} 
                    />
                  </Form.Group>

                  {/* Content Textarea */}
                  <Form.Group controlId="formContent" className="mb-4">
                    <Form.Label>Content</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={6} 
                      placeholder="Enter content" 
                      value={content} 
                      onChange={(e) => setContent(e.target.value)} 
                    />
                  </Form.Group>

                  {/* Submit Button */}
                  <Button 
                    variant="primary" 
                    onClick={handlePostSubmit}
                    disabled={!title || !author || !content} // Disable if fields are empty
                  >
                    Submit Post
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}