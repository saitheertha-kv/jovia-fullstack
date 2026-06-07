import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import styles from "./Navbar.module.css";
import photo from "/logo3.png";

import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTheme } from "../../../context/ThemeContext";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [userAnchor, setUserAnchor] = useState(null);
  const [accountAnchor, setAccountAnchor] = useState(null);
  const [activityAnchor, setActivityAnchor] = useState(null);
  const [notifications] = useState(2);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openUser = Boolean(userAnchor);
  const openAccount = Boolean(accountAnchor);
  const openActivity = Boolean(activityAnchor);

  const currentPage = useMemo(() => {
    const pathMap = {
      "/user/myprofile": "My Profile",
      "/user/editprofile": "Edit Profile",
      "/user/changepass": "Change Password",
      "/user/viewproduct": "View Product",
      "/user/viewpost": "View Post",
      "/user/mycart": "My Cart",
      "/user/mybooking": "My Bookings",
      "/user/explore": "Explore",
      "/user/complaints": "Complaint",
    };
    return pathMap[location.pathname] || "User Dashboard";
  }, [location.pathname]);

  const tooltipText = useMemo(
    () => `Switch to ${theme === "light" ? "dark" : "light"} mode`,
    [theme]
  );

  const isActiveGroup = (paths) => paths.includes(location.pathname);

  const handleLogout = () => {
    setUserAnchor(null);
    sessionStorage.clear();
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

          <div className={styles.logoWrap}>
            <img src={photo} alt="Jovia Logo" className={styles.logo} />
          </div>

          <div className={styles.brandText}>
            <h1 className={styles.brandName}>WELCOME USER</h1>
            <p className={styles.brandSub}>{currentPage}</p>
          </div>
        </div>

        {/* CENTER */}
        {!isMobile && (
          <nav className={styles.menu}>
            <NavLink
              to="/user/myprofile"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <PersonIcon fontSize="small" />
              <span>My Profile</span>
            </NavLink>

            <button
              type="button"
              className={`${styles.link} ${
                isActiveGroup(["/user/editprofile", "/user/changepass"])
                  ? styles.active
                  : ""
              }`}
              onClick={(e) => setAccountAnchor(e.currentTarget)}
            >
              <EditIcon fontSize="small" />
              <span>Account</span>
              <KeyboardArrowDownIcon fontSize="small" />
            </button>

            <Menu
              anchorEl={accountAnchor}
              open={openAccount}
              onClose={() => setAccountAnchor(null)}
              disableScrollLock
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{ className: styles.dropdownPaper }}
            >
              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setAccountAnchor(null);
                  navigate("/user/editprofile");
                }}
              >
                <EditIcon fontSize="small" />
                <span>Edit Profile</span>
              </MenuItem>

              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setAccountAnchor(null);
                  navigate("/user/changepass");
                }}
              >
                <LockResetIcon fontSize="small" />
                <span>Change Password</span>
              </MenuItem>
            </Menu>

            <button
              type="button"
              className={`${styles.link} ${
                isActiveGroup([
                  "/user/viewproduct",
                  "/user/viewpost",
                  "/user/mybooking",
                ])
                  ? styles.active
                  : ""
              }`}
              onClick={(e) => setActivityAnchor(e.currentTarget)}
            >
              <DashboardIcon fontSize="small" />
              <span>Activities</span>
              <KeyboardArrowDownIcon fontSize="small" />
            </button>

            <Menu
              anchorEl={activityAnchor}
              open={openActivity}
              onClose={() => setActivityAnchor(null)}
              disableScrollLock
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{ className: styles.dropdownPaper }}
            >
              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setActivityAnchor(null);
                  navigate("/user/viewproduct");
                }}
              >
                <ShoppingBagIcon fontSize="small" />
                <span>View Product</span>
              </MenuItem>

              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setActivityAnchor(null);
                  navigate("/user/viewpost");
                }}
              >
                <PostAddIcon fontSize="small" />
                <span>View Post</span>
              </MenuItem>
              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setActivityAnchor(null);
                  navigate("/user/explore");
                }}
              >
                <PostAddIcon fontSize="small" />
                <span>Explore</span>
              </MenuItem>

              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setActivityAnchor(null);
                  navigate("/user/mybooking");
                }}
              >
                <BookOnlineIcon fontSize="small" />
                <span>My Bookings</span>
              </MenuItem>
            </Menu>

            <NavLink
              to="/user/mycart"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <ShoppingCartIcon fontSize="small" />
              <span>My Cart</span>
            </NavLink>
            <NavLink
              to="/user/complaints"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <span>Complaints</span>
            </NavLink>
          </nav>
        )}

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
              type="button"
              className={styles.themeBtn}
              onClick={toggleTheme}
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
            type="button"
            className={styles.userBlock}
            onClick={(e) => setUserAnchor(e.currentTarget)}
          >
            <div className={styles.userInfo}>
              <span className={styles.userName}>User</span>
              <span className={styles.userRole}>Customer Panel</span>
            </div>
            <Avatar className={styles.avatar}>U</Avatar>
          </button>

          <Popover
            open={openUser}
            anchorEl={userAnchor}
            onClose={() => setUserAnchor(null)}
            disableScrollLock
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ className: styles.popoverPaper }}
          >
            <div className={styles.popoverHeader}>
              <div className={styles.popoverHeaderTop}>
                <span className={styles.popoverName}>User Panel</span>
                <span className={styles.popoverEmail}>user@example.com</span>
              </div>
            </div>

            <div className={styles.popoverContent}>
              <button
                type="button"
                className={styles.popoverItem}
                onClick={() => {
                  setUserAnchor(null);
                  navigate("/user/myprofile");
                }}
              >
                <PersonIcon fontSize="small" />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                className={styles.popoverItem}
                onClick={() => {
                  setUserAnchor(null);
                  navigate("/user/mybooking");
                }}
              >
                <BookOnlineIcon fontSize="small" />
                <span>My Bookings</span>
              </button>

              <Divider className={styles.popoverDivider} />

              <button
                type="button"
                className={`${styles.popoverItem} ${styles.logout}`}
                onClick={handleLogout}
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