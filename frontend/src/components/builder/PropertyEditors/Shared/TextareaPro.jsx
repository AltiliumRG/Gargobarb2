import React from "react";

export function TextareaPro({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
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
        resize-none
        text-white
      "
    />
  );
}
