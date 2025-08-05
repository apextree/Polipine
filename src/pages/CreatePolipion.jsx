import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./createPolipion.css";
import { supabase } from "../client";

const CreatePolipion = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState({
    post_title: "",
    politician_name: "",
    party: "",
    country: "",
    user_opinion: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const createPost = async (event) => {
    event.preventDefault();

    if (!post.post_title || !post.politician_name || !post.party || !post.country || !post.user_opinion) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);

    try {
      console.log("Creating Polipion:", post);

      const { data, error } = await supabase
        .from("polipions")
        .insert({
          username: user.username,
          politician_name: post.politician_name,
          party: post.party,
          country: post.country,
          user_opinion: post.user_opinion,
          post_title: post.post_title,
          image_url: post.image_url || null,
          post_likes: 0,
          post_dislikes: 0,
          post_comments_number: 0,
          all_comments: []
        })
        .select();

      if (error) {
        console.error("Error creating Polipion:", error);
        alert("Error creating Polipion: " + error.message);
        setLoading(false);
        return;
      }

      console.log("Polipion created successfully:", data);

      setPost({
        post_title: "",
        politician_name: "",
        party: "",
        country: "",
        user_opinion: "",
        image_url: "",
      });

      setTimeout(() => {
        navigate("/polipions");
      }, 500);

    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-polipion-container">
      <div className="create-form-wrapper">
        <h1>Share Your Political Opinion</h1>
        <div className="polipion-preview">
          <p>Share your thoughts about politicians, parties, and political issues!</p>
        </div>

        <form className="create-form" onSubmit={createPost}>
          <div className="form-group">
            <label htmlFor="post_title">Post Title *</label>
            <input
              type="text"
              value={post.post_title}
              id="post_title"
              name="post_title"
              onChange={handleChange}
              placeholder="Enter a title for your opinion"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="politician_name">Politician Name *</label>
            <input
              type="text"
              value={post.politician_name}
              id="politician_name"
              name="politician_name"
              onChange={handleChange}
              placeholder="e.g., Joe Biden, Donald Trump, Justin Trudeau"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="party">Political Party *</label>
            <input
              type="text"
              value={post.party}
              id="party"
              name="party"
              onChange={handleChange}
              placeholder="e.g., Democratic, Republican, Independent"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country *</label>
            <input
              type="text"
              value={post.country}
              id="country"
              name="country"
              onChange={handleChange}
              placeholder="e.g., United States, Canada, United Kingdom"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user_opinion">Your Opinion *</label>
            <textarea
              value={post.user_opinion}
              id="user_opinion"
              name="user_opinion"
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
              value={post.image_url}
              id="image_url"
              name="image_url"
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <button
            type="submit"
            className="create-btn"
            disabled={loading}
          >
            {loading ? "Sharing..." : "Share Opinion"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePolipion;
