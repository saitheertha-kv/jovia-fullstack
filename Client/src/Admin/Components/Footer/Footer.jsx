import React from "react";
import style from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footerContent}>
        <span className={style.brand}>Jovia Admin</span>
        <span className={style.copy}>
          © 2026 All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
