import React from "react";

export function InputPro({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        bg-gray-900
        border border-gray-700
        focus:border-yellow-400
        focus:ring-2 focus:ring-yellow-400/30
        p-3
        rounded-xl
        outline-none
        transition
        text-white
      "
    />
  );
}
