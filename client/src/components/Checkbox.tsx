const Checkbox = () => {
  return (
    <div className="relative">
      <label
        className="group relative flex items-center justify-center w-36 h-10 text-black bg-white border border-black shadow-[2px_2px_0px_black] px-2 font-montserrat font-semibold text-[20px] cursor-pointer transition-all duration-300 hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] hover:bg-black hover:text-white hover:border-none"
        htmlFor="checkbox"
        id="themeswitch"
      >
        <input
          type="checkbox"
          id="checkbox"
          className="peer absolute opacity-0 w-0 h-0"
        />

        {/* Dynamic label text */}
        <span className="pointer-events-none">
          <span className="peer-checked:hidden mr-8">Dark Mode</span>
          <span className="hidden peer-checked:inline-block mr-7">
            Light Mode
          </span>
        </span>

        {/* Slider */}
        <div
          className="absolute ml-[6.2em] w-[25px] h-[25px] rounded-full border-4 border-[#222] bg-[#222] transition-transform duration-300 
                     shadow-[inset_0px_6px_0px_#999,inset_0px_6px_1px_1px_#999] 
                     peer-checked:rotate-[360deg] peer-checked:shadow-none 
                     peer-checked:border-[#F28C38] peer-checked:bg-[#F28C38] 
                     -rotate-[120deg]"
        />
      </label>
    </div>
  );
};

export default Checkbox;
