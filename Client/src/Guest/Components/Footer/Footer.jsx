import React from "react";
import style from "./Footer.module.css";

import FavoriteIcon from "@mui/icons-material/Favorite";
import BoltIcon from "@mui/icons-material/Bolt";

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.container}>
        
        <div className={style.brand}>
          <BoltIcon className={style.icon}/>
          <span>Jovia Platform</span>
        </div>

        <p className={style.text}>
          © 2026 All Rights Reserved
        </p>

        <p className={style.made}>
          Made with <FavoriteIcon className={style.heart}/> using React & Django
        </p>

      </div>
    </footer>
  );
};

export default Footer;