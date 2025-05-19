import React, { useState } from "react";
import "../styles/contactPageStyles.css";
import { submitContact } from "../services/contactService";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await submitContact(formData);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setIsSubmitted(false), 4000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit message");
    }
  };

  return (
    <div className="cakehub-contact-page">
      <div className="cakehub-contact-hero">
        <div className="cakehub-hero-content">
          <h1>Get in Touch</h1>
          <p>We're here to help and answer any questions you might have</p>
        </div>
      </div>

      <div className="cakehub-contact-container">
        <div className="cakehub-contact-content">
          <div className="cakehub-form-container">
            <div className="cakehub-form-header">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you soon</p>
            </div>

            {isSubmitted && (
              <div className="cakehub-success-message">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            {error && <div className="cakehub-error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="cakehub-contact-form">
              <div className="cakehub-form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your Name"
                />
              </div>

              <div className="cakehub-form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Email Address"
                />
              </div>

              <div className="cakehub-form-group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Subject"
                />
              </div>

              <div className="cakehub-form-group">
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Your Message"
                ></textarea>
              </div>

              <button type="submit" className="cakehub-submit-btn">
                Send Message
              </button>
            </form>
          </div>

          <div className="cakehub-contact-info">
            {[
              {
                title: "Email Us",
                value: "support@cakeconnect.com",
                link: "mailto:support@cakeconnect.com",
                linkText: "Send Email",
                iconPath:
                  "M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z",
              },
              {
                title: "Call Us",
                value: "+94 112 345 678",
                link: "tel:+94112345678",
                linkText: "Call Now",
                iconPath:
                  "M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z",
              },
              {
                title: "Visit Us",
                value: "123 Cake Street, Colombo, Sri Lanka",
                link: "https://maps.google.com",
                linkText: "Get Directions",
                iconPath:
                  "M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z",
              },
            ].map((info, idx) => (
              <div className="cakehub-info-card" key={idx}>
                <div className="cakehub-info-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={info.iconPath} />
                  </svg>
                </div>
                <h3>{info.title}</h3>
                <p>{info.value}</p>
                <a
                  href={info.link}
                  className="cakehub-info-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {info.linkText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
