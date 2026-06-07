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
import LinkIcon from "@mui/icons-material/Link";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import EventIcon from "@mui/icons-material/Event";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useTheme } from "../../../context/ThemeContext";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [userAnchor, setUserAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [contentAnchor, setContentAnchor] = useState(null);
  const [notifications] = useState(2);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openUser = Boolean(userAnchor);
  const openProfile = Boolean(profileAnchor);
  const openContent = Boolean(contentAnchor);

  const currentPage = useMemo(() => {
    const pathMap = {
      "/influencer/myprofile": "My Profile",
      "/influencer/editprofile": "Edit Profile",
      "/influencer/changepass": "Change Password",
      "/influencer/link": "Add Link",
      "/influencer/mypost": "My Posts",
      "/influencer/viewevent": "View Events",
      "/influencer/viewRequest": "Chat",
      "/influencer/AcceptedRequest": "View Requests",
      "/influencer/myapplied": "My Applied",
    };
    return pathMap[location.pathname] || "Influencer Dashboard";
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
            <h1 className={styles.brandName}>WELCOME INFLUENCER</h1>
            <p className={styles.brandSub}>{currentPage}</p>
          </div>
        </div>

        {/* CENTER */}
        {!isMobile && (
          <nav className={styles.menu}>
            <button
              type="button"
              className={`${styles.link} ${
                isActiveGroup([
                  "/influencer/myprofile",
                  "/influencer/editprofile",
                  "/influencer/changepass",
                ])
                  ? styles.active
                  : ""
              }`}
              onClick={(e) => setProfileAnchor(e.currentTarget)}
            >
              <PersonIcon fontSize="small" />
              <span>Profile</span>
              <KeyboardArrowDownIcon fontSize="small" />
            </button>

            <Menu
              anchorEl={profileAnchor}
              open={openProfile}
              onClose={() => setProfileAnchor(null)}
              disableScrollLock
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{ className: styles.dropdownPaper }}
            >
              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setProfileAnchor(null);
                  navigate("/influencer/myprofile");
                }}
              >
                <PersonIcon fontSize="small" />
                <span>My Profile</span>
              </MenuItem>

              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setProfileAnchor(null);
                  navigate("/influencer/editprofile");
                }}
              >
                <EditIcon fontSize="small" />
                <span>Edit Profile</span>
              </MenuItem>

              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setProfileAnchor(null);
                  navigate("/influencer/changepass");
                }}
              >
                <LockResetIcon fontSize="small" />
                <span>Change Password</span>
              </MenuItem>
            </Menu>

            <button
              type="button"
              className={`${styles.link} ${
                isActiveGroup(["/influencer/link", "/influencer/mypost"])
                  ? styles.active
                  : ""
              }`}
              onClick={(e) => setContentAnchor(e.currentTarget)}
            >
              <CampaignIcon fontSize="small" />
              <span>Content</span>
              <KeyboardArrowDownIcon fontSize="small" />
            </button>

            <Menu
              anchorEl={contentAnchor}
              open={openContent}
              onClose={() => setContentAnchor(null)}
              disableScrollLock
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{ className: styles.dropdownPaper }}
            >
              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setContentAnchor(null);
                  navigate("/influencer/link");
                }}
              >
                <LinkIcon fontSize="small" />
                <span>Add Link</span>
              </MenuItem>

              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setContentAnchor(null);
                  navigate("/influencer/mypost");
                }}
              >
                <DynamicFeedIcon fontSize="small" />
                <span>My Posts</span>
              </MenuItem>
            </Menu>

            <NavLink
              to="/influencer/viewevent"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <EventIcon fontSize="small" />
              <span>Events</span>
            </NavLink>

            <NavLink
              to="/influencer/viewRequest"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <MailOutlineIcon fontSize="small" />
              <span>Chats</span>
            </NavLink>
             <NavLink
              to="/influencer/acceptedRequests"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <MailOutlineIcon fontSize="small" />
              <span>Requests</span>
            </NavLink>

             <NavLink
              to="/influencer/myapplied"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <MailOutlineIcon fontSize="small" />
              <span>My Applied</span>
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
              <span className={styles.userName}>Influencer</span>
              <span className={styles.userRole}>Creator Panel</span>
            </div>
            <Avatar className={styles.avatar}>I</Avatar>
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
                <span className={styles.popoverName}>Influencer Panel</span>
                <span className={styles.popoverEmail}>creator@example.com</span>
              </div>
            </div>

            <div className={styles.popoverContent}>
              <button
                type="button"
                className={styles.popoverItem}
                onClick={() => {
                  setUserAnchor(null);
                  navigate("/influencer/myprofile");
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
                  navigate("/influencer/mypost");
                }}
              >
                <DashboardIcon fontSize="small" />
                <span>My Posts</span>
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