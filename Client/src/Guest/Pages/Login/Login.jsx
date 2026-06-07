import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import style from "./Login.module.css";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim()) {
      alert("Enter email");
      return;
    }

    if (!password.trim()) {
      alert("Enter password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/Login/", {
        email,
        password,
      });

      const { role, id, message } = res.data;

      alert(message);

      if (role === "user") {
        sessionStorage.setItem("uid", id);
        navigate("/user");
      } else if (role === "influencer") {
        sessionStorage.setItem("iid", id);
        navigate("/influencer");
      } else if (role === "brand") {
        sessionStorage.setItem("bid", id);
        navigate("/brand");
      } else if (role === "admin") {
        sessionStorage.setItem("aid", id);
        navigate("/admin");
      }
    } catch (err) {
      console.log(err);

      if (err.response && err.response.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.page}>
      <div className={style.loginCard}>
        <div className={style.topSection}>
          <div className={style.iconWrap}>
            <AdminPanelSettingsIcon className={style.topIcon} />
          </div>

          <h1>Welcome Back</h1>
          <p>Login to continue to your dashboard</p>
        </div>

        <div className={style.formArea}>
          <div className={style.field}>
            <label>Email Address</label>
            <div className={style.inputWrap}>
              <EmailIcon className={style.inputIcon} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={style.field}>
            <label>Password</label>
            <div className={style.inputWrap}>
              <LockIcon className={style.inputIcon} />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className={style.eyeBtn}
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
          </div>

          <button
            type="button"
            className={style.loginBtn}
            onClick={handleLogin}
            disabled={loading}
          >
            <LoginIcon fontSize="small" />
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;