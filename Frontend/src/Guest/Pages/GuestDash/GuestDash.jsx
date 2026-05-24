import React, { useEffect, useState } from "react";
import { Link } from "react-router";

import StorefrontIcon from "@mui/icons-material/Storefront";
import CampaignIcon from "@mui/icons-material/Campaign";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LoginIcon from "@mui/icons-material/Login";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FlashOnIcon from "@mui/icons-material/FlashOn";

import style from "./GuestDash.module.css";

/* ── PREMIUM IMAGE SET ── */
const HERO_BG =
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=2400&q=90&dpr=2";

const HERO_PORTRAIT =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=90&dpr=2";

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1400&q=90&dpr=2",
  "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1400&q=90&dpr=2",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=90&dpr=2",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=90&dpr=2",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=90&dpr=2",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=90&dpr=2",
];

const INFLUENCER_IMAGES = [
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=90&dpr=2",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=90&dpr=2",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=90&dpr=2",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=90&dpr=2",
];

const LIFESTYLE_IMAGES = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2200&q=90&dpr=2",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=90&dpr=2",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2200&q=90&dpr=2",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=2200&q=90&dpr=2",
];

const MOCK_CATEGORIES = [
  {
    id: 1,
    category_name: "Beauty",
    emoji: "💄",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=90&dpr=2",
  },
  {
    id: 2,
    category_name: "Fashion",
    emoji: "👗",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=90&dpr=2",
  },
  {
    id: 3,
    category_name: "Skincare",
    emoji: "🧴",
    img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1000&q=90&dpr=2",
  },
  {
    id: 4,
    category_name: "Home",
    emoji: "🏠",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=90&dpr=2",
  },
  {
    id: 5,
    category_name: "Gadgets",
    emoji: "📱",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=90&dpr=2",
  },
  {
    id: 6,
    category_name: "Food",
    emoji: "🍽️",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=90&dpr=2",
  },
];
const MOCK_PRODUCTS = [
  {
    id: 1,
    brand_name: "Lakme",
    product_name: "Absolute Serum Foundation",
    product_details:
      "Lightweight serum-foundation hybrid for a dewy, natural finish with SPF 35 protection.",
    product_amount: "899",
    category_name: "Beauty",
    image: PRODUCT_IMAGES[0],
  },
  {
    id: 2,
    brand_name: "Forest Essentials",
    product_name: "Sandalwood Night Cream",
    product_details:
      "Luxurious overnight repair with pure sandalwood and 24K gold leaf for glowing skin.",
    product_amount: "2,450",
    category_name: "Skincare",
    image: PRODUCT_IMAGES[1],
  },
  {
    id: 3,
    brand_name: "Ajmal",
    product_name: "Wisal Dhahab Perfume",
    product_details:
      "Rich oriental fragrance with oud, amber and rose. Long-lasting 12hr wear.",
    product_amount: "1,599",
    category_name: "Fragrance",
    image: PRODUCT_IMAGES[2],
  },
  {
    id: 4,
    brand_name: "MyGlamm",
    product_name: "Power Play Lip Kit",
    product_details:
      "Full-coverage matte lipstick with matching liner in 20 bold shades.",
    product_amount: "649",
    category_name: "Makeup",
    image: PRODUCT_IMAGES[3],
  },
  {
    id: 5,
    brand_name: "Da Milano",
    product_name: "Signature Tote Bag",
    product_details:
      "Hand-crafted genuine leather tote with gold hardware and suede interior lining.",
    product_amount: "8,999",
    category_name: "Fashion",
    image: PRODUCT_IMAGES[4],
  },
  {
    id: 6,
    brand_name: "Puma India",
    product_name: "Nitro Runner Pro",
    product_details:
      "Responsive foam cushioning meets bold street style in this season's must-have.",
    product_amount: "5,499",
    category_name: "Footwear",
    image: PRODUCT_IMAGES[5],
  },
];

