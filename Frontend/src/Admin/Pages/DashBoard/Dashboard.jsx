import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  PeopleAlt as PeopleIcon,
  Stars as InfluencerIcon,
  Storefront as BrandIcon,
  ShoppingCart as OrderIcon,
  TrendingUp as TrendIcon,
  Inventory2 as ProductIcon,
  PhotoLibrary as PostIcon,
  SwapHoriz as RequestIcon,
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  HourglassEmpty as PendingIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import style from "./Dashboard.module.css";

const BASE = "http://127.0.0.1:8000";

/* ─── small helpers ─── */
const fmt = (n) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(1)}k`
    : `₹${n}`;

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

/* ─── Stat Card ─── */
const StatCard = ({ icon: Icon, iconBg, value, label, sub, badge, badgeColor }) => (
  <div className={style.statCard}>
    <div className={style.statTop}>
      <div className={style.statIcon} style={{ background: iconBg }}>
        <Icon sx={{ fontSize: 20 }} />
      </div>
      {badge !== undefined && (
        <span className={style.badge} style={badgeColor}>
          {badge}
        </span>
      )}
    </div>
    <div className={style.statVal}>{value ?? "—"}</div>
    <div className={style.statLabel}>{label}</div>
    {sub && <div className={style.statSub}>{sub}</div>}
  </div>
);

/* ─── Bar row ─── */
const BarRow = ({ label, count, max, color }) => (
  <div className={style.barRow}>
    <span className={style.barLabel}>{label}</span>
    <div className={style.barTrack}>
      <div
        className={style.barFill}
        style={{ width: `${pct(count, max)}%`, background: color }}
      />
    </div>
    <span className={style.barCount}>{count}</span>
  </div>
);

/* ─── Pill ─── */
const Pill = ({ status }) => {
  const map = {
    0: { label: "Pending", cls: style.pillPending },
    1: { label: "Active",  cls: style.pillActive  },
    2: { label: "Rejected",cls: style.pillRejected },
  };
  const s = map[status] ?? map[0];
  return <span className={`${style.pill} ${s.cls}`}>{s.label}</span>;
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function Dashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [ts, setTs]           = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        usersRes,
        pendingBrands,
        acceptedBrands,
        rejectedBrands,
        pendingInf,
        acceptedInf,
        rejectedInf,
        products,
        posts,
      ] = await Promise.all([
        axios.get(`${BASE}/Category/`),           // reuse any endpoint that returns users — swap if you have one
        axios.get(`${BASE}/PendingBrands/`),
        axios.get(`${BASE}/AcceptedBrands/`),
        axios.get(`${BASE}/RejectedBrands/`),
        axios.get(`${BASE}/PendingInfluencers/`),
        axios.get(`${BASE}/AcceptedInfluencers/`),
        axios.get(`${BASE}/RejectedInfluencers/`),
        axios.get(`${BASE}/AllProduct/`),
        axios.get(`${BASE}/AllPosts/`),
      ]);

      const pBrands   = pendingBrands.data.data   ?? [];
      const aBrands   = acceptedBrands.data.data  ?? [];
      const rBrands   = rejectedBrands.data.data  ?? [];
      const pInf      = pendingInf.data.data       ?? [];
      const aInf      = acceptedInf.data.data      ?? [];
      const rInf      = rejectedInf.data.data      ?? [];
      const allProds  = products.data.data         ?? [];
      const allPosts  = posts.data.data            ?? [];

      const totalLikes    = allPosts.reduce((s, p) => s + (p.likes    || 0), 0);
      const totalComments = allPosts.reduce((s, p) => s + (p.comments || 0), 0);

      setData({
        brands:    { pending: pBrands.length, active: aBrands.length, rejected: rBrands.length,
                     all: [...pBrands, ...aBrands, ...rBrands] },
        influencers:{ pending: pInf.length,   active: aInf.length,   rejected: rInf.length,
                     all: [...pInf, ...aInf, ...rInf] },
        products:  allProds,
        posts:     allPosts,
        engagement:{ likes: totalLikes, comments: totalComments },
      });
      setTs(new Date().toLocaleTimeString());
    } catch (e) {
      setError("Failed to load dashboard data. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className={style.loader}><div className={style.spinner} /><span>Loading dashboard…</span></div>;
  if (error)   return <div className={style.errorBox}><span>{error}</span><button onClick={load}>Retry</button></div>;

  const { brands, influencers, products, posts, engagement } = data;

  const totalBrands = brands.pending + brands.active + brands.rejected;
  const totalInf    = influencers.pending + influencers.active + influencers.rejected;
  const maxBar      = Math.max(brands.pending, brands.active, brands.rejected,
                               influencers.pending, influencers.active, influencers.rejected,
                               products.length, posts.length, 1);

  /* last 5 brands & influencers for tables */
  const recentBrands = [...brands.all].slice(-5).reverse();
  const recentInf    = [...influencers.all].slice(-5).reverse();

  return (
    <div className={style.page}>

      {/* ── HEADER ── */}
      <div className={style.pageHeader}>
        <div>
          <h2 className={style.pageTitle}>Dashboard</h2>
          {ts && <p className={style.pageTs}>Last updated at {ts}</p>}
        </div>
        <button className={style.refreshBtn} onClick={load} title="Refresh">
          <RefreshIcon sx={{ fontSize: 18 }} />
          Refresh
        </button>
      </div>

      {/* ── STAT CARDS ── */}
      <div className={style.statsGrid}>
        <StatCard
          icon={InfluencerIcon}
          iconBg="color-mix(in srgb, var(--color-primary) 14%, var(--color-surface))"
          value={totalInf}
          label="Total influencers"
          sub={`${influencers.active} active`}
          badge={influencers.pending ? `${influencers.pending} pending` : null}
          badgeColor={{ background: "color-mix(in srgb, var(--color-warning, #f59e0b) 18%, var(--color-surface))", color: "var(--color-warning, #b45309)" }}
        />
        <StatCard
          icon={BrandIcon}
          iconBg="color-mix(in srgb, var(--color-secondary) 14%, var(--color-surface))"
          value={totalBrands}
          label="Total brands"
          sub={`${brands.active} active`}
          badge={brands.pending ? `${brands.pending} pending` : null}
          badgeColor={{ background: "color-mix(in srgb, var(--color-error, #ef4444) 14%, var(--color-surface))", color: "var(--color-error, #dc2626)" }}
        />
        <StatCard
          icon={ProductIcon}
          iconBg="color-mix(in srgb, var(--color-success, #10b981) 14%, var(--color-surface))"
          value={products.length}
          label="Total products"
          sub="across all brands"
        />
        <StatCard
          icon={PostIcon}
          iconBg="color-mix(in srgb, #8b5cf6 14%, var(--color-surface))"
          value={posts.length}
          label="Influencer posts"
          sub={`${engagement.likes} likes · ${engagement.comments} comments`}
        />
      </div>

      {/* ── MID ROW ── */}
      <div className={style.midGrid}>

        {/* Approval breakdown */}
        <div className={style.card}>
          <h3 className={style.cardTitle}>Approval breakdown</h3>
          <div className={style.barSection}>
            <p className={style.barGroupLabel}>Brands</p>
            <BarRow label="Active"   count={brands.active}   max={maxBar} color="var(--color-success, #10b981)" />
            <BarRow label="Pending"  count={brands.pending}  max={maxBar} color="var(--color-warning, #f59e0b)" />
            <BarRow label="Rejected" count={brands.rejected} max={maxBar} color="var(--color-error,   #ef4444)" />
          </div>
          <div className={style.divider} />
          <div className={style.barSection}>
            <p className={style.barGroupLabel}>Influencers</p>
            <BarRow label="Active"   count={influencers.active}   max={maxBar} color="var(--color-success, #10b981)" />
            <BarRow label="Pending"  count={influencers.pending}  max={maxBar} color="var(--color-warning, #f59e0b)" />
            <BarRow label="Rejected" count={influencers.rejected} max={maxBar} color="var(--color-error,   #ef4444)" />
          </div>
        </div>

        {/* Content stats */}
        <div className={style.card}>
          <h3 className={style.cardTitle}>Content & engagement</h3>
          <div className={style.statPairs}>
            <div className={style.statPairItem}>
              <PostIcon sx={{ fontSize: 28, color: "var(--color-primary)" }} />
              <div>
                <div className={style.pairVal}>{posts.length}</div>
                <div className={style.pairLabel}>Total posts</div>
              </div>
            </div>
            <div className={style.statPairItem}>
              <TrendIcon sx={{ fontSize: 28, color: "var(--color-secondary)" }} />
              <div>
                <div className={style.pairVal}>{engagement.likes}</div>
                <div className={style.pairLabel}>Total likes</div>
              </div>
            </div>
            <div className={style.statPairItem}>
              <RequestIcon sx={{ fontSize: 28, color: "var(--color-success, #10b981)" }} />
              <div>
                <div className={style.pairVal}>{engagement.comments}</div>
                <div className={style.pairLabel}>Comments</div>
              </div>
            </div>
            <div className={style.statPairItem}>
              <OrderIcon sx={{ fontSize: 28, color: "var(--color-error, #ef4444)" }} />
              <div>
                <div className={style.pairVal}>{products.length}</div>
                <div className={style.pairLabel}>Products listed</div>
              </div>
            </div>
          </div>

          {/* category breakdown bar */}
          {products.length > 0 && (() => {
            const cats = {};
            products.forEach(p => { cats[p.category_name] = (cats[p.category_name] || 0) + 1; });
            const sorted = Object.entries(cats).sort((a,b) => b[1]-a[1]).slice(0,4);
            return (
              <div style={{ marginTop: 18 }}>
                <p className={style.barGroupLabel}>Top categories</p>
                {sorted.map(([name, count]) => (
                  <BarRow key={name} label={name} count={count} max={products.length} color="var(--color-primary)" />
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── TABLES ROW ── */}
      <div className={style.tablesGrid}>

        {/* Recent Brands */}
        <div className={style.card}>
          <h3 className={style.cardTitle}>Recent brands</h3>
          <div className={style.tableWrap}>
            <table className={style.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Brand</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBrands.length === 0 ? (
                  <tr><td colSpan={4} className={style.empty}>No brands yet</td></tr>
                ) : recentBrands.map((b, i) => (
                  <tr key={b.id}>
                    <td className={style.tdNum}>{i + 1}</td>
                    <td>
                      <div className={style.nameCell}>
                        <div className={style.avatar} style={{ background: "color-mix(in srgb, var(--color-secondary) 18%, var(--color-surface))", color: "var(--color-secondary)" }}>
                          {b.brand_name?.[0]?.toUpperCase() ?? "B"}
                        </div>
                        <span className={style.nameText}>{b.brand_name}</span>
                      </div>
                    </td>
                    <td className={style.tdMuted}>{b.brand_email}</td>
                    <td><Pill status={b.brand_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Influencers */}
        <div className={style.card}>
          <h3 className={style.cardTitle}>Recent influencers</h3>
          <div className={style.tableWrap}>
            <table className={style.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInf.length === 0 ? (
                  <tr><td colSpan={4} className={style.empty}>No influencers yet</td></tr>
                ) : recentInf.map((inf, i) => (
                  <tr key={inf.id}>
                    <td className={style.tdNum}>{i + 1}</td>
                    <td>
                      <div className={style.nameCell}>
                        <div className={style.avatar} style={{ background: "color-mix(in srgb, var(--color-primary) 18%, var(--color-surface))", color: "var(--color-primary)" }}>
                          {inf.influencer_name?.[0]?.toUpperCase() ?? "I"}
                        </div>
                        <span className={style.nameText}>{inf.influencer_name}</span>
                      </div>
                    </td>
                    <td className={style.tdMuted}>{inf.place_name ?? "—"}{inf.district_name ? `, ${inf.district_name}` : ""}</td>
                    <td><Pill status={Number(inf.influencer_status)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS TABLE ── */}
      {products.length > 0 && (
        <div className={style.card} style={{ marginTop: 14 }}>
          <h3 className={style.cardTitle}>Recent products</h3>
          <div className={style.tableWrap}>
            <table className={style.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {[...products].slice(-6).reverse().map((p, i) => (
                  <tr key={p.id}>
                    <td className={style.tdNum}>{i + 1}</td>
                    <td className={style.tdBold}>{p.product_name}</td>
                    <td className={style.tdMuted}>{p.brand_name}</td>
                    <td>
                      <span className={style.catChip}>{p.category_name}</span>
                    </td>
                    <td className={style.tdAmt}>₹{p.product_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}