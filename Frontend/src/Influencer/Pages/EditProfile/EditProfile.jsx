import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./EditProfile.module.css";

import {
  Person,
  Email,
  Link as LinkIcon,
  LocationOn,
  CloudUpload,
  Save,
  Edit,
  PhotoCamera,
  Verified,
  Public,
} from "@mui/icons-material";

const EditProfile = () => {
  const iid = sessionStorage.getItem("iid");

  const [form, setForm] = useState({
    influencer_name: "",
    influencer_email: "",
    influencer_link: "",
  });

  const [photo, setPhoto] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState("");

  const [districts, setDistricts] = useState([]);
  const [places, setPlaces] = useState([]);

  const [districtId, setDistrictId] = useState("");
  const [placeId, setPlaceId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!iid) {
      alert("Influencer not logged in");
      return;
    }
    loadInitialData();
  }, [iid]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const districtRes = await axios.get("http://127.0.0.1:8000/District/");
      setDistricts(districtRes.data.data || []);

      const profileRes = await axios.get(
        `http://127.0.0.1:8000/InfluencerProfile/${iid}/`
      );

      const data = profileRes.data.data;

      setForm({
        influencer_name: data.influencer_name || "",
        influencer_email: data.influencer_email || "",
        influencer_link: data.influencer_link || "",
      });

      setCurrentPhoto(data.influencer_photo || "");

      const did = data.district_id ? String(data.district_id) : "";
      const pid = data.place_id ? String(data.place_id) : "";

      setDistrictId(did);
      setPlaceId(pid);

      if (did) {
        const placeRes = await axios.get(
          `http://127.0.0.1:8000/PlaceByDistrict/${did}/`
        );
        setPlaces(placeRes.data.data || []);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadPlaces = async (did) => {
    try {
      if (!did) {
        setPlaces([]);
        return;
      }

      const res = await axios.get(
        `http://127.0.0.1:8000/PlaceByDistrict/${did}/`
      );
      setPlaces(res.data.data || []);
    } catch (err) {
      console.log(err);
      setPlaces([]);
    }
  };

  const handleDistrictChange = async (e) => {
    const did = e.target.value;
    setDistrictId(did);
    setPlaceId("");
    await loadPlaces(did);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.influencer_name.trim()) {
      alert("Enter name");
      return;
    }

    if (!form.influencer_email.trim()) {
      alert("Enter email");
      return;
    }

    if (!form.influencer_link.trim()) {
      alert("Enter social link");
      return;
    }

    if (!placeId) {
      alert("Select place");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("influencer_name", form.influencer_name);
      formData.append("influencer_email", form.influencer_email);
      formData.append("influencer_link", form.influencer_link);
      formData.append("place_id", placeId);

      if (photo) {
        formData.append("influencer_photo", photo);
      }

      const res = await axios.post(
        `http://127.0.0.1:8000/UpdateInfluencerProfile/${iid}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message || "Profile updated successfully");
      setPhoto(null);
      loadInitialData();
    } catch (err) {
      console.log(err);
      console.log(err.response?.data);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={style.loading}>Loading profile...</div>;
  }

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIcon}>
            <Edit />
          </div>
          <div>
            <h1>Edit Influencer Profile</h1>
            <p>Manage your personal details, social identity and location settings</p>
          </div>
        </div>

        <div className={style.heroStats}>
          <div className={style.statBadge}>
            <Verified fontSize="small" />
            <span>Creator Account</span>
          </div>
          <div className={style.statBadge}>
            <Public fontSize="small" />
            <span>Public Profile</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={style.layout}>
        {/* LEFT PROFILE PANEL */}
        <div className={style.sidebarCard}>
          <div className={style.profileTopGlow} />

          <div className={style.avatarWrap}>
            {currentPhoto ? (
              <img
                src={currentPhoto}
                alt="Influencer"
                className={style.avatarImage}
              />
            ) : (
              <div className={style.avatarFallback}>
                {form.influencer_name?.trim()
                  ? form.influencer_name.charAt(0).toUpperCase()
                  : "I"}
              </div>
            )}

            <label className={style.cameraBtn}>
              <PhotoCamera fontSize="small" />
              <input
                type="file"
                onChange={(e) => setPhoto(e.target.files[0])}
                className={style.hiddenInput}
              />
            </label>
          </div>

          <h2 className={style.profileName}>
            {form.influencer_name || "Influencer Name"}
          </h2>

          <p className={style.profileMail}>
            {form.influencer_email || "influencer@email.com"}
          </p>

          <div className={style.profileMeta}>
            <div className={style.metaItem}>
              <span className={style.metaLabel}>District</span>
              <span className={style.metaValue}>
                {districts.find((d) => String(d.id) === districtId)?.district_name ||
                  "Not selected"}
              </span>
            </div>

            <div className={style.metaItem}>
              <span className={style.metaLabel}>Place</span>
              <span className={style.metaValue}>
                {places.find((p) => String(p.id) === placeId)?.place_name ||
                  "Not selected"}
              </span>
            </div>
          </div>

          <label className={style.uploadBox}>
            <CloudUpload className={style.uploadIcon} />
            <span className={style.uploadTitle}>Upload New Photo</span>
            <span className={style.uploadSub}>
              JPG, PNG or WEBP supported
            </span>
            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])}
              className={style.hiddenInput}
            />
          </label>

          {photo && <p className={style.selectedFile}>{photo.name}</p>}
        </div>

        {/* RIGHT MAIN FORM */}
        <div className={style.mainCard}>
          <div className={style.sectionHeader}>
            <h3>Profile Information</h3>
            <p>Update the details visible in your influencer account</p>
          </div>

          <div className={style.grid}>
            <div className={style.field}>
              <label>Full Name</label>
              <div className={style.inputWrap}>
                <Person className={style.icon} />
                <input
                  type="text"
                  name="influencer_name"
                  value={form.influencer_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className={style.field}>
              <label>Email Address</label>
              <div className={style.inputWrap}>
                <Email className={style.icon} />
                <input
                  type="email"
                  name="influencer_email"
                  value={form.influencer_email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className={`${style.field} ${style.fullWidth}`}>
              <label>Social Profile Link</label>
              <div className={style.inputWrap}>
                <LinkIcon className={style.icon} />
                <input
                  type="text"
                  name="influencer_link"
                  value={form.influencer_link}
                  onChange={handleChange}
                  placeholder="Paste your Instagram / YouTube / profile link"
                />
              </div>
            </div>
          </div>

          <div className={style.sectionHeaderSecond}>
            <h3>Location Details</h3>
            <p>Select your district and place</p>
          </div>

          <div className={style.grid}>
            <div className={style.field}>
              <label>District</label>
              <div className={style.inputWrap}>
                <LocationOn className={style.icon} />
                <select value={districtId} onChange={handleDistrictChange}>
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={String(d.id)}>
                      {d.district_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={style.field}>
              <label>Place</label>
              <div className={style.inputWrap}>
                <LocationOn className={style.icon} />
                <select
                  value={placeId}
                  onChange={(e) => setPlaceId(e.target.value)}
                >
                  <option value="">Select Place</option>
                  {places.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.place_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={style.actionBar}>
            <button type="submit" className={style.saveBtn} disabled={saving}>
              <Save fontSize="small" />
              {saving ? "Updating Profile..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;