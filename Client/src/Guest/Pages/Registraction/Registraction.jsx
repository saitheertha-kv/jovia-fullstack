import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./Registraction.module.css";

import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Home as HomeIcon,
  Call as CallIcon,
  PhotoCamera as PhotoCameraIcon,
  LocationCity as LocationCityIcon,
  Place as PlaceIcon,
  AppRegistration as AppRegistrationIcon,
  SaveAlt as SaveAltIcon,
  RestartAlt as RestartAltIcon,
} from "@mui/icons-material";

const Registration = () => {
  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    user_address: "",
    user_contact: "",
    district_id: "",
    place_id: "",
  });

  const [userPhoto, setUserPhoto] = useState(null);
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
      user_name: "",
      user_email: "",
      user_password: "",
      user_address: "",
      user_contact: "",
      district_id: "",
      place_id: "",
    });
    setUserPhoto(null);
    setPlaces([]);
  };
  const emailRegex = /^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/;

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number

const nameRegex = /^[A-Za-z ]{3,}$/; // only letters, min 3 chars


  const handleSubmit = async () => {
   if (!nameRegex.test(form.user_name)) {
  alert("Name must contain only letters (min 3 characters)");
  return;
}

if (!emailRegex.test(form.user_email)) {
  alert("Email must start with lowercase and be valid");
  return;
}

if (!passwordRegex.test(form.user_password)) {
  alert(
    "Password must be min 6 characters, include letter, number & special character"
  );
  return;
}

if (!phoneRegex.test(form.user_contact)) {
  alert("Enter valid 10-digit phone number (starts with 6-9)");
  return;
}

if (!form.user_address.trim()) {
  alert("Enter address");
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
    formData.append("user_name", form.user_name);
    formData.append("user_email", form.user_email);
    formData.append("user_password", form.user_password);
    formData.append("user_address", form.user_address);
    formData.append("user_contact", form.user_contact);
    formData.append("place_id", form.place_id);

    if (userPhoto) {
      formData.append("user_photo", userPhoto);
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/Userreg/",
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
            <AppRegistrationIcon className={style.heroIcon} />
          </div>

          <div>
            <h1>User Registration</h1>
            <p>Create your account with personal and location details</p>
          </div>
        </div>

        <div className={style.heroStats}>
          <div className={style.statCard}>
            <span className={style.statLabel}>Districts</span>
            <span className={style.statValue}>{districts.length}</span>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Places</span>
            <span className={style.statValue}>{places.length}</span>
          </div>
        </div>
      </div>

      <div className={style.formCard}>
        <div className={style.cardHeader}>
          <div>
            <h2>Create Account</h2>
            <p>Fill the form below to complete your registration</p>
          </div>

          <div className={style.badge}>
            <AppRegistrationIcon fontSize="small" />
            <span>New User</span>
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
                    name="user_name"
                    value={form.user_name}
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
                    name="user_email"
                    value={form.user_email}
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
                    name="user_password"
                    value={form.user_password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className={style.field}>
                <label>Contact</label>
                <div className={style.inputWrap}>
                  <CallIcon className={style.inputIcon} />
                  <input
                    type="text"
                    name="user_contact"
                    value={form.user_contact}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              <div className={`${style.field} ${style.fullWidth}`}>
                <label>Address</label>
                <div className={style.textareaWrap}>
                  <HomeIcon className={style.textareaIcon} />
                  <textarea
                    name="user_address"
                    value={form.user_address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    rows="4"
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
                <label>Photo</label>
                <label className={style.fileUpload}>
                  <div className={style.fileInner}>
                    <PhotoCameraIcon className={style.inputIcon} />
                    <span className={style.fileText}>
                      {userPhoto ? userPhoto.name : "Choose profile photo"}
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUserPhoto(e.target.files[0])}
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
                {loading ? "Registering..." : "Register"}
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

export default Registration;