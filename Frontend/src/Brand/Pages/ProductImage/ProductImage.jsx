import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import style from "./ProductImage.module.css";

import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const ProductImage = () => {
  const { pid } = useParams();

  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, [pid]);

  const loadImages = () => {
    setLoading(true);

    axios
      .get(`http://127.0.0.1:8000/ProductImages/${pid}/`)
      .then((res) => setImages(res.data.data || []))
      .catch((err) => {
        console.log(err);
        alert("Failed to load images");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Select image");
      return;
    }

    const formData = new FormData();
    formData.append("product_id", pid);
    formData.append("image", file);

    try {
      setUploading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/AddProductImage/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message);
      setFile(null);
      loadImages();

      const input = document.getElementById("product-image-input");
      if (input) input.value = "";
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/DeleteProductImage/${id}/`
      );

      alert(res.data.message);
      loadImages();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className={style.page}>
      <div className={style.header}>
        <div className={style.headerLeft}>
          <div className={style.headerIconWrap}>
            <CollectionsOutlinedIcon className={style.headerIcon} />
          </div>

          <div>
            <h1>Product Images</h1>
            <p>Upload, manage, and delete gallery images for this product</p>
          </div>
        </div>

        <div className={style.headerStats}>
          <div className={style.statCard}>
            <span>Total Images</span>
            <strong>{images.length}</strong>
          </div>

          <div className={style.statCard}>
            <span>Product ID</span>
            <strong>#{pid}</strong>
          </div>
        </div>
      </div>

      <div className={style.uploadCard}>
        <div className={style.sectionTitle}>
          <CloudUploadOutlinedIcon />
          <span>Upload New Image</span>
        </div>

        <div className={style.uploadRow}>
          <label htmlFor="product-image-input" className={style.fileInputLabel}>
            <ImageOutlinedIcon fontSize="small" />
            <span>{file ? file.name : "Choose image file"}</span>
          </label>

          <input
            id="product-image-input"
            type="file"
            accept="image/*"
            className={style.fileInput}
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            type="button"
            className={style.uploadBtn}
            onClick={handleUpload}
            disabled={uploading}
          >
            <CloudUploadOutlinedIcon fontSize="small" />
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className={style.loadingBox}>Loading images...</div>
      ) : images.length === 0 ? (
        <div className={style.emptyState}>
          <Inventory2OutlinedIcon className={style.emptyIcon} />
          <h3>No images found</h3>
          <p>Upload product images to create a better gallery view.</p>
        </div>
      ) : (
        <div className={style.grid}>
          {images.map((img, index) => (
            <div key={img.id} className={style.imageCard}>
              <div className={style.imageWrap}>
                <img
                  src={img.image}
                  alt={`product-${index + 1}`}
                  className={style.image}
                />
              </div>

              <div className={style.cardBody}>
                <div className={style.imageMeta}>
                  <span className={style.imageLabel}>Image #{index + 1}</span>
                  <span className={style.imageId}>ID: {img.id}</span>
                </div>

                <button
                  type="button"
                  className={style.deleteBtn}
                  onClick={() => handleDelete(img.id)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImage;