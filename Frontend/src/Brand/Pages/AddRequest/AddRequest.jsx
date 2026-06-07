import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import style from "./AddRequest.module.css";

import {
  Campaign as CampaignIcon,
  Inventory2 as Inventory2Icon,
  CurrencyRupee as CurrencyRupeeIcon,
  Send as SendIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const AddRequest = () => {
  const { iid } = useParams();
  const bid = sessionStorage.getItem("bid");

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get(`http://127.0.0.1:8000/BrandProducts/${bid}/`);
      setProducts(res.data.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!product) {
      alert("Please select a product");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid offer amount");
      return;
    }

    try {
      setSending(true);

      await axios.post("http://127.0.0.1:8000/AddRequest/", {
        brand_id: bid,
        influencer_id: iid,
        product_id: product,
        amount: amount,
      });

      alert("Request Sent Successfully");
      setProduct("");
      setAmount("");
    } catch (err) {
      console.log(err);
      console.log(err.response?.data);
      alert("Failed to send request");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIcon}>
            <CampaignIcon />
          </div>

          <div>
            <h1>Send Promotion Request</h1>
            <p>Choose a product and send an offer to the influencer</p>
          </div>
        </div>

        <div className={style.heroBadge}>
          <PersonIcon fontSize="small" />
          <span>Influencer ID: {iid}</span>
        </div>
      </div>

      <div className={style.card}>
        <form onSubmit={handleSend} className={style.form}>
          <div className={style.sectionHeader}>
            <h3>Request Details</h3>
            <p>Fill in the product and offer amount before sending</p>
          </div>

          <div className={style.grid}>
            <div className={style.field}>
              <label>Select Product</label>
              <div className={style.inputWrap}>
                <Inventory2Icon className={style.inputIcon} />
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  disabled={loadingProducts}
                >
                  <option value="">
                    {loadingProducts ? "Loading products..." : "Select Product"}
                  </option>

                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.product_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={style.field}>
              <label>Offer Amount</label>
              <div className={style.inputWrap}>
                <CurrencyRupeeIcon className={style.inputIcon} />
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter offer amount"
                />
              </div>
            </div>
          </div>

          <div className={style.summaryBox}>
            <div className={style.summaryItem}>
              <span className={style.summaryLabel}>Selected Product</span>
              <span className={style.summaryValue}>
                {products.find((p) => String(p.id) === String(product))?.product_name ||
                  "Not selected"}
              </span>
            </div>

            <div className={style.summaryItem}>
              <span className={style.summaryLabel}>Offer Amount</span>
              <span className={style.summaryValue}>
                {amount ? `₹ ${amount}` : "Not entered"}
              </span>
            </div>
          </div>

          <div className={style.actionBar}>
            <button type="submit" className={style.sendBtn} disabled={sending}>
              <SendIcon fontSize="small" />
              {sending ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRequest;