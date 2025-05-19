import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/homePageStyles.css";
import CakeTemplateGallery from "../components/CakeTemplateGallery";

const HomePage = () => {
  const navigate = useNavigate();

  const handleEditTemplate = (layers) => {
    localStorage.setItem("templateLayers", JSON.stringify(layers));
    navigate("/cakedesign");
  };

  return (
    <div className="cakehub-home-page">
      {/* Hero Section */}
      <section className="cakehub-home-hero">
        <div className="cakehub-home-container">
          <div className="cakehub-home-hero-content">
            <h1>Discover & Customize Perfect Cakes</h1>
            <p>Connecting you with talented bakers across the country</p>
            <div className="cakehub-home-cta-buttons">
              <Link to="/cakedesign" className="cakehub-home-primary-btn">
                Design Your Cake
              </Link>
              <Link to="/products" className="cakehub-home-secondary-btn">
                Browse Products
              </Link>
              <Link to="/bakers" className="cakehub-home-secondary-btn">
                Bakers
              </Link>
            </div>
          </div>
          <div className="cakehub-home-hero-gallery">
            {[
              { id: 1, photo: "/images/hero2.jpg", alt: "Wedding Cake Design" },
              {
                id: 2,
                photo: "/images/hero1.jpg",
                alt: "Birthday Cake Design",
              },
              { id: 3, photo: "/images/hero3.jpg", alt: "Anniversary Cake" },
              { id: 4, photo: "/images/hero4.jpg", alt: "Custom Fondant Cake" },
            ].map((image, index) => (
              <div
                key={image.id}
                className={`cakehub-home-hero-image ${
                  index === 0 ? "active" : ""
                }`}
                style={{ backgroundImage: `url(${image.photo})` }}
                aria-label={image.alt}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="cakehub-home-features">
        <div className="cakehub-home-container">
          <h2>Why Choose CakeConnect?</h2>
          <div className="cakehub-home-features-grid">
            {[
              {
                icon: "🎂",
                title: "Custom Designs",
                desc: "Create your dream cake with our 3D customization tool",
              },
              {
                icon: "📍",
                title: "Local Bakers",
                desc: "Connect with talented bakers in your area",
              },
              {
                icon: "👩‍🍳",
                title: "Verified Experts",
                desc: "Choose from certified and experienced cake makers",
              },
              {
                icon: "🚚",
                title: "Reliable Delivery",
                desc: "Fresh cakes delivered to your doorstep",
              },
            ].map((feature, index) => (
              <div className="cakehub-home-feature-card" key={index}>
                <div className="cakehub-home-feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cake Template Gallery */}
      <CakeTemplateGallery onSelect={handleEditTemplate} />

      {/* CTA Section */}
      <section className="cakehub-home-cta-section">
        <div className="cakehub-home-container">
          <h2>Ready to Create Your Perfect Cake?</h2>
          <p>Start designing now or browse our baker collections</p>
          <div className="cakehub-home-cta-buttons">
            <Link to="/cakedesign" className="cakehub-home-primary-btn">
              Start Designing
            </Link>
            <Link to="/bakers" className="cakehub-home-secondary-btn">
              Find a Baker
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
