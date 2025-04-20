import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./userContext";
import { Card, Button, Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// 🎨 10 Random Image URLs
const quizImages = [
  "https://c4.wallpaperflare.com/wallpaper/751/110/518/typography-text-math-formula-wallpaper-preview.jpg",
  "https://c1.wallpaperflare.com/preview/811/367/789/technology-computer-creative-design.jpg",
  "https://c0.wallpaperflare.com/preview/920/519/697/abstract-php-c-analytics.jpg",
  "https://c4.wallpaperflare.com/wallpaper/974/565/254/windows-11-windows-10-minimalism-hd-wallpaper-preview.jpg",
  "https://c4.wallpaperflare.com/wallpaper/861/256/993/gravity-falls-illuminati-pentagram-bill-cipher-wallpaper-preview.jpg",
];

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.data.user.is_teacher) {
      navigate("/");
    }

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/quizzes");
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const username = user?.data?.user?.username;

  return (
    <div className="moving-gradient-bg min-vh-100">
      {/* 🍎 Apple-Style Top Navbar */}
      <br></br>
      <Navbar
        expand="lg"
        className="px-4 py-3 mb-4 mx-2 me-2 justify-content-between"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "30px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Brand Logo + Name */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          <img
            src="/assets/2.png"
            alt="Logo"
            height="50"
            style={{ borderRadius: "10px" }}
          />
          <span
            className="fw-semibold text-dark fs-3"
            style={{
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            QuizMaster
          </span>
        </Navbar.Brand>

        {/* Centered Title */}
        <div
          className="position-absolute start-50 translate-middle-x d-none d-lg-block"
          style={{ pointerEvents: "none" }}
        >
          <span
            className="fs-3 fw-bold"
            style={{
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              color: "#1a1a1a",
              letterSpacing: "0.5px",
            }}
          >
            Student Dashboard
          </span>
        </div>

        {/* Logout Button */}
        <Nav className="ms-auto">
          <Button
            variant="outline-danger"
            onClick={handleLogout}
            style={{
              fontWeight: 600,
              fontSize: "1.1rem",
              padding: "10px 24px",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            🔒 Logout
          </Button>
        </Nav>
      </Navbar>

      <Container>
        <h1 className="text-center mb-4 text-white welcome-message ">
          Welcome, <span className="text-white">{username}</span> 👋
        </h1>

        <h2 className="fw-semibold mb-4 text-white">📚 Latest Quizzes</h2>

        <Row>
          {quizzes.map((quiz, index) => {
            const randomImage = quizImages[index % quizImages.length];

            return (
              <Col md={6} lg={4} key={quiz.id} className="mb-4">
                <Card
                  className="border-0 shadow-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "20px",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Card.Img
                    variant="top"
                    src={randomImage}
                    alt="Quiz Cover"
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "15px",
                    }}
                  />
                  <Card.Body>
                    <Card.Title
                      className="fw-bold"
                      style={{ fontSize: "1.5rem" }}
                    >
                      {quiz.title}
                    </Card.Title>
                    <Button
                      as={Link}
                      to={`/quiz/${quiz.id}`}
                      variant="primary"
                      className="mt-3 w-100"
                    >
                      Take Quiz
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
