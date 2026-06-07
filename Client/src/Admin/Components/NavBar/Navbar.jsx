import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Navbar.module.css";
import photo from "/logo3.png";

import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";

import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import BoltIcon from "@mui/icons-material/Bolt";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "../../../context/ThemeContext";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications] = useState(3);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const open = Boolean(anchorEl);
  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const tooltipText = useMemo(
    () => `Switch to ${theme === "light" ? "dark" : "light"} mode`,
    [theme]
  );

  const handleLogout = () => {
    handleClose();
    navigate("/login");
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* LEFT */}
        <div className={styles.brandSection}>
          {isMobile && (
            <Tooltip title="Menu">
              <IconButton className={styles.menuBtn} onClick={onMenuClick}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}

         <div className={styles.brandIcon}>
  <img src={photo} alt="Jovia Logo" className={styles.logo} />
</div>
          <div className={styles.brandText}>
            <h1 className={styles.brandName}>WELCOME JOVIA</h1>
            <p className={styles.brandSub}>Dashboard overview</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.navActions}>
          <Tooltip title="Notifications">
            <IconButton className={styles.iconBtn}>
              <Badge
                badgeContent={notifications}
                max={9}
                classes={{ badge: styles.badge }}
              >
                <NotificationsIcon className={styles.iconSvg} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={tooltipText}>
            <button
              className={styles.themeBtn}
              onClick={toggleTheme}
              type="button"
            >
              {theme === "light" ? (
                <>
                  <DarkModeIcon className={styles.themeIcon} />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <LightModeIcon className={styles.themeIcon} />
                  <span>Light</span>
                </>
              )}
            </button>
          </Tooltip>

          <button
            className={styles.userBlock}
            onClick={handleAvatarClick}
            type="button"
          >
            <div className={styles.userInfo}>
              <span className={styles.userName}>Jovia</span>
              <span className={styles.userRole}>Administrator</span>
            </div>

            <Avatar className={styles.avatar}>J</Avatar>
          </button>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ className: styles.popoverPaper }}
          >
            <div className={styles.popoverHeader}>
              <div className={styles.popoverHeaderTop}>
                <span className={styles.popoverName}>Jovia</span>
                <span className={styles.popoverEmail}>admin@example.com</span>
              </div>
            </div>

            <div className={styles.popoverContent}>
              <button
                className={styles.popoverItem}
                onClick={() => {
                  handleClose();
                  navigate("/admin/profile");
                }}
                type="button"
              >
                <PersonIcon fontSize="small" />
                <span>Profile</span>
              </button>

              <button
                className={styles.popoverItem}
                onClick={() => {
                  handleClose();
                  navigate("/admin");
                }}
                type="button"
              >
                <DashboardIcon fontSize="small" />
                <span>Dashboard</span>
              </button>

              <Divider className={styles.popoverDivider} />

              <button
                className={`${styles.popoverItem} ${styles.logout}`}
                onClick={handleLogout}
                type="button"
              >
                <LogoutIcon fontSize="small" />
                <span>Logout</span>
              </button>
            </div>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
