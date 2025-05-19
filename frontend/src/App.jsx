// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import BaseLayout from "./components/Layout/BaseLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Products from "./pages/Products";

import BakerDirectoryPage from "./pages/BakerDirectoryPage";
import BakerDashboard from "./pages/BakerDashboard";
import AdminPanel from "./pages/AdminPanel";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import MyProductsPage from "./pages/MyProductsPage";
import AdminContactMessages from "./pages/AdminContactMessages";
import CakeDesigner from "./pages/CakeDesigner";
import ScrollToTop from "./utils/ScrollToTop";
import CakeRequestPage from "./pages/CakeRequestPage";
import BakerCakeRequestsPage from "./pages/BakerCakeRequestsPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <BaseLayout showFooter={false}>
                <Login />
              </BaseLayout>
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <BaseLayout showFooter={false}>
                <Register />
              </BaseLayout>
            </PublicRoute>
          }
        />

        {/* Protected Routes  */}

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BaseLayout>
                <Home />
              </BaseLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BaseLayout>
                <Cart />
              </BaseLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BaseLayout>
                <Products />
              </BaseLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BaseLayout>
                <PaymentPage />
              </BaseLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cakedesign"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BaseLayout>
                <CakeDesigner />
              </BaseLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cake-request"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BaseLayout>
                <CakeRequestPage />
              </BaseLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BaseLayout>
                <MyOrdersPage />
              </BaseLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bkdashboard"
          element={
            <ProtectedRoute allowedRoles={["baker"]}>
              <BaseLayout>
                <BakerDashboard />
              </BaseLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/myproducts"
          element={
            <ProtectedRoute allowedRoles={["baker"]}>
              <BaseLayout>
                <MyProductsPage />
              </BaseLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bcrequests"
          element={
            <ProtectedRoute allowedRoles={["baker"]}>
              <BaseLayout>
                <BakerCakeRequestsPage />
              </BaseLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bakers"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <BaseLayout>
                <BakerDirectoryPage />
              </BaseLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/adminpanel"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BaseLayout>
                <AdminPanel />
              </BaseLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admincontact"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BaseLayout>
                <AdminContactMessages />
              </BaseLayout>
            </ProtectedRoute>
          }
        />

        {/* Not Found */}
        <Route
          path="/notfound"
          element={
            <BaseLayout>
              <NotFoundPage />
            </BaseLayout>
          }
        />

        <Route
          path="/about"
          element={
            <BaseLayout>
              <About />
            </BaseLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <BaseLayout>
              <Contact />
            </BaseLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <BaseLayout>
              <ProfilePage />
            </BaseLayout>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/notfound" replace />} />
      </Routes>
    </>
  );
}

export default App;

// <Route path="/gg" element={<Home />} />
// <Route path="/about" element={<About />} />
// <Route path="/contact" element={<Contact />} /> {/* 🆕 Contact route */}
// <Route path="/checkout" element={<Checkout />} />
// <Route path="/products" element={<Products />} />
// {/* <Route path="/customize" element={<Customize/>} /> */}
// <Route path="/bakers" element={<Bakers />} />
// <Route path="/browse" element={<Browse />} />
// <Route path="/cart" element={<Cart />} />
// <Route path="/cakemaker" element={<Cakemaker />} />