const MOCK_INFLUENCERS = [
  {
    id: 1,
    influencer_name: "Priya Sharma",
    place_name: "Mumbai",
    district_name: "Maharashtra",
    followers: "2.4M",
    niche: "Beauty & Skincare",
    photo: INFLUENCER_IMAGES[0],
  },
  {
    id: 2,
    influencer_name: "Ananya Krishnan",
    place_name: "Bangalore",
    district_name: "Karnataka",
    followers: "1.8M",
    niche: "Fashion & Lifestyle",
    photo: INFLUENCER_IMAGES[1],
  },
  {
    id: 3,
    influencer_name: "Rohan Mehta",
    place_name: "Delhi",
    district_name: "NCR",
    followers: "3.1M",
    niche: "Tech & Gadgets",
    photo: INFLUENCER_IMAGES[2],
  },
  {
    id: 4,
    influencer_name: "Kavya Nair",
    place_name: "Kochi",
    district_name: "Kerala",
    followers: "980K",
    niche: "Food & Travel",
    photo: INFLUENCER_IMAGES[3],
  },
];

const MOCK_EVENTS = [
  {
    id: 1,
    event_details: "Lakme Fashion Week Grand Finale — Exclusive VIP Access",
    place_name: "BKC",
    district_name: "Mumbai",
    event_date: "2026-03-22",
    event_time: "6:00 PM",
    event_promocode: "JOVIA20",
    img: LIFESTYLE_IMAGES[0],
  },
  {
    id: 2,
    event_details: "Nykaa Beauty Festival: Masterclass & Brand Meet",
    place_name: "Indiranagar",
    district_name: "Bangalore",
    event_date: "2026-04-05",
    event_time: "11:00 AM",
    event_promocode: "BEAUTY50",
    img: LIFESTYLE_IMAGES[1],
  },
  {
    id: 3,
    event_details: "The Style Lab: Pop-up Shopping & Influencer Hangout",
    place_name: "Connaught Place",
    district_name: "Delhi",
    event_date: "2026-04-18",
    event_time: "3:00 PM",
    event_promocode: null,
    img: LIFESTYLE_IMAGES[2],
  },
];

const MOCK_POSTS = [
  {
    id: 1,
    influencer_name: "Priya Sharma",
    product_name: "Absolute Serum Foundation",
    description:
      "Obsessed with this formula! It feels like skincare but gives me full coverage all day long. Game changer for my morning routine.",
    likes: "48.2K",
    comments: "1.2K",
    file: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80",
  },
  {
    id: 2,
    influencer_name: "Ananya Krishnan",
    product_name: "Da Milano Tote",
    description:
      "This bag is everything — went from boardroom to brunch without missing a beat. The leather quality is absolutely unreal.",
    likes: "62.5K",
    comments: "2.8K",
    file: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
  },
  {
    id: 3,
    influencer_name: "Kavya Nair",
    product_name: "Wisal Dhahab Perfume",
    description:
      "If you could bottle up a sunset in Kerala, this is what it would smell like. The oud base is pure magic.",
    likes: "29.1K",
    comments: "876",
    file: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=500&q=80",
  },
  {
    id: 4,
    influencer_name: "Rohan Mehta",
    product_name: "Nitro Runner Pro",
    description:
      "First 10K in these and zero blisters. The foam is insane. Already ordered my second pair in the navy colourway.",
    likes: "71.3K",
    comments: "3.4K",
    file: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
  },
];



const formatDateParts = (dateString) => {
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    month: date.toLocaleString("default", { month: "short" }),
  };
};

