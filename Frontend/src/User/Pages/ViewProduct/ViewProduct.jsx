import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import style from "./ViewProduct.module.css";

import {
  Search as SearchIcon,
  FilterAlt as FilterAltIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  Inventory2 as Inventory2Icon,
  RestartAlt as RestartAltIcon,
} from "@mui/icons-material";

const ViewProduct = () => {
  const uid = sessionStorage.getItem("uid");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [searchName, setSearchName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const [cartLoadingId, setCartLoadingId] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productRes, categoryRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/AllProduct/"),
        axios.get("http://127.0.0.1:8000/Category/"),
      ]);

      setProducts(productRes.data.data || []);
      setCategories(categoryRes.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategories = async (cid) => {
    if (!cid) {
      setSubcategories([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/SubcategoryByCategory/${cid}/`
      );
      setSubcategories(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCategoryChange = (e) => {
    const cid = e.target.value;
    setCategoryId(cid);
    setSubcategoryId("");
    loadSubcategories(cid);
  };

  const handleResetFilters = () => {
    setSearchName("");
    setCategoryId("");
    setSubcategoryId("");
    setMinAmount("");
    setMaxAmount("");
    setSubcategories([]);
  };

  const handleSave = async (id) => {
    try {
      setCartLoadingId(id);

      const data = {
        productid: id,
        userid: uid,
      };

      const res = await axios.post("http://127.0.0.1:8000/AddtoCart/", data);
      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert("Failed to add to cart");
    } finally {
      setCartLoadingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const nameMatch = (p.product_name || "")
        .toLowerCase()
        .includes(searchName.toLowerCase());

      const categoryMatch = categoryId
        ? String(p.category_id) === String(categoryId)
        : true;

      const subcategoryMatch = subcategoryId
        ? String(p.subcategory_id) === String(subcategoryId)
        : true;

      const amount = parseFloat(p.product_amount || 0);

      const minMatch =
        minAmount !== "" ? amount >= parseFloat(minAmount || 0) : true;
      const maxMatch =
        maxAmount !== "" ? amount <= parseFloat(maxAmount || 0) : true;

      return (
        nameMatch && categoryMatch && subcategoryMatch && minMatch && maxMatch
      );
    });
  }, [products, searchName, categoryId, subcategoryId, minAmount, maxAmount]);

  return (
    <div className={style.page}>
      {/* Header */}
      <div className={style.header}>
        <div className={style.headerLeft}>
          <div className={style.headerIconBox}>
            <Inventory2Icon className={style.headerIcon} />
          </div>

          <div>
            <h1 className={style.title}>View Products</h1>
            <p className={style.subtitle}>
              Browse, filter and add products to cart
            </p>
          </div>
        </div>

        <div className={style.statsCard}>
          <span className={style.statsLabel}>Available Products</span>
          <h3 className={style.statsValue}>{filteredProducts.length}</h3>
        </div>
      </div>

      {/* Filter Section */}
      <div className={style.filterCard}>
        <div className={style.filterTitleRow}>
          <div className={style.filterTitleLeft}>
            <FilterAltIcon />
            <h3>Filter Products</h3>
          </div>

          <button
            type="button"
            className={style.resetBtn}
            onClick={handleResetFilters}
          >
            <RestartAltIcon fontSize="small" />
            Reset
          </button>
        </div>

        <div className={style.filterGrid}>
          <div className={style.inputGroup}>
            <label>Search Product</label>
            <div className={style.searchBox}>
              <SearchIcon className={style.searchIcon} />
              <input
                type="text"
                placeholder="Search by product name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
          </div>

          <div className={style.inputGroup}>
            <label>Category</label>
            <select value={categoryId} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className={style.inputGroup}>
            <label>Subcategory</label>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
            >
              <option value="">All Subcategories</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subcategory_name}
                </option>
              ))}
            </select>
          </div>

          <div className={style.inputGroup}>
            <label>Min Amount</label>
            <input
              type="number"
              placeholder="Enter min amount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </div>

          <div className={style.inputGroup}>
            <label>Max Amount</label>
            <input
              type="number"
              placeholder="Enter max amount"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className={style.tableCard}>
        <div className={style.tableHeader}>
          <h3>Product List</h3>
          <span>{filteredProducts.length} items found</span>
        </div>

        {loading ? (
          <div className={style.loadingBox}>Loading products...</div>
        ) : filteredProducts.length > 0 ? (
          <div className={style.productGrid}>
            {filteredProducts.map((p) => (
              <div key={p.id} className={style.productCard}>
                <div className={style.imageWrap}>
                  {p.image ? (
                    <img
                      src={`http://127.0.0.1:8000${p.image}`}
                      alt={p.product_name}
                      className={style.productImage}
                    />
                  ) : (
                    <div className={style.noImage}>No Image</div>
                  )}
                </div>

                <div className={style.productBody}>
                  <div className={style.topRow}>
                    <h4 className={style.productName}>{p.product_name}</h4>
                    <span className={style.price}>₹{p.product_amount}</span>
                  </div>

                  <p className={style.details}>
                    {p.product_details || "No details available"}
                  </p>

                  <div className={style.metaGrid}>
                    <div className={style.metaItem}>
                      <span className={style.metaLabel}>Category</span>
                      <span className={style.metaValue}>{p.category_name}</span>
                    </div>

                    <div className={style.metaItem}>
                      <span className={style.metaLabel}>Subcategory</span>
                      <span className={style.metaValue}>
                        {p.subcategory_name}
                      </span>
                    </div>

                    <div className={style.metaItem}>
                      <span className={style.metaLabel}>Brand</span>
                      <span className={style.metaValue}>{p.brand_name}</span>
                    </div>
                  </div>

                  <div className={style.actionRow}>
                    <button
                      type="button"
                      className={style.cartBtn}
                      onClick={() => handleSave(p.id)}
                      disabled={cartLoadingId === p.id}
                    >
                      <ShoppingCartIcon fontSize="small" />
                      {cartLoadingId === p.id ? "Adding..." : "Add To Cart"}
                    </button>

                    <Link
                      to={`/user/viewmore/${p.id}`}
                      className={style.viewBtn}
                    >
                      <VisibilityIcon fontSize="small" />
                      View More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={style.emptyBox}>No products found</div>
        )}
      </div>
    </div>
  );
};

export default ViewProduct;