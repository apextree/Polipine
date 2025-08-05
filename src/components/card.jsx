import "./card.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../client";

const Card = (props) => {
  const { user } = useAuth();

  const deletePolipion = async () => {
    if (window.confirm('Are you sure you want to delete this Polipion?')) {
      await supabase
        .from("polipions")
        .delete()
        .eq("id", props.id);
      window.location.reload();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="forum-card">
      <div className="forum-card-header">
        <span className="upload-date">{formatDate(props.created_at)}</span>
        <span className="post-author">by @{props.username}</span>
        {user && user.username === props.username && (
          <div className="card-actions">
            <Link to={`/edit/${props.id}`}>
              <button className="edit-btn">✏️</button>
            </Link>
            <button className="delete-btn" onClick={deletePolipion}>🗑️</button>
          </div>
        )}
      </div>

      <Link to={`/polipion/${props.id}`} className="forum-card-link">
        <div className="forum-card-content">
          <h2 className="forum-title">{props.post_title}</h2>

          <div className="forum-card-footer">
            <div className="vote-stats">
              <span className="likes-count">👍 {props.post_likes || 0}</span>
              <span className="dislikes-count">👎 {props.post_dislikes || 0}</span>
            </div>

            <div className="politician-info">
              <span className="politician-details">
                {props.politician_name || 'Unknown Politician'}, {props.party}, {props.country}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
