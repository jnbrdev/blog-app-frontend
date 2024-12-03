import { useState, useEffect, useContext } from "react";
import { Form, Button, FloatingLabel, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { Notyf } from "notyf";

export default function Login() {
  const notyf = new Notyf();
  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isActive, setIsActive] = useState(true);
  //test
  function authenticate(e) {
    e.preventDefault();
    fetch(`https://blog-app-api-anep.onrender.com/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          localStorage.setItem("token", data.access);
          retrieveUserDetails(data.access);
          notyf.success("Login successful");
        } else {
          notyf.error("Login Failed");
        }
      });

    setEmail("");
    setPassword("");
  }

  const retrieveUserDetails = (token) => {
    fetch(`https://blog-app-api-anep.onrender.com/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          id: data.user._id,
        });
      });
  };

  useEffect(() => {
    if (email !== "" && password !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  return user.id !== null ? (
    <Navigate to="/" />
  ) : (
    <>


      <Card className="mx-auto my-5" style={{ maxWidth: '600px' }}>
            <Card.Body>
            <Form
        onSubmit={(e) => authenticate(e)}
        className="glass-form mx-auto"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1 className="mb-4 text-center ">Login</h1>

        {/* Email Input */}
        <Form.Group controlId="userEmail" className="mb-3">
          <FloatingLabel
            controlId="floatingEmail"
            label="Email address"
            className="floating-label"
          >
            <Form.Control
              required
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="floating-label-input"
            />
            <label className="floating-label-label">Email address</label>
          </FloatingLabel>
        </Form.Group>

        <Form.Group controlId="password" className="mb-4">
          <FloatingLabel
            controlId="floatingPassword"
            label="Password"
            className="floating-label"
          >
            <Form.Control
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="8"
              className="floating-label-input"
            />
            <label className="floating-label-label">Password</label>
          </FloatingLabel>
        </Form.Group>

        {/* Submit Button */}
        <Button type="submit" className="w-100 red-button" disabled={!isActive}>
          {isActive ? "Log In" : "Log In"}
        </Button>

        {/* Optional - Forgot Password Link */}
        <div className="text-center mt-3">
          <span className="">Don't have an account yet? </span>
          <a
            href="/register"
            className="text-primary"
            style={{ textDecoration: "none" }}
          >
            Register
          </a>
        </div>
      </Form>
            </Card.Body>
        </Card>
    </>
  );
}
