import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import style from "./Chat.module.css";

import {
  Forum as ForumIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Campaign as CampaignIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Inventory2 as Inventory2Icon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassTop as HourglassTopIcon,
  Handshake as HandshakeIcon,
  FiberManualRecord as FiberManualRecordIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  SellOutlined as SellOutlinedIcon,
} from "@mui/icons-material";

const Chat = () => {
  const { roomId } = useParams();
  const iid = sessionStorage.getItem("iid");

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const chatBodyRef = useRef(null);
  const shouldScrollRef = useRef(true);
  const firstLoadRef = useRef(true);

  useEffect(() => {
    loadMessages(false);

    const interval = setInterval(() => {
      loadMessages(true);
    }, 2000);

    return () => clearInterval(interval);
  }, [roomId]);

  const loadMessages = async (isAutoRefresh = false) => {
    try {
      const chatBox = chatBodyRef.current;
      let isNearBottom = true;

      if (chatBox) {
        const distanceFromBottom =
          chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight;
        isNearBottom = distanceFromBottom < 120;
      }

      const res = await axios.get(
        `http://127.0.0.1:8000/ViewRoomMessages/${roomId}/`
      );

      setMessages(res.data.data || []);

      if (firstLoadRef.current) {
        shouldScrollRef.current = true;
        firstLoadRef.current = false;
      } else {
        shouldScrollRef.current = !isAutoRefresh || isNearBottom;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (shouldScrollRef.current && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || sending) return;

    try {
      setSending(true);

      await axios.post("http://127.0.0.1:8000/SendRoomMessage/", {
        room_id: roomId,
        sender_type: "influencer",
        sender_id: iid,
        message: message,
      });

      setMessage("");
      shouldScrollRef.current = true;
      await loadMessages(false);
    } catch (error) {
      console.log(error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      setActionLoading(`accept-${requestId}`);
      await axios.get(`http://127.0.0.1:8000/AcceptChatRequest/${requestId}/`);
      shouldScrollRef.current = false;
      await loadMessages(false);
    } catch (error) {
      console.log(error);
      alert("Failed to accept request");
    } finally {
      setActionLoading("");
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      setActionLoading(`reject-${requestId}`);
      await axios.get(`http://127.0.0.1:8000/RejectChatRequest/${requestId}/`);
      shouldScrollRef.current = false;
      await loadMessages(false);
    } catch (error) {
      console.log(error);
      alert("Failed to reject request");
    } finally {
      setActionLoading("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getStatusConfig = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value === "1" ||
      value === "accepted" ||
      value === "approve" ||
      value === "approved"
    ) {
      return {
        text: "Accepted",
        className: style.accepted,
        icon: <CheckCircleIcon fontSize="small" />,
      };
    }

    if (value === "2" || value === "rejected" || value === "reject") {
      return {
        text: "Rejected",
        className: style.rejected,
        icon: <CancelIcon fontSize="small" />,
      };
    }

    return {
      text: "Pending",
      className: style.pending,
      icon: <HourglassTopIcon fontSize="small" />,
    };
  };

  const formatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalMessages = useMemo(
    () => messages.filter((item) => item.type === "message").length,
    [messages]
  );

  const totalOffers = useMemo(
    () => messages.filter((item) => item.type !== "message").length,
    [messages]
  );

  const latestOffer = useMemo(() => {
    const offers = messages.filter((item) => item.type !== "message");
    return offers.length ? offers[offers.length - 1] : null;
  }, [messages]);

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIconWrap}>
            <ForumIcon className={style.heroIcon} />
          </div>

          <div>
            <div className={style.titleRow}>
              <h1>Influencer Chat</h1>
              <div className={style.liveBadge}>
                <FiberManualRecordIcon fontSize="inherit" />
                <span>Live</span>
              </div>
            </div>
            <p>Chat with brand and manage collaboration offers</p>
          </div>
        </div>

        <div className={style.heroStats}>
          <div className={style.statCard}>
            <span className={style.statLabel}>Room ID</span>
            <span className={style.statValue}>#{roomId}</span>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Messages</span>
            <span className={style.statValue}>{totalMessages}</span>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Offers</span>
            <span className={style.statValue}>{totalOffers}</span>
          </div>
        </div>
      </div>

      <div className={style.chatLayoutSingle}>
        <div className={style.chatCard}>
          <div className={style.chatHeader}>
            <div className={style.chatHeaderLeft}>
              <div className={style.avatarWrap}>
                <PersonIcon className={style.avatarIcon} />
              </div>
              <div>
                <h2>Conversation</h2>
                <p>Messages, offer updates, and request actions</p>
              </div>
            </div>

            <div className={style.headerPills}>
              <div className={style.headerPill}>
                <ChatBubbleOutlineIcon fontSize="small" />
                <span>{totalMessages} chats</span>
              </div>
              <div className={style.headerPill}>
                <SellOutlinedIcon fontSize="small" />
                <span>{totalOffers} offers</span>
              </div>
            </div>
          </div>

          {latestOffer && (
            <div className={style.topSummaryBar}>
              <div className={style.summaryItem}>
                <span className={style.summaryLabel}>Latest product</span>
                <span className={style.summaryValue}>
                  {latestOffer.product_name || "-"}
                </span>
              </div>

              <div className={style.summaryItem}>
                <span className={style.summaryLabel}>Latest amount</span>
                <span className={style.summaryValue}>
                  ₹{latestOffer.amount || 0}
                </span>
              </div>

              <div className={style.summaryItem}>
                <span className={style.summaryLabel}>Offer status</span>
                <span
                  className={`${style.statusBadge} ${
                    getStatusConfig(latestOffer.status).className
                  }`}
                >
                  {getStatusConfig(latestOffer.status).icon}
                  <span>{getStatusConfig(latestOffer.status).text}</span>
                </span>
              </div>
            </div>
          )}

          <div ref={chatBodyRef} className={style.messagesBox}>
            {messages.length > 0 ? (
              messages.map((item) => {
                const isInfluencerMessage =
                  item.type === "message" &&
                  (item.sender_type === "influencer" ||
                    String(item.sender_id) === String(iid));

                if (item.type === "message") {
                  return (
                    <div
                      key={`msg-${item.id}`}
                      className={`${style.messageRow} ${
                        isInfluencerMessage
                          ? style.messageRight
                          : style.messageLeft
                      }`}
                    >
                      <div
                        className={`${style.messageBubble} ${
                          isInfluencerMessage
                            ? style.myBubble
                            : style.otherBubble
                        }`}
                      >
                        <div className={style.messageMeta}>
                          <span className={style.senderName}>
                            {isInfluencerMessage
                              ? "You"
                              : item.sender_name || "Brand"}
                          </span>
                          <span className={style.dot}>•</span>
                          <span className={style.messageTime}>
                            {formatTime(
                              item.created_at ||
                                item.date ||
                                item.time ||
                                item.timestamp
                            )}
                          </span>
                        </div>

                        <div className={style.messageText}>{item.message}</div>
                      </div>
                    </div>
                  );
                }

                const statusConfig = getStatusConfig(item.status);

                return (
                  <div key={`req-${item.id}`} className={style.offerRow}>
                    <div className={style.offerCard}>
                      <div className={style.offerTop}>
                        <div className={style.offerTitleWrap}>
                          <div className={style.offerIconWrap}>
                            <CampaignIcon className={style.offerIcon} />
                          </div>
                          <div>
                            <h3>Brand Offer</h3>
                            <p>Collaboration request sent by brand</p>
                          </div>
                        </div>

                        <div
                          className={`${style.statusBadge} ${statusConfig.className}`}
                        >
                          {statusConfig.icon}
                          <span>{statusConfig.text}</span>
                        </div>
                      </div>

                      <div className={style.offerGrid}>
                        <div className={style.offerInfoItem}>
                          <div className={style.offerInfoLabel}>
                            <Inventory2Icon fontSize="small" />
                            <span>Product</span>
                          </div>
                          <div className={style.offerInfoValue}>
                            {item.product_name || "-"}
                          </div>
                        </div>

                        <div className={style.offerInfoItem}>
                          <div className={style.offerInfoLabel}>
                            <CurrencyRupeeIcon fontSize="small" />
                            <span>Amount</span>
                          </div>
                          <div className={style.offerInfoValue}>
                            ₹{item.amount || 0}
                          </div>
                        </div>

                        <div className={style.offerInfoItem}>
                          <div className={style.offerInfoLabel}>
                            <HandshakeIcon fontSize="small" />
                            <span>Status</span>
                          </div>
                          <div className={style.offerInfoValue}>
                            {statusConfig.text}
                          </div>
                        </div>
                      </div>

                      {String(item.status) === "0" && (
                        <div className={style.offerActions}>
                          <button
                            className={`${style.actionBtn} ${style.acceptBtn}`}
                            onClick={() => acceptRequest(item.request_id)}
                            disabled={actionLoading === `accept-${item.request_id}`}
                          >
                            <CheckCircleIcon fontSize="small" />
                            <span>
                              {actionLoading === `accept-${item.request_id}`
                                ? "Accepting..."
                                : "Accept Offer"}
                            </span>
                          </button>

                          <button
                            className={`${style.actionBtn} ${style.rejectBtn}`}
                            onClick={() => rejectRequest(item.request_id)}
                            disabled={actionLoading === `reject-${item.request_id}`}
                          >
                            <CancelIcon fontSize="small" />
                            <span>
                              {actionLoading === `reject-${item.request_id}`
                                ? "Rejecting..."
                                : "Reject Offer"}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={style.emptyState}>
                <div className={style.emptyIconWrap}>
                  <ForumIcon className={style.emptyIcon} />
                </div>
                <h3>No messages yet</h3>
                <p>Start the conversation by sending your first message.</p>
              </div>
            )}
          </div>

          <div className={style.chatInputArea}>
            <div className={style.inputWrap}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className={style.chatInput}
              />

              <button
                className={style.sendBtn}
                onClick={sendMessage}
                disabled={sending || !message.trim()}
              >
                <SendIcon fontSize="small" />
                <span>{sending ? "Sending..." : "Send"}</span>
              </button>
            </div>

            <div className={style.inputHint}>
              Press Enter to send message
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;