const GuestDash = () => {
  const [scrollY, setScrollY] = useState(0);

  const ticker = [
    "✦ New Drop: Lakme Serum Foundation",
    "✦ 500+ Active Influencers",
    "✦ Nykaa Beauty Fest — April 5",
    "✦ Code JOVIA20 for 20% off",
    "✦ 100+ Verified Brands",
    "✦ India’s #1 Creator Shopping Platform",
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={style.page}>
      {/* Ticker */}
      <div className={style.ticker}>
        <div className={style.tickerTrack}>
          {[...ticker, ...ticker].map((item, index) => (
            <span key={index} className={style.tickerItem}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className={style.hero}>
        <div
          className={style.heroBg}
          style={{
            backgroundImage: `url(${HERO_BG})`,
            transform: `scale(1.08) translateY(${scrollY * 0.16}px)`,
          }}
        />
        <div className={style.heroOverlay} />
        <div className={style.heroGlow} />

        <div className={style.heroInner}>
          <div className={style.heroLeft}>
            <div className={style.heroBadge}>
              <FlashOnIcon fontSize="inherit" />
              <span>Trusted by creators, brands & shoppers</span>
            </div>

            <h1 className={style.heroTitle}>
              Where <em>Brands</em>
              <br />
              Meet <em>Influence</em>
            </h1>

            <p className={style.heroSubtitle}>
              Shop authentic products promoted by India’s top creators.
              Discover exclusive campaigns, real reviews, premium events and
              creator-led experiences — all in one beautifully curated platform.
            </p>

            <div className={style.heroCta}>
              <Link to="/registraction" className={style.ctaPrimary}>
                <AppRegistrationIcon fontSize="small" />
                Start Free
              </Link>

              <Link to="/login" className={style.ctaGhost}>
                <LoginIcon fontSize="small" />
                Sign In
              </Link>
            </div>

            <div className={style.heroTrust}>
              <div className={style.trustAvatars}>
                {INFLUENCER_IMAGES.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className={style.trustAvatar}
                    style={{ zIndex: 5 - i }}
                  />
                ))}
              </div>
              <span className={style.trustText}>
                <strong>10,000+</strong> creators & shoppers already joined
              </span>
            </div>
          </div>

          <div className={style.heroRight}>
            <div className={style.heroPortraitWrap}>
              <div className={style.heroPortraitCard}>
                <img
                  src={HERO_PORTRAIT}
                  alt="Featured influencer"
                  className={style.heroPortrait}
                />
                <div className={style.heroPortraitShade} />
              </div>

              <div className={style.heroPill1}>
                <StarRoundedIcon fontSize="inherit" />
                <span>4.9 user rating</span>
              </div>

              <div className={style.heroPill2}>
                <TrendingUpIcon fontSize="inherit" />
                <span>+38% campaign growth</span>
              </div>

              <div className={style.heroPill3}>
                <VerifiedOutlinedIcon fontSize="inherit" />
                <span>100+ verified brands</span>
              </div>
            </div>
          </div>
        </div>

        <div className={style.scrollHint}>
          <span>Scroll</span>
          <div className={style.scrollLine} />
        </div>
      </section>

      {/* Stats */}
      <div className={style.statsBar}>
        {[
          { value: "100+", label: "Brands", icon: <StorefrontIcon /> },
          { value: "500+", label: "Influencers", icon: <CampaignIcon /> },
          { value: "2K+", label: "Products", icon: <ShoppingBagOutlinedIcon /> },
          { value: "10K+", label: "Community", icon: <PeopleAltOutlinedIcon /> },
        ].map((item, index) => (
          <div className={style.statItem} key={index}>
            <div className={style.statIcon}>{item.icon}</div>
            <div>
              <div className={style.statValue}>{item.value}</div>
              <div className={style.statLabel}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section className={style.section}>
        <div className={style.sectionHeadFlat}>
          <div>
            <p className={style.sectionEyebrow}>Explore</p>
            <h2 className={style.sectionTitle}>Shop by Vibe</h2>
          </div>
          <Link to="/login" className={style.sectionLink}>
            All Categories <ArrowForwardIcon fontSize="inherit" />
          </Link>
        </div>

        <div className={style.catScroll}>
          {MOCK_CATEGORIES.map((category) => (
            <div className={style.catCover} key={category.id}>
              <img
                src={category.img}
                alt={category.category_name}
                className={style.catCoverImg}
              />
              <div className={style.catCoverOverlay} />
              <div className={style.catCoverLabel}>
                <span className={style.catEmoji}>{category.emoji}</span>
                <span>{category.category_name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className={style.section}>
        <div className={style.sectionHeadFlat}>
          <div>
            <p className={style.sectionEyebrow}>Hot picks</p>
            <h2 className={style.sectionTitle}>Trending Now</h2>
          </div>
          <Link to="/login" className={style.sectionLink}>
            View All <ArrowForwardIcon fontSize="inherit" />
          </Link>
        </div>

        <div className={style.productEditorial}>
          <div className={`${style.productCard} ${style.productCardLarge}`}>
            <div className={style.productImgWrap}>
              <img
                src={MOCK_PRODUCTS[0].image}
                alt={MOCK_PRODUCTS[0].product_name}
                className={style.productImg}
              />
              <div className={style.productBadge}>🔥 Trending</div>

              <div className={style.productOverlay}>
                <div className={style.productOverlayContent}>
                  <p className={style.productBrand}>{MOCK_PRODUCTS[0].brand_name}</p>
                  <h3 className={style.productNameOverlay}>
                    {MOCK_PRODUCTS[0].product_name}
                  </h3>
                  <div className={style.productOverlayFooter}>
                    <span className={style.productPrice}>
                      ₹{MOCK_PRODUCTS[0].product_amount}
                    </span>
                    <Link to="/login" className={style.productBtnOverlay}>
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={style.productStack}>
            {MOCK_PRODUCTS.slice(1, 3).map((product) => (
              <div
                className={`${style.productCard} ${style.productCardHoriz}`}
                key={product.id}
              >
                <div className={style.productImgWrapSm}>
                  <img
                    src={product.image}
                    alt={product.product_name}
                    className={style.productImg}
                  />
                  <div className={style.productBadgeSm}>
                    {product.category_name}
                  </div>
                </div>

                <div className={style.productBody}>
                  <p className={style.productBrand}>{product.brand_name}</p>
                  <h3 className={style.productName}>{product.product_name}</h3>
                  <p className={style.productDesc}>
                    {product.product_details.slice(0, 76)}...
                  </p>
                  <div className={style.productFooter}>
                    <span className={style.productPrice}>₹{product.product_amount}</span>
                    <Link to="/login" className={style.productBtn}>
                      Shop
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={style.productGrid}>
          {MOCK_PRODUCTS.slice(3).map((product) => (
            <div className={style.productCard} key={product.id}>
              <div className={style.productImgWrap}>
                <img
                  src={product.image}
                  alt={product.product_name}
                  className={style.productImg}
                />
                <div className={style.productBadge}>{product.category_name}</div>
              </div>

              <div className={style.productBody}>
                <p className={style.productBrand}>{product.brand_name}</p>
                <h3 className={style.productName}>{product.product_name}</h3>
                <p className={style.productDesc}>
                  {product.product_details.slice(0, 68)}...
                </p>
                <div className={style.productFooter}>
                  <span className={style.productPrice}>₹{product.product_amount}</span>
                  <Link to="/login" className={style.productBtn}>
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <div className={style.adBanner}>
        <img
          src={LIFESTYLE_IMAGES[3]}
          alt="Campaign"
          className={style.adBannerImg}
        />
        <div className={style.adBannerOverlay} />

        <div className={style.adBannerContent}>
          <div className={style.adBannerInner}>
            <span className={style.adBannerEyebrow}>Exclusive Campaign</span>
            <h2 className={style.adBannerTitle}>
              Your Style,
              <br />
              Your Story
            </h2>
            <p className={style.adBannerDesc}>
              Join India’s fast-growing creator-commerce space and turn your
              influence into meaningful brand collaborations.
            </p>
            <Link to="/registraction" className={style.ctaPrimary}>
              Join as Influencer <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>
        </div>
      </div>

      {/* Influencers */}
      <section className={style.section}>
        <div className={style.sectionHeadFlat}>
          <div>
            <p className={style.sectionEyebrow}>Top creators</p>
            <h2 className={style.sectionTitle}>Creators to Follow</h2>
          </div>
          <Link to="/login" className={style.sectionLink}>
            See All <ArrowForwardIcon fontSize="inherit" />
          </Link>
        </div>

        <div className={style.influencerStrip}>
          {MOCK_INFLUENCERS.map((influencer) => (
            <div className={style.influencerCard} key={influencer.id}>
              <div className={style.influencerImgWrap}>
                <img
                  src={influencer.photo}
                  alt={influencer.influencer_name}
                  className={style.influencerImg}
                />
                <div className={style.infVerified}>
                  <VerifiedOutlinedIcon fontSize="inherit" />
                </div>
              </div>

              <div className={style.influencerInfo}>
                <h3 className={style.influencerName}>
                  {influencer.influencer_name}
                </h3>
                <p className={style.influencerNiche}>{influencer.niche}</p>

                <div className={style.influencerMeta}>
                  <span className={style.influencerFollowers}>
                    {influencer.followers} followers
                  </span>
                  <span className={style.influencerPlace}>
                    📍 {influencer.place_name}
                  </span>
                </div>

                <Link to="/login" className={style.influencerBtn}>
                  Follow
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Posts */}
      <section className={style.section}>
        <div className={style.sectionHeadFlat}>
          <div>
            <p className={style.sectionEyebrow}>Social proof</p>
            <h2 className={style.sectionTitle}>Creator Posts</h2>
          </div>
          <Link to="/login" className={style.sectionLink}>
            Explore <ArrowForwardIcon fontSize="inherit" />
          </Link>
        </div>

        <div className={style.postMosaic}>
          {MOCK_POSTS.map((post, index) => (
            <div
              key={post.id}
              className={`${style.postTile} ${
                index === 0 ? style.postTileLarge : ""
              }`}
            >
              <img src={post.file} alt={post.product_name} className={style.postTileImg} />

              <div className={style.postTileOverlay}>
                <div className={style.postTileMeta}>
                  <span className={style.postTileInfluencer}>
                    <CampaignIcon fontSize="inherit" />
                    {post.influencer_name}
                  </span>

                  <p className={style.postTileDesc}>
                    {post.description.slice(0, 90)}...
                  </p>

                  <div className={style.postTileStats}>
                    <span>
                      <FavoriteBorderIcon fontSize="inherit" />
                      {post.likes}
                    </span>
                    <span>
                      <ChatBubbleOutlineIcon fontSize="inherit" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>

              <div className={style.postPlayBtn}>
                <PlayArrowRoundedIcon />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section className={style.section}>
        <div className={style.sectionHeadFlat}>
          <div>
            <p className={style.sectionEyebrow}>Experiences</p>
            <h2 className={style.sectionTitle}>Upcoming Events</h2>
          </div>
        </div>

        <div className={style.eventCards}>
          {MOCK_EVENTS.map((event) => {
            const { day, month } = formatDateParts(event.event_date);

            return (
              <div className={style.eventCard} key={event.id}>
                <div className={style.eventImgWrap}>
                  <img
                    src={event.img}
                    alt={event.event_details}
                    className={style.eventImg}
                  />
                  <div className={style.eventImgOverlay} />

                  <div className={style.eventDateBadge}>
                    <span className={style.eventDay}>{day}</span>
                    <span className={style.eventMonth}>{month}</span>
                  </div>
                </div>

                <div className={style.eventBody}>
                  <h3 className={style.eventTitle}>{event.event_details}</h3>
                  <p className={style.eventLocation}>
                    📍 {event.place_name}, {event.district_name}
                  </p>
                  <p className={style.eventTime}>🕐 {event.event_time}</p>

                  {event.event_promocode && (
                    <div className={style.eventPromo}>
                      <LocalOfferOutlinedIcon fontSize="inherit" />
                      Use code <strong>{event.event_promocode}</strong>
                    </div>
                  )}

                  <Link to="/login" className={style.eventBtn}>
                    Register Now <ArrowForwardIcon fontSize="inherit" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className={style.finalCta}>
        <div className={style.finalCtaImg}>
          <img src={LIFESTYLE_IMAGES[1]} alt="Join Jovia" />
          <div className={style.finalCtaImgOverlay} />
        </div>

        <div className={style.finalCtaContent}>
          <div className={style.heroBadge} style={{ marginBottom: 24 }}>
            <AutoAwesomeIcon fontSize="inherit" />
            <span>Be Part of India’s Biggest Creator Economy</span>
          </div>

          <h2 className={style.finalCtaTitle}>
            Ready to Join
            <br />
            <em>Jovia?</em>
          </h2>

          <p className={style.finalCtaDesc}>
            Sign up as a user, brand, or influencer and unlock exclusive
            products, campaigns, creator collaborations and premium experiences.
          </p>

          <div className={style.finalCtaBtns}>
            <Link to="/registraction" className={style.ctaPrimary}>
              <AppRegistrationIcon fontSize="small" />
              Create Account
            </Link>

            <Link to="/brandreg" className={style.ctaGhost}>
              <StorefrontIcon fontSize="small" />
              Register Brand
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuestDash;