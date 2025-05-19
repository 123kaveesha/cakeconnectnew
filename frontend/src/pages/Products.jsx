import React, { useEffect, useState } from "react";
import { fetchAllProducts, fetchProductById } from "../services/productService";
import {
  getProductReviews,
  addReview,
  deleteReview,
  updateReview,
} from "../services/reviewService";
import { addToCart } from "../services/cartService";
import { getUserFromToken, isAuthenticated } from "../utils/auth";
import "../styles/productPageStyles.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productData, setProductData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [error, setError] = useState("");

  const user = getUserFromToken();
  const isCustomer = isAuthenticated() && user?.role === "customer";

  const categories = [
    "all",
    "cake",
    "cookie",
    "cupcake",
    "bread",
    "pastry",
    "other",
  ];

  useEffect(() => {
    fetchAllProducts().then(setProducts);
  }, []);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const openPopup = async (id) => {
    setSelectedProductId(id);
    setProductData(null);
    setReviews([]);
    setError("");
    setQuantity(1);
    setLoadingProduct(true);
    setLoadingReviews(true);

    try {
      const product = await fetchProductById(id);
      setProductData(product);
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setLoadingProduct(false);
    }

    try {
      const reviewList = await getProductReviews(id);
      setReviews(reviewList);
    } catch {
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const closePopup = () => {
    setSelectedProductId(null);
    setProductData(null);
    setReviews([]);
    setError("");
  };

  const handleAddToCart = async () => {
    await addToCart(productData._id, quantity);
    alert("Added to cart");
  };

  const handleSubmitReview = async () => {
    await addReview(productData._id, newReview.rating, newReview.comment);
    const updated = await getProductReviews(productData._id);
    setReviews(updated);
    setNewReview({ rating: 5, comment: "" });
  };

  const handleDeleteReview = async (id) => {
    await deleteReview(id);
    const updated = await getProductReviews(productData._id);
    setReviews(updated);
  };

  const handleEditReview = async (id, oldComment, rating) => {
    const newComment = prompt("Edit your review:", oldComment);
    if (!newComment) return;
    await updateReview(id, rating, newComment);
    const updated = await getProductReviews(productData._id);
    setReviews(updated);
  };

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        style={{ color: i < count ? "#ffc107" : "#ccc", fontSize: "2rem" }}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="cakehub-products-page">
      <h2>Our Products</h2>

      <div className="cakehub-products-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={activeCategory === cat ? "active" : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="cakehub-products-grid">
        {filtered.map((p) => (
          <div
            key={p._id}
            className="cakehub-product-card"
            onClick={() => openPopup(p._id)}
          >
            <img src={p.imageUrl} alt={p.name} />
            <h4>{p.name}</h4>
            <p>LKR {p.price}</p>
          </div>
        ))}
      </div>

      {selectedProductId && (
        <div className="cakehub-product-popup">
          <div className="cakehub-popup-content cakehub-two-columns">
            <button className="cakehub-close-btn" onClick={closePopup}>
              ×
            </button>

            {/* Left: Product Info */}
            <div className="cakehub-product-popup-left">
              {loadingProduct ? (
                <div className="cakehub-loader">
                  <div className="cakehub-spinner" />
                </div>
              ) : error ? (
                <p>{error}</p>
              ) : (
                productData && (
                  <>
                    <img src={productData.imageUrl} alt={productData.name} />
                    <h3>{productData.name}</h3>
                    <p>{productData.description}</p>
                    <p>
                      <strong>Price:</strong> LKR {productData.price}
                    </p>
                    <p>
                      <strong>Baker:</strong> {productData.baker?.name}
                    </p>

                    <div className="cakehub-cart-actions">
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                      />
                      <button onClick={handleAddToCart}>Add to Cart</button>
                    </div>
                  </>
                )
              )}
            </div>

            {/* Right: Reviews */}
            <div className="cakehub-product-popup-right">
              <h4>Customer Reviews</h4>
              {loadingReviews ? (
                <div className="cakehub-loader">
                  <div className="cakehub-spinner" />
                </div>
              ) : (
                <>
                  {reviews.length === 0 && <p>No reviews yet.</p>}

                  {reviews
                    .filter((r) => r.customer.id !== user?.id)
                    .map((r) => (
                      <div key={r._id} className="cakehub-review-item">
                        <div>{renderStars(r.rating)}</div>
                        <p>{r.comment}</p>
                        <small>By {r.customer.name}</small>
                      </div>
                    ))}

                  {isCustomer &&
                    reviews.some((r) => r.customer.id === user?.id) && (
                      <>
                        <h5>Your Review</h5>
                        {reviews
                          .filter((r) => r.customer.id === user?.id)
                          .map((r) => (
                            <div key={r._id} className="cakehub-review-item">
                              <div>{renderStars(r.rating)}</div>
                              <p>{r.comment}</p>
                              <button
                                onClick={() =>
                                  handleEditReview(r._id, r.comment, r.rating)
                                }
                              >
                                Edit
                              </button>
                              <button onClick={() => handleDeleteReview(r._id)}>
                                Delete
                              </button>
                            </div>
                          ))}
                      </>
                    )}

                  {isCustomer &&
                    !reviews.some((r) => r.customer.id === user?.id) && (
                      <div className="cakehub-review-form">
                        <h5>Add Your Review</h5>
                        <div className="cakehub-stars">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <span
                              key={n}
                              onClick={() =>
                                setNewReview({ ...newReview, rating: n })
                              }
                              style={{
                                cursor: "pointer",
                                color:
                                  newReview.rating >= n ? "#ffc107" : "#ccc",
                                fontSize: "3rem",
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <textarea
                          placeholder="Write your review..."
                          value={newReview.comment}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              comment: e.target.value,
                            })
                          }
                        />
                        <button onClick={handleSubmitReview}>
                          Submit Review
                        </button>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
