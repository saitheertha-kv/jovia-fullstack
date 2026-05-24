import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./EditProfile.module.css";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";

const Toast = ({ toast, onClose }) => (
  <AnimatePresence>
    {toast.show && (
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 80 }}
        transition={{ duration: 0.22 }}
        className={`${styles.toast} ${
          toast.type === "success" ? styles.toastSuccess : styles.toastError
        }`}
      >
        <div className={styles.toastLeft}>
          {toast.type === "success" ? (
            <CheckCircleIcon className={styles.toastIcon} />
          ) : (
            <ErrorOutlineIcon className={styles.toastIcon} />
          )}
          <span>{toast.message}</span>
        </div>

        <button type="button" onClick={onClose} className={styles.toastClose}>
          <CloseIcon fontSize="small" />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

const EditProfile = () => {
  const uid = sessionStorage.getItem("uid");

  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    user_address: "",
    user_contact: "",
  });

  const [photo, setPhoto] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [districts, setDistricts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  useEffect(() => {
    if (!uid) return;
    loadData();
  }, [uid]);

  const loadData = async () => {
    try {
      setLoading(true);

      const districtRes = await axios.get("http://127.0.0.1:8000/District/");
      setDistricts(districtRes.data.data || []);

      const profileRes = await axios.get(
        `http://127.0.0.1:8000/UserProfile/${uid}/`
      );
      const data = profileRes.data.data;

      setForm({
        user_name: data.user_name || "",
        user_email: data.user_email || "",
        user_address: data.user_address || "",
        user_contact: data.user_contact || "",
      });

      setCurrentPhoto(data.user_photo || "");
      setDistrictId(String(data.district_id || ""));
      setPlaceId(String(data.place_id || ""));

      if (data.district_id) {
        const placeRes = await axios.get(
          `http://127.0.0.1:8000/PlaceByDistrict/${data.district_id}/`
        );
        setPlaces(placeRes.data.data || []);
      } else {
        setPlaces([]);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadPlaces = async (did) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/PlaceByDistrict/${did}/`
      );
      setPlaces(res.data.data || []);
    } catch (err) {
      console.error(err);
      setPlaces([]);
    }
  };

  const handleDistrictChange = async (e) => {
    const did = e.target.value;
    setDistrictId(did);
    setPlaceId("");
    if (did) {
      await loadPlaces(did);
    } else {
      setPlaces([]);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const previewImage = useMemo(() => {
    if (photo) {
      return URL.createObjectURL(photo);
    }
    return currentPhoto || "";
  }, [photo, currentPhoto]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.user_name.trim()) {
      showToast("Name is required", "error");
      return;
    }

    if (!form.user_email.trim()) {
      showToast("Email is required", "error");
      return;
    }

    if (!placeId) {
      showToast("Please select a place", "error");
      return;
    }

    const formData = new FormData();
    formData.append("user_name", form.user_name);
    formData.append("user_email", form.user_email);
    formData.append("user_address", form.user_address);
    formData.append("user_contact", form.user_contact);
    formData.append("place_id", placeId);

    if (photo) {
      formData.append("user_photo", photo);
    }

    try {
      setSaving(true);

      const res = await axios.post(
        `http://127.0.0.1:8000/UpdateUserProfile/${uid}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      showToast(res.data.message || "Profile updated successfully", "success");
      setPhoto(null);
      loadData();
    } catch (err) {
      console.error(err);
      showToast("Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loaderCard}>
          <div className={styles.loader}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Toast
        toast={toast}
        onClose={() => setToast({ show: false, message: "", type: "success" })}
      />

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIconWrap}>
            <EditNoteIcon className={styles.headerIcon} />
          </div>
          <div>
            <h1>Edit Profile</h1>
            <p>Update your personal details and profile photo</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.grid}>
        {/* LEFT CARD */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.cardTitle}>Profile Information</div>

          <div className={styles.formGroup}>
            <label>Name</label>
            <div className={styles.inputWrap}>
              <PersonOutlineIcon className={styles.inputIcon} />
              <input
                type="text"
                name="user_name"
                value={form.user_name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <div className={styles.inputWrap}>
              <EmailOutlinedIcon className={styles.inputIcon} />
              <input
                type="email"
                name="user_email"
                value={form.user_email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Contact</label>
            <div className={styles.inputWrap}>
              <PhoneOutlinedIcon className={styles.inputIcon} />
              <input
                type="text"
                name="user_contact"
                value={form.user_contact}
                onChange={handleChange}
                placeholder="Enter your contact number"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Address</label>
            <div className={styles.inputWrap}>
              <HomeOutlinedIcon className={styles.inputIcon} />
              <textarea
                name="user_address"
                value={form.user_address}
                onChange={handleChange}
                placeholder="Enter your address"
                rows="4"
              />
            </div>
          </div>

          <div className={styles.row2}>
            <div className={styles.formGroup}>
              <label>District</label>
              <div className={styles.inputWrap}>
                <LocationOnOutlinedIcon className={styles.inputIcon} />
                <select value={districtId} onChange={handleDistrictChange}>
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={String(d.id)}>
                      {d.district_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Place</label>
              <div className={styles.inputWrap}>
                <LocationOnOutlinedIcon className={styles.inputIcon} />
                <select
                  value={placeId}
                  onChange={(e) => setPlaceId(e.target.value)}
                >
                  <option value="">Select Place</option>
                  {places.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.place_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <div className={styles.cardTitle}>Profile Photo</div>

          <div className={styles.photoCard}>
            <div className={styles.photoPreview}>
              {previewImage ? (
                <img src={previewImage} alt="Profile Preview" />
              ) : (
                <div className={styles.noPhoto}>
                  <ImageOutlinedIcon />
                  <span>No Photo</span>
                </div>
              )}
            </div>

            <label className={styles.uploadBtn}>
              <CloudUploadOutlinedIcon fontSize="small" />
              <span>{photo ? "Change Selected Photo" : "Upload New Photo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                hidden
              />
            </label>

            {photo && <p className={styles.fileName}>{photo.name}</p>}
          </div>

          <div className={styles.infoBox}>
            <h4>Tips</h4>
            <p>Use a clear square image for better profile appearance.</p>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={saving}>
            <SaveOutlinedIcon fontSize="small" />
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default EditProfile;