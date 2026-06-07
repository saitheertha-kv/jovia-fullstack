import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import style from "./NavBar.module.css";
import photo from "/logo3.png";

import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CampaignIcon from "@mui/icons-material/Campaign";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";


import { useTheme } from "../../../context/ThemeContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tooltipText = useMemo(
    () => `Switch to ${theme === "light" ? "dark" : "light"} mode`,
    [theme]
  );

  const isActive = (path) => location.pathname === path;

  const isRegisterActive = [
    "/guest/registraction",
    "/guest/brandreg",
    "/guest/influencerRegistration",
  ].includes(location.pathname);

  return (
    <header className={style.navbar}>
      <div className={style.navbarContainer}>
        <div className={style.brandSection}>
          <div className={style.logoWrap}>
            <img src={photo} alt="Jovia Logo" className={style.logo} />
          </div>

          <div className={style.brandText}>
            <h1 className={style.brandName}>JOVIA</h1>
            <p className={style.brandSub}>Welcome to our platform</p>
          </div>
        </div>

        <nav className={style.menu}>
          <Link
            to="/"
            className={`${style.link} ${isActive("/") ? style.active : ""}`}
          >
            <HomeRoundedIcon fontSize="small" />
            <span>Home</span>
          </Link>

          <Link
            to="/login"
            className={`${style.link} ${
              isActive("/login") ? style.active : ""
            }`}
          >
            <LoginIcon fontSize="small" />
            <span>Login</span>
          </Link>

          <div className={style.dropdown} ref={dropdownRef}>
            <button
              type="button"
              className={`${style.link} ${isRegisterActive ? style.active : ""}`}
              onClick={() => setOpen(!open)}
            >
              <AppRegistrationIcon fontSize="small" />
              <span>Registration</span>
              <KeyboardArrowDownIcon
                fontSize="small"
                className={`${style.arrow} ${open ? style.rotate : ""}`}
              />
            </button>

            {open && (
              <div className={style.dropdownMenu}>
                <Link
                  className={style.dropItem}
                  to="/registraction"
                  onClick={() => setOpen(false)}
                >
                  <PersonAddAlt1Icon fontSize="small" />
                  <span>User Register</span>
                </Link>

                <Link
                  className={style.dropItem}
                  to="/brandreg"
                  onClick={() => setOpen(false)}
                >
                  <StorefrontIcon fontSize="small" />
                  <span>Brand Register</span>
                </Link>

                <Link
                  className={style.dropItem}
                  to="/influencerRegistration"
                  onClick={() => setOpen(false)}
                >
                  <CampaignIcon fontSize="small" />
                  <span>Influencer Register</span>
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            className={style.themeBtn}
            onClick={toggleTheme}
            title={tooltipText}
          >
            {theme === "light" ? (
              <>
                <DarkModeIcon className={style.themeIcon} />
                <span>Dark</span>
              </>
            ) : (
              <>
                <LightModeIcon className={style.themeIcon} />
                <span>Light</span>
              </>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;