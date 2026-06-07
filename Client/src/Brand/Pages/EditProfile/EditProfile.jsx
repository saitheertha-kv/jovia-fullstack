import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./EditProfile.module.css";

import {
  Edit as EditIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  PhotoCamera as PhotoCameraIcon,
  Verified as VerifiedIcon,
  SaveAlt as SaveAltIcon,
  RestartAlt as RestartAltIcon,
} from "@mui/icons-material";

const EditProfile = () => {
  const bid = sessionStorage.getItem("bid");

  const [form, setForm] = useState({
    brand_name: "",
    brand_email: "",
    brand_link: "",
  });

  const [photo, setPhoto] = useState(null);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!bid) {
      setLoading(false);
      return;
    }

    loadProfile();
  }, [bid]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`http://127.0.0.1:8000/BrandProfile/${bid}/`);
      const data = res.data.data;

      setForm({
        brand_name: data.brand_name || "",
        brand_email: data.brand_email || "",
        brand_link: data.brand_link || "",
      });
    } catch (err) {
      console.log(err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    loadProfile();
    setPhoto(null);
    setProof(null);
  };

  const handleSubmit = async () => {
    if (!form.brand_name.trim()) {
      alert("Enter brand name");
      return;
    }

    if (!form.brand_email.trim()) {
      alert("Enter brand email");
      return;
    }

    const formData = new FormData();
    formData.append("brand_name", form.brand_name);
    formData.append("brand_email", form.brand_email);
    formData.append("brand_link", form.brand_link);

    if (photo) {
      formData.append("brand_photo", photo);
    }

    if (proof) {
      formData.append("brand_proof", proof);
    }

    try {
      setSaving(true);

      const res = await axios.post(
        `http://127.0.0.1:8000/UpdateBrandProfile/${bid}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message || "Profile updated successfully");
      setPhoto(null);
      setProof(null);
    } catch (err) {
      console.log(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIconWrap}>
            <EditIcon className={style.heroIcon} />
          </div>

          <div>
            <h1>Edit Brand Profile</h1>
            <p>Update your business information, logo and verification files</p>
          </div>
        </div>

        <div className={style.heroStats}>
          <div className={style.statCard}>
            <span className={style.statLabel}>Editable Fields</span>
            <span className={style.statValue}>5</span>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Profile Type</span>
            <span className={style.statValue}>Brand</span>
          </div>
        </div>
      </div>

      <div className={style.formCard}>
        <div className={style.cardHeader}>
          <div>
            <h2>Update Profile</h2>
            <p>Modify your account details and upload updated files if needed</p>
          </div>

          <div className={style.badge}>
            <EditIcon fontSize="small" />
            <span>Edit Mode</span>
          </div>
        </div>

        {loading ? (
          <div className={style.emptyBox}>Loading profile data...</div>
        ) : (
          <>
            <div className={style.formGrid}>
              <div className={style.field}>
                <label>Brand Name</label>
                <div className={style.inputWrap}>
                  <BusinessIcon className={style.inputIcon} />
                  <input
                    type="text"
                    name="brand_name"
                    value={form.brand_name}
                    onChange={handleChange}
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              <div className={style.field}>
                <label>Brand Email</label>
                <div className={style.inputWrap}>
                  <EmailIcon className={style.inputIcon} />
                  <input
                    type="email"
                    name="brand_email"
                    value={form.brand_email}
                    onChange={handleChange}
                    placeholder="Enter brand email"
                  />
                </div>
              </div>

              <div className={`${style.field} ${style.fullWidth}`}>
                <label>Website Link</label>
                <div className={style.inputWrap}>
                  <LanguageIcon className={style.inputIcon} />
                  <input
                    type="url"
                    name="brand_link"
                    value={form.brand_link}
                    onChange={handleChange}
                    placeholder="Enter website link"
                  />
                </div>
              </div>

              <div className={style.field}>
                <label>Brand Logo</label>
                <label className={style.fileUpload}>
                  <div className={style.fileInner}>
                    <PhotoCameraIcon className={style.inputIcon} />
                    <span className={style.fileText}>
                      {photo ? photo.name : "Choose new brand logo"}
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </label>
              </div>

              <div className={style.field}>
                <label>Brand Proof</label>
                <label className={style.fileUpload}>
                  <div className={style.fileInner}>
                    <VerifiedIcon className={style.inputIcon} />
                    <span className={style.fileText}>
                      {proof ? proof.name : "Choose new proof document"}
                    </span>
                  </div>

                  <input
                    type="file"
                    onChange={(e) => setProof(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <div className={style.actionBar}>
              <button
                type="button"
                onClick={handleSubmit}
                className={style.primaryBtn}
                disabled={saving}
              >
                <SaveAltIcon fontSize="small" />
                {saving ? "Updating..." : "Update Profile"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className={style.secondaryBtn}
              >
                <RestartAltIcon fontSize="small" />
                Reset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditProfile;