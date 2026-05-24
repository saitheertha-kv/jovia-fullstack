import React from "react";
import style from "./Footer.module.css";
import BoltIcon from "@mui/icons-material/Bolt";

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.container}>
        
        <div className={style.brand}>
          <BoltIcon className={style.icon} />
          <span className={style.brandName}>Jovia Platform</span>
        </div>

        <div className={style.copy}>
          © 2026 Jovia. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;