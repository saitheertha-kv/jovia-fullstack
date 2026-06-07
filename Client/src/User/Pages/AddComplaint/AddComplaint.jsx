import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./Complaint.module.css";

import CircularProgress from "@mui/material/CircularProgress";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Complaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    complaint_title: "",
    complaint_content: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    if (!uid) {
      setError("Not logged in");
      setLoading(false);
      return;
    }
    loadComplaints();
  }, [uid]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/Complaint/${uid}/`);
      setComplaints(res.data.data || []);
      setError("");
    } catch (error) {
      console.log(error);
      setError("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveComplaint = async () => {
    if (!form.complaint_title.trim() || !form.complaint_content.trim()) {
      alert("Fill all fields");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post("http://127.0.0.1:8000/Complaint/", {
        user_id: uid,
        complaint_title: form.complaint_title,
        complaint_content: form.complaint_content,
      });

      alert("Complaint added successfully");

      setForm({
        complaint_title: "",
        complaint_content: "",
      });

      loadComplaints();
    } catch (error) {
      console.log(error);
      alert("Failed to add complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComplaint = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this complaint?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/DeleteComplaint/${id}/`);
      alert("Deleted successfully");
      loadComplaints();
    } catch (error) {
      console.log(error);
      alert("Failed to delete complaint");
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
          <h1>My Complaints</h1>
          <p>Submit complaints and track admin replies from one place</p>
        </div>
      </div>

      <div className={style.complaintCard}>
        <div className={style.topSection}>
          <div className={style.iconWrap}>
            <ReportProblemIcon className={style.mainIcon} />
          </div>

          <div className={style.topInfo}>
            <h2>Complaint Center</h2>
            <p>Write your issue clearly and check the current complaint status below</p>

            <div className={style.roleBadge}>
              <InfoOutlinedIcon fontSize="small" />
              <span>{complaints.length} Complaint{complaints.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        <div className={style.formSection}>
          <div className={style.infoGrid}>
            <div className={style.infoCard}>
              <div className={style.infoIcon}>
                <TitleIcon />
              </div>
              <div className={style.fieldWrap}>
                <span className={style.label}>Complaint Title</span>
                <input
                  type="text"
                  name="complaint_title"
                  placeholder="Enter complaint title"
                  value={form.complaint_title}
                  onChange={handleChange}
                  className={style.input}
                />
              </div>
            </div>

            <div className={`${style.infoCard} ${style.fullWidth}`}>
              <div className={style.infoIcon}>
                <DescriptionIcon />
              </div>
              <div className={style.fieldWrap}>
                <span className={style.label}>Complaint Content</span>
                <textarea
                  name="complaint_content"
                  placeholder="Describe your complaint"
                  value={form.complaint_content}
                  onChange={handleChange}
                  rows="5"
                  className={style.textarea}
                />
              </div>
            </div>
          </div>

          <div className={style.actionRow}>
            <button
              className={style.submitBtn}
              onClick={saveComplaint}
              disabled={submitting}
            >
              <SendIcon fontSize="small" />
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </div>

        <div className={style.listSection}>
          <div className={style.sectionTitle}>
            <h3>Complaint History</h3>
            <p>View all your submitted complaints and admin replies</p>
          </div>

          {complaints.length > 0 ? (
            <div className={style.complaintList}>
              {complaints.map((item) => (
                <div key={item.id} className={style.complaintItem}>
                  <div className={style.complaintTop}>
                    <div>
                      <h4>{item.complaint_title}</h4>
                      <p>{item.complaint_content}</p>
                    </div>

                    <div className={`${style.statusBadge} ${getStatusClass(item.complaint_status)}`}>
                      {item.complaint_status === 1 || item.complaint_status === "1" ? (
                        <CheckCircleOutlineIcon fontSize="small" />
                      ) : (
                        <PendingActionsIcon fontSize="small" />
                      )}
                      <span>{getStatusText(item.complaint_status)}</span>
                    </div>
                  </div>

                  <div className={style.replyBox}>
                    <div className={style.replyHead}>
                      <ReplyIcon fontSize="small" />
                      <span>Admin Reply</span>
                    </div>
                    <p>{item.complaint_reply || "No reply yet"}</p>
                  </div>

                  <div className={style.itemActions}>
                    <button
                      className={style.deleteBtn}
                      onClick={() => deleteComplaint(item.id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={style.emptyBox}>
              <ReportProblemIcon />
              <h4>No complaints found</h4>
              <p>You have not submitted any complaints yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Complaint;