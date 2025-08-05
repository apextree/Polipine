import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./editPolipion.css";
import { supabase } from "../client";

const EditPolipion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState({
    id: null,
    post_title: "",
    politician_name: "",
    party: "",
    country: "",
    user_opinion: "",
    image_url: "",
    username: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from("polipions")
      .select()
      .eq("id", id)
      .single();

    if (data) {
      // Check if user owns this post
      if (user && data.username !== user.username) {
        alert("You can only edit your own posts");
        navigate("/polipions");
        return;
      }
      setPost(data);
    }
    setLoading(false);
  };

  const updatePost = async (event) => {
    event.preventDefault();

    if (!post.post_title || !post.politician_name || !post.party || !post.country || !post.user_opinion) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const { error } = await supabase
        .from("polipions")
        .update({
          post_title: post.post_title,
          politician_name: post.politician_name,
          party: post.party,
          country: post.country,
          user_opinion: post.user_opinion,
          image_url: post.image_url || null,
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating Polipion:", error);
        alert("Error updating Polipion: " + error.message);
        return;
      }

      navigate("/polipions");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred: " + error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const deletePolipion = async (event) => {
    event.preventDefault();

    if (window.confirm('Are you sure you want to delete this Polipion?')) {
      try {
        const { error } = await supabase.from("polipions").delete().eq("id", id);
        if (error) {
          console.error("Error deleting Polipion:", error);
          alert("Error deleting Polipion: " + error.message);
          return;
        }
        navigate("/polipions");
      } catch (error) {
        console.error("Unexpected error:", error);
        alert("Unexpected error occurred: " + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading Polipion data...</h2>
      </div>
    );
  }

  return (
    <div className="edit-polipion-container">
      <div className="edit-form-wrapper">
        <h1>Edit Political Opinion</h1>

        <form className="edit-form">
          <div className="form-group">
            <label htmlFor="post_title">Post Title *</label>
            <input
              type="text"
              id="post_title"
              name="post_title"
              value={post.post_title}
              onChange={handleChange}
              placeholder="Enter a title for your opinion"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="politician_name">Politician Name *</label>
            <input
              type="text"
              id="politician_name"
              name="politician_name"
              value={post.politician_name}
              onChange={handleChange}
              placeholder="e.g., Joe Biden, Donald Trump, Justin Trudeau"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="party">Political Party *</label>
            <input
              type="text"
              id="party"
              name="party"
              value={post.party}
              onChange={handleChange}
              placeholder="e.g., Democratic, Republican, Independent"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country *</label>
            <input
              type="text"
              id="country"
              name="country"
              value={post.country}
              onChange={handleChange}
              placeholder="e.g., United States, Canada, United Kingdom"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user_opinion">Your Opinion *</label>
            <textarea
              id="user_opinion"
              name="user_opinion"
              value={post.user_opinion}
              onChange={handleChange}
              placeholder="Share your detailed political opinion..."
              required
              rows="6"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Image URL (optional)</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={post.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="update-btn" onClick={updatePost}>
              ✅ Update Opinion
            </button>
            <button type="button" className="delete-btn" onClick={deletePolipion}>
              🗑️ Delete Opinion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPolipion;
