import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import style from "./ViewMoreProduct.module.css";

import {
  ShoppingBag as ShoppingBagIcon,
  Category as CategoryIcon,
  AccountBalanceWallet as WalletIcon,
  Store as StoreIcon,
  ArrowBack as ArrowBackIcon,
  Image as ImageIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";

const ViewMoreProduct = () => {
  const { pid } = useParams();
  const navigate = useNavigate();

  const uid = sessionStorage.getItem("uid");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [pid]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/ProductDetails/${pid}/`);
      setProduct(res.data.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!uid) {
      alert("Please login first");
      return;
    }

    try {
      setCartLoading(true);

      const data = {
        productid: pid,
        userid: uid,
      };

      const res = await axios.post("http://127.0.0.1:8000/AddtoCart/", data);
      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert("Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return <div className={style.loading}>Loading product details...</div>;
  }

  if (!product) {
    return <div className={style.empty}>No product details found</div>;
  }

  return (
    <div className={style.page}>
      <div className={style.header}>
        <div className={style.headerLeft}>
          <div className={style.iconWrap}>
            <ShoppingBagIcon className={style.headerIcon} />
          </div>

          <div>
            <h1>Product Details</h1>
            <p>View complete information about this product</p>
          </div>
        </div>

        <button
          type="button"
          className={style.backBtn}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </button>
      </div>

      <div className={style.grid}>
        {/* Left Side */}
        <div className={style.detailsCard}>
          <div className={style.cardTitle}>
            <ShoppingBagIcon />
            <span>Basic Information</span>
          </div>

          <div className={style.detailsGrid}>
            <div className={style.detailItem}>
              <span className={style.label}>Product Name</span>
              <span className={style.value}>{product.product_name}</span>
            </div>

            <div className={style.detailItem}>
              <span className={style.label}>Amount</span>
              <span className={style.price}>₹ {product.product_amount}</span>
            </div>

            <div className={style.detailItem}>
              <span className={style.label}>Brand</span>
              <span className={style.value}>
                <StoreIcon fontSize="small" />
                {product.brand_name}
              </span>
            </div>

            <div className={style.detailItem}>
              <span className={style.label}>Category</span>
              <span className={style.value}>
                <CategoryIcon fontSize="small" />
                {product.category_name}
              </span>
            </div>

            <div className={style.detailItem}>
              <span className={style.label}>Subcategory</span>
              <span className={style.value}>{product.subcategory_name}</span>
            </div>
          </div>

          <div className={style.descriptionBlock}>
            <h3>Description</h3>
            <p>{product.product_details}</p>
          </div>

          {/* Add To Cart Button */}
          <div style={{ marginTop: "20px" }}>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={cartLoading}
              className={style.cartBtn}
            >
              <ShoppingCartIcon fontSize="small" />
              {cartLoading ? "Adding..." : "Add To Cart"}
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className={style.summaryCard}>
          <div className={style.cardTitle}>
            <WalletIcon />
            <span>Quick Summary</span>
          </div>

          <div className={style.summaryRow}>
            <span>Status</span>
            <span className={style.status}>Available</span>
          </div>

          <div className={style.summaryRow}>
            <span>Total Images</span>
            <span>{product.images ? product.images.length : 0}</span>
          </div>

          <div className={style.summaryRow}>
            <span>Category</span>
            <span>{product.category_name}</span>
          </div>

          <div className={style.summaryRow}>
            <span>Brand</span>
            <span>{product.brand_name}</span>
          </div>
        </div>
      </div>

      <div className={style.imageCard}>
        <div className={style.cardTitle}>
          <ImageIcon />
          <span>Product Images</span>
        </div>

        {product.images && product.images.length > 0 ? (
          <div className={style.imageGrid}>
            {product.images.map((img, index) => (
              <div key={index} className={style.imageItem}>
                <img src={img} alt={`product-${index}`} />
              </div>
            ))}
          </div>
        ) : (
          <div className={style.noImages}>No images available</div>
        )}
      </div>
    </div>
  );
};

export default ViewMoreProduct;