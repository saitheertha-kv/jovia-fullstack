import React, { useCallback, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import style from "./ChangePass.module.css";

import LockResetIcon from "@mui/icons-material/LockReset";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

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

const ChangePass = () => {
  const uid = sessionStorage.getItem("uid");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);

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

  const resetFields = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      addToast("All fields are required", "error");
      return;
    }

    if (newPassword.length < 6) {
      addToast("New password must be at least 6 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast("New passwords do not match", "error");
      return;
    }

    try {
      setSaving(true);

      const res = await axios.post(
        `http://127.0.0.1:8000/ChangeUserPassword/${uid}/`,
        {
          old_password: oldPassword,
          new_password: newPassword,
        }
      );

      addToast(res.data.message || "Password changed successfully", "success");
      resetFields();
    } catch (err) {
      if (err.response?.data?.message) {
        addToast(err.response.data.message, "error");
      } else {
        addToast("Password change failed", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={style.page}>
      <Toast toasts={toasts} removeToast={removeToast} />

      <motion.div
        className={style.card}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className={style.header}>
          <div className={style.iconBox}>
            <LockResetIcon className={style.headerIcon} />
          </div>

          <div>
            <h1>Change Password</h1>
            <p>Update your account password securely</p>
          </div>
        </div>

        <div className={style.form}>
          <div className={style.field}>
            <label>Old Password</label>
            <div className={style.inputWrap}>
              <LockIcon className={style.inputIcon} />
              <input
                type={showOld ? "text" : "password"}
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                type="button"
                className={style.eyeBtn}
                onClick={() => setShowOld((prev) => !prev)}
              >
                {showOld ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
          </div>

          <div className={style.field}>
            <label>New Password</label>
            <div className={style.inputWrap}>
              <LockIcon className={style.inputIcon} />
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className={style.eyeBtn}
                onClick={() => setShowNew((prev) => !prev)}
              >
                {showNew ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
          </div>

          <div className={style.field}>
            <label>Confirm Password</label>
            <div className={style.inputWrap}>
              <LockIcon className={style.inputIcon} />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className={style.eyeBtn}
                onClick={() => setShowConfirm((prev) => !prev)}
              >
                {showConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
          </div>

          <div className={style.actions}>
            <button
              type="button"
              className={style.btnPrimary}
              onClick={handleChange}
              disabled={saving}
            >
              <SaveAltIcon fontSize="small" />
              {saving ? "Changing..." : "Change Password"}
            </button>

            <button
              type="button"
              className={style.btnGhost}
              onClick={resetFields}
              disabled={saving}
            >
              Clear
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePass;