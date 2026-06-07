import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import style from "./Chat.module.css";

import {
  Storefront as StorefrontIcon,
  Forum as ForumIcon,
  Send as SendIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Inventory2 as Inventory2Icon,
  LocalOffer as LocalOfferIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassTop as HourglassTopIcon,
  Person as PersonIcon,
  ShoppingBag as ShoppingBagIcon,
  AutoAwesome as AutoAwesomeIcon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";

const Chat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const bid = sessionStorage.getItem("bid");
  const iid = sessionStorage.getItem("chat_iid");

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [sendingOffer, setSendingOffer] = useState(false);

  const chatBodyRef = useRef(null);
  const shouldScrollRef = useRef(true);
  const firstLoadRef = useRef(true);

  useEffect(() => {
    loadProducts();
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

  const loadProducts = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/BrandProducts/${bid}/`);
      setProducts(res.data.data || []);
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
        sender_type: "brand",
        sender_id: bid,
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

  const sendRequest = async () => {
    if (!productId || !amount) {
      alert("Select product and amount");
      return;
    }

    try {
      setSendingOffer(true);

      await axios.post("http://127.0.0.1:8000/SendRequestInChat/", {
        room_id: roomId,
        brand_id: bid,
        influencer_id: iid,
        product_id: productId,
        amount: amount,
      });

      setProductId("");
      setAmount("");
      shouldScrollRef.current = true;
      await loadMessages(false);
    } catch (error) {
      console.log(error);
      alert("Failed to send request");
    } finally {
      setSendingOffer(false);
    }
  };

  const goToPayment = (requestId) => {
    navigate(`/brand/payment/${requestId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const getStatusConfig = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "1" || value === "accepted" || value === "approve" || value === "approved") {
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

  const stats = useMemo(() => {
    const textMessages = messages.filter((item) => item.type === "message").length;
    const offers = messages.filter((item) => item.type !== "message").length;

    return {
      textMessages,
      offers,
      totalProducts: products.length,
    };
  }, [messages, products]);

  return (
    <div className={style.page}>
      <motion.div
        className={style.hero}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={style.heroGlow}></div>

        <div className={style.heroLeft}>
          <div className={style.heroIconWrap}>
            <ForumIcon className={style.heroIcon} />
          </div>

          <div className={style.heroText}>
            <span className={style.eyebrow}>Brand Collaboration</span>
            <h1>Chat & Offer Room</h1>
            <p>Connect with influencer, discuss promotions, send offers, and complete payment after acceptance.</p>
          </div>
        </div>

        <div className={style.heroStats}>
          <div className={style.statCard}>
            <span className={style.statLabel}>Room ID</span>
            <span className={style.statValue}>#{roomId}</span>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Messages</span>
            <span className={style.statValue}>{stats.textMessages}</span>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Offers</span>
            <span className={style.statValue}>{stats.offers}</span>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Products</span>
            <span className={style.statValue}>{stats.totalProducts}</span>
          </div>
        </div>
      </motion.div>

      <div className={style.chatLayout}>
        <motion.div
          className={style.chatCard}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <div className={style.chatHeader}>
            <div className={style.chatHeaderLeft}>
              <div className={style.avatarWrap}>
                <StorefrontIcon className={style.avatarIcon} />
              </div>
              <div>
                <h2>Conversation</h2>
                <p>Live updates every 2 seconds</p>
              </div>
            </div>

            <div className={style.liveBadge}>
              <AutoAwesomeIcon fontSize="small" />
              Live
            </div>
          </div>

          <div ref={chatBodyRef} className={style.messagesBox}>
            {messages.length > 0 ? (
              messages.map((item) => {
                const isBrandMessage = item.type === "message" && item.sender_type === "brand";

                if (item.type === "message") {
                  return (
                    <div
                      key={`msg-${item.id}`}
                      className={`${style.messageRow} ${
                        isBrandMessage ? style.messageRight : style.messageLeft
                      }`}
                    >
                      <div
                        className={`${style.messageBubble} ${
                          isBrandMessage ? style.brandBubble : style.otherBubble
                        }`}
                      >
                        <div className={style.messageMeta}>
                          <span className={style.senderName}>
                            {item.sender_name || "User"}
                          </span>
                        </div>
                        <div className={style.messageText}>{item.message}</div>
                      </div>
                    </div>
                  );
                }

                const statusConfig = getStatusConfig(item.status);
                const isAccepted = String(item.status) === "1";
                const isPaid = String(item.payment_status || "0") === "1";

                return (
                  <div key={`req-${item.id}`} className={style.offerRow}>
                    <div className={style.offerCard}>
                      <div className={style.offerTop}>
                        <div className={style.offerTitleWrap}>
                          <div className={style.offerIconWrap}>
                            <LocalOfferIcon className={style.offerIcon} />
                          </div>
                          <div>
                            <h3>Collaboration Offer</h3>
                            <p>Brand sent a product request inside chat</p>
                          </div>
                        </div>

                        <div className={`${style.statusBadge} ${statusConfig.className}`}>
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
                          <div className={style.offerInfoValue}>{item.product_name || "-"}</div>
                        </div>

                        <div className={style.offerInfoItem}>
                          <div className={style.offerInfoLabel}>
                            <CurrencyRupeeIcon fontSize="small" />
                            <span>Amount</span>
                          </div>
                          <div className={style.offerInfoValue}>₹{item.amount || 0}</div>
                        </div>

                        <div className={style.offerInfoItem}>
                          <div className={style.offerInfoLabel}>
                            <PersonIcon fontSize="small" />
                            <span>Status</span>
                          </div>
                          <div className={style.offerInfoValue}>{statusConfig.text}</div>
                        </div>
                      </div>

                      {isAccepted && (
                        <div style={{ marginTop: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                          {!isPaid ? (
                            <button
                              className={style.offerBtn}
                              onClick={() => goToPayment(item.request_id)}
                              type="button"
                            >
                              <CreditCardIcon fontSize="small" />
                              <span>Pay Now</span>
                            </button>
                          ) : (
                            <button
                              className={style.paidBtn}
                              type="button"
                              disabled
                            >
                              Paid
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={style.emptyBox}>No messages yet</div>
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
                disabled={sending}
              >
                <SendIcon fontSize="small" />
                <span>{sending ? "Sending..." : "Send"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={style.sideCard}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div className={style.sideCardHeader}>
            <div className={style.sideIconWrap}>
              <ShoppingBagIcon className={style.sideIcon} />
            </div>
            <div>
              <h2>Send Offer</h2>
              <p>Create a paid product request directly inside this room</p>
            </div>
          </div>

          <div className={style.formGroup}>
            <label>Select Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className={style.selectInput}
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.product_name}
                </option>
              ))}
            </select>
          </div>

          <div className={style.formGroup}>
            <label>Offer Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className={style.textInput}
            />
          </div>

          <button
            className={style.offerBtn}
            onClick={sendRequest}
            disabled={sendingOffer}
          >
            <LocalOfferIcon fontSize="small" />
            <span>{sendingOffer ? "Sending..." : "Send Offer"}</span>
          </button>

          <div className={style.noteCard}>
            <h4>Quick Note</h4>
            <p>
              After the influencer accepts the offer, the brand can directly open the payment page from this chat.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;