import React from "react";

const LoadingSpinner = ({
  message = "Loading...",
  fullScreen = false,
  className = "",
}) => {
  return (
    <div
      className={`${
        fullScreen ? "min-h-[70vh] p-6" : "py-12 px-4"
      } flex flex-col items-center justify-center text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="loading loading-spinner loading-lg text-[#7b1e3c]" />
      {message && (
        <p
          className={`text-slate-600 font-medium ${
            fullScreen ? "mt-4 text-base sm:text-lg" : "mt-3 text-sm sm:text-base"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
