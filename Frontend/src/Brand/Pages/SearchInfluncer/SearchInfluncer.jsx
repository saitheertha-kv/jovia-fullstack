import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./SearchInfluencer.module.css";
import { useNavigate } from "react-router";

import {
  Search as SearchIcon,
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  Send as SendIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";

const SearchInfluencer = () => {
  const [influencers, setInfluencers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const bid = sessionStorage.getItem("bid");

  useEffect(() => {
    loadInfluencers();
  }, []);

  const loadInfluencers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:8000/SearchInfluencer/?name=${search}`
      );
      setInfluencers(res.data.data || []);
    } catch (err) {
      console.log(err);
      setInfluencers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadInfluencers();
  };

  const startChat = async (influencerId) => {
    if (!bid) {
      alert("Please login as brand");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/GetOrCreateChatRoom/",
        {
          brand_id: bid,
          influencer_id: influencerId,
        }
      );

      sessionStorage.setItem("chat_iid", influencerId);
      navigate(`/brand/chat/${res.data.room_id}`);
    } catch (error) {
      console.log(error);
      alert("Failed to start chat");
    }
  };

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIcon}>
            <GroupsIcon />
          </div>
          <div>
            <h1>Search Influencers</h1>
            <p>Find creators and start chatting directly</p>
          </div>
        </div>

        <div className={style.heroCount}>
          <span>{influencers.length}</span>
          <p>Results</p>
        </div>
      </div>

      <div className={style.searchCard}>
        <div className={style.searchBox}>
          <SearchIcon className={style.searchIcon} />
          <input
            type="text"
            placeholder="Search influencer by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        <button type="button" className={style.searchBtn} onClick={handleSearch}>
          <SearchIcon fontSize="small" />
          Search
        </button>
      </div>

      {loading ? (
        <div className={style.stateCard}>Loading influencers...</div>
      ) : influencers.length === 0 ? (
        <div className={style.emptyCard}>
          <GroupsIcon className={style.emptyIcon} />
          <h3>No influencers found</h3>
          <p>Try searching with a different name.</p>
        </div>
      ) : (
        <div className={style.grid}>
          {influencers.map((i) => (
            <div key={i.id} className={style.card}>
              <div className={style.cardTop}>
                <div className={style.imageWrap}>
                  {i.influencer_photo ? (
                    <img
                      src={i.influencer_photo}
                      alt={i.influencer_name}
                      className={style.image}
                    />
                  ) : (
                    <div className={style.imageFallback}>
                      {i.influencer_name
                        ? i.influencer_name.charAt(0).toUpperCase()
                        : "I"}
                    </div>
                  )}
                </div>

                <div className={style.mainInfo}>
                  <h3>{i.influencer_name}</h3>
                  <p className={style.email}>
                    <EmailIcon fontSize="small" />
                    {i.influencer_email}
                  </p>
                </div>
              </div>

              <div className={style.infoList}>
                <div className={style.infoItem}>
                  <LocationOnIcon className={style.infoIcon} />
                  <div>
                    <span>District</span>
                    <strong>{i.district_name || "N/A"}</strong>
                  </div>
                </div>

                <div className={style.infoItem}>
                  <PersonIcon className={style.infoIcon} />
                  <div>
                    <span>Place</span>
                    <strong>{i.place_name || "N/A"}</strong>
                  </div>
                </div>
              </div>

              <div className={style.actions}>
                <a
                  href={i.influencer_link}
                  target="_blank"
                  rel="noreferrer"
                  className={style.linkBtn}
                >
                  <LinkIcon fontSize="small" />
                  View Profile
                </a>

                <button
                  type="button"
                  className={style.requestBtn}
                  onClick={() => startChat(i.id)}
                >
                  <SendIcon fontSize="small" />
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInfluencer;