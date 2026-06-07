import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import style from "./Product.module.css";

import {
  Inventory2 as Inventory2Icon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  SaveAlt as SaveAltIcon,
  RestartAlt as RestartAltIcon,
  Search as SearchIcon,
  Layers as LayersIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Notes as NotesIcon,
  Widgets as WidgetsIcon,
  Warehouse as WarehouseIcon,
} from "@mui/icons-material";

const Product = () => {
  const bid = sessionStorage.getItem("bid");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    product_name: "",
    product_details: "",
    product_amount: "",
    category_id: "",
    subcategory_id: "",
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadProducts(), loadCategories()]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/BrandProduct/${bid}/`);
      setProducts(res.data.data || []);
    } catch (err) {
      console.log(err);
      setProducts([]);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/Category/");
      setCategories(res.data.data || []);
    } catch (err) {
      console.log(err);
      setCategories([]);
    }
  };

  const loadSubcategories = async (cid) => {
    try {
      if (!cid) {
        setSubcategories([]);
        return;
      }

      const res = await axios.get(
        `http://127.0.0.1:8000/SubcategoryByCategory/${cid}/`
      );
      setSubcategories(res.data.data || []);
    } catch (err) {
      console.log(err);
      setSubcategories([]);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "category_id") {
      setForm((prev) => ({
        ...prev,
        category_id: value,
        subcategory_id: "",
      }));
      await loadSubcategories(value);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.product_name.trim()) {
      alert("Enter product name");
      return;
    }

    if (!form.product_amount) {
      alert("Enter product amount");
      return;
    }

    if (!form.category_id) {
      alert("Select category");
      return;
    }

    if (!form.subcategory_id) {
      alert("Select subcategory");
      return;
    }

    try {
      setSaving(true);

      if (editId) {
        await axios.put(`http://127.0.0.1:8000/UpdateProduct/${editId}/`, form);
        alert("Product updated successfully");
      } else {
        await axios.post(`http://127.0.0.1:8000/BrandProduct/${bid}/`, form);
        alert("Product added successfully");
      }

      resetForm();
      loadProducts();
    } catch (err) {
      console.log(err);
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);

    setForm({
      product_name: p.product_name || "",
      product_details: p.product_details || "",
      product_amount: p.product_amount || "",
      category_id: String(p.category_id || ""),
      subcategory_id: String(p.subcategory_id || ""),
    });

    loadSubcategories(p.category_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/DeleteProduct/${id}/`);
      alert("Product deleted successfully");
      loadProducts();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      product_name: "",
      product_details: "",
      product_amount: "",
      category_id: "",
      subcategory_id: "",
    });
    setSubcategories([]);
  };

  const handleStock = (id) => {
    navigate(`/brand/stock/${id}`);
  };
    const handleImage = (id) => {
    navigate(`/brand/productimage/${id}`);
  };

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();

    return products.filter((p) =>
      [
        p.product_name,
        p.product_details,
        p.category_name,
        p.subcategory_name,
        String(p.product_amount),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [products, search]);

  return (
    <div className={style.page}>
      {/* HEADER */}
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIconWrap}>
            <Inventory2Icon className={style.heroIcon} />
          </div>

          <div>
            <h1>Product Management</h1>
            <p>Add, edit and organize your products with category details</p>
          </div>
        </div>

        <div className={style.heroStats}>
          <div className={style.statCard}>
            <span className={style.statLabel}>Total Products</span>
            <span className={style.statValue}>{products.length}</span>
          </div>

          <div className={style.statCard}>
            <span className={style.statLabel}>Categories</span>
            <span className={style.statValue}>{categories.length}</span>
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <div className={style.formCard}>
        <div className={style.cardHeader}>
          <div>
            <h2>{editId ? "Edit Product" : "Add New Product"}</h2>
            <p>
              {editId
                ? "Update selected product information"
                : "Fill the form to add a new product"}
            </p>
          </div>

          {!editId && (
            <div className={style.badge}>
              <AddIcon fontSize="small" />
              <span>New Entry</span>
            </div>
          )}
        </div>

        <div className={style.formGrid}>
          <div className={style.field}>
            <label>Product Name</label>
            <div className={style.inputWrap}>
              <WidgetsIcon className={style.inputIcon} />
              <input
                type="text"
                name="product_name"
                value={form.product_name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </div>
          </div>

          <div className={style.field}>
            <label>Amount</label>
            <div className={style.inputWrap}>
              <CurrencyRupeeIcon className={style.inputIcon} />
              <input
                type="number"
                name="product_amount"
                value={form.product_amount}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className={`${style.field} ${style.fullWidth}`}>
            <label>Product Details</label>
            <div className={style.textareaWrap}>
              <NotesIcon className={style.textareaIcon} />
              <textarea
                name="product_details"
                value={form.product_details}
                onChange={handleChange}
                placeholder="Enter product details"
                rows="4"
              />
            </div>
          </div>

          <div className={style.field}>
            <label>Category</label>
            <div className={style.inputWrap}>
              <CategoryIcon className={style.inputIcon} />
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={style.field}>
            <label>Subcategory</label>
            <div className={style.inputWrap}>
              <LayersIcon className={style.inputIcon} />
              <select
                name="subcategory_id"
                value={form.subcategory_id}
                onChange={handleChange}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.subcategory_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={style.actionBar}>
          <button
            type="button"
            onClick={handleSave}
            className={style.primaryBtn}
            disabled={saving}
          >
            <SaveAltIcon fontSize="small" />
            {saving ? "Saving..." : editId ? "Update Product" : "Save Product"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className={style.secondaryBtn}
            >
              <RestartAltIcon fontSize="small" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST CARD */}
      <div className={style.listCard}>
        <div className={style.listTop}>
          <div>
            <h2>My Products</h2>
            <p>{filteredProducts.length} items found</p>
          </div>

          <div className={style.searchWrap}>
            <SearchIcon className={style.searchIcon} />
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className={style.emptyBox}>Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className={style.emptyBox}>No products found</div>
        ) : (
          <div className={style.tableWrap}>
            <table className={style.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Details</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((p, index) => (
                  <tr key={p.id}>
                    <td>{index + 1}</td>
                    <td className={style.nameCell}>{p.product_name}</td>
                    <td>{p.product_details || "-"}</td>
                    <td>₹ {p.product_amount}</td>
                    <td>{p.category_name}</td>
                    <td>{p.subcategory_name}</td>
                    <td>
                      <div className={style.tableActions}>
                        <button
                          type="button"
                          className={style.iconAction}
                          onClick={() => handleEdit(p)}
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </button>

                        <button
                          type="button"
                          className={`${style.iconAction} ${style.deleteBtn}`}
                          onClick={() => handleDelete(p.id)}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>

                        <button
                          type="button"
                          className={`${style.iconAction} ${style.stockBtn}`}
                          onClick={() => handleStock(p.id)}
                          title="Stock"
                        >
                          <WarehouseIcon fontSize="small" />
                        </button>
                         <button
                          type="button"
                          className={`${style.iconAction} ${style.stockBtn}`}
                          onClick={() => handleImage(p.id)}
                          title="Gallery"
                        >
                          <WarehouseIcon fontSize="small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;