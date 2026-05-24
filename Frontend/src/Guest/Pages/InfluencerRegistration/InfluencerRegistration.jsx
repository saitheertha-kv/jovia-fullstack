import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./InfluencerRegistration.module.css";

import {
  Campaign as CampaignIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Link as LinkIcon,
  PhotoCamera as PhotoCameraIcon,
  LocationCity as LocationCityIcon,
  Place as PlaceIcon,
  AppRegistration as AppRegistrationIcon,
  SaveAlt as SaveAltIcon,
  RestartAlt as RestartAltIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

const InfluencerRegistration = () => {
  const [form, setForm] = useState({
    influencer_name: "",
    influencer_email: "",
    influencer_password: "",
    influencer_link: "",
    district_id: "",
    place_id: "",
  });

  const [photo, setPhoto] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/District/");
      setDistricts(res.data.data || []);
    } catch (err) {
      console.log(err);
      setDistricts([]);
    } finally {
      setPageLoading(false);
    }
  };

  const loadPlaces = async (districtId) => {
    try {
      if (!districtId) {
        setPlaces([]);
        return;
      }

      const res = await axios.get(
        `http://127.0.0.1:8000/PlaceByDistrict/${districtId}/`
      );
      setPlaces(res.data.data || []);
    } catch (err) {
      console.log(err);
      setPlaces([]);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "district_id") {
      setForm((prev) => ({
        ...prev,
        district_id: value,
        place_id: "",
      }));
      await loadPlaces(value);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      influencer_name: "",
      influencer_email: "",
      influencer_password: "",
      influencer_link: "",
      district_id: "",
      place_id: "",
    });
    setPhoto(null);
    setPlaces([]);
  };

  const emailRegex = /^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/;

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

const urlRegex =
  /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/;


  const handleSubmit = async () => {
   if (!form.influencer_name.trim()) {
  alert("Enter influencer name");
  return;
}

if (!emailRegex.test(form.influencer_email)) {
  alert("Email must start with lowercase and be valid");
  return;
}

if (!passwordRegex.test(form.influencer_password)) {
  alert(
    "Password must be min 6 characters, include letter, number & special character"
  );
  return;
}

if (form.influencer_link && !urlRegex.test(form.influencer_link)) {
  alert("Enter valid social media link");
  return;
}

if (!form.district_id) {
  alert("Select district");
  return;
}

if (!form.place_id) {
  alert("Select place");
  return;
    }

    const formData = new FormData();
    formData.append("influencer_name", form.influencer_name);
    formData.append("influencer_email", form.influencer_email);
    formData.append("influencer_password", form.influencer_password);
    formData.append("influencer_link", form.influencer_link);
    formData.append("place_id", form.place_id);

    if (photo) {
      formData.append("influencer_photo", photo);
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/InfluencerReg/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message || "Registration successful");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIconWrap}>
            <TrendingUpIcon className={style.heroIcon} />
          </div>

          <div>
            <h1>Influencer Registration</h1>
            <p>Create your profile and connect your social media presence</p>
          </div>
        </div>

        <div className={style.heroStats}>
          <div className={style.statCard}>
            <span className={style.statLabel}>Districts</span>
            <span className={style.statValue}>{districts.length}</span>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Profile Type</span>
            <span className={style.statValue}>Creator</span>
          </div>
        </div>
      </div>

      <div className={style.formCard}>
        <div className={style.cardHeader}>
          <div>
            <h2>Create Influencer Account</h2>
            <p>Fill the details below to register as an influencer</p>
          </div>

          <div className={style.badge}>
            <AppRegistrationIcon fontSize="small" />
            <span>Creator Entry</span>
          </div>
        </div>

        {pageLoading ? (
          <div className={style.emptyBox}>Loading registration form...</div>
        ) : (
          <>
            <div className={style.formGrid}>
              <div className={style.field}>
                <label>Name</label>
                <div className={style.inputWrap}>
                  <PersonIcon className={style.inputIcon} />
                  <input
                    type="text"
                    name="influencer_name"
                    value={form.influencer_name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className={style.field}>
                <label>Email</label>
                <div className={style.inputWrap}>
                  <EmailIcon className={style.inputIcon} />
                  <input
                    type="email"
                    name="influencer_email"
                    value={form.influencer_email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className={style.field}>
                <label>Password</label>
                <div className={style.inputWrap}>
                  <LockIcon className={style.inputIcon} />
                  <input
                    type="password"
                    name="influencer_password"
                    value={form.influencer_password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className={style.field}>
                <label>Social Media Link</label>
                <div className={style.inputWrap}>
                  <LinkIcon className={style.inputIcon} />
                  <input
                    type="url"
                    name="influencer_link"
                    value={form.influencer_link}
                    onChange={handleChange}
                    placeholder="Enter social media link"
                  />
                </div>
              </div>

              <div className={style.field}>
                <label>District</label>
                <div className={style.inputWrap}>
                  <LocationCityIcon className={style.inputIcon} />
                  <select
                    name="district_id"
                    value={form.district_id}
                    onChange={handleChange}
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.district_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={style.field}>
                <label>Place</label>
                <div className={style.inputWrap}>
                  <PlaceIcon className={style.inputIcon} />
                  <select
                    name="place_id"
                    value={form.place_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Place</option>
                    {places.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.place_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={`${style.field} ${style.fullWidth}`}>
                <label>Profile Photo</label>
                <label className={style.fileUpload}>
                  <div className={style.fileInner}>
                    <PhotoCameraIcon className={style.inputIcon} />
                    <span className={style.fileText}>
                      {photo ? photo.name : "Choose profile photo"}
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <div className={style.actionBar}>
              <button
                type="button"
                onClick={handleSubmit}
                className={style.primaryBtn}
                disabled={loading}
              >
                <SaveAltIcon fontSize="small" />
                {loading ? "Registering..." : "Register Influencer"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className={style.secondaryBtn}
              >
                <RestartAltIcon fontSize="small" />
                Reset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfluencerRegistration;