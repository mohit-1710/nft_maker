import React from "react";
import AppBar from "./AppBar";
import Img from "../../../public/c256070a64879df00eb10d3a19fe7c78.jpg";

const HeroSection = () => {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#050810] to-[#0a0f1e] overflow-hidden">
      <div className="relative max-w-[2560px] mx-auto h-screen flex">
        {/* Left Section - 60% */}
        <div className="w-[60%] flex flex-col justify-between p-12 lg:p-16 xl:p-20">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <AppBar />
          </div>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center space-y-8 lg:space-y-12 max-w-3xl">
            <div className="space-y-2">
              <h2 className="text-[clamp(2rem,8vw,10rem)] font-black leading-[0.9] tracking-tighter text-white">
                DESIGN
              </h2>
              <h2 className="text-[clamp(2rem,8vw,10rem)] font-black leading-[0.9] tracking-tighter text-white">
                GENERATE
              </h2>
              <h2 className="text-[clamp(2rem,8vw,10rem)] font-black leading-[0.9] tracking-tighter text-[#ae0bef] relative">
                LAUNCH
              </h2>
            </div>

            <p className="text-[#6b7280] text-lg lg:text-xl max-w-xl leading-relaxed">
              Where wild ideas mint into reality. Design, generate, and launch
              NFTs — and tokens — on Solana in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#6d28d9] via-[#8b5cf6] to-[#a855f7] hover:from-[#8b5cf6] hover:via-[#a855f7] hover:to-[#c084fc] text-white font-semibold tracking-wide shadow-lg shadow-purple-500/30 border border-purple-400/30 transition-all duration-300 transform hover:scale-105 cursor-pointer hover:shadow-purple-400/50"
                onClick={() => (window.location.href = "/create-nft")}
              >
                Start Creating
              </button>
              <button
                className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition transform hover:scale-105 cursor-pointer font-semibold text-white"
                onClick={() => (window.location.href = "/mint/token")}
              >
                Mint Token
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - 40% */}
        <div className="w-[40%] relative overflow-hidden rounded-4xl m-4">
          {/* Image Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(./c256070a64879df00eb10d3a19fe7c78.jpg)`,
            }}
          ></div>

          {/* Optional overlay for readability */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Bottom Left Card */}
          {/* Bottom Left Card */}
          {/* Left Card */}
          <div className="absolute bottom-16 left-8 w-64">
            <div className="rounded-xl bg-black/40 backdrop-blur-md border border-purple-500/40 p-4 shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all">
              <h3 className="text-lg font-semibold text-white">
                ⚡ 99% Uptime
              </h3>
              <p className="text-sm text-purple-200 mt-1">
                Zero lag. Always live.
              </p>
            </div>
          </div>

          {/* Right Card */}
          <div className="absolute bottom-16 right-8 w-64">
            <div className="rounded-xl bg-black/40 backdrop-blur-md border border-cyan-400/40 p-4 shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all">
              <h3 className="text-lg font-semibold text-white">
                💠 0.000 SOL Fee
              </h3>
              <p className="text-sm text-cyan-200 mt-1">
                Batch mints. Lightning-fast.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(45deg);
          }
          50% {
            transform: translateY(-20px) rotate(45deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
