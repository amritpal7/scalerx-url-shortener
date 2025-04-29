import React from "react";

interface cardProps {
  heading: string;
  children?: React.ReactNode;
}

function Card({ children, heading }: cardProps) {
  return (
    <div className="w-[320px] border-4 border-black bg-white p-6 shadow-[10px_10px_0_#000] font-sans">
      <div className="flex items-center gap-4 mb-4 border-b-2 border-black pb-4">
        <div className="bg-black p-2 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 fill-white"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <h2 className="font-black text-black text-2xl uppercase">{heading}</h2>
      </div>
      {children}
    </div>
  );
}

export default Card;
