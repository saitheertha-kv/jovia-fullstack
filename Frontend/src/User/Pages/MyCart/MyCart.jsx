import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import style from "./MyCart.module.css";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PaymentsIcon from "@mui/icons-material/Payments";

const MyCart = () => {
  const navigate = useNavigate();
  const uid = sessionStorage.getItem("uid");

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAddress = () => {
    axios
      .get(`http://127.0.0.1:8000/GetAddress/${uid}/`)
      .then((res) => {
        setAddresses(res.data.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadCart = () => {
    setLoading(true);

    axios
      .get(`http://127.0.0.1:8000/ViewCart/${uid}/`)
      .then((res) => {
        setCart(res.data.data || []);
        setTotal(res.data.total || 0);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCart();
    loadAddress();
  }, []);

  const addAddress = async () => {
    if (!newAddress.trim()) {
      alert("Enter address");
      return;
    }

    if (!pincode.trim()) {
      alert("Enter pincode");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/AddAddress/", {
        uid: uid,
        address: newAddress,
        pincode: pincode,
      });

      setNewAddress("");
      setPincode("");
      loadAddress();
    } catch (err) {
      console.log(err);
      alert("Failed to add address");
    }
  };

  const deleteAddress = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/DeleteAddress/${id}/`);
      if (selectedAddress === id) {
        setSelectedAddress(null);
      }
      loadAddress();
    } catch (err) {
      console.log(err);
      alert("Failed to delete address");
    }
  };

  const updateQty = async (cartid, qty) => {
    if (qty < 1) return;

    try {
      await axios.post("http://127.0.0.1:8000/UpdateCartQty/", {
        cartid: cartid,
        qty: qty,
      });

      loadCart();
    } catch (err) {
      console.log(err);
      alert("Failed to update quantity");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/DeleteCart/${id}/`);
      loadCart();
    } catch (err) {
      console.log(err);
      alert("Failed to remove item");
    }
  };

  const checkout = async () => {
    if (!selectedAddress) {
      alert("Select address");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/Checkout/", {
        uid: uid,
        address_id: selectedAddress,
      });

      const bookingid = res.data.booking_id;
      navigate(`/user/payment/${bookingid}`);
    } catch (err) {
      console.log(err);
      alert("Checkout failed");
    }
  };

  return (
    <div className={style.page}>
      <div className={style.header}>
        <div className={style.headerLeft}>
          <div className={style.iconBox}>
            <ShoppingCartIcon />
          </div>
          <div>
            <h1 className={style.title}>My Cart</h1>
            <p className={style.subtitle}>Review your products and continue checkout</p>
          </div>
        </div>
      </div>

      <div className={style.grid}>
        {/* LEFT SIDE */}
        <div className={style.leftPanel}>
          <div className={style.card}>
            <div className={style.sectionTitle}>
              <LocalMallIcon />
              <span>Cart Items</span>
            </div>

            {loading ? (
              <div className={style.emptyBox}>Loading cart...</div>
            ) : cart.length === 0 ? (
              <div className={style.emptyBox}>
                <ShoppingCartIcon className={style.emptyIcon} />
                <h3>Your cart is empty</h3>
                <p>Add some products to continue shopping.</p>
              </div>
            ) : (
              <div className={style.tableWrap}>
                <table className={style.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Available Stock</th>
                      <th>Subtotal</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.map((c) => (
                      <tr key={c.cart_id}>
                        <td className={style.productName}>{c.product_name}</td>
                        <td>₹ {c.price}</td>
                        <td>
                          <div className={style.qtyBox}>
                            <button
                              type="button"
                              className={style.qtyBtn}
                              onClick={() => updateQty(c.cart_id, c.qty - 1)}
                            >
                              <RemoveIcon fontSize="small" />
                            </button>

                            <span className={style.qtyValue}>{c.qty}</span>

                            <button
                              type="button"
                              className={style.qtyBtn}
                              onClick={() => updateQty(c.cart_id, c.qty + 1)}
                            >
                              <AddIcon fontSize="small" />
                            </button>
                          </div>
                        </td>

                        <td>{c.available_stock}</td>

                        <td className={style.subtotal}>₹ {c.subtotal}</td>

                        <td>
                          <button
                            type="button"
                            className={style.removeBtn}
                            onClick={() => deleteItem(c.cart_id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                            <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={style.rightPanel}>
          <div className={style.summaryCard}>
            <div className={style.sectionTitle}>
              <PaymentsIcon />
              <span>Order Summary</span>
            </div>

            <div className={style.summaryRow}>
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className={style.summaryRow}>
              <span>Total Amount</span>
              <span className={style.totalText}>₹ {total}</span>
            </div>

            <button
              type="button"
              className={style.checkoutBtn}
              onClick={checkout}
              disabled={cart.length === 0}
            >
              Checkout
            </button>
          </div>

          <div className={style.card}>
            <div className={style.sectionTitle}>
              <LocationOnIcon />
              <span>Select Address</span>
            </div>

            <div className={style.addressList}>
              {addresses.length === 0 ? (
                <div className={style.noAddress}>No saved addresses found.</div>
              ) : (
                addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`${style.addressCard} ${selectedAddress === a.id ? style.addressActive : ""
                      }`}
                  >
                    <div className={style.addressTop}>
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === a.id}
                        onChange={() => setSelectedAddress(a.id)}
                      />
                      <button
                        type="button"
                        className={style.deleteAddressBtn}
                        onClick={() => deleteAddress(a.id)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </div>

                    <div className={style.addressText}>{a.address}</div>
                    <div className={style.pincode}>PIN: {a.pincode}</div>
                  </label>
                ))
              )}
            </div>
          </div>

          {addresses.length < 3 && (
            <div className={style.card}>
              <div className={style.sectionTitle}>
                <AddLocationAltIcon />
                <span>Add New Address</span>
              </div>

              <div className={style.formGroup}>
                <textarea
                  className={style.textarea}
                  placeholder="Enter full delivery address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />

                <input
                  className={style.input}
                  type="text"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />

                <button
                  type="button"
                  className={style.addAddressBtn}
                  onClick={addAddress}
                >
                  Add Address
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCart;