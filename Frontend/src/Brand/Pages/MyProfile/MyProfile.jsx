import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import style from "./MyProfile.module.css";

import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  VerifiedUser as VerifiedUserIcon,
  Description as DescriptionIcon,
  HourglassTop as HourglassTopIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Storefront as StorefrontIcon,
} from "@mui/icons-material";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const bid = sessionStorage.getItem("bid");

  useEffect(() => {
    if (!bid) {
      alert("Not logged in");
      setLoading(false);
      return;
    }

    loadProfile();
  }, [bid]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/BrandProfile/${bid}/`);
      setProfile(res.data.data || null);
    } catch (err) {
      console.log(err);
      alert("Failed to load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const statusData = useMemo(() => {
    if (!profile) {
      return {
        text: "",
        icon: null,
        className: "",
      };
    }

    if (profile.brand_status === 0) {
      return {
        text: "Pending",
        icon: <HourglassTopIcon fontSize="small" />,
        className: style.pending,
      };
    }

    if (profile.brand_status === 1) {
      return {
        text: "Accepted",
        icon: <CheckCircleIcon fontSize="small" />,
        className: style.accepted,
      };
    }

    if (profile.brand_status === 2) {
      return {
        text: "Rejected",
        icon: <CancelIcon fontSize="small" />,
        className: style.rejected,
      };
    }

    return {
      text: "Unknown",
      icon: <VerifiedUserIcon fontSize="small" />,
      className: style.pending,
    };
  }, [profile]);

  if (loading) {
    return (
      <div className={style.page}>
        <div className={style.emptyBox}>Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={style.page}>
        <div className={style.emptyBox}>Profile not found</div>
      </div>
    );
  }

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIconWrap}>
            <StorefrontIcon className={style.heroIcon} />
          </div>

          <div>
            <h1>Brand Profile</h1>
            <p>View your business account details and verification status</p>
          </div>
        </div>

        <div className={style.heroStats}>
          <div className={style.statCard}>
            <span className={style.statLabel}>Account Type</span>
            <span className={style.statValue}>Brand</span>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Status</span>
            <span className={style.statValue}>{statusData.text}</span>
          </div>
        </div>
      </div>

      <div className={style.profileCard}>
        <div className={style.topSection}>
          <div className={style.photoCard}>
            {profile.brand_photo ? (
              <img
                src={profile.brand_photo}
                alt={profile.brand_name || "Brand"}
                className={style.profileImage}
              />
            ) : (
              <div className={style.photoPlaceholder}>
                <BusinessIcon className={style.placeholderIcon} />
              </div>
            )}
          </div>

          <div className={style.profileIntro}>
            <h2>{profile.brand_name || "Brand Name"}</h2>
            <p>{profile.brand_email || "No email available"}</p>

            <div className={`${style.statusBadge} ${statusData.className}`}>
              {statusData.icon}
              <span>{statusData.text}</span>
            </div>
          </div>
        </div>

        <div className={style.infoGrid}>
          <div className={style.infoItem}>
            <div className={style.infoLabel}>
              <BusinessIcon fontSize="small" />
              <span>Name</span>
            </div>
            <div className={style.infoValue}>{profile.brand_name || "-"}</div>
          </div>

          <div className={style.infoItem}>
            <div className={style.infoLabel}>
              <EmailIcon fontSize="small" />
              <span>Email</span>
            </div>
            <div className={style.infoValue}>{profile.brand_email || "-"}</div>
          </div>

          <div className={style.infoItem}>
            <div className={style.infoLabel}>
              <LanguageIcon fontSize="small" />
              <span>Website</span>
            </div>
            <div className={style.infoValue}>
              {profile.brand_link ? (
                <a
                  href={profile.brand_link}
                  target="_blank"
                  rel="noreferrer"
                  className={style.infoLink}
                >
                  {profile.brand_link}
                </a>
              ) : (
                "-"
              )}
            </div>
          </div>

          <div className={style.infoItem}>
            <div className={style.infoLabel}>
              <VerifiedUserIcon fontSize="small" />
              <span>Status</span>
            </div>
            <div className={style.infoValue}>
              <span className={`${style.statusBadge} ${statusData.className}`}>
                {statusData.icon}
                <span>{statusData.text}</span>
              </span>
            </div>
          </div>

          <div className={`${style.infoItem} ${style.fullWidth}`}>
            <div className={style.infoLabel}>
              <DescriptionIcon fontSize="small" />
              <span>Proof Document</span>
            </div>
            <div className={style.infoValue}>
              {profile.brand_proof ? (
                <a
                  href={profile.brand_proof}
                  target="_blank"
                  rel="noreferrer"
                  className={style.proofBtn}
                >
                  View Proof
                </a>
              ) : (
                "No proof uploaded"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;