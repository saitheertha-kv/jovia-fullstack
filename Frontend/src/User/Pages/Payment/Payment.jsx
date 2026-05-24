import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import style from "./Payment.module.css";

const Payment = () => {
  const { bookingid } = useParams();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [bookingAmount, setBookingAmount] = useState("0.00");

  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [upiId, setUpiId] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPaymentDetails();
  }, [bookingid]);

  const loadPaymentDetails = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:8000/PaymentDetails/${bookingid}/`
      );

      if (res.data.status === "success") {
        setBookingAmount(res.data.data.booking_amount || "0.00");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load booking amount");
    } finally {
      setPageLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (paymentMethod === "card") {
      // Name Validation
      if (!cardData.cardName.trim()) {
        newErrors.cardName = "Card holder name required";
      } else if (cardData.cardName.trim().length < 3) {
        newErrors.cardName = "Name must be at least 3 characters";
      }

      // Card Number Validation (Must be exactly 16 digits)
      const rawCardNumber = cardData.cardNumber.replace(/\s/g, "");
      if (!rawCardNumber) {
        newErrors.cardNumber = "Card number required";
      } else if (rawCardNumber.length !== 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }

      // Expiry Validation (Format MM/YY and check if expired)
      if (!cardData.expiry.trim()) {
        newErrors.expiry = "Expiry required";
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiry)) {
        newErrors.expiry = "Invalid format (MM/YY)";
      } else {
        const [month, year] = cardData.expiry.split("/");
        const now = new Date();
        const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10);
        const currentMonth = now.getMonth() + 1;
        const expYear = parseInt(year, 10);
        const expMonth = parseInt(month, 10);

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
          newErrors.expiry = "Card has expired";
        }
      }

      // CVV Validation
      if (!cardData.cvv.trim()) {
        newErrors.cvv = "CVV required";
      } else if (cardData.cvv.length < 3) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      }
    }

    if (paymentMethod === "upi") {
      // UPI Regex Validation (e.g., number@upi or name@bank)
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiId.trim()) {
        newErrors.upiId = "UPI ID required";
      } else if (!upiRegex.test(upiId)) {
        newErrors.upiId = "Enter a valid UPI ID (e.g., example@okbank)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const payNow = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await axios.post("http://127.0.0.1:8000/PaymentComplete/", {
        booking_id: bookingid,
        payment_method: paymentMethod,
        payment_status: "completed",
      });

      alert("Payment Successful");
      navigate("/user/mybooking");
    } catch (error) {
      console.error(error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Change Handler with Input Restrictions & Formatting
  const handleCardChange = (e) => {
    let { name, value } = e.target;

    if (name === "cardName") {
      // Only allow letters and spaces
      value = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "cardNumber") {
      // Remove all non-digits, cap at 16 digits, and add spaces every 4 digits
      let v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
      if (v.length > 16) v = v.substring(0, 16);
      let parts = [];
      for (let i = 0; i < v.length; i += 4) {
        parts.push(v.substring(i, i + 4));
      }
      value = parts.length > 1 ? parts.join(" ") : v;
    } else if (name === "expiry") {
      // Remove non-digits and auto-insert slash
      value = value.replace(/\D/g, "");
      if (value.length > 4) value = value.substring(0, 4);
      if (value.length >= 3) {
        value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
      }
    } else if (name === "cvv") {
      // Only digits, cap at 4
      value = value.replace(/\D/g, "");
      if (value.length > 4) value = value.substring(0, 4);
    }

    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear the error for the field being typed in
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUpiChange = (e) => {
    setUpiId(e.target.value);
    if (errors.upiId) {
      setErrors((prev) => ({ ...prev, upiId: "" }));
    }
  };

  // Reset errors when switching payment methods
  const handleMethodSwitch = (method) => {
    setPaymentMethod(method);
    setErrors({});
  };

  if (pageLoading) {
    return (
      <div className={style.page}>
        <div className={style.paymentCard}>
          <h2>Loading payment details...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={style.page}>
      <div className={style.paymentCard}>
        <div className={style.leftSection}>
          <p className={style.tag}>Secure Payment</p>
          <h2 className={style.title}>Complete Your Payment</h2>
          <p className={style.subtext}>
            Booking ID: <span>{bookingid}</span>
          </p>

          <div className={style.methodBox}>
            <button
              className={`${style.methodBtn} ${
                paymentMethod === "card" ? style.activeMethod : ""
              }`}
              onClick={() => handleMethodSwitch("card")}
              type="button"
            >
              Card
            </button>

            <button
              className={`${style.methodBtn} ${
                paymentMethod === "upi" ? style.activeMethod : ""
              }`}
              onClick={() => handleMethodSwitch("upi")}
              type="button"
            >
              UPI
            </button>
          </div>

          {paymentMethod === "card" && (
            <div className={style.formSection}>
              <div className={style.inputGroup}>
                <label>Card Holder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={cardData.cardName}
                  onChange={handleCardChange}
                  placeholder="Enter card holder name"
                />
                {errors.cardName && (
                  <p className={style.error}>{errors.cardName}</p>
                )}
              </div>

              <div className={style.inputGroup}>
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19} // 16 digits + 3 spaces
                />
                {errors.cardNumber && (
                  <p className={style.error}>{errors.cardNumber}</p>
                )}
              </div>

              <div className={style.row}>
                <div className={style.inputGroup}>
                  <label>Expiry</label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.expiry && (
                    <p className={style.error}>{errors.expiry}</p>
                  )}
                </div>

                <div className={style.inputGroup}>
                  <label>CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    maxLength={3}
                  />
                  {errors.cvv && <p className={style.error}>{errors.cvv}</p>}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "upi" && (
            <div className={style.formSection}>
              <div className={style.inputGroup}>
                <label>UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={handleUpiChange}
                  placeholder="example@upi"
                />
                {errors.upiId && <p className={style.error}>{errors.upiId}</p>}
              </div>
            </div>
          )}

          <button
            className={style.payBtn}
            onClick={payNow}
            disabled={loading}
            type="button"
          >
            {loading ? "Processing..." : `Pay ₹${bookingAmount}`}
          </button>
        </div>

        <div className={style.rightSection}>
          <div className={style.summaryCard}>
            <h3>Payment Summary</h3>
            <div className={style.summaryRow}>
              <span>Booking ID</span>
              <span>#{bookingid}</span>
            </div>
            <div className={style.summaryRow}>
              <span>Method</span>
              <span>{paymentMethod.toUpperCase()}</span>
            </div>
            <div className={style.summaryRow}>
              <span>Status</span>
              <span className={style.pending}>Pending</span>
            </div>
            
            <div className={`${style.summaryRow} ${style.total}`}>
              <span>Total</span>
              <span>₹{bookingAmount}</span>
            </div>
          </div>

          <div className={style.secureBox}>
            <h4>Safe Payment</h4>
            <p>Your transaction is protected in this demo payment page.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;