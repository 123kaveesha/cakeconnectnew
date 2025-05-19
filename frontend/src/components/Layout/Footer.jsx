import React from "react";
import { Link } from "react-router-dom";
import "../../styles/footerStyle.css";

const Footer = () => {
  return (
    <footer className="cakehub-footer">
      <div className="cakehub-footer-container">
        <div className="cakehub-footer-top">
          <div className="cakehub-footer-column">
            <h3 className="cakehub-footer-logo">
              <span className="cakehub-logo-cake">Cake</span>
              <span className="cakehub-logo-connect">Connect</span>
            </h3>
            <p className="cakehub-footer-description">
              Connecting cake lovers with talented bakers across Sri Lanka.
            </p>
            <div className="cakehub-social-links">
              <a href="#" className="cakehub-social-link" aria-label="Facebook">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a
                href="#"
                className="cakehub-social-link"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="cakehub-social-link" aria-label="Twitter">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="cakehub-footer-column">
            <h4 className="cakehub-footer-title">Quick Links</h4>
            <ul className="cakehub-footer-links">
              <li>
                <Link to="/" className="cakehub-footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="cakehub-footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/bakers" className="cakehub-footer-link">
                  Our Bakers
                </Link>
              </li>
              <li>
                <Link to="/customize" className="cakehub-footer-link">
                  Customize Cake
                </Link>
              </li>
              <li>
                <Link to="/contact" className="cakehub-footer-link">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="cakehub-footer-column">
            <h4 className="cakehub-footer-title">For Bakers</h4>
            <ul className="cakehub-footer-links">
              <li>
                <Link to="/login" className="cakehub-footer-link">
                  Join as Baker
                </Link>
              </li>
              <li>
                <Link to="/baker-resources" className="cakehub-footer-link">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/baker-support" className="cakehub-footer-link">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="cakehub-footer-link">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/terms" className="cakehub-footer-link">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="cakehub-footer-column">
            <h4 className="cakehub-footer-title">Contact Info</h4>
            <ul className="cakehub-footer-contact-info">
              <li>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>{" "}
                <span>support@cakeconnect.com</span>
              </li>
              <li>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>{" "}
                <span>+94 112 345 678</span>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>{" "}
                <span>123 Cake Street, Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="cakehub-footer-bottom">
          <div className="cakehub-footer-copyright">
            &copy; {new Date().getFullYear()} CakeConnect. All rights reserved.
          </div>
          <div className="cakehub-footer-legal-links">
            <Link to="/privacy" className="cakehub-footer-legal-link">
              Privacy Policy
            </Link>
            <Link to="/terms" className="cakehub-footer-legal-link">
              Terms of Service
            </Link>
            <Link to="/cookies" className="cakehub-footer-legal-link">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
