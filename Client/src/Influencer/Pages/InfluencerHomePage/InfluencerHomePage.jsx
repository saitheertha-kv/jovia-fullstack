import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import style from "./InfluencerHomePage.module.css";

import CampaignIcon from "@mui/icons-material/Campaign";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LinkIcon from "@mui/icons-material/Link";
import AddLinkIcon from "@mui/icons-material/AddLink";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import BarChartIcon from "@mui/icons-material/BarChart";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const InfluencerHomePage = () => {
  const navigate = useNavigate();
  const iid = sessionStorage.getItem("iid");
  const influencerName = localStorage.getItem("name") || "Influencer";

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add link modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);

  useEffect(() => {
    if (!iid) { navigate("/login"); return; }
    fetchAll();
  }, [iid]);

  const fetchAll = async () => {
    try {
      const [profRes, postRes, reqRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/InfluencerProfile/${iid}/`),
        axios.get(`http://127.0.0.1:8000/InfluencerPosts/${iid}/`),
        axios.get(`http://127.0.0.1:8000/InfluencerRequests/${iid}/`),
      ]);
      setProfile(profRes.data.data);
      setPosts(postRes.data.data || []);
      setRequests(reqRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async () => {
    if (!linkUrl.trim()) return;
    setLinkLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/addlink/", {
        url: linkUrl,
        influencerid: iid,
      });
      alert("Link added successfully!");
      setLinkUrl("");
      setShowLinkModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add link");
    } finally {
      setLinkLoading(false);
    }
  };

  const handleAccept = async (rid) => {
    try {
      await axios.get(`http://127.0.0.1:8000/AcceptRequest/${rid}/`);
      setRequests((prev) =>
        prev.map((r) => (r.id === rid ? { ...r, status: 1 } : r))
      );
    } catch (err) { console.error(err); }
  };

  const handleReject = async (rid) => {
    try {
      await axios.get(`http://127.0.0.1:8000/RejectRequest/${rid}/`);
      setRequests((prev) =>
        prev.map((r) => (r.id === rid ? { ...r, status: 2 } : r))
      );
    } catch (err) { console.error(err); }
  };

  const pendingReqs = requests.filter((r) => String(r.status) === "0");
  const acceptedReqs = requests.filter((r) => String(r.status) === "1");
  const rejectedReqs = requests.filter((r) => String(r.status) === "2");

  const totalLikes = posts.reduce((s, p) => s + (p.likes_count || 0), 0);
  const totalComments = posts.reduce((s, p) => s + (p.comments_count || 0), 0);

  const statCards = [
    { icon: <PhotoCameraOutlinedIcon />, label: "Total Posts", value: posts.length, accent: "primary" },
    { icon: <FavoriteBorderIcon />, label: "Total Likes", value: totalLikes, accent: "secondary" },
    { icon: <ChatBubbleOutlineIcon />, label: "Comments", value: totalComments, accent: "info" },
    { icon: <PendingActionsIcon />, label: "Pending Deals", value: pendingReqs.length, accent: "warning" },
  ];

  const getStatusInfo = (status) => {
    const s = String(status);
    if (s === "0") return { label: "Pending", cls: style.badgePending, icon: <PendingActionsIcon fontSize="inherit" /> };
    if (s === "1") return { label: "Accepted", cls: style.badgeAccepted, icon: <CheckCircleOutlineIcon fontSize="inherit" /> };
    return { label: "Rejected", cls: style.badgeRejected, icon: <CancelOutlinedIcon fontSize="inherit" /> };
  };
   const isVideo = (url) => {
  return /\.(mp4|webm|ogg)$/i.test(url);
};
  if (loading) {
    return (
      <div className={style.loadingPage}>
        <div className={style.loadingOrb} />
        <div className={style.loadingContent}>
          <div className={style.loadingSpinner} />
          <p>Loading your creator dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.page}>
      

      {/* ── HERO ── */}
      <section className={style.hero}>
        <div className={style.heroOrb1} />
        <div className={style.heroOrb2} />
        <div className={style.heroOrb3} />

        <div className={style.heroLeft}>
          <div className={style.avatarWrap}>
            {profile?.influencer_photo ? (
              <img src={profile.influencer_photo} alt={influencerName} className={style.avatar} />
            ) : (
              <div className={style.avatarFallback}>
                {influencerName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className={style.avatarVerified}>
              <VerifiedIcon fontSize="inherit" />
            </div>
          </div>

          <div className={style.heroText}>
            <div className={style.heroBadge}>
              <AutoAwesomeIcon fontSize="small" />
              <span>Creator Dashboard</span>
            </div>
            <h1 className={style.heroTitle}>
              Hey, <span className={style.heroGradient}>{influencerName}</span> 👋
            </h1>
            <div className={style.heroMeta}>
              {(profile?.place_name || profile?.district_name) && (
                <span className={style.heroMetaItem}>
                  <PlaceOutlinedIcon fontSize="inherit" />
                  {profile.place_name && `${profile.place_name}, `}{profile.district_name}
                </span>
              )}
              {profile?.influencer_link && (
                <a
                  href={profile.influencer_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={style.heroMetaLink}
                >
                  <LinkIcon fontSize="inherit" />
                  My Channel
                  <OpenInNewIcon fontSize="inherit" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={style.heroActions}>
          <Link to="/influencer/addpost" className={style.actionBtn}>
            <AddCircleOutlineIcon fontSize="small" />
            New Post
          </Link>
          <button
            className={style.actionBtnSecondary}
            onClick={() => setShowLinkModal(true)}
          >
            <AddLinkIcon fontSize="small" />
            Add Link
          </button>
          <Link to="/influencer/mypost" className={style.actionBtnSecondary}>
            <CampaignIcon fontSize="small" />
            My Posts
          </Link>
        </div>
      </section>

      {/* ── STAT CARDS ── */}
      <section className={style.statsGrid}>
        {statCards.map((s, i) => (
          <div className={`${style.statCard} ${style[`statCard_${s.accent}`]}`} key={i}
            style={{ animationDelay: `${i * 0.07}s` }}>
            <div className={style.statIconWrap}>{s.icon}</div>
            <div className={style.statInfo}>
              <span className={style.statValue}>{s.value}</span>
              <span className={style.statLabel}>{s.label}</span>
            </div>
            <TrendingUpIcon className={style.statTrend} fontSize="small" />
          </div>
        ))}
      </section>

      {/* ── MAIN GRID ── */}
      <div className={style.mainGrid}>

        {/* ── POSTS ── */}
        <section className={style.card}>
          <div className={style.cardHeader}>
            <div className={style.cardHeaderLeft}>
              <div className={style.cardIconWrap}>
                <PhotoCameraOutlinedIcon />
              </div>
              <div>
                <h2 className={style.cardTitle}>My Posts</h2>
                <p className={style.cardSub}>{posts.length} published</p>
              </div>
            </div>
            <Link to="/influencer/mypost" className={style.cardLink}>
              View All <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className={style.emptyState}>
              <PhotoCameraOutlinedIcon />
              <p>No posts yet</p>
              <Link to="/influencer/addpost" className={style.emptyBtn}>Create your first post</Link>
            </div>
          ) : (
            <div className={style.postsMasonry}>
              {posts.slice(0, 6).map((p, i) => (
                <div
                  className={`${style.postThumb} ${i === 0 ? style.postThumbFeatured : ""}`}
                  key={p.id}
                >
                  <div className={style.postThumbMedia}>
                    {p.file ? (
  isVideo(p.file) ? (
    <video
      src={p.file}
      className={style.postThumbImg}
      autoPlay
      muted
      loop
      playsInline
    />
  ) : (
    <img
      src={p.file}
      alt="post"
      className={style.postThumbImg}
    />
  )
) : (
  <div className={style.postThumbFallback}>
    <CampaignIcon />
  </div>
)}
                    <div className={style.postThumbOverlay}>
                      <span><FavoriteIcon fontSize="inherit" /> {p.likes_count}</span>
                      <span><ChatBubbleOutlineIcon fontSize="inherit" /> {p.comments_count}</span>
                    </div>
                  </div>
                  {i === 0 && (
                    <div className={style.postThumbBody}>
                      <span className={style.postThumbProduct}>
                        <LocalOfferOutlinedIcon fontSize="inherit" /> {p.product_name}
                      </span>
                      <p className={style.postThumbDesc}>
                        {p.description?.slice(0, 80)}{p.description?.length > 80 ? "…" : ""}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── BRAND REQUESTS ── */}
        <section className={style.card}>
          <div className={style.cardHeader}>
            <div className={style.cardHeaderLeft}>
              <div className={`${style.cardIconWrap} ${style.iconWarnAccent}`}>
                <StorefrontIcon />
              </div>
              <div>
                <h2 className={style.cardTitle}>Brand Requests</h2>
                <p className={style.cardSub}>{requests.length} total</p>
              </div>
            </div>
            <Link to="/influencer/acceptedRequests" className={style.cardLink}>
              View All <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>

          {/* summary pills */}
          <div className={style.reqSummary}>
            <div className={style.reqPill}>
              <PendingActionsIcon fontSize="small" />
              <span>{pendingReqs.length} Pending</span>
            </div>
            <div className={`${style.reqPill} ${style.reqPillAccepted}`}>
              <CheckCircleOutlineIcon fontSize="small" />
              <span>{acceptedReqs.length} Accepted</span>
            </div>
            <div className={`${style.reqPill} ${style.reqPillRejected}`}>
              <CancelOutlinedIcon fontSize="small" />
              <span>{rejectedReqs.length} Rejected</span>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className={style.emptyState}>
              <StorefrontIcon />
              <p>No brand requests yet</p>
              <p className={style.emptyHint}>Brands will send collaboration requests here</p>
            </div>
          ) : (
            <div className={style.requestList}>
              {requests.slice(0, 5).map((r) => {
                const si = getStatusInfo(r.status);
                const isPending = String(r.status) === "0";
                return (
                  <div className={style.requestRow} key={r.id}>
                    <div className={style.requestBrandAvatar}>
                      {r.brand_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className={style.requestInfo}>
                      <span className={style.requestBrand}>{r.brand_name}</span>
                      <span className={style.requestProduct}>
                        <LocalOfferOutlinedIcon fontSize="inherit" /> {r.product_name}
                      </span>
                    </div>
                    <div className={style.requestRight}>
                      <span className={style.requestAmount}>₹{r.amount}</span>
                      {isPending ? (
                        <div className={style.requestActions}>
                          <button
                            className={style.acceptBtn}
                            onClick={() => handleAccept(r.id)}
                          >
                            <CheckCircleOutlineIcon fontSize="inherit" /> Accept
                          </button>
                          <button
                            className={style.rejectBtn}
                            onClick={() => handleReject(r.id)}
                          >
                            <CancelOutlinedIcon fontSize="inherit" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`${style.requestBadge} ${si.cls}`}>
                          {si.icon} {si.label}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── ENGAGEMENT OVERVIEW ── */}
      {posts.length > 0 && (
        <section className={style.engagementCard}>
          <div className={style.cardHeader}>
            <div className={style.cardHeaderLeft}>
              <div className={`${style.cardIconWrap} ${style.iconSecondaryAccent}`}>
                <BarChartIcon />
              </div>
              <div>
                <h2 className={style.cardTitle}>Engagement Overview</h2>
                <p className={style.cardSub}>Your top performing content</p>
              </div>
            </div>
          </div>

          <div className={style.engagementGrid}>
            {posts.slice(0, 4).map((p) => {
              const maxLikes = Math.max(...posts.map((x) => x.likes_count || 0), 1);
              const pct = Math.round(((p.likes_count || 0) / maxLikes) * 100);
              return (
                <div className={style.engagementItem} key={p.id}>
                  <div className={style.engagementThumb}>
                   {p.file ? (
  isVideo(p.file) ? (
    <video
      src={p.file}
      className={style.postThumbImg}
      autoPlay
      muted
      loop
      playsInline
    />
  ) : (
    <img
      src={p.file}
      alt="post"
      className={style.postThumbImg}
    />
  )
) : (
  <div className={style.postThumbFallback}>
    <CampaignIcon />
  </div>
)}
                  </div>
                  <div className={style.engagementBody}>
                    <p className={style.engagementProduct}>
                      <LocalOfferOutlinedIcon fontSize="inherit" /> {p.product_name}
                    </p>
                    <div className={style.engagementBar}>
                      <div className={style.engagementBarFill} style={{ width: `${pct}%` }} />
                    </div>
                    <div className={style.engagementStats}>
                      <span><FavoriteBorderIcon fontSize="inherit" /> {p.likes_count}</span>
                      <span><ChatBubbleOutlineIcon fontSize="inherit" /> {p.comments_count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── QUICK ACTIONS ── */}
      <section className={style.quickActions}>
        <div className={style.quickActionsOrb} />
        <h3 className={style.quickActionsTitle}>Quick Actions</h3>
        <div className={style.quickActionsGrid}>
          {[
            { icon: <AddCircleOutlineIcon />, label: "New Post", to: "/influencer/", accent: "primary" },
            { icon: <StorefrontIcon />, label: "Brand Requests", to: "/influencer/", accent: "warning" },
            { icon: <CampaignIcon />, label: "All Posts", to: "/influencer/", accent: "secondary" },
            { icon: <AddLinkIcon />, label: "Add Link", onClick: () => setShowLinkModal(true), accent: "info" },
            { icon: <BarChartIcon />, label: "Analytics", to: "/influencer/", accent: "success" },
            { icon: <VerifiedIcon />, label: "My Profile", to: "/influencer/", accent: "primary" },
          ].map((a, i) =>
            a.onClick ? (
              <button
                key={i}
                onClick={a.onClick}
                className={`${style.quickActionCard} ${style[`qa_${a.accent}`]}`}
              >
                <div className={style.quickActionIcon}>{a.icon}</div>
                <span>{a.label}</span>
              </button>
            ) : (
              <Link
                key={i}
                to={a.to}
                className={`${style.quickActionCard} ${style[`qa_${a.accent}`]}`}
              >
                <div className={style.quickActionIcon}>{a.icon}</div>
                <span>{a.label}</span>
              </Link>
            )
          )}
        </div>
      </section>

      {/* ── ADD LINK MODAL ── */}
      {showLinkModal && (
        <div className={style.modalOverlay} onClick={() => setShowLinkModal(false)}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <div className={style.modalIconWrap}>
                <AddLinkIcon />
              </div>
              <div>
                <h3 className={style.modalTitle}>Add a Link</h3>
                <p className={style.modalSub}>Share your channel, portfolio or social profile</p>
              </div>
            </div>

            <div className={style.modalField}>
              <label className={style.modalLabel}>URL</label>
              <div className={style.modalInputWrap}>
                <LinkIcon className={style.modalInputIcon} />
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://youtube.com/yourchannel"
                  className={style.modalInput}
                />
              </div>
            </div>

            <div className={style.modalFooter}>
              <button
                className={style.modalPrimaryBtn}
                onClick={handleAddLink}
                disabled={linkLoading || !linkUrl.trim()}
              >
                {linkLoading ? "Adding…" : "Add Link"}
              </button>
              <button
                className={style.modalSecondaryBtn}
                onClick={() => setShowLinkModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerHomePage;