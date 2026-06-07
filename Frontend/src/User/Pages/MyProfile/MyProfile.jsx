import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./MyProfile.module.css";

import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PlaceIcon from "@mui/icons-material/Place";
import BadgeIcon from "@mui/icons-material/Badge";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    if (!uid) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/UserProfile/${uid}/`)
      .then((res) => {
        setProfile(res.data.data);
      })
      .catch(() => {
        setError("Failed to load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [uid]);

  if (loading) {
    return (
      <div className={style.stateBox}>
        <CircularProgress size={34} />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${style.stateBox} ${style.errorBox}`}>
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={style.stateBox}>
        <p>No profile data found</p>
      </div>
    );
  }

  return (
    <div className={style.page}>
      <div className={style.header}>
        <div>
          <h1>My Profile</h1>
          <p>View your account details and personal information</p>
        </div>
      </div>

      <div className={style.profileCard}>
        <div className={style.topSection}>
          <div className={style.photoWrap}>
            {profile.user_photo ? (
              <img
                src={profile.user_photo}
                alt="User"
                className={style.profileImage}
              />
            ) : (
              <Avatar className={style.avatarFallback}>
                {(profile.user_name || "U").charAt(0).toUpperCase()}
              </Avatar>
            )}
          </div>

          <div className={style.topInfo}>
            <h2>{profile.user_name || "User"}</h2>
            <p>{profile.user_email || "No email available"}</p>

            <div className={style.roleBadge}>
              <BadgeIcon fontSize="small" />
              <span>User Account</span>
            </div>
          </div>
        </div>

        <div className={style.infoGrid}>
          <div className={style.infoCard}>
            <div className={style.infoIcon}>
              <PersonIcon />
            </div>
            <div>
              <span className={style.label}>Name</span>
              <h4>{profile.user_name || "-"}</h4>
            </div>
          </div>

          <div className={style.infoCard}>
            <div className={style.infoIcon}>
              <EmailIcon />
            </div>
            <div>
              <span className={style.label}>Email</span>
              <h4>{profile.user_email || "-"}</h4>
            </div>
          </div>

          <div className={style.infoCard}>
            <div className={style.infoIcon}>
              <PhoneIcon />
            </div>
            <div>
              <span className={style.label}>Contact</span>
              <h4>{profile.user_contact || "-"}</h4>
            </div>
          </div>

          <div className={style.infoCard}>
            <div className={style.infoIcon}>
              <HomeIcon />
            </div>
            <div>
              <span className={style.label}>Address</span>
              <h4>{profile.user_address || "-"}</h4>
            </div>
          </div>

          <div className={style.infoCard}>
            <div className={style.infoIcon}>
              <LocationCityIcon />
            </div>
            <div>
              <span className={style.label}>District</span>
              <h4>{profile.district_name || "-"}</h4>
            </div>
          </div>

          <div className={style.infoCard}>
            <div className={style.infoIcon}>
              <PlaceIcon />
            </div>
            <div>
              <span className={style.label}>Place</span>
              <h4>{profile.place_name || "-"}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;