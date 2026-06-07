import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import style from "./ViewBooking.module.css";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";

const ViewBooking = () => {
  const bid = sessionStorage.getItem("bid");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = () => {
    setLoading(true);

    axios
      .get(`http://127.0.0.1:8000/BrandBookings/${bid}/`)
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

  useEffect(() => {
    loadBookings();
  }, [bid]);

  const updateCartStatus = async (cartId, status) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/UpdateBrandCartStatus/${cartId}/${status}/`
      );

      alert(res.data.message);
      loadBookings();
    } catch (err) {
      console.log(err);
      alert("Failed to update cart status");
    }
  };

  const totalOrders = useMemo(() => bookings.length, [bookings]);

  const totalItems = useMemo(() => {
    return bookings.reduce((acc, booking) => acc + (booking.items?.length || 0), 0);
  }, [bookings]);

  const deliveredItems = useMemo(() => {
    return bookings.reduce((acc, booking) => {
      const deliveredCount =
        booking.items?.filter((item) => String(item.cart_status) === "6").length || 0;
      return acc + deliveredCount;
    }, 0);
  }, [bookings]);

  const bookingStatus = (status) => {
    const value = Number(status);

    if (value === 1) {
      return {
        label: "Payment Pending",
        className: style.warningBadge,
        icon: <HourglassBottomOutlinedIcon fontSize="small" />,
      };
    }

    if (value === 2) {
      return {
        label: "Payment Completed",
        className: style.successBadge,
        icon: <CheckCircleOutlinedIcon fontSize="small" />,
      };
    }

    if (value === 3) {
      return {
        label: "Order Completed",
        className: style.primaryBadge,
        icon: <DoneAllOutlinedIcon fontSize="small" />,
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

  const renderAction = (item) => {
    if (item.cart_status === "2") {
      return (
        <button
          className={`${style.actionBtn} ${style.primaryAction}`}
          onClick={() => updateCartStatus(item.cart_id, "3")}
        >
          <InventoryOutlinedIcon fontSize="small" />
          Mark as Packed
        </button>
      );
    }

    if (item.cart_status === "3") {
      return (
        <button
          className={`${style.actionBtn} ${style.infoAction}`}
          onClick={() => updateCartStatus(item.cart_id, "4")}
        >
          <LocalShippingOutlinedIcon fontSize="small" />
          Mark as Shipped
        </button>
      );
    }

    if (item.cart_status === "4") {
      return (
        <button
          className={`${style.actionBtn} ${style.warningAction}`}
          onClick={() => updateCartStatus(item.cart_id, "5")}
        >
          <LocationOnOutlinedIcon fontSize="small" />
          Out for Delivery
        </button>
      );
    }

    if (item.cart_status === "5") {
      return (
        <button
          className={`${style.actionBtn} ${style.successAction}`}
          onClick={() => updateCartStatus(item.cart_id, "6")}
        >
          <CheckCircleOutlinedIcon fontSize="small" />
          Mark as Delivered
        </button>
      );
    }

    if (item.cart_status === "6") {
      return (
        <span className={`${style.statusBadge} ${style.successBadge}`}>
          <CheckCircleOutlinedIcon fontSize="small" />
          Delivered Successfully
        </span>
      );
    }

    return (
      <span className={`${style.statusBadge} ${style.grayBadge}`}>
        <HourglassBottomOutlinedIcon fontSize="small" />
        Waiting for Payment
      </span>
    );
  };

  return (
    <div className={style.page}>
      <div className={style.header}>
        <div className={style.headerLeft}>
          <div className={style.headerIconWrap}>
            <ShoppingBagOutlinedIcon className={style.headerIcon} />
          </div>

          <div>
            <h1>View Bookings</h1>
            <p>Track customer orders, shipping progress, and delivery updates</p>
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

          <div className={style.statCard}>
            <span>Delivered Items</span>
            <strong>{deliveredItems}</strong>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={style.loadingBox}>Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className={style.emptyState}>
          <Inventory2OutlinedIcon className={style.emptyIcon} />
          <h3>No bookings found</h3>
          <p>No customer orders are available for your brand yet.</p>
        </div>
      ) : (
        <div className={style.bookingList}>
          {bookings.map((booking) => {
            const currentBookingStatus = bookingStatus(booking.booking_status);

            return (
              <div key={booking.booking_id} className={style.bookingCard}>
                <div className={style.bookingTop}>
                  <div className={style.bookingInfoGrid}>
                    <div className={style.infoBlock}>
                      <span className={style.infoLabel}>Order Number</span>
                      <strong className={style.infoValue}>#{booking.booking_id}</strong>
                    </div>

                    <div className={style.infoBlock}>
                      <span className={style.infoLabel}>
                        <CalendarMonthOutlinedIcon fontSize="small" />
                        Date
                      </span>
                      <strong className={style.infoValue}>{booking.booking_date}</strong>
                    </div>

                    <div className={style.infoBlock}>
                      <span className={style.infoLabel}>
                        <PaymentsOutlinedIcon fontSize="small" />
                        Total Amount
                      </span>
                      <strong className={style.priceValue}>₹{booking.booking_amount}</strong>
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
                      <span className={style.infoLabel}>
                        <PersonOutlineOutlinedIcon fontSize="small" />
                        Customer
                      </span>
                      <strong className={style.infoValue}>{booking.customer_name}</strong>
                    </div>

                    <div className={style.infoBlock}>
                      <span className={style.infoLabel}>
                        <LocalPhoneOutlinedIcon fontSize="small" />
                        Contact
                      </span>
                      <strong className={style.infoValue}>{booking.customer_contact}</strong>
                    </div>

                    <div className={`${style.infoBlock} ${style.addressBlock}`}>
                      <span className={style.infoLabel}>
                        <LocationOnOutlinedIcon fontSize="small" />
                        Delivery Address
                      </span>
                      <div className={style.addressText}>{booking.address_line}</div>
                      {booking.pincode && (
                        <small className={style.pinText}>PIN: {booking.pincode}</small>
                      )}
                    </div>
                  </div>
                </div>

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
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {booking.items?.map((item, index) => {
                        const currentCartStatus = cartStatus(item.cart_status);

                        return (
                          <tr key={item.cart_id}>
                            <td>{index + 1}</td>

                            <td>
                              {item.product_image ? (
                                <img
                                  src={item.product_image}
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
                                <p>{item.product_details}</p>
                                <span>₹{item.product_amount}</span>
                              </div>
                            </td>

                            <td>{item.cart_qty}</td>

                            <td className={style.subtotal}>₹{item.subtotal}</td>

                            <td>
                              <span
                                className={`${style.statusBadge} ${currentCartStatus.className}`}
                              >
                                <LocalShippingOutlinedIcon fontSize="small" />
                                {currentCartStatus.label}
                              </span>
                            </td>

                            <td>{renderAction(item)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className={style.mobileItems}>
                  {booking.items?.map((item, index) => {
                    const currentCartStatus = cartStatus(item.cart_status);

                    return (
                      <div key={item.cart_id} className={style.mobileCard}>
                        <div className={style.mobileCardTop}>
                          <span className={style.mobileIndex}>Item {index + 1}</span>

                          <span
                            className={`${style.statusBadge} ${currentCartStatus.className}`}
                          >
                            <LocalShippingOutlinedIcon fontSize="small" />
                            {currentCartStatus.label}
                          </span>
                        </div>

                        <div className={style.mobileBody}>
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className={style.mobileImage}
                            />
                          ) : (
                            <div className={style.noImage}>No Image</div>
                          )}

                          <div className={style.mobileContent}>
                            <h4>{item.product_name}</h4>
                            <p>{item.product_details}</p>

                            <div className={style.mobileMeta}>
                              <span>Price: ₹{item.product_amount}</span>
                              <span>Qty: {item.cart_qty}</span>
                              <span>Subtotal: ₹{item.subtotal}</span>
                            </div>

                            <div className={style.mobileActionWrap}>
                              {renderAction(item)}
                            </div>
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

export default ViewBooking;