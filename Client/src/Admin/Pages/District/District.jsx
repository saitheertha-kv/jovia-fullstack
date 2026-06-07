import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import style from "./District.module.css";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  LocationCity as LocationCityIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  Search as SearchIcon,
  SaveAlt as SaveAltIcon,
} from "@mui/icons-material";

/* ───────────────────────── Toast ───────────────────────── */
const Toast = ({ toasts, removeToast }) => (
  <div className={style.toastWrapper}>
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className={`${style.toast} ${
            t.type === "success" ? style.toastSuccess : style.toastError
          }`}
        >
          {t.type === "success" ? (
            <CheckCircleIcon className={style.toastIcon} />
          ) : (
            <ErrorOutlineIcon className={style.toastIcon} />
          )}

          <span className={style.toastMsg}>{t.message}</span>

          <button onClick={() => removeToast(t.id)} className={style.toastClose}>
            <CloseIcon fontSize="small" />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ───────────────────── Confirm Dialog ───────────────────── */
const ConfirmDialog = ({ open, districtName, onConfirm, onCancel }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={style.backdrop}
          onClick={onCancel}
        />

        <motion.div
          key="dialog"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className={style.dialog}
        >
          <div className={style.dialogIcon}>
            <DeleteIcon className={style.dialogIconSvg} />
          </div>

          <h3 className={style.dialogTitle}>Delete District?</h3>
          <p className={style.dialogBody}>
            Are you sure you want to delete <b>{districtName}</b>? This action cannot be undone.
          </p>

          <div className={style.dialogActions}>
            <button className={style.btnGhost} onClick={onCancel}>
              Cancel
            </button>
            <button className={style.btnDanger} onClick={onConfirm}>
              <DeleteIcon fontSize="small" /> Delete
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const District = () => {
  // ✅ keep your same working states
  const [value, setValue] = useState("");
  const [districts, setDistricts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // ✅ UI states (do not break logic)
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, id: null, name: "" });

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadDistricts = useCallback(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/District/")
      .then((res) => setDistricts(res.data.data || []))
      .catch(() => addToast("Failed to load districts.", "error"))
      .finally(() => setLoading(false));
  }, [addToast]);

  useEffect(() => {
    loadDistricts();
  }, [loadDistricts]);

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const resetPanel = () => {
    setValue("");
    cancelEdit();
    setPanelOpen(false);
  };

  const startEdit = (d) => {
    setEditId(d.id);
    setEditName(d.district_name);
    setPanelOpen(true);
  };

  // ✅ SAME WORKING SAVE (just better UX)
  const handleSave = () => {
    const nameToSave = editId ? editName : value;

    if (!nameToSave.trim()) {
      addToast("District name cannot be empty.", "error");
      return;
    }

    setSaving(true);

    if (editId) {
      axios
        .put(`http://127.0.0.1:8000/EditDistrict/${editId}/`, {
          district_name: editName,
        })
        .then((res) => {
          // keep your existing behavior
          setDistricts(res.data.data || []);
          addToast("District updated successfully!");
          resetPanel();
          // in case API doesn’t return full list:
          loadDistricts();
        })
        .catch(() => addToast("Update failed. Please try again.", "error"))
        .finally(() => setSaving(false));
    } else {
      const formData = new FormData();
      formData.append("district_name", value);

      axios
        .post("http://127.0.0.1:8000/District/", formData)
        .then((res) => {
          addToast(res.data?.msg || "District added successfully!");
          setValue("");
          resetPanel();
          loadDistricts();
        })
        .catch(() => addToast("Save failed. Please try again.", "error"))
        .finally(() => setSaving(false));
    }
  };

  // ✅ SAME WORKING DELETE (with confirm)
  const handleDeleteConfirm = (id, name) => {
    setConfirm({ open: true, id, name });
  };

  const executeDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/DeleteDistrict/${confirm.id}/`)
      .then((res) => {
        setDistricts(res.data.data || []);
        addToast("District deleted successfully!");
        loadDistricts();
      })
      .catch(() => addToast("Delete failed. Please try again.", "error"))
      .finally(() => setConfirm({ open: false, id: null, name: "" }));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return districts;
    return districts.filter((d) => d.district_name.toLowerCase().includes(q));
  }, [districts, search]);

  const isAddMode = panelOpen && !editId;

  return (
    <div className={style.page}>
      <Toast toasts={toasts} removeToast={removeToast} />

      <ConfirmDialog
        open={confirm.open}
        districtName={confirm.name}
        onConfirm={executeDelete}
        onCancel={() => setConfirm({ open: false, id: null, name: "" })}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={style.header}
      >
        <div className={style.headerLeft}>
          <div className={style.headerIcon}>
            <LocationCityIcon className={style.headerIconSvg} />
          </div>

          <div>
            <h1 className={style.title}>Districts</h1>
            <p className={style.subtitle}>
              {districts.length} district{districts.length !== 1 ? "s" : ""} registered
            </p>
          </div>
        </div>

        <motion.button
          layout
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 520, damping: 30 }}
          className={`${style.btnPrimary} ${isAddMode ? style.btnPrimaryClose : ""}`}
          onClick={() => {
            if (panelOpen && !editId) resetPanel();
            else {
              cancelEdit();
              setValue("");
              setPanelOpen(true);
            }
          }}
        >
          <motion.span
            key={isAddMode ? "closeIcon" : "addIcon"}
            className={style.btnIconWrap}
            initial={{ opacity: 0, rotate: isAddMode ? -90 : 90, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: isAddMode ? 90 : -90, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 700, damping: 35 }}
          >
            {isAddMode ? <CloseIcon fontSize="small" /> : <AddIcon fontSize="small" />}
          </motion.span>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={isAddMode ? "closeText" : "addText"}
              className={style.btnText}
              initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
              transition={{ duration: 0.18 }}
            >
              {isAddMode ? "Close" : "Add District"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Panel */}
      <AnimatePresence initial={false}>
        {panelOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -8, maxHeight: 0, marginBottom: 0 }}
            animate={{ opacity: 1, y: 0, maxHeight: 340, marginBottom: 18 }}
            exit={{ opacity: 0, y: -8, maxHeight: 0, marginBottom: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className={style.panelWrap}
          >
            <div className={style.panel}>
              <div className={style.panelHeader}>
                <span className={style.panelTitle}>
                  {editId ? "✏️ Edit District" : "➕ New District"}
                </span>
                <button className={style.iconGhostBtn} onClick={resetPanel}>
                  <CloseIcon fontSize="small" />
                </button>
              </div>

              <div className={style.fieldGroup}>
                <label className={style.label}>District Name</label>

                {editId ? (
                  <input
                    autoFocus
                    type="text"
                    placeholder="Edit district name"
                    className={style.input}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  />
                ) : (
                  <input
                    autoFocus
                    type="text"
                    placeholder="Enter district name"
                    className={style.input}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  />
                )}
              </div>

              <div className={style.panelActions}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={style.btnPrimary}
                  onClick={handleSave}
                  disabled={saving}
                >
                  <SaveAltIcon fontSize="small" />
                  {saving ? "Saving…" : editId ? "Update" : "Save"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={style.btnGhost}
                  onClick={resetPanel}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.35 }}
        className={style.searchWrap}
      >
        <SearchIcon className={style.searchIcon} />
        <input
          type="text"
          placeholder="Search districts…"
          className={style.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        className={style.tableCard}
      >
        <div className={style.tableHead}>
          <div className={`${style.cell} ${style.colSmall}`}>#</div>
          <div className={`${style.cell} ${style.colFlex}`}>District Name</div>
          <div className={`${style.cell} ${style.colAction}`}>Actions</div>
        </div>

        {loading ? (
          <div className={style.emptyState}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
              className={style.spinner}
            />
            <span className={style.muted}>Loading…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className={style.emptyState}>
            <LocationCityIcon className={style.emptyIcon} />
            <span className={style.muted}>
              {search ? "No matching districts found." : "No districts yet. Add one!"}
            </span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((d, index) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0 }}
                transition={{ duration: 0.22, delay: index * 0.03 }}
                className={style.tableRow}
              >
                <div className={`${style.cell} ${style.colSmall}`}>
                  <span className={style.badge}>{index + 1}</span>
                </div>

                <div className={`${style.cell} ${style.colFlex} ${style.nameCell}`}>
                  {d.district_name}
                </div>

                <div className={`${style.cell} ${style.colAction}`}>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className={style.iconBtn}
                    onClick={() => startEdit(d)}
                    title="Edit"
                  >
                    <EditIcon fontSize="small" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${style.iconBtn} ${style.iconBtnDanger}`}
                    onClick={() => handleDeleteConfirm(d.id, d.district_name)}
                    title="Delete"
                  >
                    <DeleteIcon fontSize="small" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default District;
