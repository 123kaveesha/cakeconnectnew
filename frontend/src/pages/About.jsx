import React from "react";
import "../styles/aboutPageStyles.css";

const AboutUs = () => {
  return (
    <div className="cakehub-about-container">
      <section className="cakehub-about-hero">
        <div className="cakehub-hero-overlay">
          <h1>Our Sweet Story</h1>
          <p>Connecting cake lovers with talented bakers across Sri Lanka</p>
        </div>
      </section>

      <section className="cakehub-mission-section">
        <div className="cakehub-container">
          <h2>Our Mission</h2>
          <div className="cakehub-mission-content">
            <div className="cakehub-mission-text">
              <p>
                At CakeHub, we're revolutionizing the way Sri Lankans buy and
                sell cakes...
              </p>
              <p>Founded in 2024, we started with a simple idea...</p>
            </div>
            <div className="cakehub-mission-gallery">
              {[
                {
                  id: 1,
                  photo: "/images/a1.jpg",
                  alt: "Bakers preparing cake",
                },
                { id: 2, photo: "/images/a2.jpg", alt: "Cake decorating" },
                { id: 3, photo: "/images/a3.jpg", alt: "Team meeting" },
                {
                  id: 4,
                  photo: "/images/a4.jpg",
                  alt: "Customer enjoying cake",
                },
              ].map((image, index) => (
                <div
                  key={image.id}
                  className={`cakehub-gallery-image ${
                    index === 0 ? "active" : ""
                  }`}
                  style={{ backgroundImage: `url(${image.photo})` }}
                  aria-label={image.alt}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cakehub-values-section">
        <div className="cakehub-container">
          <h2>Our Core Values</h2>
          <div className="cakehub-values-grid">
            {[
              {
                icon: "fa-heart",
                title: "Quality",
                desc: "We maintain high standards...",
              },
              {
                icon: "fa-users",
                title: "Community",
                desc: "We believe in supporting local bakers...",
              },
              {
                icon: "fa-lightbulb",
                title: "Innovation",
                desc: "Our 3D customization tools...",
              },
              {
                icon: "fa-handshake",
                title: "Trust",
                desc: "Transparent ratings and secure payments...",
              },
            ].map((val, idx) => (
              <div className="cakehub-value-card" key={idx}>
                <div className="cakehub-value-icon">
                  <i className={`fas ${val.icon}`}></i>
                </div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cakehub-team-section">
        <div className="cakehub-container">
          <h2>Meet Our Team</h2>
          <p className="cakehub-team-subtitle">
            The passionate people behind CakeHub
          </p>
          <div className="cakehub-team-grid">
            {[
              {
                name: "Denuwan Perera",
                role: "Founder & CEO",
                bio: "Pastry chef turned entrepreneur...",
                img: "/images/Denu.JPG",
              },
              {
                name: "Nadeesha Perera",
                role: "Tech Lead",
                bio: "Developed our innovative platform...",
                img: "/images/team2.jpg",
              },
              {
                name: "Chamari Silva",
                role: "Marketing Director",
                bio: "Helping rural bakers establish their brands...",
                img: "/images/team3.jpg",
              },
            ].map((member, idx) => (
              <div className="cakehub-team-member" key={idx}>
                <div className="cakehub-member-image">
                  <img src={member.img} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p className="cakehub-position">{member.role}</p>
                <p className="cakehub-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cakehub-cta-section">
        <div className="cakehub-container">
          <h2>Join Our Growing Community</h2>
          <p>Whether you're a baker or a cake lover, we’d love to have you!</p>
          <div className="cakehub-cta-buttons">
            <a href="/login" className="cakehub-btn cakehub-btn-primary">
              Register as a Baker
            </a>
            <a href="/login" className="cakehub-btn cakehub-btn-secondary">
              Sign Up as Customer
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
