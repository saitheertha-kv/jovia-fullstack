import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import style from "./UserHomePage.module.css";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CampaignIcon from "@mui/icons-material/Campaign";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";

const BASE = "http://127.0.0.1:8000";

const UserHomePage = () => {
  const navigate = useNavigate();
  const uid = sessionStorage.getItem("uid");
  const userName = localStorage.getItem("name") || "User";

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [cart, setCart] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [cartMsg, setCartMsg] = useState({});

  useEffect(() => {
    if (!uid) { navigate("/login"); return; }
    fetchAll();
  }, [uid]);

  const fetchAll = async () => {
    try {
      const [profRes, postRes, prodRes, eventRes, cartRes, bookRes, catRes] =
        await Promise.all([
          axios.get(`${BASE}/UserProfile/${uid}/`),
          axios.get(`${BASE}/AllPosts/`),
          axios.get(`${BASE}/AllProduct/`),
          axios.get(`${BASE}/AllEvent/`),
          axios.get(`${BASE}/ViewCart/${uid}/`),
          axios.get(`${BASE}/MyBookings/${uid}/`),
          axios.get(`${BASE}/Category/`),
        ]);
      setProfile(profRes.data.data);
      setPosts(postRes.data.data?.slice(0, 6) || []);
      setProducts(prodRes.data.data?.slice(0, 6) || []);
      setEvents(eventRes.data.data?.slice(0, 3) || []);
      setCart(cartRes.data.data || []);
      setBookings(bookRes.data.data || []);
      setCategories(catRes.data.data?.slice(0, 6) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`${BASE}/ToggleLike/`, {
        post_id: postId,
        user_id: uid,
      });
      setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (productId) => {
    setAddingToCart((prev) => ({ ...prev, [productId]: true }));
    try {
      const res = await axios.post(`${BASE}/AddtoCart/`, {
        productid: productId,
        userid: uid,
      });
      setCartMsg((prev) => ({ ...prev, [productId]: res.data.message }));
      setTimeout(() => setCartMsg((prev) => ({ ...prev, [productId]: "" })), 2000);
      const cartRes = await axios.get(`${BASE}/ViewCart/${uid}/`);
      setCart(cartRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const getBookingStatus = (status) => {
    const s = parseInt(status);
    if (s === 0) return { label: "In Cart", icon: <ShoppingCartOutlinedIcon fontSize="inherit" />, cls: style.statusCart };
    if (s === 1) return { label: "Ordered", icon: <HourglassEmptyIcon fontSize="inherit" />, cls: style.statusOrdered };
    if (s === 2) return { label: "Delivered", icon: <CheckCircleOutlineIcon fontSize="inherit" />, cls: style.statusDelivered };
    return { label: "Processing", icon: <LocalShippingOutlinedIcon fontSize="inherit" />, cls: style.statusProcessing };
  };

  const categoryEmojis = ["🧴", "👗", "🏠", "🎮", "📱", "🍽️"];
  const recentBookings = bookings.filter((b) => b.booking_status >= 1).slice(0, 3);
  const activeCart = cart.length;

  const statCards = [
    { icon: <ShoppingCartOutlinedIcon />, label: "Cart Items", value: activeCart, accent: "primary", to: "/user/" },
    { icon: <ReceiptLongOutlinedIcon />, label: "My Orders", value: bookings.filter((b) => b.booking_status >= 1).length, accent: "secondary", to: "/user/" },
    { icon: <EventAvailableIcon />, label: "Events", value: events.length, accent: "success", to: "/user/" },
    { icon: <CampaignIcon />, label: "Posts", value: posts.length, accent: "warning", to: "/user/" },
  ];
   const isVideo = (url) => {
  return /\.(mp4|webm|ogg)$/i.test(url);
};
  if (loading) {
    return (
      <div className={style.loadingPage}>
        <div className={style.loadingOrb} />
        <div className={style.loadingContent}>
          <div className={style.loadingSpinner} />
          <p>Loading your feed…</p>
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
            {profile?.user_photo ? (
              <img src={profile.user_photo} alt={userName} className={style.avatar} />
            ) : (
              <div className={style.avatarFallback}>
                <PersonOutlineIcon />
              </div>
            )}
            <div className={style.avatarOnline} />
          </div>

          <div className={style.heroText}>
            <div className={style.heroBadge}>
              <AutoAwesomeIcon fontSize="small" />
              <span>Welcome back</span>
            </div>
            <h1 className={style.heroTitle}>
              Hey, <span className={style.heroGradient}>{userName}</span> 👋
            </h1>
            <p className={style.heroSub}>
              {profile?.place_name
                ? `📍 ${profile.place_name}, ${profile.district_name}`
                : "Discover products, posts & events curated for you."}
            </p>
          </div>
        </div>

        <div className={style.heroActions}>
          <Link to="/user/viewproduct" className={style.heroCta}>
            <ShoppingBagOutlinedIcon fontSize="small" />
            Shop Now
          </Link>
          <Link to="/user/mycart" className={style.heroCtaSecondary}>
            <ShoppingCartOutlinedIcon fontSize="small" />
            Cart {activeCart > 0 && <span className={style.cartBubble}>{activeCart}</span>}
          </Link>
          <Link to="/user/myprofile" className={style.heroCtaSecondary}>
            <PersonOutlineIcon fontSize="small" />
            Profile
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className={style.statsGrid}>
        {statCards.map((s, i) => (
          <Link to={s.to} className={`${style.statCard} ${style[`stat_${s.accent}`]}`} key={i}
            style={{ animationDelay: `${i * 0.07}s` }}>
            <div className={style.statIconWrap}>{s.icon}</div>
            <div className={style.statInfo}>
              <span className={style.statValue}>{s.value}</span>
              <span className={style.statLabel}>{s.label}</span>
            </div>
            <ArrowForwardIcon className={style.statArrow} fontSize="small" />
          </Link>
        ))}
      </section>

      {/* ── CATEGORIES ── */}
      {categories.length > 0 && (
        <section className={style.section}>
          <div className={style.sectionHead}>
            <div className={style.sectionLeft}>
              <div className={style.sectionIcon}><CategoryOutlinedIcon /></div>
              <div>
                <h2 className={style.sectionTitle}>Categories</h2>
                <p className={style.sectionSub}>Browse by type</p>
              </div>
            </div>
            <Link to="/user/viewproduct" className={style.sectionLink}>
              All Products <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>
          <div className={style.catGrid}>
            {categories.map((c, i) => (
              <Link to="/user/viewproduct" className={style.catCard} key={c.id}>
                <span className={style.catEmoji}>{categoryEmojis[i] || "📦"}</span>
                <span className={style.catName}>{c.category_name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── POSTS FEED ── */}
      {posts.length > 0 && (
        <section className={style.section}>
          <div className={style.sectionHead}>
            <div className={style.sectionLeft}>
              <div className={`${style.sectionIcon} ${style.sectionIconSecondary}`}><CampaignIcon /></div>
              <div>
                <h2 className={style.sectionTitle}>Influencer Feed</h2>
                <p className={style.sectionSub}>Latest posts from creators</p>
              </div>
            </div>
            <Link to="/user/explore" className={style.sectionLink}>
              See All <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>

          <div className={style.postGrid}>
            {posts.map((p) => (
              <div className={style.postCard} key={p.id}>
                <div className={style.postMediaWrap}>
                  {p.file ? (
  isVideo(p.file) ? (
    <video
      src={p.file}
      video controls preload="metadata" className={style.postMedia} 
    />
  ) : (
    <img
  src={p.file?.startsWith("http") ? p.file : `${BASE}${p.file}`}
  alt="post"
  className={style.postMedia}
/>
  )
) : (
  <div className={style.postMediaFallback}>
    <CampaignIcon />
  </div>
)}
                  <div className={style.postOverlay}>
                    <span className={style.postInfluencerChip}>
                      <CampaignIcon fontSize="inherit" /> {p.influencer_name}
                    </span>
                  </div>
                </div>
                <div className={style.postBody}>
                  <p className={style.postProductTag}>
                    <LocalOfferOutlinedIcon fontSize="inherit" /> {p.product_name}
                  </p>
                  <p className={style.postDesc}>
                    {p.description?.slice(0, 75)}{p.description?.length > 75 ? "…" : ""}
                  </p>
                  <div className={style.postActions}>
                    <button
                      className={`${style.likeBtn} ${likedPosts[p.id] ? style.liked : ""}`}
                      onClick={() => handleLike(p.id)}
                    >
                      {likedPosts[p.id]
                        ? <FavoriteIcon fontSize="inherit" />
                        : <FavoriteBorderIcon fontSize="inherit" />}
                      <span>{p.likes}</span>
                    </button>
                    <Link to={`/user/comments/${p.id}`} className={style.commentBtn}>
                      <ChatBubbleOutlineIcon fontSize="inherit" />
                      <span>{p.comments}</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      {products.length > 0 && (
        <section className={style.section}>
          <div className={style.sectionHead}>
            <div className={style.sectionLeft}>
              <div className={`${style.sectionIcon} ${style.sectionIconSuccess}`}><ShoppingBagOutlinedIcon /></div>
              <div>
                <h2 className={style.sectionTitle}>Featured Products</h2>
                <p className={style.sectionSub}>Handpicked for you</p>
              </div>
            </div>
            <Link to="/user/viewproduct" className={style.sectionLink}>
              View All <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>

          <div className={style.productGrid}>
            {products.map((p) => (
              <div className={style.productCard} key={p.id}>
                <div className={style.productImgWrap}>
                  {p.image ? (
                    <img src={`${BASE}${p.image}`} alt={p.product_name} className={style.productImg} />
                  ) : (
                    <div className={style.productImgFallback}><ShoppingBagOutlinedIcon /></div>
                  )}
                  <div className={style.productCatBadge}>{p.category_name}</div>
                </div>
                <div className={style.productBody}>
                  <p className={style.productBrand}>
                    <StorefrontIcon fontSize="inherit" /> {p.brand_name}
                  </p>
                  <h3 className={style.productName}>{p.product_name}</h3>
                  <p className={style.productDesc}>
                    {p.product_details?.slice(0, 55)}{p.product_details?.length > 55 ? "…" : ""}
                  </p>
                  <div className={style.productFooter}>
                    <span className={style.productPrice}>₹{p.product_amount}</span>
                    <button
                      className={`${style.addCartBtn} ${cartMsg[p.id] ? style.addCartBtnDone : ""}`}
                      onClick={() => handleAddToCart(p.id)}
                      disabled={!!addingToCart[p.id]}
                    >
                      <AddShoppingCartIcon fontSize="inherit" />
                      {cartMsg[p.id] ? "Added!" : addingToCart[p.id] ? "…" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── MAIN 2-COL: CART + BOOKINGS ── */}
      <div className={style.twoCol}>

        {/* CART PREVIEW */}
        <section className={style.card}>
          <div className={style.cardHeader}>
            <div className={style.cardHeaderLeft}>
              <div className={style.cardIcon}><ShoppingCartOutlinedIcon /></div>
              <div>
                <h2 className={style.cardTitle}>My Cart</h2>
                <p className={style.cardSub}>{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <Link to="/user/mycart" className={style.cardLink}>
              View Cart <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>

          {cart.length === 0 ? (
            <div className={style.emptyState}>
              <ShoppingCartOutlinedIcon />
              <p>Your cart is empty</p>
              <Link to="/user/viewproduct" className={style.emptyBtn}>Browse Products</Link>
            </div>
          ) : (
            <div className={style.cartList}>
              {cart.slice(0, 4).map((c) => (
                <div className={style.cartRow} key={c.cart_id}>
                  <div className={style.cartRowIcon}><ShoppingBagOutlinedIcon fontSize="small" /></div>
                  <div className={style.cartRowInfo}>
                    <span className={style.cartRowName}>{c.product_name}</span>
                    <span className={style.cartRowQty}>Qty: {c.qty}</span>
                  </div>
                  <span className={style.cartRowPrice}>₹{c.subtotal}</span>
                </div>
              ))}
              {cart.length > 4 && (
                <p className={style.cartMore}>+{cart.length - 4} more items</p>
              )}
              <div className={style.cartTotalRow}>
                <span>Total</span>
                <span className={style.cartTotal}>
                  ₹{cart.reduce((s, c) => s + parseFloat(c.subtotal || 0), 0).toFixed(2)}
                </span>
              </div>
              <Link to="/user/mycart" className={style.checkoutBtn}>
                Proceed to Checkout <ArrowForwardIcon fontSize="small" />
              </Link>
            </div>
          )}
        </section>

        {/* BOOKINGS PREVIEW */}
        <section className={style.card}>
          <div className={style.cardHeader}>
            <div className={style.cardHeaderLeft}>
              <div className={`${style.cardIcon} ${style.cardIconSecondary}`}><ReceiptLongOutlinedIcon /></div>
              <div>
                <h2 className={style.cardTitle}>My Orders</h2>
                <p className={style.cardSub}>{recentBookings.length} recent</p>
              </div>
            </div>
            <Link to="/user/mybooking" className={style.cardLink}>
              All Orders <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className={style.emptyState}>
              <ReceiptLongOutlinedIcon />
              <p>No orders yet</p>
              <Link to="/user/viewproduct" className={style.emptyBtn}>Start Shopping</Link>
            </div>
          ) : (
            <div className={style.bookingList}>
              {recentBookings.map((b) => {
                const si = getBookingStatus(b.booking_status);
                return (
                  <div className={style.bookingRow} key={b.booking_id}>
                    <div className={style.bookingRowLeft}>
                      <span className={style.bookingId}>#{b.booking_id}</span>
                      <span className={style.bookingDate}>{b.date}</span>
                    </div>
                    <div className={style.bookingRowMid}>
                      <span className={style.bookingItems}>
                        {b.items?.length} item{b.items?.length !== 1 ? "s" : ""}
                      </span>
                      <span className={style.bookingAmount}>₹{b.amount}</span>
                    </div>
                    <span className={`${style.bookingStatus} ${si.cls}`}>
                      {si.icon} {si.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── EVENTS ── */}
      {events.length > 0 && (
        <section className={style.section}>
          <div className={style.sectionHead}>
            <div className={style.sectionLeft}>
              <div className={`${style.sectionIcon} ${style.sectionIconWarning}`}><EventAvailableIcon /></div>
              <div>
                <h2 className={style.sectionTitle}>Upcoming Events</h2>
                <p className={style.sectionSub}>Exclusive brand experiences near you</p>
              </div>
            </div>
          </div>

          <div className={style.eventGrid}>
            {events.map((e) => (
              <div className={style.eventCard} key={e.id}>
                <div className={style.eventDateBadge}>
                  <span className={style.eventDay}>{new Date(e.event_date).getDate()}</span>
                  <span className={style.eventMonth}>
                    {new Date(e.event_date).toLocaleString("default", { month: "short" })}
                  </span>
                </div>
                <div className={style.eventInfo}>
                  <p className={style.eventDetails}>
                    {e.event_details?.slice(0, 65)}{e.event_details?.length > 65 ? "…" : ""}
                  </p>
                  <p className={style.eventLocation}>
                    <LocationOnOutlinedIcon fontSize="inherit" />
                    {e.place_name}, {e.district_name}
                  </p>
                  <div className={style.eventMeta}>
                    <span className={style.eventTime}>
                      <CalendarMonthOutlinedIcon fontSize="inherit" /> {e.event_time}
                    </span>
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

      {/* ── QUICK ACCESS ── */}
      <section className={style.quickSection}>
        <div className={style.quickOrb} />
        <h3 className={style.quickTitle}>Quick Access</h3>
        <div className={style.quickGrid}>
          {[
            { icon: <ShoppingBagOutlinedIcon />, label: "All Products", to: "/user/", accent: "primary" },
            { icon: <ShoppingCartOutlinedIcon />, label: "My Cart", to: "/user/", accent: "secondary", badge: activeCart },
            { icon: <ReceiptLongOutlinedIcon />, label: "My Orders", to: "/user/", accent: "success" },
            { icon: <CampaignIcon />, label: "Posts Feed", to: "/user/", accent: "warning" },
            { icon: <EventAvailableIcon />, label: "Events", to: "/user/", accent: "primary" },
            { icon: <PersonOutlineIcon />, label: "My Profile", to: "/user/", accent: "secondary" },
          ].map((a, i) => (
            <Link to={a.to} className={`${style.quickCard} ${style[`qc_${a.accent}`]}`} key={i}>
              <div className={style.quickCardIcon}>{a.icon}</div>
              <span>{a.label}</span>
              {a.badge > 0 && <span className={style.quickBadge}>{a.badge}</span>}
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};

export default UserHomePage;