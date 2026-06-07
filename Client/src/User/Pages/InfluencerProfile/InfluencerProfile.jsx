import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import style from "./InfluencerProfile.module.css";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VerifiedIcon from "@mui/icons-material/Verified";
import ImageIcon from "@mui/icons-material/Image";
import PersonIcon from "@mui/icons-material/Person";
import LinkIcon from "@mui/icons-material/Link";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import CollectionsIcon from "@mui/icons-material/Collections";

const InfluencerProfile = () => {
  const { iid } = useParams();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added dedicated error state

  useEffect(() => {
    loadAll();
  }, [iid]);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileRes, postsRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/UserInfluencerProfile/${iid}/`),
        axios.get(`http://127.0.0.1:8000/UserInfluencerPosts/${iid}/`),
      ]);

      setProfile(profileRes.data?.data || null);
      
      // Ensure posts is always an array
      if (postsRes.data && Array.isArray(postsRes.data.data)) {
        setPosts(postsRes.data.data);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load influencer details. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (!posts || posts.length === 0) return { totalPosts: 0, totalLikes: 0, totalComments: 0 };

    const totalLikes = posts.reduce(
      (sum, item) => sum + (Number(item?.likes_count) || 0),
      0
    );
    const totalComments = posts.reduce(
      (sum, item) => sum + (Number(item?.comments_count) || 0),
      0
    );

    return {
      totalPosts: posts.length,
      totalLikes,
      totalComments,
    };
  }, [posts]);

  // Handle broken profile or post images
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/400x400?text=Image+Unavailable";
  };

  // Helper function to detect videos
  const isVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  if (loading) {
    return (
      <div className={style.page}>
        <div className={style.loadingCard}>
          <div className={style.loader}></div>
          <h3>Loading profile...</h3>
          <p>Please wait while we fetch influencer details and posts.</p>
        </div>
      </div>
    );
  }

  // Graceful error state handling
  if (error) {
    return (
      <div className={style.page}>
        <div className={style.emptyState}>
          <div className={style.emptyIconWrap} style={{ background: "#ffebee", color: "#d32f2f" }}>
            <CloseIcon className={style.emptyIcon} />
          </div>
          <h3 style={{ color: "#d32f2f" }}>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            onClick={loadAll} 
            style={{ marginTop: "15px", padding: "10px 20px", borderRadius: "8px", border: "none", background: "#1976d2", color: "white", cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={style.page}>
        <div className={style.emptyState}>
          <div className={style.emptyIconWrap}>
            <PersonIcon className={style.emptyIcon} />
          </div>
          <h3>Profile not found</h3>
          <p>Unable to load this influencer profile right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.avatarWrap}>
            {profile?.photo ? (
              <img 
                src={profile.photo} 
                alt="profile" 
                className={style.avatar} 
                onError={handleImageError} 
              />
            ) : (
              <div className={style.avatarFallback}>
                {(profile?.name || "I").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className={style.profileInfo}>
            <div className={style.nameRow}>
              <h1>{profile?.name || "Unknown Influencer"}</h1>
              <VerifiedIcon className={style.verifyIcon} />
            </div>

            <p className={style.roleText}>{profile?.link || "Influencer"}</p>

            <div className={style.profileMeta}>
              <span className={style.metaPill}>
                <GridViewRoundedIcon fontSize="small" />
                {stats.totalPosts} Posts
              </span>

              <span className={style.metaPill}>
                <FavoriteIcon fontSize="small" />
                {stats.totalLikes} Likes
              </span>

              <span className={style.metaPill}>
                <ChatBubbleOutlineIcon fontSize="small" />
                {stats.totalComments} Comments
              </span>

              {profile?.link && (
                <span className={style.metaPill}>
                  <LinkIcon fontSize="small" />
                  Profile Link
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={style.statsGrid}>
        <div className={style.statCard}>
          <div className={style.statIconWrap}>
            <CollectionsIcon fontSize="small" />
          </div>
          <div>
            <h3>{stats.totalPosts}</h3>
            <p>Total Posts</p>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.statIconWrap}>
            <FavoriteIcon fontSize="small" />
          </div>
          <div>
            <h3>{stats.totalLikes}</h3>
            <p>Total Likes</p>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.statIconWrap}>
            <ChatBubbleOutlineIcon fontSize="small" />
          </div>
          <div>
            <h3>{stats.totalComments}</h3>
            <p>Total Comments</p>
          </div>
        </div>
      </div>

      <div className={style.sectionHeader}>
        <div>
          <h2>Posts Gallery</h2>
          <p>
            {posts.length} post{posts.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className={style.grid}>
        {posts.length === 0 ? (
          <div className={style.emptyState}>
            <div className={style.emptyIconWrap}>
              <ImageIcon className={style.emptyIcon} />
            </div>
            <h3>No posts available</h3>
            <p>This influencer has not uploaded any posts yet.</p>
          </div>
        ) : (
          posts.map((p, index) => (
            <div
              key={p?.id || index}
              className={style.card}
              onClick={() => setSelectedPost(p)}
            >
              <div className={style.imageWrap}>
                {/* MEDIA RENDERING LOGIC FOR GRID */}
                {p?.file ? (
                  isVideo(p.file) ? (
                    <video 
                      src={p.file} 
                      className={style.cardImage} 
                      controls 
                      muted 
                      loop 
                      playsInline 
                    />
                  ) : (
                    <img 
                      src={p.file} 
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

                <div className={style.overlay}>
                  <div className={style.overlayTop}>
                    <span className={style.postBadge}>Post #{index + 1}</span>
                  </div>

                  <div className={style.overlayBottom}>
                    <div className={style.overlayStats}>
                      <span>
                        <FavoriteIcon fontSize="small" /> {p?.likes_count || 0}
                      </span>
                      <span>
                        <ChatBubbleOutlineIcon fontSize="small" />{" "}
                        {p?.comments_count || 0}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={style.previewBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(p);
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPost && (
        <div
          className={style.modalBackdrop}
          onClick={() => setSelectedPost(null)}
        >
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={style.closeBtn}
              onClick={() => setSelectedPost(null)}
            >
              <CloseIcon />
            </button>

            <div className={style.modalImageWrap}>
              {/* MEDIA RENDERING LOGIC FOR MODAL */}
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
              <div className={style.modalProfileRow}>
                <div className={style.smallAvatar}>
                  {profile?.photo ? (
                    <img
                      src={profile.photo}
                      alt="profile"
                      className={style.smallAvatarImage}
                      onError={handleImageError}
                    />
                  ) : (
                    <span>{(profile?.name || "I").charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div>
                  <div className={style.modalName}>
                    {profile?.name || "Unknown Influencer"}
                    <VerifiedIcon className={style.verifyIcon} />
                  </div>
                  <div className={style.modalSub}>Influencer Post Preview</div>
                </div>
              </div>

              <div className={style.statsRow}>
                <div className={style.statItem}>
                  <FavoriteIcon />
                  <span>{selectedPost?.likes_count || 0} Likes</span>
                </div>

                <div className={style.statItem}>
                  <ChatBubbleOutlineIcon />
                  <span>{selectedPost?.comments_count || 0} Comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerProfile;