import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Sidebar.module.css";

import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import PlaceIcon from "@mui/icons-material/Place";
import ClassIcon from "@mui/icons-material/Class";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CampaignIcon from "@mui/icons-material/Campaign";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";

const Sidebar = ({ isMobileOpen = true, onClose }) => {
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [openLocation, setOpenLocation] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (
      location.pathname.startsWith("/admin/district") ||
      location.pathname.startsWith("/admin/place")
    ) {
      setOpenLocation(true);
    }
  }, [location.pathname]);

  const menuItems = useMemo(
    () => [
      {
        path: "/admin/",
        label: "Dashboard",
        key: "Dashboard",
        icon: <HomeIcon className={styles.menuIcon} />,
      },
      {
        path: "/admin/category",
        label: "Category",
        key: "Category",
        icon: <CategoryIcon className={styles.menuIcon} />,
      },
      {
        path: "/admin/subcategory",
        label: "Sub Category",
        key: "SubCategory",
        icon: <ClassIcon className={styles.menuIcon} />,
      },
      {
        path: "/admin/BrandVerification",
        label: "Brand Verification",
        key: "BrandVerification",
        icon: <VerifiedUserIcon className={styles.menuIcon} />,
      },
       {
        path: "/admin/viewcomplaint",
        label: "View Complaint",
        key: "ViewComplaint",
        icon: <VerifiedUserIcon className={styles.menuIcon} />,
      },
      {
        path: "/admin/VerifyInfluncer",
        label: "Influencer Verification",
        key: "VerifyInfluncer",
        icon: <CampaignIcon className={styles.menuIcon} />,
      },
    ],
    []
  );

  const activeKey = useMemo(() => {
    const p = location.pathname;

    const exact = menuItems.find((m) => m.path === p);
    if (exact) return exact.key;

    const prefix = menuItems.find(
      (m) => m.path !== "/admin/" && p.startsWith(m.path)
    );
    if (prefix) return prefix.key;

    if (p === "/admin" || p === "/admin/") return "Dashboard";
    return "";
  }, [location.pathname, menuItems]);

  const locationActive =
    location.pathname.startsWith("/admin/district") ||
    location.pathname.startsWith("/admin/place");

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: -320 },
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            className={styles.overlay}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={styles.sidebarContainer}
        initial={false}
        animate={isMobile ? (isMobileOpen ? "open" : "closed") : "open"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
      >
        <div className={styles.sidebarGlow}></div>

        <div className={styles.sidebarHeader}>
          <div className={styles.brandCard}>
            <div className={styles.brandAvatar}>A</div>
            <div className={styles.brandText}>
              <h3 className={styles.brandTitle}>JOVIA Panel</h3>
              <p className={styles.brandSub}>Admin Dashboard</p>
            </div>
          </div>
        </div>

        <ul className={styles.menuList}>
          {menuItems.map((item) => {
            const isActive = activeKey === item.key;

            return (
              <li key={item.key} className={styles.menuItem}>
                <Link
                  to={item.path}
                  className={`${styles.menuLink} ${isActive ? styles.active : ""}`}
                  onClick={() => isMobile && onClose?.()}
                >
                  <span className={styles.iconWrap}>{item.icon}</span>
                  <span className={styles.menuText}>{item.label}</span>
                  {isActive && <span className={styles.activeDot} />}
                </Link>
              </li>
            );
          })}

          <li className={styles.menuItem}>
            <button
              type="button"
              className={`${styles.menuLink} ${styles.dropdownBtn} ${
                locationActive ? styles.activeSoft : ""
              }`}
              onClick={() => setOpenLocation((prev) => !prev)}
            >
              <span className={styles.iconWrap}>
                <PlaceIcon className={styles.menuIcon} />
              </span>
              <span className={styles.menuText}>Location</span>
              <KeyboardArrowDownIcon
                className={`${styles.chev} ${openLocation ? styles.chevOpen : ""}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {openLocation && (
                <motion.div
                  className={styles.dropdown}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link
                    to="/admin/district"
                    className={`${styles.subLink} ${
                      location.pathname.startsWith("/admin/district")
                        ? styles.subActive
                        : ""
                    }`}
                    onClick={() => isMobile && onClose?.()}
                  >
                    <LocationOnIcon className={styles.subIcon} />
                    District
                  </Link>

                  <Link
                    to="/admin/place"
                    className={`${styles.subLink} ${
                      location.pathname.startsWith("/admin/place")
                        ? styles.subActive
                        : ""
                    }`}
                    onClick={() => isMobile && onClose?.()}
                  >
                    <MapIcon className={styles.subIcon} />
                    Place
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>

        <div className={styles.sidebarFooter}>
          <p>© 2026 Jovia Panel</p>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;