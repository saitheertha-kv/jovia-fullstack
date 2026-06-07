import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import style from "./ViewPost.module.css";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CampaignIcon from "@mui/icons-material/Campaign";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import GroupsIcon from "@mui/icons-material/Groups";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import InsightsIcon from "@mui/icons-material/Insights";
import VerifiedIcon from "@mui/icons-material/Verified";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Link } from "react-router";

const ViewPost = () => {
  const uid = sessionStorage.getItem("uid");

  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://127.0.0.1:8000/AllPosts/");
      const data = res.data.data || [];

      setPosts(data);

      data.forEach((p) => {
        loadComments(p.id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (pid) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/GetComments/${pid}/`);
      console.log(res);

      setComments((prev) => ({
        ...prev,
        [pid]: res.data.data || [],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const likePost = async (pid, index) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/ToggleLike/", {
        post_id: pid,
        user_id: uid,
      });

      const updated = [...posts];
      updated[index].likes = res.data.likes;
      setPosts(updated);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (pid, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [pid]: value,
    }));
  };

  const addComment = async (pid, index) => {
    try {
      const comment = commentInputs[pid];

      if (!comment || !comment.trim()) return;

      const res = await axios.post("http://127.0.0.1:8000/AddComment/", {
        post_id: pid,
        user_id: uid,
        comment: comment,
      });

      const updated = [...posts];
      updated[index].comments = res.data.comments;
      setPosts(updated);

      setCommentInputs((prev) => ({
        ...prev,
        [pid]: "",
      }));

      loadComments(pid);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPosts = posts.length;

  const totalLikes = useMemo(() => {
    return posts.reduce((sum, item) => sum + (Number(item.likes) || 0), 0);
  }, [posts]);

  const totalComments = useMemo(() => {
    return posts.reduce((sum, item) => sum + (Number(item.comments) || 0), 0);
  }, [posts]);


  const deleteComment = async (cid, pid) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/DeleteComment/${cid}/`, {
        data: {
          user_id: uid
        }
      });

      // reload comments
      loadComments(pid);

    } catch (error) {
      console.log(error);
    }
  };

  const isVideo = (url) => {
    if (!url) return false;
    // Get the file extension and handle potential query parameters
    const extension = url.split('.').pop().toLowerCase().split('?')[0];
    return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(extension);
  };

  return (
    <div className={style.page}>
      <div className={style.layout}>
        {/* LEFT SIDEBAR */}
        <aside className={style.sidebarLeft}>
          <div className={style.sideCard}>
            <div className={style.sideCardHeader}>
              <CampaignIcon className={style.sideIcon} />
              <h3>Feed Overview</h3>
            </div>

            <div className={style.statList}>
              <div className={style.statItem}>
                <span>Total Posts</span>
                <strong>{totalPosts}</strong>
              </div>

              <div className={style.statItem}>
                <span>Total Likes</span>
                <strong>{totalLikes}</strong>
              </div>

              <div className={style.statItem}>
                <span>Total Comments</span>
                <strong>{totalComments}</strong>
              </div>
            </div>
          </div>

          <div className={style.sideCard}>
            <div className={style.sideCardHeader}>
              <LocalFireDepartmentIcon className={style.sideIcon} />
              <h3>Trending Tips</h3>
            </div>

            <ul className={style.tipList}>
              <li>Engage with influencer content daily</li>
              <li>Check comments to track user reaction</li>
              <li>Popular posts usually get faster interaction</li>
              <li>Product visuals improve post engagement</li>
            </ul>
          </div>
        </aside>

        {/* CENTER CONTENT */}
        <main className={style.feed}>
          <div className={style.feedHeader}>
            <div>
              <h1>Community Posts</h1>
              <p>Explore influencer posts, reactions, and conversations</p>
            </div>

            <div className={style.feedBadge}>
              <InsightsIcon />
              <span>Live Feed</span>
            </div>
          </div>

          {loading ? (
            <div className={style.emptyBox}>Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className={style.emptyBox}>No posts available</div>
          ) : (
            <div className={style.postList}>
              {posts.map((p, i) => (
                <article key={p.id} className={style.postCard}>
                  {/* TOP */}
                  <div className={style.postTop}>
                    <div className={style.authorWrap}>
                      <div className={style.avatarCircle}>
                        {(p.influencer_name || "I").charAt(0).toUpperCase()}
                      </div>

                      <div className={style.authorInfo}>
                        <div className={style.authorLine}>
                          <h3>{p.influencer_name}</h3>
                          <VerifiedIcon className={style.verifyIcon} />
                        </div>
                        <p>Influencer Post</p>
                      </div>
                    </div>
                  </div>

                  {/* BODY */}
                  {/* BODY */}
                  <div className={style.postBody}>
                    <p className={style.description}>{p.description}</p>

                    {p.file ? (
                      <div className={style.imageWrap}>
                        {isVideo(p.file) ? (
                          <video
                            src={p.file}
                            controls
                            className={style.postImage}
                            controlsList="nodownload"
                          />
                        ) : (
                          <img src={p.file} alt="post" className={style.postImage} />
                        )}
                      </div>
                    ) : (
                      <div className={style.noImageBox}>
                        <ImageIcon />
                        <span>No media available</span>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className={style.postActions}>
                    <button
                      type="button"
                      className={style.actionBtn}
                      onClick={() => likePost(p.id, i)}
                    >
                      <FavoriteIcon />
                      <span>{p.likes} Likes</span>
                    </button>

                    <div className={style.commentCount}>
                      <ChatBubbleOutlineIcon />
                      <span>{p.comments} Comments</span>
                    </div>
                    <Link to={`/user/viewmore/${p.product_id}`} className={style.viewMoreBtn}>
                      View More
                    </Link>
                  </div>

                  {/* COMMENT INPUT */}
                  <div className={style.commentInputBox}>
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[p.id] || ""}
                      onChange={(e) => handleInputChange(p.id, e.target.value)}
                      className={style.commentInput}
                    />

                    <button
                      type="button"
                      className={style.sendBtn}
                      onClick={() => addComment(p.id, i)}
                    >
                      <SendIcon />
                    </button>

                  </div>

                  {/* COMMENTS */}
                  <div className={style.commentSection}>
                    {(comments[p.id] || []).length === 0 ? (
                      <div className={style.noComment}>No comments yet</div>
                    ) : (
                      (comments[p.id] || []).map((c) => (
                        <div key={c.comment_id} className={style.commentCard}>
                          <div className={style.commentMain}>
                            <div className={style.commentAvatar}>
                              {(c.user || "U").charAt(0).toUpperCase()}
                            </div>

                            <div className={style.commentContent}>
                              <div className={style.commentUser}>{c.user}</div>
                              <div className={style.commentText}>{c.comment}</div>
                            </div>

                            {String(c.user_id) === String(uid) && (
                              <button
                                type="button"
                                className={style.deleteBtn}
                                onClick={() => deleteComment(c.comment_id, p.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>

                          {c.replies && c.replies.length > 0 && (
                            <div className={style.replyWrap}>
                              {c.replies.map((r, index) => (
                                <div key={index} className={style.replyCard}>
                                  <div className={style.replyUser}>{r.user}</div>
                                  <div className={style.replyText}>{r.reply}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className={style.sidebarRight}>
          <div className={style.sideCard}>
            <div className={style.sideCardHeader}>
              <TrendingUpIcon className={style.sideIcon} />
              <h3>Highlights</h3>
            </div>

            <div className={style.highlightList}>
              <div className={style.highlightItem}>
                <span>Most active area</span>
                <strong>Comments</strong>
              </div>

              <div className={style.highlightItem}>
                <span>User engagement</span>
                <strong>Growing</strong>
              </div>

              <div className={style.highlightItem}>
                <span>Feed type</span>
                <strong>Influencer Content</strong>
              </div>
            </div>
          </div>

          <div className={style.sideCard}>
            <div className={style.sideCardHeader}>
              <GroupsIcon className={style.sideIcon} />
              <h3>Quick Notes</h3>
            </div>

            <ul className={style.tipList}>
              <li>Use likes to identify popular posts</li>
              <li>Read replies to understand discussion depth</li>
              <li>High comment count means strong engagement</li>
              <li>Visual posts usually perform better</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ViewPost;