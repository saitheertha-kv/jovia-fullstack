import React, { useState } from "react";
import style from "./AddLink.module.css";
import axios from "axios";

import {
  Link as LinkIcon,
  Save as SaveIcon,
  Public as PublicIcon,
  Campaign as CampaignIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const AddLink = () => {
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const submitLink = async () => {
    const influencerid = sessionStorage.getItem("iid");

    if (!url.trim()) {
      alert("Please enter URL");
      return;
    }

    try {
      setSaving(true);

      await axios.post("http://127.0.0.1:8000/addlink/", {
        url: url,
        influencerid: influencerid,
      });

      alert("Link Added Successfully");
      setUrl("");
    } catch (err) {
      console.log(err);
      alert("Error adding link");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIcon}>
            <CampaignIcon />
          </div>

          <div>
            <h1>Add Social Link</h1>
            <p>Add your public profile or content link for collaborations</p>
          </div>
        </div>

        <div className={style.badges}>
          <div className={style.badge}>
            <PublicIcon fontSize="small" />
            <span>Public Link</span>
          </div>

          <div className={style.badge}>
            <CheckCircleIcon fontSize="small" />
            <span>Creator Ready</span>
          </div>
        </div>
      </div>

      <div className={style.wrapper}>
        {/* LEFT INFO CARD */}
        <div className={style.infoCard}>
          <div className={style.glow}></div>

          <div className={style.infoTop}>
            <div className={style.infoIcon}>
              <LinkIcon />
            </div>

            <div>
              <h3>Link Submission</h3>
              <p>Add your important creator or social media link here</p>
            </div>
          </div>

          <div className={style.infoList}>
            <div className={style.infoItem}>
              <span className={style.infoLabel}>Examples</span>
              <span className={style.infoValue}>
                Instagram, YouTube, Portfolio, Website
              </span>
            </div>

            <div className={style.infoItem}>
              <span className={style.infoLabel}>Format</span>
              <span className={style.infoValue}>
                https://example.com/yourprofile
              </span>
            </div>

            <div className={style.infoItem}>
              <span className={style.infoLabel}>Visibility</span>
              <span className={style.infoValue}>Visible for brand review</span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM CARD */}
        <div className={style.formCard}>
          <div className={style.formHeader}>
            <h2>Add New Link</h2>
            <p>Paste a valid public URL below</p>
          </div>

          <div className={style.field}>
            <label>Profile / Social URL</label>

            <div className={style.inputWrap}>
              <LinkIcon className={style.inputIcon} />
              <input
                type="url"
                placeholder="Enter your URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>

          <div className={style.previewBox}>
            <span className={style.previewTitle}>Preview</span>
            <p className={style.previewText}>
              {url.trim() ? url : "Your entered link will appear here"}
            </p>
          </div>

          <div className={style.actions}>
            <button
              className={style.button}
              onClick={submitLink}
              disabled={saving}
              type="button"
            >
              <SaveIcon fontSize="small" />
              {saving ? "Submitting..." : "Submit Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLink;