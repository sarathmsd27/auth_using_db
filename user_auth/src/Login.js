import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      axios
        .post("http://localhost:3001/login", { email, password })
        .then((result) => {
          console.log(result);
          if (result.data === "Success") {
            navigate("/home");
          } else {
            setErrorMessage(result.data);
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage("An error occurred. Please try again later.");
        });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-danger vh-100">
      <div className="bg-info p-3 rounded w-25">
        <h2>
          <center>Login</center>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div className="text-danger mt-1">{errors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="text-danger mt-1">{errors.password}</div>
            )}
          </div>
          {errorMessage && (
            <div className="text-danger mb-3">{errorMessage}</div>
          )}
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </button>
        </form>

        <Link
          to="/"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none mt-3"
        >
          <center>Don't have an account? Click here</center>
        </Link>
      </div>
    </div>
  );
}

export default Login;
