import React, { useState } from "react";
import axios from "axios";
import style from "./ChangePass.module.css";

import {
  LockOutlined,
  VpnKey,
  Shield,
  Visibility,
  VisibilityOff,
  Save,
  Security,
} from "@mui/icons-material";

const ChangePass = () => {
  const iid = sessionStorage.getItem("iid");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("All fields required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      setSaving(true);

      const res = await axios.post(
        `http://127.0.0.1:8000/ChangeInfluencerPassword/${iid}/`,
        {
          old_password: oldPassword,
          new_password: newPassword,
        }
      );

      alert(res.data.message);

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
          <div className={style.heroIcon}>
            <Security />
          </div>

          <div>
            <h1>Change Password</h1>
            <p>Keep your influencer account secure by updating your password</p>
          </div>
        </div>

        <div className={style.heroBadge}>
          <Shield fontSize="small" />
          <span>Secure Access</span>
        </div>
      </div>

      <div className={style.layout}>
        {/* LEFT SIDE */}
        <div className={style.infoCard}>
          <div className={style.infoGlow} />

          <div className={style.infoTop}>
            <div className={style.lockCircle}>
              <LockOutlined />
            </div>
            <h2>Password Security</h2>
            <p>
              Use a strong password to protect your account from unauthorized
              access.
            </p>
          </div>

          <div className={style.tipList}>
            <div className={style.tipItem}>
              <span className={style.tipDot} />
              <p>Use at least 8 characters</p>
            </div>

            <div className={style.tipItem}>
              <span className={style.tipDot} />
              <p>Mix uppercase, lowercase, numbers and symbols</p>
            </div>

            <div className={style.tipItem}>
              <span className={style.tipDot} />
              <p>Do not reuse your previous password</p>
            </div>

            <div className={style.tipItem}>
              <span className={style.tipDot} />
              <p>Never share your password with anyone</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={style.formCard}>
          <div className={style.formHeader}>
            <h3>Update Credentials</h3>
            <p>Enter your current password and choose a new one</p>
          </div>

          <div className={style.fieldGroup}>
            <label>Old Password</label>
            <div className={style.inputWrap}>
              <VpnKey className={style.inputIcon} />
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter old password"
              />
              <button
                type="button"
                className={style.eyeBtn}
                onClick={() => setShowOld((prev) => !prev)}
              >
                {showOld ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
          </div>

          <div className={style.fieldGroup}>
            <label>New Password</label>
            <div className={style.inputWrap}>
              <LockOutlined className={style.inputIcon} />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className={style.eyeBtn}
                onClick={() => setShowNew((prev) => !prev)}
              >
                {showNew ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
          </div>

          <div className={style.fieldGroup}>
            <label>Confirm Password</label>
            <div className={style.inputWrap}>
              <LockOutlined className={style.inputIcon} />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className={style.eyeBtn}
                onClick={() => setShowConfirm((prev) => !prev)}
              >
                {showConfirm ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
          </div>

          <div className={style.actionBar}>
            <button
              type="button"
              className={style.saveBtn}
              onClick={handleChange}
              disabled={saving}
            >
              <Save fontSize="small" />
              {saving ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;