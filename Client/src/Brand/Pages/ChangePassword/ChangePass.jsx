import React, { useState } from "react";
import axios from "axios";
import style from "./ChangePass.module.css";

import {
  LockReset as LockResetIcon,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon,
  VerifiedUser as VerifiedUserIcon,
  SaveAlt as SaveAltIcon,
  RestartAlt as RestartAltIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";

const ChangePass = () => {
  const bid = sessionStorage.getItem("bid");

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleChange = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      alert("All fields required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      setSaving(true);

      const res = await axios.post(
        `http://127.0.0.1:8000/ChangeBrandPassword/${bid}/`,
        {
          old_password: form.oldPassword,
          new_password: form.newPassword,
        }
      );

      alert(res.data.message || "Password changed successfully");
      resetForm();
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Password change failed");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIconWrap}>
            <SecurityIcon className={style.heroIcon} />
          </div>

          <div>
            <h1>Change Password</h1>
            <p>Update your brand account password securely</p>
          </div>
        </div>

        <div className={style.heroStats}>
          <div className={style.statCard}>
            <span className={style.statLabel}>Security</span>
            <span className={style.statValue}>High</span>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Fields</span>
            <span className={style.statValue}>3</span>
          </div>
        </div>
      </div>

      <div className={style.formCard}>
        <div className={style.cardHeader}>
          <div>
            <h2>Password Settings</h2>
            <p>Enter your current password and set a new one</p>
          </div>

          <div className={style.badge}>
            <LockResetIcon fontSize="small" />
            <span>Secure Update</span>
          </div>
        </div>

        <div className={style.formGrid}>
          <div className={style.field}>
            <label>Old Password</label>
            <div className={style.inputWrap}>
              <LockIcon className={style.inputIcon} />
              <input
                type="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleInputChange}
                placeholder="Enter old password"
              />
            </div>
          </div>

          <div className={style.field}>
            <label>New Password</label>
            <div className={style.inputWrap}>
              <VpnKeyIcon className={style.inputIcon} />
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className={`${style.field} ${style.fullWidth}`}>
            <label>Confirm New Password</label>
            <div className={style.inputWrap}>
              <VerifiedUserIcon className={style.inputIcon} />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        <div className={style.actionBar}>
          <button
            type="button"
            onClick={handleChange}
            className={style.primaryBtn}
            disabled={saving}
          >
            <SaveAltIcon fontSize="small" />
            {saving ? "Updating..." : "Change Password"}
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

export default ChangePass;