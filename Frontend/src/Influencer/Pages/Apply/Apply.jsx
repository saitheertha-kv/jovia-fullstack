import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import style from "./Apply.module.css";
import {
  Event,
  LocationOn,
  AccessTime,
  ConfirmationNumber,
  ArrowBack,
} from "@mui/icons-material";

const Apply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const iid = sessionStorage.getItem("iid");

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/EventDetails/${id}/`);
      setEventData(res.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!iid) {
      alert("Please login as influencer");
      return;
    }

    try {
      setApplying(true);

      const res = await axios.post("http://127.0.0.1:8000/ApplyEvent/", {
        event_id: id,
        influencer_id: iid,
      });

      if (res.data.status === "success") {
        alert("Applied successfully");
        navigate("/influencer/MyApplied");
      } else if (res.data.status === "exists") {
        alert("You already applied for this event");
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className={style.loading}>Loading...</div>;
  if (!eventData) return <div className={style.empty}>Event not found</div>;

  return (
    <div className={style.page}>
      <div className={style.topBar}>
        <button className={style.backBtn} onClick={() => navigate(-1)}>
          <ArrowBack fontSize="small" />
          Back
        </button>
      </div>

      <div className={style.card}>
        <div className={style.header}>
          <div className={style.iconWrap}>
            <Event />
          </div>
          <div>
            <h1>Apply Event</h1>
            <p>{eventData.brand_name}</p>
          </div>
        </div>

        <div className={style.content}>
          <div className={style.infoRow}>
            <LocationOn />
            <span>
              {eventData.place_name}, {eventData.district_name}
            </span>
          </div>

          <div className={style.infoRow}>
            <Event />
            <span>{eventData.event_date}</span>
          </div>

          <div className={style.infoRow}>
            <AccessTime />
            <span>{eventData.event_time}</span>
          </div>

          <div className={style.infoRow}>
            <ConfirmationNumber />
            <span>
              Promo Code: <b>{eventData.event_promocode}</b>
            </span>
          </div>

          <div className={style.detailsBox}>
            <h3>Event Details</h3>
            <p>{eventData.event_details}</p>
          </div>

          <button
            className={style.applyBtn}
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? "Applying..." : "Confirm Apply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Apply;