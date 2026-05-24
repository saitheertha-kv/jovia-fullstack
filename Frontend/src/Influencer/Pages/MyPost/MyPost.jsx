import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import style from "./MyPost.module.css";

import {
  DynamicFeed,
  Favorite,
  ChatBubbleOutline,
  Image as ImageIcon,
  PlayCircleOutline,
  Inventory2,
  Forum,
} from "@mui/icons-material";

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const iid = sessionStorage.getItem("iid");

  useEffect(() => {
    if (!iid) {
      alert("Login required");
      return;
    }

    setLoading(true);

    axios
      .get(`http://127.0.0.1:8000/InfluencerPosts/${iid}/`)
      .then((res) => {
        setPosts(res.data.data || []);
      })
      .catch(() => {
        alert("Failed to load posts");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [iid]);

  const isVideo = (file) => {
    return file?.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  const isImage = (file) => {
    return file?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  };

  const totals = useMemo(() => {
    return posts.reduce(
      (acc, post) => {
        acc.posts += 1;
        acc.likes += Number(post.likes_count || 0);
        acc.comments += Number(post.comments_count || 0);
        return acc;
      },
      { posts: 0, likes: 0, comments: 0 }
    );
  }, [posts]);

  if (loading) {
    return <div className={style.loading}>Loading posts...</div>;
  }

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIcon}>
            <DynamicFeed />
          </div>

          <div>
            <h1>My Posts</h1>
            <p>Manage your uploaded content, engagement and audience comments</p>
          </div>
        </div>

        <div className={style.heroStats}>
          <div className={style.statCard}>
            <span className={style.statLabel}>Total Posts</span>
            <strong>{totals.posts}</strong>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Total Likes</span>
            <strong>{totals.likes}</strong>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Comments</span>
            <strong>{totals.comments}</strong>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className={style.emptyState}>
          <div className={style.emptyIcon}>
            <ImageIcon />
          </div>
          <h3>No Posts Added</h3>
          <p>Your uploaded influencer posts will appear here.</p>
        </div>
      ) : (
        <div className={style.grid}>
          {posts.map((p) => (
            <div key={p.id} className={style.postCard}>
              <div className={style.cardTopGlow} />

              <div className={style.postHeader}>
                <div className={style.productBadge}>
                  <Inventory2 fontSize="small" />
                  <span>{p.product_name}</span>
                </div>

                <div className={style.engagementRow}>
                  <div className={style.engagementBadge}>
                    <Favorite fontSize="small" />
                    <span>{p.likes_count}</span>
                  </div>

                  <div className={style.engagementBadge}>
                    <ChatBubbleOutline fontSize="small" />
                    <span>{p.comments_count}</span>
                  </div>
                </div>
              </div>

              <div className={style.mediaBox}>
                {p.file && isImage(p.file) && (
                  <img src={p.file} alt="post" className={style.mediaImage} />
                )}

                {p.file && isVideo(p.file) && (
                  <div className={style.videoWrap}>
                    <video src={p.file} controls className={style.mediaVideo} />
                    <div className={style.videoBadge}>
                      <PlayCircleOutline fontSize="small" />
                      <span>Video Post</span>
                    </div>
                  </div>
                )}

                {!p.file && (
                  <div className={style.noMedia}>
                    <ImageIcon />
                    <span>No File</span>
                  </div>
                )}
              </div>

              <div className={style.content}>
                <h3 className={style.sectionTitle}>Description</h3>
                <p className={style.description}>
                  {p.description || "No description available"}
                </p>
              </div>

              <div className={style.commentsSection}>
                <div className={style.commentsHeader}>
                  <div className={style.commentsTitle}>
                    <Forum fontSize="small" />
                    <span>Comments</span>
                  </div>
                  <span className={style.commentCount}>{p.comments_count}</span>
                </div>

                {p.comments && p.comments.length > 0 ? (
                  <div className={style.commentsList}>
                    {p.comments.map((c) => (
                      <div key={c.id} className={style.commentItem}>
                        <div className={style.commentAvatar}>
                          {c.user_name ? c.user_name.charAt(0).toUpperCase() : "U"}
                        </div>

                        <div className={style.commentBody}>
                          <span className={style.commentUser}>{c.user_name}</span>
                          <p className={style.commentText}>{c.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={style.noComments}>No Comments</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPost;