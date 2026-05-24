import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import style from "./Place.module.css";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Place as PlaceIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  Search as SearchIcon,
  SaveAlt as SaveAltIcon,
  LocationCity as LocationCityIcon,
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
          <h3>Delete Place?</h3>
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

const Place = () => {
  const [placeName, setPlaceName] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [places, setPlaces] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDist, setEditDist] = useState("");

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
    setPlaceName("");
    setDistrictId("");
    setEditId(null);
    setEditName("");
    setEditDist("");
    setPanelOpen(false);
  }, []);

  const loadDistricts = useCallback(() => {
    axios
      .get("http://127.0.0.1:8000/District/")
      .then((res) => {
        setDistricts(res.data.data || []);
      })
      .catch(() => {
        addToast("Failed to load districts", "error");
      });
  }, [addToast]);

  const loadPlaces = useCallback(() => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/Place/")
      .then((res) => {
        setPlaces(res.data.data || []);
      })
      .catch(() => {
        addToast("Failed to load places", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [addToast]);

  useEffect(() => {
    loadDistricts();
    loadPlaces();
  }, [loadDistricts, loadPlaces]);

  const handleSave = () => {
    const name = editId ? editName : placeName;
    const dist = editId ? editDist : districtId;

    if (!dist) {
      addToast("Please select district", "error");
      return;
    }

    if (!name.trim()) {
      addToast("Place name required", "error");
      return;
    }

    setSaving(true);

    if (editId) {
      axios
        .put(`http://127.0.0.1:8000/EditPlace/${editId}/`, {
          place_name: editName,
          district_id: editDist,
        })
        .then((res) => {
          setPlaces(res.data.data || []);
          addToast("Place updated");
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
      formData.append("place_name", placeName);
      formData.append("district_id", districtId);

      axios
        .post("http://127.0.0.1:8000/Place/", formData)
        .then((res) => {
          setPlaces(res.data.data || []);
          addToast("Place added");
          resetPanel();
        })
        .catch(() => {
          addToast("Save failed", "error");
        })
        .finally(() => {
          setSaving(false);
        });
    }
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setEditName(p.place_name || "");
    setEditDist(String(p.district_id || ""));
    setPanelOpen(true);
  };

  const handleDeleteConfirm = () => {
    axios
      .delete(`http://127.0.0.1:8000/DeletePlace/${confirm.id}/`)
      .then((res) => {
        setPlaces(res.data.data || []);
        addToast("Place deleted");
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

    return places.filter((p) => {
      const place = (p.place_name || "").toLowerCase();
      const district = (p.district_name || "").toLowerCase();
      return place.includes(q) || district.includes(q);
    });
  }, [places, search]);

  return (
    <div className={style.page}>
      <Toast toasts={toasts} removeToast={removeToast} />

      <ConfirmDialog
        open={confirm.open}
        name={confirm.name}
        onCancel={() => setConfirm({ open: false, id: null, name: "" })}
        onConfirm={handleDeleteConfirm}
      />

      <div className={style.header}>
        <div className={style.headerLeft}>
          <PlaceIcon className={style.headerIcon} />
          <div>
            <h1>Places</h1>
            <p>{places.length} total</p>
          </div>
        </div>

        <button
          type="button"
          className={style.btnPrimary}
          onClick={() => {
            if (!panelOpen) {
              setEditId(null);
              setEditName("");
              setEditDist("");
              setPlaceName("");
              setDistrictId("");
            }
            setPanelOpen((prev) => !prev);
          }}
        >
          <AddIcon fontSize="small" />
          Add Place
        </button>
      </div>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className={style.panel}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.2 }}
          >
            <div className={style.formGrid}>
              <div className={style.field}>
                <label>District</label>
                <div className={style.selectWrap}>
                  <LocationCityIcon className={style.fieldIcon} />
                  <select
                    value={editId ? editDist : districtId}
                    onChange={(e) =>
                      editId
                        ? setEditDist(e.target.value)
                        : setDistrictId(e.target.value)
                    }
                    className={style.select}
                  >
                    <option value="">Select district</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.district_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={style.field}>
                <label>Place Name</label>
                <input
                  type="text"
                  placeholder="Enter place name"
                  value={editId ? editName : placeName}
                  onChange={(e) =>
                    editId
                      ? setEditName(e.target.value)
                      : setPlaceName(e.target.value)
                  }
                  className={style.input}
                />
              </div>
            </div>

            <div className={style.panelActions}>
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

      <div className={style.searchWrap}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search place or district..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={style.tableCard}>
        <div className={style.tableHead}>
          <span>No</span>
          <span>Place</span>
          <span>District</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <p className={style.loadingText}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div className={style.emptyState}>No places found</div>
        ) : (
          filtered.map((p, index) => (
            <div key={p.id} className={style.tableRow}>
              <span>{index + 1}</span>
              <span>{p.place_name}</span>
              <span>{p.district_name}</span>

              <div>
                <button type="button" onClick={() => startEdit(p)}>
                  <EditIcon fontSize="small" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setConfirm({
                      open: true,
                      id: p.id,
                      name: p.place_name,
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

export default Place;