import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import style from "./Category.module.css";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  Search as SearchIcon,
  SaveAlt as SaveAltIcon,
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
const ConfirmDialog = ({ open, name, onConfirm, onCancel }) => (
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
          <h3>Delete Category?</h3>
          <p>
            Are you sure you want to delete <b>{name}</b>?
          </p>

          <div className={style.dialogActions}>
            <button type="button" onClick={onCancel} className={style.btnGhost}>
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className={style.btnDanger}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Category = () => {
  const [value, setValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, id: null, name: "" });

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

  const resetPanel = useCallback(() => {
    setValue("");
    setEditId(null);
    setEditName("");
    setPanelOpen(false);
  }, []);

  const loadCategories = useCallback(() => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/Category/")
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch(() => {
        addToast("Failed to load categories", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [addToast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSave = () => {
    const name = editId ? editName : value;

    if (!name.trim()) {
      addToast("Category name required", "error");
      return;
    }

    setSaving(true);

    if (editId) {
      axios
        .put(`http://127.0.0.1:8000/EditCategory/${editId}/`, {
          category_name: editName,
        })
        .then((res) => {
          setCategories(res.data.data || []);
          addToast("Category updated");
          resetPanel();
        })
        .catch(() => {
          addToast("Update failed", "error");
        })
        .finally(() => {
          setSaving(false);
        });
    } else {
      const formData = new FormData();
      formData.append("category_name", value);

      axios
        .post("http://127.0.0.1:8000/Category/", formData)
        .then(() => {
          addToast("Category added");
          resetPanel();
          loadCategories();
        })
        .catch(() => {
          addToast("Save failed", "error");
        })
        .finally(() => {
          setSaving(false);
        });
    }
  };

  const handleDeleteConfirm = () => {
    axios
      .delete(`http://127.0.0.1:8000/DeleteCategory/${confirm.id}/`)
      .then((res) => {
        setCategories(res.data.data || []);
        addToast("Category deleted");
      })
      .catch(() => {
        addToast("Delete failed", "error");
      })
      .finally(() => {
        setConfirm({ open: false, id: null, name: "" });
      });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return categories.filter((c) =>
      (c.category_name || "").toLowerCase().includes(q)
    );
  }, [categories, search]);

  return (
    <div className={style.page}>
      <Toast toasts={toasts} removeToast={removeToast} />

      <ConfirmDialog
        open={confirm.open}
        name={confirm.name}
        onCancel={() => setConfirm({ open: false, id: null, name: "" })}
        onConfirm={handleDeleteConfirm}
      />

      {/* Header */}
      <div className={style.header}>
        <div className={style.headerLeft}>
          <CategoryIcon className={style.headerIcon} />
          <div>
            <h1>Categories</h1>
            <p>{categories.length} total</p>
          </div>
        </div>

        <button
          type="button"
          className={style.btnPrimary}
          onClick={() => {
            if (!panelOpen) {
              setEditId(null);
              setEditName("");
              setValue("");
            }
            setPanelOpen((prev) => !prev);
          }}
        >
          <AddIcon fontSize="small" />
          Add Category
        </button>
      </div>

      {/* Add / Edit Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className={style.panel}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="text"
              placeholder="Enter category name"
              value={editId ? editName : value}
              onChange={(e) =>
                editId ? setEditName(e.target.value) : setValue(e.target.value)
              }
              className={style.input}
            />

            <div>
              <button
                type="button"
                onClick={handleSave}
                className={style.btnPrimary}
                disabled={saving}
              >
                <SaveAltIcon fontSize="small" />
                {saving ? "Saving..." : editId ? "Update" : "Save"}
              </button>

              <button
                type="button"
                onClick={resetPanel}
                className={style.btnGhost}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className={style.searchWrap}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table / List */}
      <div className={style.tableCard}>
        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <div className={style.emptyState}>No categories found</div>
        ) : (
          filtered.map((c, index) => (
            <div key={c.id} className={style.tableRow}>
              <span>{index + 1}</span>
              <span>{c.category_name}</span>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setEditId(c.id);
                    setEditName(c.category_name);
                    setPanelOpen(true);
                  }}
                >
                  <EditIcon fontSize="small" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setConfirm({
                      open: true,
                      id: c.id,
                      name: c.category_name,
                    })
                  }
                >
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Category;