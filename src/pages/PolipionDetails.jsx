import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../client";
import "./PolipionDetails.css";

const PolipionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [polipion, setPolipion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchPolipion();
    if (user) {
      fetchUserVote();
    }
  }, [id, user]);

  const fetchPolipion = async () => {
    try {
      const { data, error } = await supabase
        .from("polipions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching Polipion:", error);
        if (error.code === 'PGRST116') {
          // No rows returned - polipion doesn't exist
          setNotFound(true);
        }
      } else {
        setPolipion(data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVote = async () => {
    // For unlimited voting, we don't need to track user vote state
    // This function is kept for compatibility but does nothing
    return;
  };

  const handleUpvote = async () => {
    if (!user) {
      alert("Please log in to vote");
      return;
    }

    try {
      // Add a new like vote (unlimited voting)
      await supabase
        .from("user_votes")
        .insert({
          user_id: user.id,
          polipion_id: id,
          vote_type: 'like'
        });

      // Increment the like count
      const newLikes = (polipion.post_likes || 0) + 1;
      await supabase
        .from("polipions")
        .update({ post_likes: newLikes })
        .eq("id", id);

      setPolipion(prev => ({ ...prev, post_likes: newLikes }));
    } catch (error) {
      console.error("Error updating vote:", error);
      alert("Error updating vote: " + error.message);
    }
  };

  const handleDownvote = async () => {
    if (!user) {
      alert("Please log in to vote");
      return;
    }

    try {
      // Add a new dislike vote (unlimited voting)
      await supabase
        .from("user_votes")
        .insert({
          user_id: user.id,
          polipion_id: id,
          vote_type: 'dislike'
        });

      // Increment the dislike count
      const newDislikes = (polipion.post_dislikes || 0) + 1;
      await supabase
        .from("polipions")
        .update({ post_dislikes: newDislikes })
        .eq("id", id);

      setPolipion(prev => ({ ...prev, post_dislikes: newDislikes }));
    } catch (error) {
      console.error("Error updating vote:", error);
      alert("Error updating vote: " + error.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      alert("Please log in to comment");
      return;
    }

    setSubmittingComment(true);
    try {
      const currentComments = polipion.all_comments || [];
      const newCommentObj = {
        id: Date.now(),
        text: newComment.trim(),
        timestamp: new Date().toISOString(),
        author: user.username
      };

      const updatedComments = [...currentComments, newCommentObj];
      const newCommentsCount = updatedComments.length;

      const { error } = await supabase
        .from("polipions")
        .update({
          all_comments: updatedComments,
          post_comments_number: newCommentsCount
        })
        .eq("id", id);

      if (error) {
        console.error("Error adding comment:", error);
        alert("Error adding comment: " + error.message);
      } else {
        setPolipion(prev => ({
          ...prev,
          all_comments: updatedComments,
          post_comments_number: newCommentsCount
        }));
        setNewComment('');
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred: " + error.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading Polipion details...</h2>
      </div>
    );
  }

  if (notFound || (!loading && !polipion)) {
    return (
      <div className="error-container">
        <h2>Polipion not found</h2>
        <p>This polipion may have been deleted or doesn't exist.</p>
        <div className="error-actions">
          <Link to="/polipions">
            <button className="back-btn">Back to All Polipions</button>
          </Link>
          <Link to="/">
            <button className="home-btn">Go Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="polipion-details-container">
      <div className="polipion-details-card">
        <div className="polipion-details-header">
          <Link to="/polipions" className="back-link">
            ← Back to All Polipions
          </Link>
          {user && user.username === polipion.username && (
            <Link to={`/edit/${polipion.id}`} className="edit-link">
              Edit Polipion
            </Link>
          )}
        </div>

        <div className="polipion-details-content">
          {polipion.image_url && (
            <div className="polipion-details-image">
              <img
                src={polipion.image_url}
                alt={polipion.post_title}
                className="details-polipion-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="polipion-info">
            <h1 className="polipion-details-title">{polipion.post_title}</h1>

            <div className="polipion-meta">
              <p className="creation-date">
                <span className="meta-label">📅 Posted:</span> {formatDate(polipion.created_at)}
              </p>
              <p className="post-author">
                <span className="meta-label">👤 By:</span> @{polipion.username}
              </p>
            </div>

            <div className="polipion-stats">
              <div className="stat-item">
                <span className="stat-label">Politician:</span>
                <span className="stat-value">{polipion.politician_name || 'Unknown Politician'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Party:</span>
                <span className="stat-value party-badge">{polipion.party}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Country:</span>
                <span className="stat-value">{polipion.country}</span>
              </div>
            </div>

            <div className="polipion-opinion">
              <h3>Opinion</h3>
              <div className="opinion-text">
                <p>{polipion.user_opinion}</p>
              </div>
            </div>

            <div className="polipion-actions">
              <div className="vote-buttons">
                <button
                  className="upvote-btn"
                  onClick={handleUpvote}
                  title="Upvote this opinion"
                  disabled={!user}
                >
                  👍 {polipion.post_likes || 0}
                </button>
                <button
                  className="downvote-btn"
                  onClick={handleDownvote}
                  title="Downvote this opinion"
                  disabled={!user}
                >
                  👎 {polipion.post_dislikes || 0}
                </button>
              </div>
              {!user && (
                <p className="login-prompt">
                  <Link to="/login">Login</Link> to vote multiple times and comment
                </p>
              )}
              {user && (
                <p className="voting-info">
                  💡 You can vote as many times as you want!
                </p>
              )}
            </div>

            <div className="comments-section">
              <h3>Comments ({polipion.post_comments_number || 0})</h3>

              <form onSubmit={handleAddComment} className="add-comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your comment..."
                  rows="3"
                  className="comment-input"
                  disabled={submittingComment}
                />
                <button
                  type="submit"
                  className="submit-comment-btn"
                  disabled={submittingComment || !newComment.trim()}
                >
                  {submittingComment ? "Adding..." : "Add Comment"}
                </button>
              </form>

              <div className="comments-list">
                {polipion.all_comments && polipion.all_comments.length > 0 ? (
                  polipion.all_comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-date">{formatDate(comment.timestamp)}</span>
                      </div>
                      <div className="comment-text">{comment.text}</div>
                    </div>
                  ))
                ) : (
                  <p className="no-comments">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolipionDetails;