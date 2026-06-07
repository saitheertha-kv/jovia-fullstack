import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import style from "./ViewRequest.module.css";

import {
  Campaign,
  Chat,
  Inbox,
  PendingActions,
  MarkChatRead,
  Groups,
} from "@mui/icons-material";

const ViewRequest = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const iid = sessionStorage.getItem("iid");
  const navigate = useNavigate();

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:8000/InfluencerChatList/${iid}/`
      );
      setRooms(res.data.data || []);
    } catch (error) {
      console.log(error);
      alert("Error loading chats");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!iid) {
      alert("Login required");
      return;
    }
    loadChatRooms();
  }, [iid]);

  const openChat = (roomId) => {
    navigate(`/influencer/chat/${roomId}`);
  };

  const stats = useMemo(() => {
    const total = rooms.length;
    const active = rooms.filter(
      (r) => (r.last_message || "").trim() !== ""
    ).length;
    const pendingOffers = rooms.reduce(
      (sum, r) => sum + (Number(r.pending_requests) || 0),
      0
    );

    return { total, active, pendingOffers };
  }, [rooms]);

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIcon}>
            <Campaign />
          </div>

          <div>
            <h1>Chats</h1>
            <p>View brand conversations, offers, and continue discussion</p>
          </div>
        </div>

        <div className={style.heroRight}>
          <div className={style.statPill}>
            <Inbox fontSize="small" />
            <span>{stats.total} Total</span>
          </div>
        </div>
      </div>

      <div className={style.statsGrid}>
        <div className={style.statCard}>
          <div className={style.statIconWrap}>
            <Inbox className={style.statIcon} />
          </div>
          <div>
            <h3>{stats.total}</h3>
            <p>Total Chats</p>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={`${style.statIconWrap} ${style.pendingBg}`}>
            <PendingActions className={style.statIcon} />
          </div>
          <div>
            <h3>{stats.pendingOffers}</h3>
            <p>Pending Offers</p>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={`${style.statIconWrap} ${style.acceptedBg}`}>
            <MarkChatRead className={style.statIcon} />
          </div>
          <div>
            <h3>{stats.active}</h3>
            <p>Active Chats</p>
          </div>
        </div>

        <div className={style.statCard}>
          <div className={`${style.statIconWrap} ${style.rejectedBg}`}>
            <Groups className={style.statIcon} />
          </div>
          <div>
            <h3>{stats.total}</h3>
            <p>Brand Partners</p>
          </div>
        </div>
      </div>

      <div className={style.tableCard}>
        <div className={style.cardHeader}>
          <div>
            <h2>Chat List</h2>
            <p>Open a chat to view messages, offers, and accept or reject requests</p>
          </div>
        </div>

        {loading ? (
          <div className={style.loading}>Loading chats...</div>
        ) : rooms.length === 0 ? (
          <div className={style.emptyState}>
            <Inbox className={style.emptyIcon} />
            <h3>No chats found</h3>
            <p>You do not have any brand chats at the moment.</p>
          </div>
        ) : (
          <div className={style.tableWrap}>
            <table className={style.table}>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Last Message</th>
                  <th className={style.actionHead}>Action</th>
                </tr>
              </thead>

              <tbody>
                {rooms.map((room) => (
                  <tr key={room.room_id}>
                    <td>
                      <div className={style.primaryCell}>
                        <span className={style.mainText}>{room.brand_name}</span>
                        <span className={style.subText}>Brand Partner</span>
                      </div>
                    </td>

                    <td>
                      <div className={style.primaryCell}>
                        <span className={style.mainText}>
                          {room.last_message || "No messages yet"}
                        </span>
                        <span className={style.subText}>
                          {room.last_message_time || "Recently created"}
                        </span>
                      </div>
                    </td>

                   

                    <td>
                      <div className={style.actionGroup}>
                        <button
                          className={`${style.actionBtn} ${style.postBtn}`}
                          onClick={() => openChat(room.room_id)}
                          type="button"
                        >
                          <Chat fontSize="small" />
                          View Chat
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequest;