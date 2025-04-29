// components/Loader.tsx
const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
      <div className="w-24 h-24 rounded-full border-4 border-black animate-colorShift [perspective:1000px] flex justify-center items-center">
        <div className="flex justify-center items-center animate-revolve transform rotate-x-90 [transform-style:preserve-3d] relative">
          {/* Front */}
          <div className="side front translate-z-6">
            <div className="dot" />
          </div>

          {/* Back */}
          <div className="side back -translate-z-6">
            <div className="dotContainer rotate--45">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
          </div>

          {/* Left */}
          <div className="side left rotate-y-90 translate-z-6">
            <div className="dotContainer rotate-45">
              <div className="dot" />
              <div className="dot" />
            </div>
          </div>

          {/* Right */}
          <div className="side right rotate-y-90 -translate-z-6">
            <div className="dotContainer flex-col justify-around h-full">
              <div className="subDotContainer">
                <div className="dot" />
                <div className="dot" />
              </div>
              <div className="subDotContainer">
                <div className="dot" />
                <div className="dot" />
              </div>
            </div>
          </div>

          {/* Top */}
          <div className="side top -translate-y-6 rotate-x-90">
            <div className="dotContainer flex-col justify-around h-full">
              <div className="subDotContainer">
                <div className="dot" />
                <div className="dot" />
              </div>
              <div className="subDotContainer">
                <div className="dot" />
              </div>
              <div className="subDotContainer">
                <div className="dot" />
                <div className="dot" />
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="side bottom translate-y-6 rotate-x-90">
            <div className="dotContainer flex-col justify-around h-full">
              <div className="subDotContainer">
                <div className="dot" />
                <div className="dot" />
              </div>
              <div className="subDotContainer">
                <div className="dot" />
                <div className="dot" />
              </div>
              <div className="subDotContainer">
                <div className="dot" />
                <div className="dot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
