import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import style from "./AddEvent.module.css";

import {
  Event as EventIcon,
  LocationOn,
  CalendarMonth,
  AccessTime,
  Description,
  LocalOffer,
  Save,
  AddBusiness,
  Place as PlaceIcon,
  Campaign as CampaignIcon,
  CheckCircle,
  HourglassTop,
  Visibility,
  Refresh,
} from "@mui/icons-material";
import { Link } from "react-router";

const AddEvent = () => {
  const bid = sessionStorage.getItem("bid");

  const [districts, setDistricts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    district: "",
    venue: "",
    date: "",
    time: "",
    details: "",
    promo: "",
  });

  const [saving, setSaving] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(true);

  useEffect(() => {
    if (!bid) {
      alert("Brand not logged in");
      return;
    }

    loadDistrict();
    loadEvents();
  }, [bid]);

  const loadDistrict = async () => {
    try {
      setLoadingDistricts(true);
      const res = await axios.get("http://127.0.0.1:8000/District/");
      setDistricts(res.data.data || []);
    } catch (err) {
      console.log(err);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const loadPlaces = async (id) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/PlaceByDistrict/${id}/`);
      setPlaces(res.data.data || []);
    } catch (err) {
      console.log(err);
      setPlaces([]);
    }
  };

  const loadEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await axios.get(`http://127.0.0.1:8000/BrandEvent/${bid}/`);
      setEvents(res.data.data || []);
    } catch (err) {
      console.log(err);
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDistrict = async (e) => {
    const id = e.target.value;
    setForm((prev) => ({
      ...prev,
      district: id,
      venue: "",
    }));

    if (id) {
      await loadPlaces(id);
    } else {
      setPlaces([]);
    }
  };

  const resetForm = () => {
    setForm({
      district: "",
      venue: "",
      date: "",
      time: "",
      details: "",
      promo: "",
    });
    setPlaces([]);
  };

  const saveEvent = async () => {
    if (!form.district) {
      alert("Select district");
      return;
    }

    if (!form.venue) {
      alert("Select place");
      return;
    }

    if (!form.date) {
      alert("Select date");
      return;
    }

    if (!form.time) {
      alert("Select time");
      return;
    }

    if (!form.details.trim()) {
      alert("Enter event details");
      return;
    }

    try {
      setSaving(true);

      await axios.post(`http://127.0.0.1:8000/AddEvent/${bid}/`, {
        venue: form.venue,
        date: form.date,
        time: form.time,
        details: form.details,
        promo: form.promo,
      });

      await loadEvents();
      resetForm();
      alert("Event added successfully");
    } catch (err) {
      console.log(err);
      alert("Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    const total = events.length;
    const withPromo = events.filter(
      (item) => item.event_promocode && item.event_promocode.trim() !== ""
    ).length;

    return {
      total,
      withPromo,
      districts: districts.length,
    };
  }, [events, districts]);

  return (
    <div className={style.page}>
      <motion.div
        className={style.hero}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={style.heroGlow}></div>

        <div className={style.heroTop}>
          <div className={style.heroLeft}>
            <div className={style.heroIconWrap}>
              <EventIcon className={style.heroIcon} />
            </div>

            <div className={style.heroContent}>
              <span className={style.eyebrow}>Brand Dashboard</span>
              <h1>Event Management</h1>
              <p>
                Create, publish, and manage your brand events with district,
                place, date, time, and promo details.
              </p>
            </div>
          </div>

          <div className={style.heroBadge}>
            <AddBusiness fontSize="small" />
            <span>{stats.total} Total Events</span>
          </div>
        </div>

        <div className={style.statsGrid}>
          <div className={style.statCard}>
            <span className={style.statIcon}>
              <EventIcon fontSize="small" />
            </span>
            <div>
              <small>Total Events</small>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className={style.statCard}>
            <span className={style.statIcon}>
              <CampaignIcon fontSize="small" />
            </span>
            <div>
              <small>Promo Events</small>
              <strong>{stats.withPromo}</strong>
            </div>
          </div>

          <div className={style.statCard}>
            <span className={style.statIcon}>
              <PlaceIcon fontSize="small" />
            </span>
            <div>
              <small>Districts Loaded</small>
              <strong>{districts.length}</strong>
            </div>
          </div>
        </div>
      </motion.div>

      <div className={style.layout}>
        <motion.div
          className={style.formCard}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <div className={style.cardHeader}>
            <div>
              <h3>Create New Event</h3>
              <p>Fill in the event details below to publish a new event.</p>
            </div>

            <button
              type="button"
              className={style.miniBtn}
              onClick={resetForm}
            >
              <Refresh fontSize="small" />
              Clear
            </button>
          </div>

          <div className={style.formGrid}>
            <div className={style.field}>
              <label>District</label>
              <div className={style.inputWrap}>
                <LocationOn className={style.inputIcon} />
                <select value={form.district} onChange={handleDistrict}>
                  <option value="">
                    {loadingDistricts ? "Loading districts..." : "Select District"}
                  </option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.district_name}
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
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  disabled={!form.district}
                >
                  <option value="">
                    {form.district ? "Select Place" : "Select district first"}
                  </option>
                  {places.map((place) => (
                    <option key={place.id} value={place.id}>
                      {place.place_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={style.field}>
              <label>Event Date</label>
              <div className={style.inputWrap}>
                <CalendarMonth className={style.inputIcon} />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={style.field}>
              <label>Event Time</label>
              <div className={style.inputWrap}>
                <AccessTime className={style.inputIcon} />
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={`${style.field} ${style.fullWidth}`}>
              <label>Event Details</label>
              <div className={`${style.inputWrap} ${style.textareaWrap}`}>
                <Description className={style.inputIcon} />
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Enter event description, highlights, audience, or special notes"
                />
              </div>
            </div>

            <div className={`${style.field} ${style.fullWidth}`}>
              <label>Promo Code</label>
              <div className={style.inputWrap}>
                <LocalOffer className={style.inputIcon} />
                <input
                  type="text"
                  name="promo"
                  value={form.promo}
                  onChange={handleChange}
                  placeholder="Enter promo code (optional)"
                />
              </div>
            </div>
          </div>

          <div className={style.bottomBar}>
            <div className={style.formHint}>
              <HourglassTop fontSize="small" />
              <span>Make sure district and place are selected before saving.</span>
            </div>

            <button
              type="button"
              className={style.saveBtn}
              onClick={saveEvent}
              disabled={saving}
            >
              <Save fontSize="small" />
              {saving ? "Saving..." : "Save Event"}
            </button>
          </div>
        </motion.div>

        <motion.div
          className={style.listCard}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className={style.cardHeader}>
            <div>
              <h3>My Events</h3>
              <p>View all events created by your brand.</p>
            </div>

            <div className={style.listBadge}>
              <CheckCircle fontSize="small" />
              <span>{events.length} Records</span>
            </div>
          </div>

          {loadingEvents ? (
            <div className={style.emptyState}>Loading events...</div>
          ) : events.length === 0 ? (
            <div className={style.emptyState}>No events found</div>
          ) : (
            <div className={style.eventGrid}>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  className={style.eventCard}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={style.eventCardTop}>
                    <div className={style.eventCardIcon}>
                      <EventIcon fontSize="small" />
                    </div>

                    <div className={style.eventCardHead}>
                      <h4>{event.place_name}</h4>
                      <p>{event.district_name}</p>
                    </div>
                  </div>

                  <div className={style.eventMetaGrid}>
                    <div className={style.metaItem}>
                      <span className={style.metaLabel}>Date</span>
                      <span className={style.metaValue}>{event.event_date}</span>
                    </div>

                    <div className={style.metaItem}>
                      <span className={style.metaLabel}>Time</span>
                      <span className={style.metaValue}>{event.event_time}</span>
                    </div>
                  </div>

                  <div className={style.detailsBox}>
                    {event.event_details || "No details added"}
                  </div>

                  <div className={style.eventFooter}>
                    <span className={style.promoBadge}>
                      {event.event_promocode || "No Promo"}
                    </span>

                    <Link
                      to={`/brand/viewApplyEvent/${event.id}`}
                      className={style.viewBtn}
                    >
                      <Visibility fontSize="small" />
                      View Applied
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AddEvent;