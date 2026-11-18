import React from "react";
import { Outlet, useNavigation } from "react-router";
import Navbar from "../pages/Shared/Navbar";
import Footer from "../pages/Shared/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SmoothScroll from "../components/SmoothScroll";
import LoadingSpinner from "../components/LoadingSpinner";

const RootLayout = () => {
  const navigation = useNavigation();
  const isRouteLoading = navigation.state === "loading";

  return (
    <div className="min-h-screen flex flex-col" data-theme="light">
      <SmoothScroll />
      <Navbar />
      <main className="flex-1">
        {isRouteLoading ? (
          <LoadingSpinner fullScreen message="Loading page..." />
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light" // Change toast theme to light as well
      />
    </div>
  );
};

export default RootLayout;