import React from "react";
import AppBar from "./AppBar";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* AppBar positioned at the top */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="flex justify-end p-6">
          <AppBar />
        </div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="./f4c556c4da8b3620c7bb583c5baba56b.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => {
          const styles = [
            {
              duration: 7.516,
              delay: 3.784,
              top: "35.08%",
              left: "4.47%",
              tx: 286.83,
              ty: 94.0,
            },
            {
              duration: 12.567,
              delay: 0.971,
              top: "76.54%",
              left: "95.99%",
              tx: -289.73,
              ty: -167.18,
            },
            {
              duration: 8.83,
              delay: 4.044,
              top: "84.23%",
              left: "30.09%",
              tx: 125.45,
              ty: -215.65,
            },
            {
              duration: 13.126,
              delay: 4.478,
              top: "91.89%",
              left: "48.21%",
              tx: 11.29,
              ty: -263.88,
            },
            {
              duration: 8.851,
              delay: 2.309,
              top: "93.72%",
              left: "94.13%",
              tx: -278.05,
              ty: -275.46,
            },
            {
              duration: 13.37,
              delay: 0.187,
              top: "62.20%",
              left: "82.68%",
              tx: -205.88,
              ty: -76.85,
            },
            {
              duration: 7.184,
              delay: 4.78,
              top: "30.21%",
              left: "96.79%",
              tx: -294.76,
              ty: 124.7,
            },
            {
              duration: 9.067,
              delay: 2.488,
              top: "20.39%",
              left: "61.96%",
              tx: -75.37,
              ty: 186.56,
            },
            {
              duration: 10.91,
              delay: 1.611,
              top: "1.95%",
              left: "16.72%",
              tx: 209.66,
              ty: 302.74,
            },
            {
              duration: 13.844,
              delay: 3.686,
              top: "26.78%",
              left: "8.89%",
              tx: 259.0,
              ty: 146.32,
            },
          ];

          const style = styles[i % styles.length];

          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-star-float"
              style={{
                top: style.top,
                left: style.left,
                animationDuration: `${style.duration}s`,
                animationDelay: `${style.delay}s`,
                "--tx": `${style.tx}px`,
                "--ty": `${style.ty}px`,
                opacity: Math.random() * 0.5 + 0.5,
              }}
            />
          );
        })}
      </div>

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        {/* Badge */}
        <div className="inline-block mb-6 animate-fade-in">
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-900/50 border border-purple-500/50 text-purple-200">
            New Token Launchpad on Solana
          </span>
        </div>

        <h1 className="text-7xl font-bold mb-6 animate-fade-in">
          <span className="text-white">Solana Token </span>
          <span className="text-purple-400">Launchpad</span>
        </h1>

        <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto text-gray-100 animate-fade-in-delay font-light">
          Launch your tokens and NFTs on Solana with ease
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-delay-2">
          <button
            className="button-neomorphic"
            onClick={() => (window.location.href = "/mint/token")}
          >
            Mint Token
          </button>
          <button
            className="button-neomorphic-secondary"
            onClick={() => (window.location.href = "/mint/nft")}
          >
            Mint NFT
          </button>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent opacity-30"></div>

      <style jsx>{`
        @keyframes star-float {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty));
            opacity: 0;
          }
        }

        .animate-star-float {
          animation: star-float linear infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-delay {
          opacity: 0;
          animation: fade-in 1s ease-out 0.3s forwards;
        }

        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fade-in 1s ease-out 0.6s forwards;
        }

        .button-neomorphic {
          border-radius: 0.25rem;
          text-transform: uppercase;
          font-style: normal;
          font-weight: 500;
          padding-left: 25px;
          padding-right: 25px;
          color: #fff;
          -webkit-clip-path: polygon(
            0 0,
            0 0,
            100% 0,
            100% 0,
            100% calc(100% - 15px),
            calc(100% - 15px) 100%,
            15px 100%,
            0 100%
          );
          clip-path: polygon(
            0 0,
            0 0,
            100% 0,
            100% 0,
            100% calc(100% - 15px),
            calc(100% - 15px) 100%,
            15px 100%,
            0 100%
          );
          height: 42px;
          font-size: 0.8rem;
          line-height: 14px;
          letter-spacing: 1.2px;
          transition: all 0.3s ease;
          background-image: linear-gradient(90deg, #a855f7, #9333ea);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
        }

        .button-neomorphic:hover {
          transform: scale(1.05);
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.7);
        }

        .button-neomorphic-secondary {
          border-radius: 0.25rem;
          text-transform: uppercase;
          font-style: normal;
          font-weight: 500;
          padding-left: 25px;
          padding-right: 25px;
          color: #fff;
          -webkit-clip-path: polygon(
            0 0,
            0 0,
            100% 0,
            100% 0,
            100% calc(100% - 15px),
            calc(100% - 15px) 100%,
            15px 100%,
            0 100%
          );
          clip-path: polygon(
            0 0,
            0 0,
            100% 0,
            100% 0,
            100% calc(100% - 15px),
            calc(100% - 15px) 100%,
            15px 100%,
            0 100%
          );
          height: 42px;
          font-size: 0.8rem;
          line-height: 14px;
          letter-spacing: 1.2px;
          transition: all 0.3s ease;
          background-image: linear-gradient(90deg, #14b8a6, #06b6d4);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 15px rgba(20, 184, 166, 0.4);
        }

        .button-neomorphic-secondary:hover {
          transform: scale(1.05);
          box-shadow: 0 0 25px rgba(20, 184, 166, 0.7);
        }
      `}</style>
    </div>
  );
}
