"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const AppBar = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Add class to Solana wallet adapter button once it mounts
    const btn = document.querySelector(".wallet-adapter-button");
    if (btn) btn.classList.add("button-neomorphic-wallet");
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#0a0f1e] to-transparent">
      <div className="max-w-[2560px] mx-auto flex items-center">
        {/* Left Section - 60% */}
        <div className="w-[60%] px-12 mt-2 lg:px-16 xl:px-20 py-6">
          <div className="flex items-center justify-between w-full">
            {/* Left Side: ASSET FLOW Logo */}
            <Link
              href="/"
              className="text-white font-black text-2xl lg:text-3xl leading-tight hover:opacity-80 transition-opacity"
            >
              NFT MAKER
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-2">
              <Link href="/docs" className="nav-link">
                Docs
              </Link>
              <Link href="/create-nft" className="nav-link">
                Create NFT
              </Link>
              <Link href="/mint/token" className="nav-link">
                Launch Token
              </Link>
            </nav>
          </div>
        </div>

        {/* Right Section - 40% (Empty for image) */}
        <div className="w-[40%] px-12 lg:px-16 xl:px-20 py-6 flex items-center justify-end">
          <div>
            {mounted ? (
              <WalletMultiButton />
            ) : (
              <div className="h-[42px] w-[150px]" />
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Navigation Links - Matching Asset Flow Design */
        .nav-link {
          color: #8892a6;
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          text-decoration: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          transition: all 0.25s ease;
          background: transparent;
          position: relative;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: #ae0bef;
          transition: width 0.3s ease;
        }

        .nav-link:hover {
          color: #fff;
        }

        .nav-link:hover::after {
          width: 80%;
        }

        /* Wallet Button Styles */
        .button-neomorphic-wallet {
          border-radius: 0.25rem !important;
          text-transform: uppercase !important;
          font-style: normal !important;
          font-weight: 500 !important;
          padding-left: 25px !important;
          padding-right: 25px !important;
          color: #fff !important;
          -webkit-clip-path: polygon(
            0 0,
            0 0,
            100% 0,
            100% 0,
            100% calc(100% - 15px),
            calc(100% - 15px) 100%,
            15px 100%,
            0 100%
          ) !important;
          clip-path: polygon(
            0 0,
            0 0,
            100% 0,
            100% 0,
            100% calc(100% - 15px),
            calc(100% - 15px) 100%,
            15px 100%,
            0 100%
          ) !important;
          height: 42px !important;
          font-size: 0.8rem !important;
          line-height: 14px !important;
          letter-spacing: 1.2px !important;
          transition: all 0.3s ease !important;
          background-image: linear-gradient(
            90deg,
            #6d28d9,
            #9333ea,
            #a855f7
          ) !important;
          border: 1px solid rgba(168, 85, 247, 0.4) !important;
          box-shadow: 0 0 15px rgba(147, 51, 234, 0.4) !important;
          cursor: pointer !important;
        }

        .button-neomorphic-wallet:hover {
          transform: scale(1.05) !important;
          background-image: linear-gradient(
            90deg,
            #8b5cf6,
            #a855f7,
            #c084fc
          ) !important;
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.6) !important;
        }

        /* Wallet Adapter Button States */
        .wallet-adapter-button-trigger,
        .wallet-adapter-button[aria-expanded="true"],
        .wallet-adapter-button:not([disabled]):hover {
          background-image: linear-gradient(
            90deg,
            #7e22ce,
            #a855f7,
            #c084fc
          ) !important;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.5) !important;
          border: 1px solid rgba(168, 85, 247, 0.4) !important;
        }

        /* Dropdown Menu */
        .wallet-adapter-dropdown-list {
          background-color: rgba(20, 10, 30, 0.95) !important;
          border: 1px solid rgba(168, 85, 247, 0.3) !important;
          backdrop-filter: blur(12px) !important;
        }

        /* Dropdown Items */
        .wallet-adapter-dropdown-list-item {
          color: #b197f5 !important;
          transition: all 0.2s ease !important;
        }

        .wallet-adapter-dropdown-list-item:hover {
          background-color: rgba(168, 85, 247, 0.15) !important;
          color: #fff !important;
        }

        /* Mobile Menu Button (Optional) */
        @media (max-width: 768px) {
          .nav-link {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default AppBar;
