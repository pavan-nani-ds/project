import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FiChevronLeft } from "react-icons/fi";
import { UserContext } from "./userContext";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const QuizData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [quizDetails, setQuizDetails] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const isTeacher = user?.data?.user?.is_teacher;

  // ✅ Calculate score based on answers
  const calculateScore = useCallback(() => {
    let score = 0;
    quizDetails.questions?.forEach((question, idx) => {
      if (answers[idx] === question.correctOption) {
        score++;
      }
    });
    return score;
  }, [answers, quizDetails.questions]);

  // ✅ Handle quiz submission
  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    localStorage.removeItem(`quiz-${id}-startTime`);
    const score = calculateScore();
    toast.info(`You scored ${score} out of ${quizDetails.questions?.length}`);
  }, [submitted, id, quizDetails.questions, calculateScore]);

  // ✅ Fetch quiz details
  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/quizzes/${id}`);
        setQuizDetails(response.data);
      } catch (error) {
        console.error("Error fetching quiz details:", error);
      }
    };
    fetchQuizDetails();
  }, [id]);

  // ✅ Handle timer with persistence
  useEffect(() => {
    if (isTeacher) return;

    const storedStartTime = localStorage.getItem(`quiz-${id}-startTime`);
    let startTime = storedStartTime ? parseInt(storedStartTime, 10) : Date.now();

    if (!storedStartTime) {
      localStorage.setItem(`quiz-${id}-startTime`, startTime.toString());
    }

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = Math.floor((currentTime - startTime) / 1000);
      const remaining = 300 - elapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        if (!submitted) handleSubmit();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [id, submitted, isTeacher, handleSubmit]);

  const handleBack = () => {
    navigate(isTeacher ? "/dashboard" : "/home");
  };

  const handleOptionSelect = (questionIndex, selectedOption) => {
    if (submitted || isTeacher) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: selectedOption }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (

    <div className="moving-gradient-bg min-vh-100"> 
    <div className="container" style={{ maxWidth: "900px", fontSize: "1.2rem" }}>
      <br>
      </br>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <button
            onClick={handleBack}
            className="btn btn-dark me-3 rounded-circle shadow-sm"
          >
            <FiChevronLeft size={24} />
          </button>
          <h2 className="fw-semibold mb-0 text-white" style={{ fontSize: "2rem" }}>
            Quiz Details
          </h2>
        </div>
        {!isTeacher && !submitted && (
          <div className="fw-bold fs-4 text-white btn btn-danger">{formatTime(timeLeft)}</div>
        )}
      </div>

      {quizDetails.questions?.map((question, qIndex) => (
        <div
          key={qIndex}
          className="card mb-4 border-0"
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.25)",
            backdropFilter: "blur(8px)",
            borderRadius: "20px",
            padding: "24px",
            transition: "all 0.3s ease",
          }}
        >
          <h5 className="mb-4 fw-semibold" style={{ fontSize: "1.5rem" }}>
            Question {qIndex + 1}
          </h5>
          <p className="fs-5 mb-3">{question.text}</p>

          <ul className="list-unstyled mt-3">
            {question.options?.map((option, oIndex) => {
              const selected = answers[qIndex] === option;
              const isCorrect = question.correctOption === option;
              const isWrong = submitted && selected && !isCorrect;

              return (
                <li
                  key={oIndex}
                  className={`mb-3 p-3 rounded ${
                    selected ? "bg-primary text-white" : "bg-white"
                  } ${submitted && isCorrect ? "border border-success" : ""} ${
                    isWrong ? "border border-danger" : ""
                  }`}
                  style={{
                    cursor: submitted || isTeacher ? "default" : "pointer",
                    transition: "0.3s ease",
                  }}
                  onClick={() => handleOptionSelect(qIndex, option)}
                >
                  {option}
                </li>
              );
            })}
          </ul>

          {isTeacher && (
            <div className="mt-3">
              <span className="badge bg-success p-2 fs-6">
                ✅ Correct Option: <strong>{question.correctOption}</strong>
              </span>
            </div>
          )}
        </div>
      ))}

      {!isTeacher && !submitted && Object.keys(answers).length === quizDetails.questions?.length && (
        <div className="text-center mt-4">
          <button className="btn btn-success btn-lg px-5 shadow" onClick={handleSubmit}>
            Submit Quiz
          </button>
        </div>
      )}

      {submitted && !isTeacher && (
        <div className="text-center mt-4">
          <h4 className="text-success">
            🎉 You scored {calculateScore()} / {quizDetails.questions?.length}
          </h4>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </div>
  );
};

export default QuizData;
