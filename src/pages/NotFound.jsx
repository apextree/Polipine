import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist or may have been removed.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-btn primary">
            Go Home
          </Link>
          <Link to="/polipions" className="not-found-btn secondary">
            View All Polipions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
