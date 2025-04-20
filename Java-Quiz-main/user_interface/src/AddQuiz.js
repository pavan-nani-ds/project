import React, { useState, useContext } from "react";
import { UserContext } from "./userContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FiChevronLeft, FiTrash2, FiPlus } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Navbar,
  Nav,
} from "react-bootstrap";

const AddQuiz = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const [quiz, setQuiz] = useState({
    title: "",
    username: user.data.user.username,
    questions: [
      {
        text: "",
        options: ["", ""],
        correctOption: "",
      },
    ],
  });

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { text: "", options: ["", ""], correctOption: "" },
      ],
    });
  };

  const removeQuestion = (qIndex) => {
    if (quiz.questions.length > 1) {
      const updated = [...quiz.questions];
      updated.splice(qIndex, 1);
      setQuiz({ ...quiz, questions: updated });
    } else {
      toast.info("Quiz must have at least one question.");
    }
  };

  const addOption = (qIndex) => {
    const updated = [...quiz.questions];
    updated[qIndex].options.push("");
    setQuiz({ ...quiz, questions: updated });
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...quiz.questions];
    if (updated[qIndex].options.length > 2) {
      updated[qIndex].options.splice(oIndex, 1);
      setQuiz({ ...quiz, questions: updated });
    } else {
      toast.info("Minimum 2 options required.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/quizzes", quiz);
      toast.success("Quiz added successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add quiz.");
    }
  };

  return (

    <div className="moving-gradient-bg min-vh-100">

      <br></br>
            {/* Navbar */}
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
  {/* Left: Logo + Brand */}
  <Navbar.Brand
    as={Link}
    to="/dashboard"
    className="d-flex align-items-center gap-2"
  >
    <img
      src="/assets/2.png" // Replace with actual path or hosted logo
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

  {/* Center: Title absolutely centered */}
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
      Teacher Dashboard
    </span>
  </div>

  {/* Right: Logout Button */}
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


    <div className="container" style={{ maxWidth: "900px", fontSize: "1.2rem" }}>
      <div className="d-flex align-items-center mb-5">
        <button
          className="btn btn-dark me-3 rounded-circle shadow-sm"
          onClick={() => navigate("/dashboard")}
        >
          <FiChevronLeft size={24} />
        </button>
        <h2 className="fw-semibold mb-0 text-white" style={{ fontSize: "2rem" }}>
          Create a New Quiz
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label fw-medium text-white">Quiz Title</label>
          <input
            type="text"
            className="form-control form-control-lg shadow-sm"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            required
          />
        </div>

        {quiz.questions.map((question, qIndex) => (
          <div
            className="card mb-5 border-0"
            key={qIndex}
            style={{
              background: "rgba(255, 255, 255, 0.75)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.3)",
              backdropFilter: "blur(8px)",
              borderRadius: "20px",
            }}
          >
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-4" style={{ fontSize: "1.5rem" }}>
                Question {qIndex + 1}
              </h5>

              <div className="mb-3">
                <label className="form-label fw-medium">Question Text</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={question.text}
                  onChange={(e) => {
                    const updated = [...quiz.questions];
                    updated[qIndex].text = e.target.value;
                    setQuiz({ ...quiz, questions: updated });
                  }}
                  required
                />
              </div>

              {question.options.map((option, oIndex) => (
                <div className="mb-3 d-flex align-items-center gap-3" key={oIndex}>
                  <div className="flex-grow-1">
                    <label className="form-label fw-medium">Option {oIndex + 1}</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={option}
                      onChange={(e) => {
                        const updated = [...quiz.questions];
                        updated[qIndex].options[oIndex] = e.target.value;
                        setQuiz({ ...quiz, questions: updated });
                      }}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-danger mt-4"
                    onClick={() => removeOption(qIndex, oIndex)}
                    disabled={question.options.length <= 2}
                    title="Remove Option"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-dark btn-sm mb-3"
                onClick={() => addOption(qIndex)}
              >
                <FiPlus /> Add Option
              </button>

              <div className="mb-3">
                <label className="form-label fw-medium">Correct Option</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={question.correctOption}
                  onChange={(e) => {
                    const updated = [...quiz.questions];
                    updated[qIndex].correctOption = e.target.value;
                    setQuiz({ ...quiz, questions: updated });
                  }}
                  required
                />
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeQuestion(qIndex)}
                  disabled={quiz.questions.length <= 1}
                >
                  🗑 Remove Question
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="d-flex gap-3 mt-4">
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={addQuestion}
          >
            ➕ Add Question
          </button>
          <button type="submit" className="btn btn-primary btn-lg px-4">
            🚀 Submit Quiz
          </button>
        </div>
      </form>

      <br></br>
      <br></br>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </div>
  );
};

export default AddQuiz;
