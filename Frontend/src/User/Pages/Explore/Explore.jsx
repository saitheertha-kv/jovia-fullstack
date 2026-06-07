import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import style from "./Explore.module.css";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VerifiedIcon from "@mui/icons-material/Verified";
import CloseIcon from "@mui/icons-material/Close";
import ExploreIcon from "@mui/icons-material/TravelExplore";
import ImageIcon from "@mui/icons-material/Image";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import { Link } from "react-router";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get("http://127.0.0.1:8000/AllPosts/");
      
      if (res.data && Array.isArray(res.data.data)) {
        setPosts(res.data.data);
      } else {
        setPosts([]);
        setError("Received invalid data format from the server.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load posts. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return posts;

    return posts.filter((post) => {
      const name = post?.influencer_name || "";
      const desc = post?.description || "";
      return `${name} ${desc}`.toLowerCase().includes(query);
    });
  }, [posts, search]);

  const stats = useMemo(() => {
    if (!posts || posts.length === 0) {
      return { totalPosts: 0, totalInfluencers: 0, totalLikes: 0 };
    }

    const influencers = new Set(
      posts.filter(p => p?.influencer_id).map((post) => post.influencer_id)
    );
    
    const totalLikes = posts.reduce(
      (sum, post) => sum + (Number(post?.likes) || 0), 
      0
    );

    return {
      totalPosts: posts.length,
      totalInfluencers: influencers.size,
      totalLikes,
    };
  }, [posts]);

  // Handle broken image links
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/400x300?text=Media+Unavailable";
  };

  // Helper function to check if the file URL is a video
  const isVideo = (url) => {
    if (!url) return false;
    // Checks for common video extensions. Expand this list if your backend uses others.
    return url.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  return (
    <div className={style.page}>
      <div className={style.container}>
        <div className={style.hero}>
          <div className={style.heroLeft}>
            <div className={style.heroIconWrap}>
              <ExploreIcon className={style.heroIcon} />
            </div>

            <div>
              <h1 className={style.title}>Explore</h1>
              <p className={style.subtitle}>
                Discover influencer posts, view content quickly, and open profiles easily
              </p>
            </div>
          </div>

          <button className={style.refreshBtn} onClick={loadPosts} disabled={loading}>
            <RefreshIcon fontSize="small" className={loading ? style.spinning : ""} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>

        <div className={style.statsGrid}>
          {/* Stats Cards remain the same... */}
          <div className={style.statCard}>
            <div className={style.statIconWrap}><GridViewRoundedIcon fontSize="small" /></div>
            <div><h3>{stats.totalPosts}</h3><p>Total Posts</p></div>
          </div>
          <div className={style.statCard}>
            <div className={style.statIconWrap}><PersonIcon fontSize="small" /></div>
            <div><h3>{stats.totalInfluencers}</h3><p>Influencers</p></div>
          </div>
          <div className={style.statCard}>
            <div className={style.statIconWrap}><FavoriteIcon fontSize="small" /></div>
            <div><h3>{stats.totalLikes}</h3><p>Total Likes</p></div>
          </div>
        </div>

        <div className={style.toolbar}>
          <div className={style.toolbarText}>
            <h2>Discover Posts</h2>
            <p>{filteredPosts.length} of {posts.length} post{posts.length !== 1 ? "s" : ""} shown</p>
          </div>

          <div className={style.searchBox}>
            <SearchIcon className={style.searchIcon} />
            <input
              type="text"
              placeholder="Search by influencer or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={style.searchInput}
              maxLength={100}
            />
            {search && (
              <CloseIcon 
                className={style.clearSearchIcon} 
                onClick={() => setSearch("")} 
                style={{cursor: "pointer", opacity: 0.5}}
                fontSize="small"
              />
            )}
          </div>
        </div>

        {loading ? (
          <div className={style.stateCard}>
            <div className={style.loader}></div>
            <h3>Loading posts...</h3>
            <p>Please wait while we fetch trending content.</p>
          </div>
        ) : error ? (
          <div className={style.stateCard}>
            <div className={style.stateIconWrap} style={{ background: "#ffebee", color: "#d32f2f" }}>
              <CloseIcon className={style.stateIcon} />
            </div>
            <h3 style={{ color: "#d32f2f" }}>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={loadPosts} className={style.refreshBtn} style={{marginTop: "15px"}}>
              Try Again
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={style.stateCard}>
            <div className={style.stateIconWrap}>
              <SearchIcon className={style.stateIcon} />
            </div>
            <h3>No posts found</h3>
            <p>
              {search.trim() 
                ? `No results for "${search}". Try another keyword.` 
                : "There are currently no posts available."}
            </p>
          </div>
        ) : (
          <div className={style.grid}>
            {filteredPosts.map((post, index) => (
              <div
                key={post?.id || index}
                className={style.card}
                onClick={() => setSelectedPost(post)}
              >
                <div className={style.imageWrap}>
                  {/* --- MEDIA RENDERING LOGIC UPDATED HERE --- */}
                  {post?.file ? (
                    isVideo(post.file) ? (
                      <video 
                        src={post.file} 
                        className={style.cardImage} 
                        controls 
                        muted 
                        loop
                        playsInline
                      />
                    ) : (
                      <img 
                        src={post.file} 
                        alt="post" 
                        className={style.cardImage} 
                        onError={handleImageError} 
                      />
                    )
                  ) : (
                    <div className={style.noImage}>
                      <ImageIcon />
                      <span>No Media</span>
                    </div>
                  )}

                  <div className={style.imageOverlay}>
                    <div className={style.overlayTop}>
                      <span className={style.postBadge}>Post #{index + 1}</span>
                    </div>

                    <div className={style.overlayBottom}>
                      <div className={style.overlayStats}>
                        <span><FavoriteIcon fontSize="small" /> {post?.likes || 0}</span>
                        <span><ChatBubbleOutlineIcon fontSize="small" /> {post?.comments || 0}</span>
                      </div>

                      <button
                        type="button"
                        className={style.previewBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPost(post);
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className={style.cardContent}>
                  <div className={style.authorRow}>
                    <div className={style.avatar}>
                      {(post?.influencer_name || "I").charAt(0).toUpperCase()}
                    </div>

                    <div className={style.authorMeta}>
                      <div className={style.authorName}>
                        {post?.influencer_name || "Unknown Influencer"}
                        <VerifiedIcon className={style.verifyIcon} />
                      </div>
                      <div className={style.authorSub}>Influencer Post</div>
                    </div>
                  </div>

                  <p className={style.cardDescription}>
                    {post?.description || "No description available."}
                  </p>

                  <div className={style.cardFooter}>
                    <div className={style.inlineStats}>
                      <span><FavoriteIcon fontSize="small" /> {post?.likes || 0}</span>
                      <span><ChatBubbleOutlineIcon fontSize="small" /> {post?.comments || 0}</span>
                    </div>

                    {post?.influencer_id && (
                      <Link
                        to={`/user/influencer/${post.influencer_id}`}
                        className={style.viewProfileBtn}
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Profile
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL RENDERING LOGIC UPDATED HERE --- */}
      {selectedPost && (
        <div className={style.modalBackdrop} onClick={() => setSelectedPost(null)}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <button className={style.closeBtn} onClick={() => setSelectedPost(null)}>
              <CloseIcon />
            </button>

            <div className={style.modalImageWrap}>
              {selectedPost?.file ? (
                isVideo(selectedPost.file) ? (
                  <video 
                    src={selectedPost.file} 
                    className={style.modalImage} 
                    controls 
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={selectedPost.file}
                    alt="post"
                    className={style.modalImage}
                    onError={handleImageError}
                  />
                )
              ) : (
                <div className={style.modalNoImage}>
                  <ImageIcon />
                  <span>No Media Available</span>
                </div>
              )}
            </div>

            <div className={style.modalContent}>
              <div className={style.modalAuthorRow}>
                <div className={style.avatar}>
                  {(selectedPost?.influencer_name || "I").charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className={style.authorName}>
                    {selectedPost?.influencer_name || "Unknown Influencer"}
                    <VerifiedIcon className={style.verifyIcon} />
                  </div>
                  <div className={style.authorSub}>Influencer Post Preview</div>
                </div>
              </div>

              <p className={style.description}>
                {selectedPost?.description || "No description available."}
              </p>

              <div className={style.statsRow}>
                <div className={style.statItem}>
                  <FavoriteIcon />
                  <span>{selectedPost?.likes || 0} Likes</span>
                </div>
                <div className={style.statItem}>
                  <ChatBubbleOutlineIcon />
                  <span>{selectedPost?.comments || 0} Comments</span>
                </div>
              </div>

              {selectedPost?.influencer_id && (
                <Link
                  to={`/user/influencer/${selectedPost.influencer_id}`}
                  className={style.modalProfileBtn}
                  onClick={() => setSelectedPost(null)}
                >
                  View Influencer Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;