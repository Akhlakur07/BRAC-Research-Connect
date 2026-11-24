import React, { useContext, useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import ThesisWorkflow from "./ThesisWorkflow";
import RecentFAQs from "./RecentFAQs";
import Seacrh from "./Search";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Home = () => {
  const { loading: authLoading } = useContext(AuthContext);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/faqs`)
      .catch(() => {})
      .finally(() => {
        if (active) setBooting(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (authLoading || booting) {
    return (
      <LoadingSpinner
        fullScreen
        message="Loading BRACU Research Connect..."
      />
    );
  }

  return (
    <div>
      <HeroSection />
      <Seacrh />
      <ThesisWorkflow />
      <RecentFAQs />
    </div>
  );
};

export default Home;