import { useNavigate } from "react-router-dom";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function DisplayTokenCard({ tokens }) {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isIdle, setIsIdle] = useState(false);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Sync fullscreen state if user presses Esc or leaves FS
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  // Idle detection (controls + cursor)
  useEffect(() => {
    let timeout;
    const handleActivity = () => {
      setShowControls(true);
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
        setIsIdle(true);
      }, 5000);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    handleActivity();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, []);

  // Keyboard shortcuts for fullscreen
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Compute tokens safely AFTER hooks
  const currentToken = tokens?.find((t) => t.status === "waiting");
  const remainingTokens = tokens
    ?.filter((t) => t.status === "waiting" && t._id !== currentToken?._id)
    .sort((a, b) => a.tokenNumber - b.tokenNumber)
    .slice(0, 8);

  return (
    <div
      className={`flex flex-col font-nato min-h-screen bg-teal-500 text-gray-800 ${
        isIdle ? "cursor-none" : "cursor-auto"
      }`}
    >
      {/* If no tokens */}
      {!tokens || tokens.length === 0 ? (
        <div className="flex-grow flex justify-center items-center">
          <div className="text-center p-6 bg-gray-100 rounded-lg shadow">
            <p className="text-2xl font-bold">No tokens currently</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="flex items-center justify-between py-6 px-6 bg-teal-500 text-white shadow-xs">
            <button
              onClick={() => navigate("/dashboard")}
              className={`flex items-center group space-x-2 transition-opacity duration-500 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <ArrowLeft className="text-white/90"/>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Back
              </span>
            </button>

            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Token Queue
              </h1>
              <p className="mt-1 text-lg md:text-xl font-light opacity-90">
                Live status for patients
              </p>
            </div>

            <button
              onClick={toggleFullscreen}
              className={`transition-opacity duration-500 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              {isFullscreen ? <Minimize2 /> : <Maximize2 />}
            </button>
          </header>

          {/* Main Content */}
          <div className="flex-grow flex justify-center items-center py-10 px-4">
            <main className="container max-w-6xl flex flex-col lg:flex-row gap-10 lg:gap-16">
              {/* Current Token */}
              {currentToken && (
                <div className="flex-1 flex justify-center">
                  <div
                    className="relative w-full max-w-lg rounded-3xl shadow-2xl p-8 md:p-12 text-center
                              bg-cyan-600/80 backdrop-blur-lg border border-white/30"
                  >
                    <p className="text-xl md:text-2xl font-medium text-white opacity-80 mb-2">
                      Next
                    </p>
                    <div className="text-[100px] md:text-[14rem] font-black text-white drop-shadow-lg leading-none">
                      {currentToken.tokenNumber}
                    </div>
                    <div className="text-3xl md:text-4xl font-semibold text-white mt-4 opacity-90">
                      {currentToken.name || "Anonymous"}
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming Tokens + Total */}
              <div className="flex-1 flex flex-col justify-start gap-8 lg:gap-12">
                {remainingTokens?.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <h3 className="text-3xl font-bold text-teal-800 mb-4 text-center">
                      Upcoming
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
                      {remainingTokens.map((t) => (
                        <div
                          key={t._id}
                          className="relative w-full text-center py-3 bg-gray-200 text-xl font-bold text-gray-700 rounded-xl transition-all duration-300 hover:bg-gray-300 group"
                        >
                          {t.tokenNumber}
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 text-sm bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {t.name || "Anonymous"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
                  <p className="text-xl md:text-2xl font-medium text-teal-800">
                    Total Waiting Patients
                  </p>
                  <p className="text-5xl md:text-6xl font-extrabold text-teal-600 mt-2">
                    {tokens.filter((t) => t.status === "waiting").length}
                  </p>
                </div>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}
