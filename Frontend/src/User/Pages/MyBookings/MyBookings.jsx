import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import style from "./MyBookings.module.css";
import { Link } from "react-router";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";

const MyBookings = () => {
  const uid = sessionStorage.getItem("uid");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    setLoading(true);

    axios
      .get(`http://127.0.0.1:8000/MyBookings/${uid}/`)
      .then((res) => {
        setBookings(res.data.data || []);
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to load bookings");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const bookingStatus = (status) => {
    status = Number(status);

    if (status === 1) {
      return {
        label: "Payment Pending",
        className: style.warningBadge,
        icon: <HourglassBottomOutlinedIcon fontSize="small" />,
      };
    }

    if (status === 2) {
      return {
        label: "Payment Completed",
        className: style.successBadge,
        icon: <CheckCircleOutlinedIcon fontSize="small" />,
      };
    }

    if (status === 3) {
      return {
        label: "Booking Completed",
        className: style.primaryBadge,
        icon: <CheckCircleOutlinedIcon fontSize="small" />,
      };
    }

    return {
      label: "Unknown",
      className: style.grayBadge,
      icon: <ErrorOutlineIcon fontSize="small" />,
    };
  };

  const cartStatus = (status) => {
    const map = {
      "0": {
        label: "In Cart",
        className: style.grayBadge,
      },
      "1": {
        label: "Payment Pending",
        className: style.warningBadge,
      },
      "2": {
        label: "Payment Successful",
        className: style.successBadge,
      },
      "3": {
        label: "Packed",
        className: style.primaryBadge,
      },
      "4": {
        label: "Shipped",
        className: style.infoBadge,
      },
      "5": {
        label: "Out for Delivery",
        className: style.warningBadge,
      },
      "6": {
        label: "Delivered",
        className: style.successBadge,
      },
    };

    return (
      map[String(status)] || {
        label: "Unknown",
        className: style.grayBadge,
      }
    );
  };

  const totalOrders = useMemo(() => bookings.length, [bookings]);

  const totalItems = useMemo(
    () =>
      bookings.reduce((acc, booking) => {
        return acc + (booking.items?.length || 0);
      }, 0),
    [bookings]
  );

  return (
    <div className={style.page}>
      {/* Header */}
      <div className={style.header}>
        <div className={style.headerLeft}>
          <div className={style.headerIconWrap}>
            <ShoppingBagOutlinedIcon className={style.headerIcon} />
          </div>

          <div>
            <h1>My Bookings</h1>
            <p>Track your orders, delivery progress, and reviews</p>
          </div>
        </div>

        <div className={style.headerStats}>
          <div className={style.statCard}>
            <span>Total Orders</span>
            <strong>{totalOrders}</strong>
          </div>

          <div className={style.statCard}>
            <span>Total Items</span>
            <strong>{totalItems}</strong>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className={style.loadingBox}>Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className={style.emptyState}>
          <Inventory2OutlinedIcon className={style.emptyIcon} />
          <h3>No bookings found</h3>
          <p>You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className={style.bookingList}>
          {bookings.map((b) => {
            const currentBookingStatus = bookingStatus(b.booking_status);

            return (
              <div key={b.booking_id} className={style.bookingCard}>
                {/* Booking top */}
                <div className={style.bookingTop}>
                  <div className={style.bookingInfoGrid}>
                    <div className={style.infoBlock}>
                      <span className={style.infoLabel}>Order Number</span>
                      <strong className={style.infoValue}>#{b.booking_id}</strong>
                    </div>

                    <div className={style.infoBlock}>
                      <span className={style.infoLabel}>
                        <CalendarMonthOutlinedIcon fontSize="small" />
                        Date
                      </span>
                      <strong className={style.infoValue}>{b.date}</strong>
                    </div>

                    <div className={style.infoBlock}>
                      <span className={style.infoLabel}>
                        <PaymentsOutlinedIcon fontSize="small" />
                        Total Amount
                      </span>
                      <strong className={style.priceValue}>₹{b.amount}</strong>
                    </div>

                    <div className={style.infoBlock}>
                      <span className={style.infoLabel}>Booking Status</span>
                      <span
                        className={`${style.statusBadge} ${currentBookingStatus.className}`}
                      >
                        {currentBookingStatus.icon}
                        {currentBookingStatus.label}
                      </span>
                    </div>

                    <div className={style.infoBlock}>
                      <span className={style.infoLabel}>Delivery Address</span>
                      <strong className={style.infoValue}>{b.address_line}</strong>
                      {b.pincode && <small>PIN: {b.pincode}</small>}
                    </div>
                  </div>
                </div>

                {/* Desktop table */}
                <div className={style.tableWrap}>
                  <table className={style.table}>
                    <thead>
                      <tr>
                        <th>SNO</th>
                        <th>Photo</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Amount</th>
                        <th>Status</th>
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>

                    <tbody>
                      {b.items?.map((item, index) => {
                        const currentCartStatus = cartStatus(item.cart_status);

                        return (
                          <tr key={item.cart_id}>
                            <td>{index + 1}</td>

                            <td>
                              {item.photo ? (
                                <img
                                  src={item.photo}
                                  alt={item.product_name}
                                  className={style.productImage}
                                />
                              ) : (
                                <div className={style.noImage}>No Image</div>
                              )}
                            </td>

                            <td>
                              <div className={style.productCell}>
                                <strong>{item.product_name}</strong>
                                <p>{item.description}</p>
                                <span>₹{item.price}</span>
                              </div>
                            </td>

                            <td>{item.qty}</td>

                            <td className={style.subtotal}>₹{item.subtotal}</td>

                            <td>
                              <span
                                className={`${style.statusBadge} ${currentCartStatus.className}`}
                              >
                                <LocalShippingOutlinedIcon fontSize="small" />
                                {currentCartStatus.label}
                              </span>
                            </td>

                            {/* <td>
                              {String(item.cart_status) === "6" ? (
                                <Link
                                  to={`/rating/${item.product_id}`}
                                  className={style.reviewBtn}
                                >
                                  <RateReviewOutlinedIcon fontSize="small" />
                                  Give Review
                                </Link>
                              ) : (
                                <span className={style.naText}>N/A</span>
                              )}
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className={style.mobileItems}>
                  {b.items?.map((item, index) => {
                    const currentCartStatus = cartStatus(item.cart_status);

                    return (
                      <div key={item.cart_id} className={style.mobileCard}>
                        <div className={style.mobileCardTop}>
                          <span className={style.mobileIndex}>
                            Item {index + 1}
                          </span>

                          <span
                            className={`${style.statusBadge} ${currentCartStatus.className}`}
                          >
                            <LocalShippingOutlinedIcon fontSize="small" />
                            {currentCartStatus.label}
                          </span>
                        </div>

                        <div className={style.mobileBody}>
                          {item.photo ? (
                            <img
                              src={item.photo}
                              alt={item.product_name}
                              className={style.mobileImage}
                            />
                          ) : (
                            <div className={style.noImage}>No Image</div>
                          )}

                          <div className={style.mobileContent}>
                            <h4>{item.product_name}</h4>
                            <p>{item.description}</p>

                            <div className={style.mobileMeta}>
                              <span>Price: ₹{item.price}</span>
                              <span>Qty: {item.qty}</span>
                              <span>Subtotal: ₹{item.subtotal}</span>
                            </div>

                            {String(item.cart_status) === "6" ? (
                              <Link
                                to={`/rating/${item.product_id}`}
                                className={style.reviewBtn}
                              >
                                <RateReviewOutlinedIcon fontSize="small" />
                                Give Review
                              </Link>
                            ) : (
                              <span className={style.naText}>Review not available</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;