import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../../styles/baseLayoutStyle.css";

const BaseLayout = ({ children, showFooter = true }) => {
  return (
    <div className="cakehub-layout-container">
      <Navbar />
      <main className="cakehub-layout-main">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default BaseLayout;