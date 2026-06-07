import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import style from "./ViewEvent.module.css";
import { Link } from "react-router";
import {
  Event,
  LocationOn,
  AccessTime,
  ConfirmationNumber,
  Search,
  Celebration,
  CalendarMonth,
  Place,
  Refresh,
  ArrowForward,
  SearchOff,
} from "@mui/icons-material";

const ViewEvent = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/AllEvent/")
      .then((res) => setEvents(res.data.data || []))
      .catch((err) => {
        console.log(err);
        alert("Failed to load events");
      })
      .finally(() => setLoading(false));
  };

  const filtered = useMemo(() => {
    return events.filter((e) =>
      `${e.district_name} ${e.place_name} ${e.event_details} ${e.event_promocode} ${e.event_date} ${e.event_time}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [events, search]);

  const stats = useMemo(() => {
    const places = new Set(
      events.map((item) => `${item.place_name}-${item.district_name}`)
    );

    return {
      totalEvents: events.length,
      totalPlaces: places.size,
      withPromo: events.filter(
        (item) =>
          item.event_promocode && String(item.event_promocode).trim() !== ""
      ).length,
    };
  }, [events]);

  if (loading) {
    return (
      <div className={style.page}>
        <div className={style.loadingCard}>
          <div className={style.loader}></div>
          <h3>Loading events...</h3>
          <p>Please wait while we fetch the latest event list.</p>
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
            <h1>Explore Events</h1>
            <p>Find events, check details, and apply quickly from one place.</p>
          </div>
        </div>

        <button className={style.refreshBtn} onClick={loadEvents}>
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
            <h3>{stats.totalEvents}</h3>
            <p>Total Events</p>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.statIconWrap}>
            <Place fontSize="small" />
          </div>
          <div>
            <h3>{stats.totalPlaces}</h3>
            <p>Event Locations</p>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={style.statIconWrap}>
            <ConfirmationNumber fontSize="small" />
          </div>
          <div>
            <h3>{stats.withPromo}</h3>
            <p>Promo Codes</p>
          </div>
        </div>
      </div>

      <div className={style.topBar}>
        <div className={style.sectionText}>
          <h2>Available Events</h2>
          <p>
            {filtered.length} of {events.length} event
            {events.length !== 1 ? "s" : ""} shown
          </p>
        </div>

        <div className={style.searchBox}>
          <Search className={style.searchIcon} />
          <input
            type="text"
            placeholder="Search by place, district, details, date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={style.grid}>
        {filtered.length === 0 ? (
          <div className={style.emptyState}>
            <div className={style.emptyIconWrap}>
              <SearchOff className={style.emptyIcon} />
            </div>
            <h3>No Events Found</h3>
            <p>Try changing your search to see more events.</p>
          </div>
        ) : (
          filtered.map((e, index) => (
            <div key={e.id} className={style.card}>
              <div className={style.cardTop}>
                <div>
                  <span className={style.badge}>Event #{index + 1}</span>
                  <h3 className={style.cardTitle}>
                    {e.place_name}, {e.district_name}
                  </h3>
                </div>
              </div>

              <div className={style.detailsBox}>
                <h4>Event Details</h4>
                <p>{e.event_details || "No event details available."}</p>
              </div>

              <div className={style.infoGrid}>
                <div className={style.infoItem}>
                  <div className={style.infoLabel}>
                    <LocationOn fontSize="small" />
                    <span>Location</span>
                  </div>
                  <div className={style.infoValue}>
                    {e.place_name}, {e.district_name}
                  </div>
                </div>

                <div className={style.infoItem}>
                  <div className={style.infoLabel}>
                    <Event fontSize="small" />
                    <span>Date</span>
                  </div>
                  <div className={style.infoValue}>
                    {e.event_date || "Not available"}
                  </div>
                </div>

                <div className={style.infoItem}>
                  <div className={style.infoLabel}>
                    <AccessTime fontSize="small" />
                    <span>Time</span>
                  </div>
                  <div className={style.infoValue}>
                    {e.event_time || "Not available"}
                  </div>
                </div>

                <div className={style.infoItem}>
                  <div className={style.infoLabel}>
                    <ConfirmationNumber fontSize="small" />
                    <span>Promo Code</span>
                  </div>
                  <div className={style.infoValue}>
                    {e.event_promocode || "No promo code"}
                  </div>
                </div>
              </div>

              <Link to={`/influencer/apply/${e.id}`} className={style.applyBtn}>
                <span>Apply Now</span>
                <ArrowForward fontSize="small" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewEvent;