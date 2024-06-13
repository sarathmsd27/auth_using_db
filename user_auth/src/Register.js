import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};

    if (!name) {
      errors.name = "Name is required";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length === 10) {
      errors.password = "Password must be at least 10 characters";
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
        .post("http://localhost:3001/register", { name, email, password })
        .then((result) => {
          console.log(result);
          navigate("/login");
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-danger vh-100">
      <div className="bg-info p-3 rounded w-25">
        <h2>
          <center>Sign Up</center>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              name="name"
              className="form-control rounded-0"
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <div className="text-danger mt-1">{errors.name}</div>
            )}
          </div>
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
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Sign Up
          </button>
        </form>

        <Link
          to="/login"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none mt-3"
        >
          <center>Already have an account?</center>
        </Link>
      </div>
    </div>
  );
}

export default Register;
