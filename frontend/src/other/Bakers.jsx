import React, { useState, useRef, useEffect } from 'react';
import './Bakers.css';
import axios from 'axios';

const App = () => {
  const [cart, setCart] = useState([]);
  const [selectedBaker, setSelectedBaker] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [adminView, setAdminView] = useState('products');
  const [newBaker, setNewBaker] = useState({
    name: '',
    experience: '',
    location: '',
    specialty: '',
    rating: 0,
    photo: '/images/default-baker.jpg',
    products: [],
    email: '',
    password: ''
  });
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: 0, 
    description: '', 
    photo: '/images/default-product.jpg' 
  });
  const [showAddBakerModal, setShowAddBakerModal] = useState(false);
  const productFileInputRef = useRef(null);
  const profilePhotoInputRef = useRef(null);
  const [bakers, setBakers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch bakers from MongoDB on component mount
  useEffect(() => {
    fetchBakers();
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'manufacturer') {
      setCurrentUser(user);
    }
  }, []);

  const fetchBakers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bakers');
      setBakers(response.data);
    } catch (error) {
      console.error('Error fetching bakers:', error);
    }
  };

  // Handle image upload for products
  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct(prev => ({ ...prev, photo: imageUrl }));
    }
  };

  // Handle profile photo upload
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewBaker(prev => ({ ...prev, photo: imageUrl }));
    }
  };

  // Calculate rating based on experience
  const calculateRating = (experience) => {
    const years = parseInt(experience) || 0;
    if (years >= 15) return 4.9;
    if (years >= 10) return 4.7;
    if (years >= 5) return 4.3;
    return 4.0;
  };

  // Add new baker to MongoDB
  const addNewBaker = async (e) => {
    e.preventDefault();
    
    try {
      const yearsExp = parseInt(newBaker.experience) || 0;
      const bakerData = {
        ...newBaker,
        experience: `${yearsExp} years`,
        rating: calculateRating(yearsExp),
        role: 'manufacturer'
      };

      const response = await axios.post('http://localhost:5000/api/bakers', bakerData);
      
      setBakers([...bakers, response.data]);
      setNewBaker({
        name: '',
        experience: '',
        location: '',
        specialty: '',
        rating: 0,
        photo: '/images/default-baker.jpg',
        products: [],
        email: '',
        password: ''
      });
      setShowAddBakerModal(false);
    } catch (error) {
      console.error('Error adding baker:', error);
      alert('Failed to add baker. Please try again.');
    }
  };

  // Add product to baker in MongoDB
  const addProduct = async () => {
    if (!currentUser) return;
    
    try {
      const response = await axios.post(
        `http://localhost:5000/api/bakers/${currentUser._id}/products`,
        newProduct
      );
      
      const updatedBakers = bakers.map(baker => {
        if (baker._id === currentUser._id) {
          return response.data;
        }
        return baker;
      });
      
      setBakers(updatedBakers);
      setNewProduct({ name: '', price: 0, description: '', photo: '/images/default-product.jpg' });
      if (productFileInputRef.current) {
        productFileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Remove product from baker in MongoDB
  const removeProduct = async (productId) => {
    if (!currentUser) return;
    
    try {
      await axios.delete(
        `http://localhost:5000/api/bakers/${currentUser._id}/products/${productId}`
      );
      
      const updatedBakers = bakers.map(baker => {
        if (baker._id === currentUser._id) {
          return {
            ...baker,
            products: baker.products.filter(product => product._id !== productId)
          };
        }
        return baker;
      });
      
      setBakers(updatedBakers);
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, {...product, baker: selectedBaker.name}]);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const submitContactForm = (e) => {
    e.preventDefault();
    alert(`Message sent to ${selectedBaker.name}! They will contact you soon.`);
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Sri Lankan Baking Masters</h1>
          <p>Discover Sri Lanka's finest baking talents</p>
        </div>
        <div className="header-actions">
          {currentUser?.role === 'manufacturer' && (
            <button 
              className="add-baker-btn" 
              onClick={() => setShowAddBakerModal(true)}
            >
              Add Baker
            </button>
          )}
          <div className="user-info">
            {currentUser && (
              <span className="username">{currentUser.name || currentUser.email}</span>
            )}
            {currentUser ? (
              <button 
                className="logout-btn" 
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  setCurrentUser(null);
                }}
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="login-btn">Login</Link>
            )}
          </div>
          <div className="cart-icon" onClick={() => setSelectedBaker(null)}>
            🛒 {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </div>
        </div>
      </header>

      {showAddBakerModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Baker</h2>
            <button className="close-modal" onClick={() => setShowAddBakerModal(false)}>
              &times;
            </button>
            
            <form onSubmit={addNewBaker}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={newBaker.name}
                  onChange={(e) => setNewBaker({...newBaker, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    value={newBaker.experience}
                    onChange={(e) => setNewBaker({...newBaker, experience: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={newBaker.location}
                    onChange={(e) => setNewBaker({...newBaker, location: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Specialty</label>
                <input
                  type="text"
                  value={newBaker.specialty}
                  onChange={(e) => setNewBaker({...newBaker, specialty: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={profilePhotoInputRef}
                  onChange={handleProfilePhotoUpload}
                />
                {newBaker.photo && (
                  <div className="image-preview">
                    <img src={newBaker.photo} alt="Profile preview" />
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newBaker.email}
                  onChange={(e) => setNewBaker({...newBaker, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={newBaker.password}
                  onChange={(e) => setNewBaker({...newBaker, password: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddBakerModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Baker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {currentUser?.role === 'manufacturer' ? (
        <div className="baker-panel">
          {/* ... rest of the baker panel code remains the same ... */}
        </div>
      ) : (
        <main className="main-content">
          {/* ... rest of the main content code remains the same ... */}
        </main>
      )}

      {cart.length > 0 && (
        <div className="cart-preview">
          <h4>Your Cart ({cart.length})</h4>
          <div className="cart-items">
            {cart.slice(0, 3).map((item, index) => (
              <div key={index} className="cart-item">
                <span>{item.name}</span>
                <span>LKR {item.price}</span>
              </div>
            ))}
            {cart.length > 3 && <div className="more-items">+{cart.length - 3} more</div>}
          </div>
          <button className="view-cart-btn">View Full Cart</button>
        </div>
      )}
    </div>
  );
};

export default App;