import { useState, useContext} from 'react';
import { Form, Button, Col, Row, Card } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function Register() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    // Disable button if not all fields are filled
    const isFormValid =  email && password && confirmPassword && password === confirmPassword;

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false || password !== confirmPassword) {
            event.stopPropagation();
        } else {
            registerUser();
        }

        setValidated(true);
    };

    const registerUser = () => {
        fetch(`https://blog-app-api-anep.onrender.com/users/register`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Registered Successfully") {
                notyf.success("Registration successful");
                setRedirectToLogin(true);
            } else {
                handleErrors(data.message);
            }
        })
        .catch(() => notyf.error("Something went wrong. Please try again."));
    };

    const handleErrors = (message) => {
        if (message === "Email invalid") {
            notyf.error("Email is invalid");
        }  else if (message === "Password must be at least 8 characters long") {
            notyf.error("Password must be at least 8 characters");
        } else {
            notyf.error("Something went wrong.");
        }
    };

    if (user.id !== null || redirectToLogin) return <Navigate to="/login" />;

    return (
        <Card className="mx-auto my-5" style={{ maxWidth: '600px' }}>
            <Card.Body>
                <h1 className="text-center mb-4">Register</h1>
                <Form noValidate validated={validated} onSubmit={handleSubmit}
                        className="glass-form mx-auto"
                        style={{ maxWidth: "400px", width: "100%" }}
                >
                    <Form.Group className="mb-3">
                        <FloatingLabel controlId="floatingEmail" label="Email address">
                            <Form.Control
                                required
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6">
                            <FloatingLabel controlId="floatingPassword" label="Password">
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength="8"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Password must be at least 8 characters long.
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                            <FloatingLabel controlId="floatingConfirmPassword" label="Verify Password">
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please confirm your password.
                                </Form.Control.Feedback>
                                {password && confirmPassword && password !== confirmPassword && (
                                    <div className="text-danger">Passwords do not match.</div>
                                )}
                            </FloatingLabel>
                        </Form.Group>
                    </Row>
                    <Button type="submit" variant="primary" className="w-100" disabled={!isFormValid}>
                        Register
                    </Button>
                    <div className="text-center mt-3">
            <span>Already have an account? </span>
            <a
              href="/login"
              className="text-primary"
              style={{ textDecoration: "none" }}
            >
              Click here
            </a>{" "}
            to login.
          </div>
                </Form>
            </Card.Body>
        </Card>
    );
}
