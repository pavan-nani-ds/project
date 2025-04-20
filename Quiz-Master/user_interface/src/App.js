import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import QuizData from "./QuizData";
import AddQuiz from "./AddQuiz";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./userContext";
import Dashboard from "./Dashboard";
import './styles.css';


const App = () => {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <Routes>
      <Route path="/"
  element={
    user ? (
      user.data.user.is_teacher ? (
        <Navigate to="/dashboard" />
      ) : (
        <Navigate to="/home" />
      )
    ) : (
      <Login />
    )
  }
/>
        <Route
          path="/register"
          element={user ? <Navigate to="/home" /> : <Register />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/" />}
        />

        <Route
          path="/dashboard"
          element={user && user.data.user.is_teacher ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/quiz/:id"
          element={user ? <QuizData /> : <Navigate to="/" />}
        />
        <Route
          path="/addQuiz"
          element={user ? <AddQuiz /> : <Navigate to="/" />}
        />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} />
    </Router>
  );
};

export default App;
