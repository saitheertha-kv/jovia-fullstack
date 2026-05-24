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
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SearchIcon from "@mui/icons-material/Search";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CampaignIcon from "@mui/icons-material/Campaign";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useTheme } from "../../../context/ThemeContext";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [userAnchor, setUserAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [campaignAnchor, setCampaignAnchor] = useState(null);
  const [notifications] = useState(3);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openUser = Boolean(userAnchor);
  const openProfile = Boolean(profileAnchor);
  const openCampaign = Boolean(campaignAnchor);

  const currentPage = useMemo(() => {
    const pathMap = {
      "/brand/myprofile": "My Profile",
      "/brand/editprofile": "Edit Profile",
      "/brand/changepass": "Change Password",
      "/brand/product": "Product",
      "/brand/SearchInfluencer": "Search Influencer",
      "/brand/addevent": "Add Event",
      "/brand/viewpost": "View Post",
    };
    return pathMap[location.pathname] || "Brand Dashboard";
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
            <h1 className={styles.brandName}>WELCOME BRAND</h1>
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
                  "/brand/myprofile",
                  "/brand/editprofile",
                  "/brand/changepass",
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
                  navigate("/brand/myprofile");
                }}
              >
                <PersonIcon fontSize="small" />
                <span>My Profile</span>
              </MenuItem>

              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setProfileAnchor(null);
                  navigate("/brand/editprofile");
                }}
              >
                <EditIcon fontSize="small" />
                <span>Edit Profile</span>
              </MenuItem>

              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setProfileAnchor(null);
                  navigate("/brand/changepass");
                }}
              >
                <LockResetIcon fontSize="small" />
                <span>Change Password</span>
              </MenuItem>
            </Menu>

            <NavLink
              to="/brand/product"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <Inventory2Icon fontSize="small" />
              <span>Product</span>
            </NavLink>
             <NavLink
              to="/brand/viewbooking"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <Inventory2Icon fontSize="small" />
              <span>View Booking</span>
            </NavLink>

            <button
              type="button"
              className={`${styles.link} ${
                isActiveGroup([
                  "/brand/SearchInfluencer",
                  "/brand/addevent",
                  "/brand/viewpost",
                ])
                  ? styles.active
                  : ""
              }`}
              onClick={(e) => setCampaignAnchor(e.currentTarget)}
            >
              <CampaignIcon fontSize="small" />
              <span>Campaign</span>
              <KeyboardArrowDownIcon fontSize="small" />
            </button>

            <Menu
              anchorEl={campaignAnchor}
              open={openCampaign}
              onClose={() => setCampaignAnchor(null)}
              disableScrollLock
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{ className: styles.dropdownPaper }}
            >
              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setCampaignAnchor(null);
                  navigate("/brand/SearchInfluencer");
                }}
              >
                <SearchIcon fontSize="small" />
                <span>Search Influencer</span>
              </MenuItem>

              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setCampaignAnchor(null);
                  navigate("/brand/addevent");
                }}
              >
                <EventAvailableIcon fontSize="small" />
                <span>Add Event</span>
              </MenuItem>

              <MenuItem
                className={styles.dropdownItem}
                onClick={() => {
                  setCampaignAnchor(null);
                  navigate("/brand/viewpost");
                }}
              >
                <DynamicFeedIcon fontSize="small" />
                <span>View Post</span>
              </MenuItem>
            </Menu>
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
              <span className={styles.userName}>Brand</span>
              <span className={styles.userRole}>Business Panel</span>
            </div>
            <Avatar className={styles.avatar}>B</Avatar>
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
                <span className={styles.popoverName}>Brand Panel</span>
                <span className={styles.popoverEmail}>brand@example.com</span>
              </div>
            </div>

            <div className={styles.popoverContent}>
              <button
                type="button"
                className={styles.popoverItem}
                onClick={() => {
                  setUserAnchor(null);
                  navigate("/brand/myprofile");
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
                  navigate("/brand/product");
                }}
              >
                <StorefrontIcon fontSize="small" />
                <span>Product</span>
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