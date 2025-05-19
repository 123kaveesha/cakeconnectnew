import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Browse.css';

const Browse = () => {
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Cheesecake",
      category: "cakes",
      price: 500,
      description: "Indulge in the creamy, dreamy bliss of our cheesecakes. A perfect blend of tangy cheese and sweet flavors, topped with your choice of delicious fruit or decadent sauces. From classic New York-style to inventive flavor combinations, there's a cheesecake for every craving.",
      photo: "/images/8.jpg",
      rating: 4.8
    },
    {
      id: 2,
      name: "Red Velvet Cake",
      category: "cakes",
      price: 750,
      description: "Classic red velvet with cream cheese frosting",
      photo: "/images/redvelvet.jpg",
      rating: 4.9
    },
    {
      id: 3,
      name: "Artisan Sourdough",
      category: "bakery",
      price: 600,
      description: "Handcrafted using traditional methods, our artisan sourdough offers a rich, tangy flavor with a perfectly crisp crust. Naturally fermented for depth and texture, it's a wholesome, delicious choice for any meal.",
      photo: "/images/sourdough.jpg",
      rating: 4.7
    },
    {
      id: 4,
      name: "Croissants (6pk)",
      category: "bakery",
      price: 900,
      description: "Buttery French croissants with flaky layers",
      photo: "/images/croissant.jpg",
      rating: 4.6
    },
    {
      id: 5,
      name: "Vanilla Cupcakes (12pk)",
      category: "cakes",
      price: 2500,
      description: "Moist vanilla cupcakes with buttercream frosting",
      photo: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400",
      rating: 4.5
    },
    {
      id: 6,
      name: "Whole Grain Bread",
      category: "bakery",
      price: 900,
      description: "Healthy whole grain bread with seeds",
      photo: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400",
      rating: 4.4
    },
    {
      id: 7,
      name: "Butter Cake (1Kg)",
      category: "cakes",
      price: 1000,
      description: "Rich and moist butter cake made with premium ingredients",
      photo: "/images/9.jpg",
      rating: 4.4
    }
  ];

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const addToCart = (product) => {
    const quantity = parseInt(document.querySelector('.quantity-selector select')?.value || 1);
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    let updatedCart;

    if (existingItemIndex >= 0) {
      updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      updatedCart = [...cart, { ...product, quantity }];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setSelectedProduct(null);
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="products-page">
      {/* Header */}
      <header className="products-header">
        <h1>Our Cake & Bakery Collection</h1>
        <p>Premium quality baked goods made with love</p>
      </header>

      {/* Category Filter */}
      <div className="category-filter">
        <button 
          className={activeCategory === 'all' ? 'active' : ''}
          onClick={() => setActiveCategory('all')}
        >
          All Products
        </button>
        <button 
          className={activeCategory === 'cakes' ? 'active' : ''}
          onClick={() => setActiveCategory('cakes')}
        >
          Cakes
        </button>
        <button 
          className={activeCategory === 'bakery' ? 'active' : ''}
          onClick={() => setActiveCategory('bakery')}
        >
          Bakery Items
        </button>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="product-image">
              <img src={product.photo} alt={product.name} />
              <span className="category-badge">
                {product.category === 'cakes' ? 'Cake' : 'Bakery'}
              </span>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <div className="rating">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
                <span>({product.rating})</span>
              </div>
              <p className="price">LKR {product.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="product-modal">
          <div className="modal-content">
            <button 
              className="close-modal"
              onClick={() => setSelectedProduct(null)}
            >
              &times;
            </button>
            
            <div className="modal-image">
              <img src={selectedProduct.photo} alt={selectedProduct.name} />
            </div>
            
            <div className="modal-details">
              <h2>{selectedProduct.name}</h2>
              <div className="category-price">
                <span className="category">
                  {selectedProduct.category === 'cakes' ? 'Cake' : 'Bakery Item'}
                </span>
                <span className="price">LKR {selectedProduct.price.toLocaleString()}</span>
              </div>
              
              <div className="rating">
                {'★'.repeat(Math.floor(selectedProduct.rating))}
                {'☆'.repeat(5 - Math.floor(selectedProduct.rating))}
                <span>({selectedProduct.rating})</span>
              </div>
              
              <p className="description">{selectedProduct.description}</p>
              
              <div className="quantity-selector">
                <label>Quantity:</label>
                <select defaultValue="1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="add-to-cart-btn"
                onClick={() => addToCart(selectedProduct)}
              >
                Add to Cart
              </button>
              
              <Link to="/cart" className="buy-now-btn">
                Proceed to Payment
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Cart Preview */}
      {cart.length > 0 && (
        <div className="cart-preview">
          <Link to="/cart" className="cart-preview-link">
            🛒 {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
          </Link>
        </div>
      )}
    </div>
  );
};

export default Browse;