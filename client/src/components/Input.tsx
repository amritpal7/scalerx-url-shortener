import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div>
      {label && <label className="flex flex-col gap-2 w-full">{label}</label>}
      <input
        className={`border-2 border-black px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-black ${className}`}
        {...props}
      />
    </div>
  );
}

export default Input;
