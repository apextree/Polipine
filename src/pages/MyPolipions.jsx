import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../client";
import Card from "../components/card";
import "./MyPolipions.css";

const MyPolipions = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (user) {
      fetchMyPolipions();
    }
  }, [user, sortBy]);

  const fetchMyPolipions = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("polipions")
        .select("*")
        .eq("username", user.username);

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'most_liked':
          query = query.order('post_likes', { ascending: false });
          break;
        case 'most_commented':
          query = query.order('post_comments_number', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching my polipions:", error);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (loading) {
    return (
      <div className="my-polipions-container">
        <div className="loading-container">
          <h2>Loading your polipions...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="my-polipions-container">
      <div className="my-polipions-header">
        <h1>My Polipions</h1>
        <p className="user-stats">
          You have created <strong>{posts.length}</strong> polipion{posts.length !== 1 ? 's' : ''}
        </p>
        
        <div className="controls-section">
          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select" 
              value={sortBy} 
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_liked">Most Liked</option>
              <option value="most_commented">Most Commented</option>
            </select>
          </div>
          
          <Link to="/new" className="add-polipion-btn">
            ➕ Create New Polipion
          </Link>
        </div>
      </div>

      {posts && posts.length > 0 ? (
        <div className="my-polipions-list">
          {posts.map((post) => (
            <Card
              key={post.id}
              id={post.id}
              post_title={post.post_title}
              party={post.party}
              country={post.country}
              user_opinion={post.user_opinion}
              post_likes={post.post_likes}
              post_dislikes={post.post_dislikes}
              created_at={post.created_at}
              image_url={post.image_url}
              politician_name={post.politician_name}
              username={post.username}
            />
          ))}
        </div>
      ) : (
        <div className="no-polipions">
          <h2>No Polipions Yet</h2>
          <p>You haven't created any polipions yet. Share your first political opinion!</p>
          <Link to="/new" className="add-polipion-btn">
            ➕ Create Your First Polipion
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyPolipions;
