import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import style from "./Subcategory.module.css";

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
  AccountTree as AccountTreeIcon,
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
          <h3>Delete Subcategory?</h3>
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

/* ───────── Edit Modal ───────── */
const EditModal = ({
  open,
  categories,
  editCategory,
  setEditCategory,
  editName,
  setEditName,
  onUpdate,
  onClose,
  saving,
}) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          className={style.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className={style.modal}
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.22 }}
        >
          <div className={style.modalHeader}>
            <div className={style.modalTitleWrap}>
              <div className={style.modalIcon}>
                <EditIcon />
              </div>
              <div>
                <h3>Edit Subcategory</h3>
                <p>Update subcategory name and category</p>
              </div>
            </div>

            <button type="button" className={style.iconClose} onClick={onClose}>
              <CloseIcon />
            </button>
          </div>

          <div className={style.modalBody}>
            <div className={style.fieldGroup}>
              <label>Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className={style.select}
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div className={style.fieldGroup}>
              <label>Subcategory Name</label>
              <input
                type="text"
                className={style.input}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter subcategory name"
              />
            </div>
          </div>

          <div className={style.modalActions}>
            <button
              type="button"
              onClick={onUpdate}
              className={style.btnPrimary}
              disabled={saving}
            >
              <SaveAltIcon fontSize="small" />
              {saving ? "Updating..." : "Update"}
            </button>

            <button type="button" onClick={onClose} className={style.btnGhost}>
              Cancel
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Subcategory = () => {
  const [subcategoryName, setSubcategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");

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

  const loadCategories = useCallback(() => {
    axios
      .get("http://127.0.0.1:8000/Category/")
      .then((res) => setCategories(res.data.data || []))
      .catch(() => addToast("Failed to load categories", "error"));
  }, [addToast]);

  const loadSubcategories = useCallback(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/Subcategory/")
      .then((res) => setSubcategories(res.data.data || []))
      .catch(() => addToast("Failed to load subcategories", "error"))
      .finally(() => setLoading(false));
  }, [addToast]);

  useEffect(() => {
    loadCategories();
    loadSubcategories();
  }, [loadCategories, loadSubcategories]);

  const resetForm = () => {
    setSubcategoryName("");
    setCategoryId("");
  };

  const handleSave = () => {
    if (!subcategoryName.trim() || !categoryId) {
      addToast("Subcategory name and category are required", "error");
      return;
    }

    setSaving(true);

    const formData = new FormData();
    formData.append("subcategory_name", subcategoryName);
    formData.append("category_id", categoryId);

    axios
      .post("http://127.0.0.1:8000/Subcategory/", formData)
      .then((res) => {
        setSubcategories(res.data.data || []);
        resetForm();
        addToast("Subcategory added");
      })
      .catch(() => addToast("Save failed", "error"))
      .finally(() => setSaving(false));
  };

  const openEdit = (s) => {
    setEditId(s.id);
    setEditName(s.subcategory_name);
    setEditCategory(String(s.category_id));
    setShowModal(true);
  };

  const updateSubcategory = () => {
    if (!editName.trim() || !editCategory) {
      addToast("Subcategory name and category are required", "error");
      return;
    }

    setSaving(true);

    axios
      .put(`http://127.0.0.1:8000/EditSubcategory/${editId}/`, {
        subcategory_name: editName,
        category_id: editCategory,
      })
      .then((res) => {
        setSubcategories(res.data.data || []);
        setShowModal(false);
        setEditId(null);
        setEditName("");
        setEditCategory("");
        addToast("Subcategory updated");
      })
      .catch(() => addToast("Update failed", "error"))
      .finally(() => setSaving(false));
  };

  const deleteSubcategory = () => {
    axios
      .delete(`http://127.0.0.1:8000/DeleteSubcategory/${confirm.id}/`)
      .then((res) => {
        setSubcategories(res.data.data || []);
        addToast("Subcategory deleted");
      })
      .catch(() => addToast("Delete failed", "error"))
      .finally(() => setConfirm({ open: false, id: null, name: "" }));
  };

  const filteredSubcategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    return subcategories.filter(
      (s) =>
        (s.subcategory_name || "").toLowerCase().includes(q) ||
        (s.category_name || "").toLowerCase().includes(q)
    );
  }, [subcategories, search]);

  return (
    <div className={style.page}>
      <Toast toasts={toasts} removeToast={removeToast} />

      <ConfirmDialog
        open={confirm.open}
        name={confirm.name}
        onCancel={() => setConfirm({ open: false, id: null, name: "" })}
        onConfirm={deleteSubcategory}
      />

      <EditModal
        open={showModal}
        categories={categories}
        editCategory={editCategory}
        setEditCategory={setEditCategory}
        editName={editName}
        setEditName={setEditName}
        onUpdate={updateSubcategory}
        onClose={() => setShowModal(false)}
        saving={saving}
      />

      <div className={style.header}>
        <div className={style.headerLeft}>
          <AccountTreeIcon className={style.headerIcon} />
          <div>
            <h1>Subcategories</h1>
            <p>{subcategories.length} total</p>
          </div>
        </div>
      </div>

      <div className={style.formCard}>
        <div className={style.formHeader}>
          <div className={style.formTitle}>
            <CategoryIcon className={style.formTitleIcon} />
            <div>
              <h3>Add Subcategory</h3>
              <p>Create and manage product subcategories</p>
            </div>
          </div>
        </div>

        <div className={style.formGrid}>
          <div className={style.fieldGroup}>
            <label>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={style.select}
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className={style.fieldGroup}>
            <label>Subcategory Name</label>
            <input
              type="text"
              placeholder="Enter subcategory name"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              className={style.input}
            />
          </div>

          <div className={style.formActions}>
            <button
              type="button"
              onClick={handleSave}
              className={style.btnPrimary}
              disabled={saving}
            >
              <AddIcon fontSize="small" />
              {saving ? "Saving..." : "Save"}
            </button>

            <button type="button" onClick={resetForm} className={style.btnGhost}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className={style.searchWrap}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search by subcategory or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={style.tableCard}>
        <div className={style.tableHead}>
          <span>No</span>
          <span>Subcategory</span>
          <span>Category</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className={style.emptyState}>Loading...</div>
        ) : filteredSubcategories.length === 0 ? (
          <div className={style.emptyState}>No subcategories found</div>
        ) : (
          filteredSubcategories.map((s, index) => (
            <div key={s.id} className={style.tableRow}>
              <span className={style.rowIndex}>{index + 1}</span>
              <span className={style.rowName}>{s.subcategory_name}</span>
              <span className={style.rowCategory}>{s.category_name}</span>

              <div className={style.rowActions}>
                <button type="button" onClick={() => openEdit(s)}>
                  <EditIcon fontSize="small" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setConfirm({
                      open: true,
                      id: s.id,
                      name: s.subcategory_name,
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

export default Subcategory;