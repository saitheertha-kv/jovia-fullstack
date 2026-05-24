import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import style from "./BrandVerification.module.css";

import {
  Store as StoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PendingActions as PendingActionsIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  ErrorOutline as ErrorOutlineIcon,
  VerifiedUser as VerifiedUserIcon,
  Public as PublicIcon,
  Description as DescriptionIcon,
  DoneAll as DoneAllIcon,
  Block as BlockIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

/* ───────────── Toast ───────────── */
const Toast = ({ toasts, removeToast }) => (
  <div className={style.toastWrapper}>
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.22 }}
          className={`${style.toast} ${
            t.type === "success" ? style.toastSuccess : style.toastError
          }`}
        >
          {t.type === "success" ? (
            <CheckCircleIcon className={style.toastIcon} />
          ) : (
            <ErrorOutlineIcon className={style.toastIcon} />
          )}

          <span>{t.message}</span>

          <button type="button" onClick={() => removeToast(t.id)}>
            <CloseIcon fontSize="small" />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ───────── Confirm Dialog ───────── */
const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, type }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          className={style.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        />

        <motion.div
          className={style.dialog}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <h3>{title}</h3>
          <p>{message}</p>

          <div className={style.dialogActions}>
            <button type="button" onClick={onCancel} className={style.btnGhost}>
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className={type === "accept" ? style.btnSuccess : style.btnDanger}
            >
              {type === "accept" ? "Accept" : "Reject"}
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const BrandVerification = () => {
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState({
    open: false,
    id: null,
    name: "",
    type: "",
  });

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pendingRes, acceptedRes, rejectedRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/PendingBrands/"),
        axios.get("http://127.0.0.1:8000/AcceptedBrands/"),
        axios.get("http://127.0.0.1:8000/RejectedBrands/"),
      ]);

      setPending(pendingRes.data.data || []);
      setAccepted(acceptedRes.data.data || []);
      setRejected(rejectedRes.data.data || []);
    } catch (err) {
      console.log(err);
      addToast("Failed to load brands", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const accept = async (id) => {
    setActionLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/AcceptBrand/${id}/`);
      addToast(res.data.message || "Brand accepted");
      loadData();
    } catch (err) {
      console.log(err);
      addToast("Accept failed", "error");
    } finally {
      setActionLoading(false);
      setConfirm({ open: false, id: null, name: "", type: "" });
    }
  };

  const reject = async (id) => {
    setActionLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8000/RejectBrand/${id}/`);
      addToast(res.data.message || "Brand rejected");
      loadData();
    } catch (err) {
      console.log(err);
      addToast("Reject failed", "error");
    } finally {
      setActionLoading(false);
      setConfirm({ open: false, id: null, name: "", type: "" });
    }
  };

  const filterList = useCallback(
    (list) => {
      const q = search.toLowerCase().trim();
      if (!q) return list;

      return list.filter((item) =>
        [item.brand_name, item.brand_email, item.brand_link]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    },
    [search]
  );

  const filteredPending = useMemo(() => filterList(pending), [pending, filterList]);
  const filteredAccepted = useMemo(
    () => filterList(accepted),
    [accepted, filterList]
  );
  const filteredRejected = useMemo(
    () => filterList(rejected),
    [rejected, filterList]
  );

  const StatCard = ({ icon, label, value, tone }) => (
    <div className={`${style.statCard} ${style[tone]}`}>
      <div className={style.statIcon}>{icon}</div>
      <div>
        <h4>{value}</h4>
        <p>{label}</p>
      </div>
    </div>
  );

  const SectionCard = ({ title, icon, count, children }) => (
    <div className={style.sectionCard}>
      <div className={style.sectionHeader}>
        <div className={style.sectionTitle}>
          <div className={style.sectionIcon}>{icon}</div>
          <div>
            <h2>{title}</h2>
            <p>{count} records</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );

  const EmptyState = ({ text }) => (
    <div className={style.emptyState}>{text}</div>
  );

  const BrandRow = ({ item, type }) => (
    <motion.div
      layout
      className={style.tableRow}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={style.photoCell}>
        {item.brand_photo ? (
          <img
            src={item.brand_photo}
            alt={item.brand_name}
            className={style.avatar}
          />
        ) : (
          <div className={style.avatarFallback}>
            {item.brand_name?.charAt(0)?.toUpperCase() || "B"}
          </div>
        )}
      </div>

      <div className={style.nameCell}>
        <h4>{item.brand_name}</h4>
        <p>{item.brand_email}</p>
      </div>

      <div className={style.linkCell}>
        {item.brand_link ? (
          <a href={item.brand_link} target="_blank" rel="noreferrer">
            <PublicIcon fontSize="small" />
            Visit Link
          </a>
        ) : (
          <span className={style.mutedText}>No Link</span>
        )}
      </div>

      <div className={style.proofCell}>
        {item.brand_proof ? (
          <a href={item.brand_proof} target="_blank" rel="noreferrer">
            <DescriptionIcon fontSize="small" />
            View Proof
          </a>
        ) : (
          <span className={style.mutedText}>No Proof</span>
        )}
      </div>

      <div className={style.actionCell}>
        {type === "pending" ? (
          <>
            <button
              type="button"
              className={style.btnSuccess}
              disabled={actionLoading}
              onClick={() =>
                setConfirm({
                  open: true,
                  id: item.id,
                  name: item.brand_name,
                  type: "accept",
                })
              }
            >
              <DoneAllIcon fontSize="small" />
              Accept
            </button>

            <button
              type="button"
              className={style.btnDanger}
              disabled={actionLoading}
              onClick={() =>
                setConfirm({
                  open: true,
                  id: item.id,
                  name: item.brand_name,
                  type: "reject",
                })
              }
            >
              <BlockIcon fontSize="small" />
              Reject
            </button>
          </>
        ) : (
          <span
            className={`${style.statusBadge} ${
              type === "accepted" ? style.acceptedBadge : style.rejectedBadge
            }`}
          >
            {type === "accepted" ? "Accepted" : "Rejected"}
          </span>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className={style.page}>
      <Toast toasts={toasts} removeToast={removeToast} />

      <ConfirmDialog
        open={confirm.open}
        title={confirm.type === "accept" ? "Accept Brand?" : "Reject Brand?"}
        message={
          confirm.type === "accept" ? (
            <>
              Are you sure you want to accept <b>{confirm.name}</b>?
            </>
          ) : (
            <>
              Are you sure you want to reject <b>{confirm.name}</b>?
            </>
          )
        }
        onCancel={() => setConfirm({ open: false, id: null, name: "", type: "" })}
        onConfirm={() =>
          confirm.type === "accept" ? accept(confirm.id) : reject(confirm.id)
        }
        type={confirm.type}
      />

      <div className={style.header}>
        <div className={style.headerLeft}>
          <VerifiedUserIcon className={style.headerIcon} />
          <div>
            <h1>Brand Verification</h1>
            <p>Manage pending, accepted and rejected brand accounts</p>
          </div>
        </div>
      </div>

      <div className={style.statsGrid}>
        <StatCard
          icon={<StoreIcon />}
          label="Total Brands"
          value={pending.length + accepted.length + rejected.length}
          tone="tonePrimary"
        />
        <StatCard
          icon={<PendingActionsIcon />}
          label="Pending"
          value={pending.length}
          tone="toneWarning"
        />
        <StatCard
          icon={<CheckCircleIcon />}
          label="Accepted"
          value={accepted.length}
          tone="toneSuccess"
        />
        <StatCard
          icon={<CancelIcon />}
          label="Rejected"
          value={rejected.length}
          tone="toneDanger"
        />
      </div>

      <div className={style.searchWrap}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search by brand name, email or link..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={style.loadingCard}>Loading brands...</div>
      ) : (
        <div className={style.sections}>
          <SectionCard
            title="Pending Brands"
            icon={<PendingActionsIcon />}
            count={filteredPending.length}
          >
            {filteredPending.length === 0 ? (
              <EmptyState text="No pending brands found" />
            ) : (
              <div className={style.tableCard}>
                <div className={style.tableHead}>
                  <span>Photo</span>
                  <span>Details</span>
                  <span>Brand Link</span>
                  <span>Proof</span>
                  <span>Action</span>
                </div>

                {filteredPending.map((item) => (
                  <BrandRow key={item.id} item={item} type="pending" />
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Accepted Brands"
            icon={<CheckCircleIcon />}
            count={filteredAccepted.length}
          >
            {filteredAccepted.length === 0 ? (
              <EmptyState text="No accepted brands found" />
            ) : (
              <div className={style.tableCard}>
                <div className={style.tableHead}>
                  <span>Photo</span>
                  <span>Details</span>
                  <span>Brand Link</span>
                  <span>Proof</span>
                  <span>Status</span>
                </div>

                {filteredAccepted.map((item) => (
                  <BrandRow key={item.id} item={item} type="accepted" />
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Rejected Brands"
            icon={<CancelIcon />}
            count={filteredRejected.length}
          >
            {filteredRejected.length === 0 ? (
              <EmptyState text="No rejected brands found" />
            ) : (
              <div className={style.tableCard}>
                <div className={style.tableHead}>
                  <span>Photo</span>
                  <span>Details</span>
                  <span>Brand Link</span>
                  <span>Proof</span>
                  <span>Status</span>
                </div>

                {filteredRejected.map((item) => (
                  <BrandRow key={item.id} item={item} type="rejected" />
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}
    </div>
  );
};

export default BrandVerification;