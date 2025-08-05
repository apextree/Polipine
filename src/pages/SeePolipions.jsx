import { useState, useEffect } from "react";
import Card from "../components/card";
import { supabase } from "../client";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./seePolipions.css";

const SeePolipions = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('created_at');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const location = useLocation();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchPosts();
  }, [location.pathname, sortBy, debouncedSearchTerm]);


  useEffect(() => {
    const handleFocus = () => {
      fetchPosts();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  
  const fetchPosts = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("polipions")
        .select("*");

      // Apply search filter if search term exists
      if (debouncedSearchTerm.trim()) {
        query = query.ilike('post_title', `%${debouncedSearchTerm}%`);
      }

      // Apply sorting
      if (sortBy === 'created_at') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'post_likes') {
        query = query.order('post_likes', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching polipions:", error);
        setPosts([]);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      alert("Unexpected error loading polipions: " + error.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading your Polipions...</h2>
      </div>
    );
  }

  return (
    <div className="ReadPosts">
      <div className="controls-section" style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search-control">
          <label htmlFor="search" className="control-label">Search:</label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title..."
            className="control-input"
          />
        </div>

        <div className="sort-control">
          <label htmlFor="sort" className="control-label">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="control-select"
          >
            <option value="created_at">Creation Time</option>
            <option value="post_likes">Upvotes</option>
          </select>
        </div>

        <button
          onClick={fetchPosts}
          className="refresh-btn"
        >
          Refresh
        </button>
      </div>
      
      {posts && posts.length > 0 ? (
        <div className="forum-posts-list">
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
          <h2>No Polipions to display 😔</h2>
          <p>No political opinions have been shared yet. Be the first to share your thoughts!</p>
          <Link to="/new">
            <button className="add-polipion-btn">
              Share Your First Opinion
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SeePolipions;
