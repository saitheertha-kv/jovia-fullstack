import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MyProfile.module.css";

import {
  Person as PersonIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  LocationCity as LocationCityIcon,
  Place as PlaceIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const iid = sessionStorage.getItem("iid");

  useEffect(() => {
    if (!iid) {
      alert("Not logged in");
      setLoading(false);
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/InfluencerProfile/${iid}/`)
      .then((res) => {
        setProfile(res.data.data);
      })
      .catch(() => {
        alert("Failed to load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [iid]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingCard}>Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyCard}>Profile not found</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIconWrap}>
            <AccountCircleIcon className={styles.headerIcon} />
          </div>

          <div>
            <h1 className={styles.title}>Influencer Profile</h1>
            <p className={styles.subtitle}>View your personal details</p>
          </div>
        </div>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.topSection}>
          <div className={styles.photoWrap}>
            {profile.influencer_photo ? (
              <img
                src={profile.influencer_photo}
                alt="Influencer"
                className={styles.photo}
              />
            ) : (
              <div className={styles.photoFallback}>
                {profile.influencer_name?.charAt(0)?.toUpperCase() || "I"}
              </div>
            )}
          </div>

          <div className={styles.topInfo}>
            <h2 className={styles.profileName}>{profile.influencer_name}</h2>
            <p className={styles.profileRole}>Influencer Account</p>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>
              <PersonIcon fontSize="small" />
              <span>Name</span>
            </div>
            <div className={styles.infoValue}>{profile.influencer_name}</div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>
              <EmailIcon fontSize="small" />
              <span>Email</span>
            </div>
            <div className={styles.infoValue}>{profile.influencer_email}</div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>
              <LinkIcon fontSize="small" />
              <span>Social Link</span>
            </div>
            <div className={styles.infoValue}>
              {profile.influencer_link ? (
                <a
                  href={profile.influencer_link}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                >
                  {profile.influencer_link}
                </a>
              ) : (
                "No link added"
              )}
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>
              <LocationCityIcon fontSize="small" />
              <span>District</span>
            </div>
            <div className={styles.infoValue}>{profile.district_name}</div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>
              <PlaceIcon fontSize="small" />
              <span>Place</span>
            </div>
            <div className={styles.infoValue}>{profile.place_name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;