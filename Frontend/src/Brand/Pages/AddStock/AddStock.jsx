import React, { useEffect, useState } from "react";
import style from "./AddStock.module.css";
import { useParams } from "react-router";
import axios from "axios";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import AddBoxIcon from "@mui/icons-material/AddBox";

const AddStock = () => {
  const { id } = useParams();
  const [stockqty, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStock, setCurrentStock] = useState(0);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    loadStock();
  }, [id]);

  const loadStock = () => {
    axios
      .get(`http://127.0.0.1:8000/ProductStock/${id}/`)
      .then((res) => {
        setCurrentStock(res.data.data.stock_qty || 0);
        setProductName(res.data.data.product_name || "");
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to load stock");
      });
  };

  const addStock = () => {
    if (!stockqty || Number(stockqty) <= 0) {
      alert("Enter valid stock quantity");
      return;
    }

    setLoading(true);

    axios
      .post("http://127.0.0.1:8000/addstock/", {
        stockqty: stockqty,
        productid: id,
      })
      .then((res) => {
        alert(res.data.message);
        setQuantity("");
        if (res.data.current_stock !== undefined) {
          setCurrentStock(res.data.current_stock);
        } else {
          loadStock();
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to update stock");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={style.page}>
      <div className={style.header}>
        <div className={style.headerLeft}>
          <div className={style.iconWrap}>
            <Inventory2Icon className={style.icon} />
          </div>

          <div>
            <h1>Add Product Stock</h1>
            <p>Increase inventory quantity for this product</p>
          </div>
        </div>
      </div>

      <div className={style.card}>
        <h2 className={style.cardTitle}>Stock Quantity</h2>

        <div className={style.stockInfo}>
          <p><strong>Product:</strong> {productName || "Product"}</p>
          <p><strong>Current Stock:</strong> {currentStock}</p>
        </div>

        <div className={style.inputGroup}>
          <label>Enter Quantity</label>

          <div className={style.inputWrap}>
            <input
              type="number"
              placeholder="Enter stock quantity"
              value={stockqty}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <button
          className={style.button}
          onClick={addStock}
          disabled={loading}
        >
          <AddBoxIcon fontSize="small" />
          {loading ? "Updating..." : "Update Stock"}
        </button>
      </div>
    </div>
  );
};

export default AddStock;