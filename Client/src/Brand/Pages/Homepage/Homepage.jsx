import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import style from "./BrandHomePage.module.css";

import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CampaignIcon from "@mui/icons-material/Campaign";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

const BrandHomePage = () => {
  const navigate = useNavigate();
  const bid = sessionStorage.getItem("bid");
  const brandName = localStorage.getItem("name") || "Brand";

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bid) { navigate("/login"); return; }
    fetchAll();
  }, [bid]);

  const fetchAll = async () => {
    try {
      const [profRes, prodRes, reqRes, postRes, eventRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/BrandProfile/${bid}/`),
        axios.get(`http://127.0.0.1:8000/BrandProduct/${bid}/`),
        axios.get(`http://127.0.0.1:8000/BrandRequests/${bid}/`),
        axios.get(`http://127.0.0.1:8000/BrandPosts/${bid}/`),
        axios.get(`http://127.0.0.1:8000/BrandEvent/${bid}/`),
      ]);
      setProfile(profRes.data.data);
      setProducts(prodRes.data.data || []);
      setRequests(reqRes.data.data || []);
      setPosts(postRes.data.data || []);
      setEvents(eventRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingRequests = requests.filter((r) => String(r.status) === "0");
  const acceptedRequests = requests.filter((r) => String(r.status) === "1");
  const rejectedRequests = requests.filter((r) => String(r.status) === "2");

  const totalLikes = posts.reduce((sum, p) => sum + (p.likes_count || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.comments_count || 0), 0);

  const statCards = [
    {
      icon: <InventoryOutlinedIcon />,
      label: "Products",
      value: products.length,
      accent: "primary",
      link: `/brand/`,
    },
    {
      icon: <PendingActionsIcon />,
      label: "Pending Requests",
      value: pendingRequests.length,
      accent: "warning",
      link: `/brand/`,
    },
    {
      icon: <CampaignIcon />,
      label: "Active Campaigns",
      value: acceptedRequests.length,
      accent: "success",
      link: `/brand/`,
    },
    {
      icon: <TrendingUpIcon />,
      label: "Total Likes",
      value: totalLikes,
      accent: "secondary",
      link: `/brand/`,
    },
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
          <p>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.page}>

      {/* ── HERO WELCOME ── */}
      <section className={style.hero}>
        <div className={style.heroOrb1} />
        <div className={style.heroOrb2} />

        <div className={style.heroLeft}>
          {profile?.brand_photo ? (
            <img src={profile.brand_photo} alt={brandName} className={style.brandAvatar} />
          ) : (
            <div className={style.brandAvatarFallback}>
              <StorefrontIcon />
            </div>
          )}
          <div className={style.heroText}>
            <div className={style.heroBadge}>
              <AutoAwesomeIcon fontSize="small" />
              <span>Brand Dashboard</span>
            </div>
            <h1 className={style.heroTitle}>
              Welcome back, <span className={style.heroGradient}>{brandName}</span>
            </h1>
            <p className={style.heroSub}>
              {profile?.brand_link
                ? <a href={profile.brand_link} target="_blank" rel="noopener noreferrer" className={style.heroLink}>🔗 {profile.brand_link}</a>
                : "Manage your products, campaigns and events from here."}
            </p>
          </div>
        </div>

        <div className={style.heroActions}>
          <Link to="/brand/product" className={style.actionBtn}>
            <AddCircleOutlineIcon fontSize="small" />
            Add Product
          </Link>
          <Link to="/brand/addevent" className={style.actionBtnSecondary}>
            <EventAvailableIcon fontSize="small" />
            Add Event
          </Link>
          <Link to="/brand/searchinfluencer" className={style.actionBtnSecondary}>
            <PersonSearchIcon fontSize="small" />
            Find Influencers
          </Link>
        </div>
      </section>

      {/* ── STAT CARDS ── */}
      <section className={style.statsGrid}>
        {statCards.map((s, i) => (
          <Link to={s.link} className={`${style.statCard} ${style[`statCard_${s.accent}`]}`} key={i}>
            <div className={style.statIconWrap}>{s.icon}</div>
            <div className={style.statInfo}>
              <span className={style.statValue}>{s.value}</span>
              <span className={style.statLabel}>{s.label}</span>
            </div>
            {/* <ArrowForwardIcon className={style.statArrow} fontSize="small" /> */}
          </Link>
        ))}
      </section>

      {/* ── MAIN GRID ── */}
      <div className={style.mainGrid}>

        {/* ── LEFT: PRODUCTS ── */}
        <section className={style.card}>
          <div className={style.cardHeader}>
            <div className={style.cardHeaderLeft}>
              <div className={style.cardIconWrap}>
                <ShoppingBagOutlinedIcon />
              </div>
              <div>
                <h2 className={style.cardTitle}>Products</h2>
                <p className={style.cardSub}>{products.length} listed</p>
              </div>
            </div>
            {/* <Link to="/brand/products" className={style.cardLink}>
              Manage <ArrowForwardIcon fontSize="small" />
            </Link> */}
          </div>

          {products.length === 0 ? (
            <div className={style.emptyState}>
              <ShoppingBagOutlinedIcon />
              <p>No products yet</p>
              <Link to="/brand/addproduct" className={style.emptyBtn}>Add your first product</Link>
            </div>
          ) : (
            <div className={style.productList}>
              {products.slice(0, 5).map((p) => (
                <div className={style.productRow} key={p.id}>
                  <div className={style.productRowIcon}>
                    <ShoppingBagOutlinedIcon fontSize="small" />
                  </div>
                  <div className={style.productRowInfo}>
                    <span className={style.productRowName}>{p.product_name}</span>
                    <span className={style.productRowSub}>{p.subcategory_name}</span>
                  </div>
                  <span className={style.productRowPrice}>₹{p.product_amount}</span>
                </div>
              ))}
              {products.length > 5 && (
                <Link to="/brand/product" className={style.seeMoreRow}>
                  +{products.length - 5} more products <ArrowForwardIcon fontSize="inherit" />
                </Link>
              )}
            </div>
          )}
        </section>

        {/* ── RIGHT: REQUESTS ── */}
        <section className={style.card}>
          <div className={style.cardHeader}>
            <div className={style.cardHeaderLeft}>
              <div className={`${style.cardIconWrap} ${style.cardIconWarnAccent}`}>
                <PendingActionsIcon />
              </div>
              <div>
                <h2 className={style.cardTitle}>Influencer Requests</h2>
                <p className={style.cardSub}>{requests.length} total</p>
              </div>
            </div>
            {/* <Link to="/brand/requests" className={style.cardLink}>
              View All <ArrowForwardIcon fontSize="small" />
            </Link> */}
          </div>

          <div className={style.reqSummary}>
            <div className={style.reqSummaryItem}>
              <PendingActionsIcon fontSize="small" />
              <span>{pendingRequests.length} Pending</span>
            </div>
            <div className={`${style.reqSummaryItem} ${style.reqSummaryAccepted}`}>
              <CheckCircleOutlineIcon fontSize="small" />
              <span>{acceptedRequests.length} Accepted</span>
            </div>
            <div className={`${style.reqSummaryItem} ${style.reqSummaryRejected}`}>
              <CancelOutlinedIcon fontSize="small" />
              <span>{rejectedRequests.length} Rejected</span>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className={style.emptyState}>
              <PendingActionsIcon />
              <p>No requests yet</p>
              <Link to="/brand/searchinfluencer" className={style.emptyBtn}>Find Influencers</Link>
            </div>
          ) : (
            <div className={style.requestList}>
              {requests.slice(0, 4).map((r) => {
                const si = getStatusInfo(r.status);
                return (
                  <div className={style.requestRow} key={r.id}>
                    <div className={style.requestAvatar}>
                      {r.influencer_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className={style.requestInfo}>
                      <span className={style.requestName}>{r.influencer_name}</span>
                      <span className={style.requestProduct}>{r.product_name}</span>
                    </div>
                    <div className={style.requestRight}>
                      <span className={style.requestAmount}>₹{r.amount}</span>
                      <span className={`${style.requestBadge} ${si.cls}`}>
                        {si.icon} {si.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── POSTS ── */}
      {posts.length > 0 && (
        <section className={style.wideCard}>
          <div className={style.cardHeader}>
            <div className={style.cardHeaderLeft}>
              <div className={`${style.cardIconWrap} ${style.cardIconSecondaryAccent}`}>
                <CampaignIcon />
              </div>
              <div>
                <h2 className={style.cardTitle}>Influencer Posts</h2>
                <p className={style.cardSub}>{posts.length} posts · {totalLikes} likes · {totalComments} comments</p>
              </div>
            </div>
            <Link to="/brand/" className={style.cardLink}>
              View All <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>

          <div className={style.postGrid}>
            {posts.slice(0, 4).map((p) => (
              <div className={style.postCard} key={p.id}>
                <div className={style.postMediaWrap}>
                 {p.file ? (
  isVideo(p.file) ? (
    <video
      src={`http://127.0.0.1:8000${p.file}`}
      className={style.postMedia}
      autoPlay
      muted
      loop
      playsInline
    />
  ) : (
    <img
      src={`http://127.0.0.1:8000${p.file}`}
      alt="post"
      className={style.postMedia}
    />
  )
) : (
  <div className={style.postMediaFallback}>
    <CampaignIcon />
  </div>
)}
                </div>
                <div className={style.postBody}>
                  <p className={style.postProduct}>
                    <LocalOfferOutlinedIcon fontSize="inherit" /> {p.product_name}
                  </p>
                  <p className={style.postDesc}>
                    {p.description?.slice(0, 70)}{p.description?.length > 70 ? "…" : ""}
                  </p>
                  <div className={style.postStats}>
                    <span><FavoriteBorderIcon fontSize="inherit" /> {p.likes_count}</span>
                    <span><ChatBubbleOutlineIcon fontSize="inherit" /> {p.comments_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EVENTS ── */}
      {events.length > 0 && (
        <section className={style.wideCard}>
          <div className={style.cardHeader}>
            <div className={style.cardHeaderLeft}>
              <div className={`${style.cardIconWrap} ${style.cardIconSuccessAccent}`}>
                <EventAvailableIcon />
              </div>
              <div>
                <h2 className={style.cardTitle}>Your Events</h2>
                <p className={style.cardSub}>{events.length} scheduled</p>
              </div>
            </div>
            {/* <Link to="/brand/" className={style.cardLink}>
              View All <ArrowForwardIcon fontSize="small" />
            </Link> */}
          </div>

          <div className={style.eventGrid}>
            {events.slice(0, 3).map((e) => (
              <div className={style.eventCard} key={e.id}>
                <div className={style.eventDateBadge}>
                  <span className={style.eventDay}>{new Date(e.event_date).getDate()}</span>
                  <span className={style.eventMonth}>
                    {new Date(e.event_date).toLocaleString("default", { month: "short" })}
                  </span>
                </div>
                <div className={style.eventInfo}>
                  <p className={style.eventDetails}>
                    {e.event_details?.slice(0, 60)}{e.event_details?.length > 60 ? "…" : ""}
                  </p>
                  <p className={style.eventLocation}>📍 {e.place_name}, {e.district_name}</p>
                  <div className={style.eventMeta}>
                    <span className={style.eventTime}><CalendarMonthOutlinedIcon fontSize="inherit" /> {e.event_time}</span>
                    {e.event_promocode && (
                      <span className={style.eventPromo}>
                        <LocalOfferOutlinedIcon fontSize="inherit" /> {e.event_promocode}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── QUICK ACTIONS FOOTER ── */}
      <section className={style.quickActions}>
        <div className={style.quickActionsOrb} />
        <h3 className={style.quickActionsTitle}>Quick Actions</h3>
        <div className={style.quickActionsGrid}>
          {[
            { icon: <AddCircleOutlineIcon />, label: "Add Product", to: "/brand/addproduct", accent: "primary" },
            { icon: <PersonSearchIcon />, label: "Find Influencer", to: "/brand/searchinfluencer", accent: "secondary" },
            { icon: <EventAvailableIcon />, label: "Create Event", to: "/brand/addevent", accent: "success" },
            { icon: <ShoppingBagOutlinedIcon />, label: "Manage Products", to: "/brand/", accent: "warning" },
            { icon: <PendingActionsIcon />, label: "View Requests", to: "/brand/", accent: "primary" },
            { icon: <CampaignIcon />, label: "View Posts", to: "/brand/", accent: "secondary" },
          ].map((a, i) => (
            <Link to={a.to} className={`${style.quickActionCard} ${style[`qa_${a.accent}`]}`} key={i}>
              <div className={style.quickActionIcon}>{a.icon}</div>
              <span>{a.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BrandHomepage;