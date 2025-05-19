import React, { useEffect, useState } from "react";
import {
  getMyProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProductById,
} from "../services/productService";
import { getProductReviews } from "../services/reviewService";
import "../styles/myProductsStyles.css";

const categoryOptions = ["cake", "bakery"];
const subcategoryOptions = ["cupcake", "cookie", "bread", "pastry", "other"];

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [popupProduct, setPopupProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);

  const [formProduct, setFormProduct] = useState({
    _id: "",
    name: "",
    price: "",
    description: "",
    category: "cake",
    subcategory: "other",
    image: null,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getMyProducts();
      setProducts(data);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenPopup = async (productId) => {
    setPopupProduct(null);
    setReviews([]);
    setLoading(true);
    const product = await fetchProductById(productId);
    const reviewList = await getProductReviews(productId);
    setPopupProduct(product);
    setReviews(reviewList);
    setLoading(false);
  };

  const handleClosePopup = () => {
    setPopupProduct(null);
    setReviews([]);
  };

  const handleOpenFormPopup = () => {
    setFormProduct({
      _id: "",
      name: "",
      price: "",
      description: "",
      category: "cake",
      subcategory: "other",
      image: null,
    });
    setIsEditing(false);
    setShowFormPopup(true);
  };

  const handleEdit = (product) => {
    setFormProduct({
      _id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      image: null,
    });
    setIsEditing(true);
    setShowFormPopup(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (!confirm) return;

    setLoading(true);
    await deleteProduct(id);
    await loadProducts();
    setLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    
    Object.entries(formProduct).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      if (isEditing) {
        await updateProduct(formProduct._id, data);
      } else {
        await addProduct(data);
      }
      await loadProducts();
      setShowFormPopup(false);
    } catch {
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-products-page">
      <div className="my-products-header">
        <h2>My Products</h2>
        <button className="add-product-btn" onClick={handleOpenFormPopup}>+ Add Product</button>
      </div>

      {loading && <div className="spinner" />}

      {!loading && products.length === 0 && (
        <div className="no-products">
          <img src="/images/empty-box.svg" alt="No Products" />
          <p>No products yet. Add your first product!</p>
        </div>
      )}

      <div className="my-products-grid">
        {products.map((p) => (
          <div key={p._id} className="my-product-card">
            <img src={p.imageUrl} alt={p.name} />
            <h4>{p.name}</h4>
            <p>LKR {p.price}</p>
            <div className="my-product-actions">
              <button onClick={() => handleOpenPopup(p._id)}>View</button>
              <button onClick={() => handleEdit(p)}>Edit</button>
              <button onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {popupProduct && (
        <div className="my-product-popup">
          <div className="popup-content">
            <button className="close-btn" onClick={handleClosePopup}>×</button>
            <img src={popupProduct.imageUrl} alt={popupProduct.name} />
            <h3>{popupProduct.name}</h3>
            <p>{popupProduct.description}</p>
            <p><strong>Category:</strong> {popupProduct.category} / {popupProduct.subcategory}</p>
            <h4>Reviews</h4>
            {reviews.length === 0 ? (
              <p>No reviews yet</p>
            ) : (
              <ul className="review-list">
                {reviews.map((r) => (
                  <li key={r._id}><strong>{r.rating} ★</strong> - {r.comment}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {showFormPopup && (
        <div className="my-product-popup">
          <div className="popup-content form-popup">
            <button className="close-btn" onClick={() => setShowFormPopup(false)}>×</button>
            <h3>{isEditing ? "Update Product" : "Add Product"}</h3>
            <form onSubmit={handleFormSubmit}>
              <input name="name" value={formProduct.name} onChange={handleFormChange} placeholder="Product Name" required />
              <input name="price" type="number" value={formProduct.price} onChange={handleFormChange} placeholder="Price" required />
              <select name="category" value={formProduct.category} onChange={handleFormChange} required>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select name="subcategory" value={formProduct.subcategory} onChange={handleFormChange} required>
                {subcategoryOptions.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              <textarea name="description" value={formProduct.description} onChange={handleFormChange} placeholder="Description" />
              <input type="file" onChange={handleImageChange} />
              <button type="submit" disabled={loading}>{loading ? "Saving..." : isEditing ? "Update" : "Add"} Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;
