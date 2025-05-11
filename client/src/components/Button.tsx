import React from "react";

type props = {
  children: React.ReactNode;
  submit?: () => void;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

function Button({ children, onClick, type = "button" }: props) {
  return (
    <div className="flex items-center justify-center md:justify-end">
      <div className="relative w-[100px] h-[40px]">
        <button
          className="group relative w-full h-full flex items-center justify-center cursor-pointer bg-black text-white font-bold border-4 border-white outline-4 outline-black shadow-[6px_6px_0_#00a4ef] px-4 box-border overflow-hidden transition-all duration-100 ease-out active:translate-x-[4px] active:translate-y-[4px] active:shadow-none active:bg-amber-400 active:text-black active:border-black"
          type={type}
          onClick={onClick}
        >
          {/* Shimmer effect */}
          <span
            className="absolute top-0 left-[-100%] w-full h-full opacity-0 group-hover:opacity-100 
                     bg-gradient-to-r from-transparent via-white/80 to-transparent 
                     animate-[slide_2s_infinite] z-0"
          />

          {/* Button text */}
          <div
            className="relative z-10 flex leading-tight transition-transform duration-200 ease-out 
                     group-hover:-skew-x-[5deg] group-active:skew-x-[5deg]"
          >
            {children}
          </div>
        </button>

        {/* Keyframes for shimmer effect */}
        <style>{`
        @keyframes slide {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
      </div>
    </div>
  );
}

export default Button;
