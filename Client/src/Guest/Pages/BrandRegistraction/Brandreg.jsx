import React, { useState } from "react";
import axios from "axios";
import style from "./Brandreg.module.css";

import {
  Storefront as StorefrontIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Language as LanguageIcon,
  PhotoCamera as PhotoCameraIcon,
  Verified as VerifiedIcon,
  AppRegistration as AppRegistrationIcon,
  SaveAlt as SaveAltIcon,
  RestartAlt as RestartAltIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

const Brandreg = () => {
  const [form, setForm] = useState({
    brand_name: "",
    brand_email: "",
    brand_password: "",
    brand_link: "",
  });

  const [brandLogo, setBrandLogo] = useState(null);
  const [brandProof, setBrandProof] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      brand_name: "",
      brand_email: "",
      brand_password: "",
      brand_link: "",
    });
    setBrandLogo(null);
    setBrandProof(null);
  };

  const emailRegex = /^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/;

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

const urlRegex =
  /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/;



  const handleSubmit = async () => {
    if (!form.brand_name.trim()) {
  alert("Enter brand name");
  return;
}

if (!emailRegex.test(form.brand_email)) {
  alert("Enter valid email");
  return;
}

if (!passwordRegex.test(form.brand_password)) {
  alert("Password must contain letter, number & special character (min 6)");
  return;
}

if (form.brand_link && !urlRegex.test(form.brand_link)) {
  alert("Enter valid website link");
  return;
}

if (!brandLogo) {
  alert("Upload brand logo");
  return;
}

if (!brandProof) {
  alert("Upload brand proof");
  return;
    }

    const formData = new FormData();
    formData.append("brand_name", form.brand_name);
    formData.append("brand_email", form.brand_email);
    formData.append("brand_password", form.brand_password);
    formData.append("brand_photo", brandLogo);
    formData.append("brand_proof", brandProof);
    formData.append("brand_link", form.brand_link);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/BrandReg/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message || "Brand registration successful");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIconWrap}>
            <BusinessIcon className={style.heroIcon} />
          </div>

          <div>
            <h1>Brand Registration</h1>
            <p>Register your business profile and submit verification details</p>
          </div>
        </div>

        <div className={style.heroStats}>
          <div className={style.statCard}>
            <span className={style.statLabel}>Required Files</span>
            <span className={style.statValue}>2</span>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Account Type</span>
            <span className={style.statValue}>Brand</span>
          </div>
        </div>
      </div>

      <div className={style.formCard}>
        <div className={style.cardHeader}>
          <div>
            <h2>Create Brand Account</h2>
            <p>Fill in your business details to register as a brand</p>
          </div>

          <div className={style.badge}>
            <AppRegistrationIcon fontSize="small" />
            <span>Business Entry</span>
          </div>
        </div>

        <div className={style.formGrid}>
          <div className={style.field}>
            <label>Brand Name</label>
            <div className={style.inputWrap}>
              <StorefrontIcon className={style.inputIcon} />
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

          <div className={style.field}>
            <label>Password</label>
            <div className={style.inputWrap}>
              <LockIcon className={style.inputIcon} />
              <input
                type="password"
                name="brand_password"
                value={form.brand_password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className={style.field}>
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
                  {brandLogo ? brandLogo.name : "Choose brand logo"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBrandLogo(e.target.files[0])}
              />
            </label>
          </div>

          <div className={style.field}>
            <label>Brand Proof</label>
            <label className={style.fileUpload}>
              <div className={style.fileInner}>
                <VerifiedIcon className={style.inputIcon} />
                <span className={style.fileText}>
                  {brandProof ? brandProof.name : "Choose verification proof"}
                </span>
              </div>
              <input
                type="file"
                onChange={(e) => setBrandProof(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        <div className={style.actionBar}>
          <button
            type="button"
            onClick={handleSubmit}
            className={style.primaryBtn}
            disabled={loading}
          >
            <SaveAltIcon fontSize="small" />
            {loading ? "Registering..." : "Register Brand"}
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
      </div>
    </div>
  );
};

export default Brandreg;