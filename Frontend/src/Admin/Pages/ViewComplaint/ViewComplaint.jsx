import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./ViewComplaint.module.css";

import CircularProgress from "@mui/material/CircularProgress";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BadgeIcon from "@mui/icons-material/Badge";

const ViewComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/Complaint/");
      setComplaints(res.data.data || []);
      setError("");
    } catch (error) {
      console.log(error);
      setError("Failed to load complaints");
      alert("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (id, value) => {
    setReplyText((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const sendReply = async (id) => {
    if (!replyText[id]?.trim()) {
      alert("Enter reply");
      return;
    }

    try {
      setSendingId(id);

      await axios.post(`http://127.0.0.1:8000/ReplyComplaint/${id}/`, {
        complaint_reply: replyText[id],
      });

      alert("Reply sent successfully");

      setReplyText((prev) => ({
        ...prev,
        [id]: "",
      }));

      loadComplaints();
    } catch (error) {
      console.log(error);
      alert("Failed to send reply");
    } finally {
      setSendingId(null);
    }
  };

  const getStatusText = (status) => {
    if (status === 1 || status === "1") return "Replied";
    if (status === 0 || status === "0") return "Pending";
    if (typeof status === "string" && status.trim() !== "") return status;
    return "Pending";
  };

  const getStatusClass = (status) => {
    if (status === 1 || status === "1") return style.replied;
    return style.pending;
  };

  if (loading) {
    return (
      <div className={style.stateBox}>
        <CircularProgress size={34} />
        <p>Loading complaints...</p>
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

  return (
    <div className={style.page}>
      <div className={style.header}>
        <div>
          <h1>View Complaints</h1>
          <p>Review user complaints and send admin replies</p>
        </div>
      </div>

      <div className={style.profileCard}>
        <div className={style.topSection}>
          <div className={style.photoWrap}>
            <div className={style.iconBox}>
              <ReportProblemIcon className={style.mainIcon} />
            </div>
          </div>

          <div className={style.topInfo}>
            <h2>Complaint Management</h2>
            <p>Track all user complaints, reply to issues, and monitor status</p>

            <div className={style.roleBadge}>
              <BadgeIcon fontSize="small" />
              <span>{complaints.length} Complaints</span>
            </div>
          </div>
        </div>

        {complaints.length > 0 ? (
          <div className={style.complaintList}>
            {complaints.map((item) => (
              <div className={style.complaintCard} key={item.id}>
                <div className={style.infoGrid}>
                  <div className={style.infoCard}>
                    <div className={style.infoIcon}>
                      <PersonIcon />
                    </div>
                    <div>
                      <span className={style.label}>User</span>
                      <h4>{item.user_name || "-"}</h4>
                    </div>
                  </div>

                  <div className={style.infoCard}>
                    <div className={style.infoIcon}>
                      <EmailIcon />
                    </div>
                    <div>
                      <span className={style.label}>Email</span>
                      <h4>{item.user_email || "-"}</h4>
                    </div>
                  </div>

                  <div className={style.infoCard}>
                    <div className={style.infoIcon}>
                      <TitleIcon />
                    </div>
                    <div>
                      <span className={style.label}>Complaint Title</span>
                      <h4>{item.complaint_title || "-"}</h4>
                    </div>
                  </div>

                  <div className={style.infoCard}>
                    <div className={style.infoIcon}>
                      {item.complaint_status === 1 || item.complaint_status === "1" ? (
                        <CheckCircleOutlineIcon />
                      ) : (
                        <PendingActionsIcon />
                      )}
                    </div>
                    <div>
                      <span className={style.label}>Status</span>
                      <div className={`${style.statusBadge} ${getStatusClass(item.complaint_status)}`}>
                        {getStatusText(item.complaint_status)}
                      </div>
                    </div>
                  </div>

                  <div className={`${style.infoCard} ${style.fullWidth}`}>
                    <div className={style.infoIcon}>
                      <DescriptionIcon />
                    </div>
                    <div className={style.flexGrow}>
                      <span className={style.label}>Complaint Content</span>
                      <p className={style.contentText}>
                        {item.complaint_content || "-"}
                      </p>
                    </div>
                  </div>

                  <div className={`${style.infoCard} ${style.fullWidth}`}>
                    <div className={style.infoIcon}>
                      <ReplyIcon />
                    </div>
                    <div className={style.flexGrow}>
                      <span className={style.label}>Current Reply</span>
                      <p className={style.replyText}>
                        {item.complaint_reply || "No reply yet"}
                      </p>
                    </div>
                  </div>

                  <div className={`${style.infoCard} ${style.fullWidth}`}>
                    <div className={style.infoIcon}>
                      <SendIcon />
                    </div>
                    <div className={style.flexGrow}>
                      <span className={style.label}>Send Reply</span>

                      <div className={style.replyActionWrap}>
                        <textarea
                          placeholder="Enter reply"
                          value={replyText[item.id] || ""}
                          onChange={(e) =>
                            handleReplyChange(item.id, e.target.value)
                          }
                          className={style.replyInput}
                          rows="4"
                        />
                        <button
                          onClick={() => sendReply(item.id)}
                          className={style.replyBtn}
                          disabled={sendingId === item.id}
                        >
                          <SendIcon fontSize="small" />
                          {sendingId === item.id ? "Sending..." : "Reply"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={style.emptyBox}>
            <ReportProblemIcon />
            <h4>No complaints found</h4>
            <p>No users have submitted complaints yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewComplaint;