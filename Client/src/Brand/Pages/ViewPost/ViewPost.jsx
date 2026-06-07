import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import style from "./ViewPost.module.css";

import {
  DynamicFeed,
  Favorite,
  Comment,
  Inventory2,
  PlayCircle,
  Image as ImageIcon,
} from "@mui/icons-material";

const ViewPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const brandId = sessionStorage.getItem("bid");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      if (!brandId) {
        alert("Brand not logged in");
        return;
      }

      const res = await axios.get(
        `http://127.0.0.1:8000/BrandPosts/${brandId}/`
      );
      setPosts(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const totalLikes = posts.reduce(
      (sum, item) => sum + (Number(item.likes_count) || 0),
      0
    );
    const totalComments = posts.reduce(
      (sum, item) => sum + (Number(item.comments_count) || 0),
      0
    );

    return { totalPosts, totalLikes, totalComments };
  }, [posts]);

  if (loading) {
    return <div className={style.loading}>Loading posts...</div>;
  }

  return (
    <div className={style.page}>
      {/* Header */}
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIcon}>
            <DynamicFeed />
          </div>

          <div>
            <h1>My Product Posts</h1>
            <p>View all campaign posts related to your brand products</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={style.statsGrid}>
        <div className={style.statCard}>
          <div className={style.statIconWrap}>
            <DynamicFeed className={style.statIcon} />
          </div>
          <div>
            <h3>{stats.totalPosts}</h3>
            <p>Total Posts</p>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.statIconWrap}>
            <Favorite className={style.statIcon} />
          </div>
          <div>
            <h3>{stats.totalLikes}</h3>
            <p>Total Likes</p>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.statIconWrap}>
            <Comment className={style.statIcon} />
          </div>
          <div>
            <h3>{stats.totalComments}</h3>
            <p>Total Comments</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {posts.length === 0 ? (
        <div className={style.emptyState}>
          <DynamicFeed className={style.emptyIcon} />
          <h3>No posts found</h3>
          <p>Your brand does not have any posts yet.</p>
        </div>
      ) : (
        <div className={style.cardGrid}>
          {posts.map((item, index) => {
            const isVideo = item.file?.match(/\.(mp4|webm|ogg)$/i);

            return (
              <div key={index} className={style.postCard}>
                <div className={style.mediaWrap}>
                  {item.file ? (
                    isVideo ? (
                      <div className={style.videoBox}>
                        <video
                          src={`http://127.0.0.1:8000${item.file}`}
                          controls
                          className={style.media}
                        />
                        <div className={style.mediaBadge}>
                          <PlayCircle fontSize="small" />
                          <span>Video</span>
                        </div>
                      </div>
                    ) : (
                      <div className={style.imageBox}>
                        <img
                          src={`http://127.0.0.1:8000${item.file}`}
                          alt="post"
                          className={style.media}
                        />
                        <div className={style.mediaBadge}>
                          <ImageIcon fontSize="small" />
                          <span>Image</span>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className={style.noMedia}>
                      <ImageIcon className={style.noMediaIcon} />
                      <span>No Media</span>
                    </div>
                  )}
                </div>

                <div className={style.cardBody}>
                  <div className={style.productRow}>
                    <Inventory2 className={style.productIcon} />
                    <h3>{item.product_name}</h3>
                  </div>

                  <p className={style.description}>
                    {item.description || "No description available"}
                  </p>

                  <div className={style.cardFooter}>
                    <div className={style.metric}>
                      <Favorite fontSize="small" />
                      <span>{item.likes_count}</span>
                    </div>

                    <div className={style.metric}>
                      <Comment fontSize="small" />
                      <span>{item.comments_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewPost;