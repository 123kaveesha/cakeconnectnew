import React from "react";
import { Link } from "react-router-dom";
import "../styles/notFoundPageStyles.css";

const NotFoundPage = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <h1>404</h1>
        <p>Oops! The page you are looking for doesn’t exist.</p>
        <Link to="/" className="notfound-button">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
