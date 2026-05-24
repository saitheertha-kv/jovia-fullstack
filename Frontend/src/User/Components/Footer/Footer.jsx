import React from "react";
import styles from "./Footer.module.css";

import BoltIcon from "@mui/icons-material/Bolt";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* LEFT */}
        <div className={styles.brand}>
          <div className={styles.logoBox}>
            <BoltIcon className={styles.logoIcon} />
          </div>

          <div>
            <h3 className={styles.brandName}>JOVIA</h3>
            <p className={styles.brandSub}>Influencer Marketing Platform</p>
          </div>
        </div>

        {/* CENTER */}
        <div className={styles.links}>
          <a href="#">About</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>

        {/* RIGHT */}
        <div className={styles.social}>
          <a href="#">
            <GitHubIcon />
          </a>

          <a href="#">
            <LinkedInIcon />
          </a>

          <a href="#">
            <LanguageIcon />
          </a>
        </div>
      </div>

      {/* BOTTOM */}
      <div className={styles.bottom}>
        <p>© 2026 Jovia. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;