import React from "react";
import styles from "./Footer.module.css";
import BoltIcon from "@mui/icons-material/Bolt";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      
      <div className={styles.container}>

        <div className={styles.brand}>
          <div className={styles.logoBox}>
            <BoltIcon className={styles.logoIcon}/>
          </div>

          <div className={styles.brandText}>
            <h3>JOVIA</h3>
            <p>Influencer Marketing Platform</p>
          </div>
        </div>

        <div className={styles.copy}>
          © 2026 Jovia. All rights reserved.
        </div>

      </div>

    </footer>
  );
};

export default Footer;