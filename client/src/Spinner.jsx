import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center my-1">
      <div className="w-7 h-7 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
