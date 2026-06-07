import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import style from "./ViewAppliedEvents.module.css";

import {
  ArrowBack,
  Groups,
  Email,
  Phone,
  LocationOn,
  Language,
  CheckCircle,
  Cancel,
  HourglassTop,
  Refresh,
  Visibility,
  Person,
} from "@mui/icons-material";

const ViewApplyEvent = () => {
  const { eid } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplicants();
  }, [eid]);

  const loadApplicants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/ViewApplyEvent/${eid}/`);
      setApplicants(res.data.data || []);
    } catch (error) {
      console.log(error);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = applicants.length;
    const accepted = applicants.filter((item) => String(item.apply_status) === "1").length;
    const rejected = applicants.filter((item) => String(item.apply_status) === "2").length;
    const pending = applicants.filter(
      (item) => String(item.apply_status) !== "1" && String(item.apply_status) !== "2"
    ).length;

    return { total, accepted, rejected, pending };
  }, [applicants]);

  const getStatus = (status) => {
    if (String(status) === "1") {
      return {
        text: "Accepted",
        className: style.accepted,
        icon: <CheckCircle fontSize="small" />,
      };
    }

    if (String(status) === "2") {
      return {
        text: "Rejected",
        className: style.rejected,
        icon: <Cancel fontSize="small" />,
      };
    }

    return {
      text: "Applied",
      className: style.pending,
      icon: <HourglassTop fontSize="small" />,
    };
  };

  return (
    <div className={style.page}>
      <motion.div
        className={style.hero}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={style.heroGlow}></div>

        <div className={style.topBar}>
          <button className={style.backBtn} onClick={() => navigate(-1)}>
            <ArrowBack fontSize="small" />
            Back
          </button>

          <button className={style.refreshBtn} onClick={loadApplicants}>
            <Refresh fontSize="small" />
            Refresh
          </button>
        </div>

        <div className={style.heroContent}>
          <div className={style.titleBlock}>
            <div className={style.titleIcon}>
              <Groups />
            </div>

            <div>
              <span className={style.eyebrow}>Brand Dashboard</span>
              <h1>Event Applicants</h1>
              <p>View all influencers who applied for this event and check their details.</p>
            </div>
          </div>

          <div className={style.headerCount}>
            <Groups fontSize="small" />
            <span>{stats.total} Influencers Applied</span>
          </div>
        </div>

        <div className={style.statsGrid}>
          <div className={style.statCard}>
            <span className={style.statIcon}>
              <Groups fontSize="small" />
            </span>
            <div>
              <small>Total Applicants</small>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className={style.statCard}>
            <span className={`${style.statIcon} ${style.acceptedIcon}`}>
              <CheckCircle fontSize="small" />
            </span>
            <div>
              <small>Accepted</small>
              <strong>{stats.accepted}</strong>
            </div>
          </div>

          <div className={style.statCard}>
            <span className={`${style.statIcon} ${style.pendingIcon}`}>
              <HourglassTop fontSize="small" />
            </span>
            <div>
              <small>Applied</small>
              <strong>{stats.pending}</strong>
            </div>
          </div>

          <div className={style.statCard}>
            <span className={`${style.statIcon} ${style.rejectedIcon}`}>
              <Cancel fontSize="small" />
            </span>
            <div>
              <small>Rejected</small>
              <strong>{stats.rejected}</strong>
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className={style.emptyState}>Loading applicants...</div>
      ) : applicants.length === 0 ? (
        <div className={style.emptyState}>No influencers applied for this event</div>
      ) : (
        <motion.div
          className={style.cardGrid}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          {applicants.map((item, index) => {
            const statusData = getStatus(item.apply_status);

            return (
              <motion.div
                className={style.card}
                key={item.application_id || index}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className={style.cardTop}>
                  <div className={style.avatarWrap}>
                    {item.influencer_photo ? (
                      <img
                        src={item.influencer_photo}
                        alt={item.influencer_name}
                        className={style.avatar}
                      />
                    ) : (
                      <div className={style.avatarPlaceholder}>
                        <Person />
                      </div>
                    )}
                  </div>

                  <div className={style.cardHead}>
                    <h3>{item.influencer_name || "Influencer"}</h3>
                    <div className={`${style.statusBadge} ${statusData.className}`}>
                      {statusData.icon}
                      <span>{statusData.text}</span>
                    </div>
                  </div>
                </div>

                <div className={style.infoList}>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>
                      <Email fontSize="small" />
                      Email
                    </span>
                    <span className={style.infoValue}>
                      {item.influencer_email || "No email"}
                    </span>
                  </div>

                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>
                      <Phone fontSize="small" />
                      Contact
                    </span>
                    <span className={style.infoValue}>
                      {item.influencer_contact || "No contact"}
                    </span>
                  </div>

                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>
                      <LocationOn fontSize="small" />
                      Place
                    </span>
                    <span className={style.infoValue}>
                      {item.influencer_place || "No place"}
                    </span>
                  </div>

                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>
                      <Language fontSize="small" />
                      Profile Link
                    </span>
                    <span className={style.infoValue}>
                      {item.influencer_link ? (
                        <a
                          href={item.influencer_link}
                          target="_blank"
                          rel="noreferrer"
                          className={style.linkBtn}
                        >
                          <Visibility fontSize="small" />
                          View Profile
                        </a>
                      ) : (
                        "No link"
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default ViewApplyEvent;