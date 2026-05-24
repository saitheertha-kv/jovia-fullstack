import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import style from "./MyAppliedEvents.module.css";
import {
  Event,
  LocationOn,
  AccessTime,
  ConfirmationNumber,
  CalendarMonth,
  HourglassTop,
  CheckCircle,
  Celebration,
  SearchOff,
  Refresh,
} from "@mui/icons-material";

const MyAppliedEvents = () => {
  const iid = sessionStorage.getItem("iid");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppliedEvents();
  }, []);

  const loadAppliedEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:8000/InfluencerAppliedEvents/${iid}/`
      );
      setApplications(res.data.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load applied events");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: applications.length,
      withPromo: applications.filter(
        (item) => item.event_promocode && String(item.event_promocode).trim() !== ""
      ).length,
      withDetails: applications.filter(
        (item) => item.event_details && String(item.event_details).trim() !== ""
      ).length,
    };
  }, [applications]);

  if (loading) {
    return (
      <div className={style.page}>
        <div className={style.loadingCard}>
          <div className={style.loader}></div>
          <h3>Loading your applied events...</h3>
          <p>Please wait while we fetch your event applications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIconWrap}>
            <Celebration className={style.heroIcon} />
          </div>

          <div>
            <h1>My Applied Events</h1>
            <p>
              Track the events you have already applied for in one clean view.
            </p>
          </div>
        </div>

        <button className={style.refreshBtn} onClick={loadAppliedEvents}>
          <Refresh fontSize="small" />
          <span>Refresh</span>
        </button>
      </div>

      <div className={style.statsGrid}>
        <div className={style.statCard}>
          <div className={style.statIconWrap}>
            <CalendarMonth fontSize="small" />
          </div>
          <div>
            <h3>{stats.total}</h3>
            <p>Total Applications</p>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.statIconWrap}>
            <ConfirmationNumber fontSize="small" />
          </div>
          <div>
            <h3>{stats.withPromo}</h3>
            <p>Promo Codes Available</p>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.statIconWrap}>
            <CheckCircle fontSize="small" />
          </div>
          <div>
            <h3>{stats.withDetails}</h3>
            <p>Detailed Events</p>
          </div>
        </div>
      </div>

      <div className={style.sectionHeader}>
        <div>
          <h2>Applied Event List</h2>
          <p>{applications.length} application{applications.length !== 1 ? "s" : ""} found</p>
        </div>
      </div>

      <div className={style.grid}>
        {applications.length === 0 ? (
          <div className={style.emptyState}>
            <div className={style.emptyIconWrap}>
              <SearchOff className={style.emptyIcon} />
            </div>
            <h3>No applications found</h3>
            <p>You have not applied to any events yet.</p>
          </div>
        ) : (
          applications.map((item, index) => (
            <div key={item.id} className={style.card}>
              <div className={style.cardTop}>
                <div>
                  <span className={style.badge}>Application #{index + 1}</span>
                  <h3 className={style.cardTitle}>
                    {item.place_name}, {item.district_name}
                  </h3>
                </div>

                <div className={style.appliedStatus}>
                  <HourglassTop fontSize="small" />
                  <span>Applied</span>
                </div>
              </div>

              <div className={style.infoGrid}>
                <div className={style.infoItem}>
                  <div className={style.infoLabel}>
                    <LocationOn fontSize="small" />
                    <span>Location</span>
                  </div>
                  <div className={style.infoValue}>
                    {item.place_name}, {item.district_name}
                  </div>
                </div>

                <div className={style.infoItem}>
                  <div className={style.infoLabel}>
                    <Event fontSize="small" />
                    <span>Date</span>
                  </div>
                  <div className={style.infoValue}>
                    {item.event_date || "Not available"}
                  </div>
                </div>

                <div className={style.infoItem}>
                  <div className={style.infoLabel}>
                    <AccessTime fontSize="small" />
                    <span>Time</span>
                  </div>
                  <div className={style.infoValue}>
                    {item.event_time || "Not available"}
                  </div>
                </div>

                <div className={style.infoItem}>
                  <div className={style.infoLabel}>
                    <ConfirmationNumber fontSize="small" />
                    <span>Promo Code</span>
                  </div>
                  <div className={style.infoValue}>
                    {item.event_promocode || "No promo code"}
                  </div>
                </div>
              </div>

              <div className={style.detailsBox}>
                <h4>Event Details</h4>
                <p>{item.event_details || "No event details available."}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppliedEvents;