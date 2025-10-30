"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect } from "react";
import Link from "next/link";

const AppBar = () => {
  useEffect(() => {
    // Add class to Solana wallet adapter button once it mounts
    const btn = document.querySelector(".wallet-adapter-button");
    if (btn) btn.classList.add("button-neomorphic-wallet");
  }, []);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-6xl">
      <div className="flex items-center justify-between gap-6 px-6 py-3 rounded-full bg-black/70 border border-white/10 backdrop-blur-xl shadow-2xl">
      {/* Left Side: Platform Name */}
      <h1 className="text-xl font-semibold text-white tracking-wide select-none">
        nft<span className="text-purple-400">maker</span>
      </h1>

      {/* Right Side: Navigation + Wallet Button */}
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-2">
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

        <div>
          <WalletMultiButton />
        </div>
      </div>
      </div>
      <style jsx global>{`
        /* Navigation Links */
        .nav-link {
          color: #e9d5ff;
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-decoration: none;
          padding: 0.55rem 1rem;
          border-radius: 9999px;
          transition: all 0.25s ease;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(6px);
        }

        .nav-link:hover {
          background: linear-gradient(90deg, #a855f7, #9333ea);
          color: #fff;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
          transform: translateY(-1px);
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
          background-image: linear-gradient(90deg, #a855f7, #9333ea) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.4) !important;
          cursor: pointer !important;
        }

        .button-neomorphic-wallet:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.7) !important;
        }

        .wallet-adapter-button-trigger,
        .wallet-adapter-button[aria-expanded="true"],
        .wallet-adapter-button:not([disabled]):hover {
          background-image: linear-gradient(90deg, #a855f7, #9333ea) !important;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.7) !important;
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
        }

        /* Wallet Dropdown Menu */
        .wallet-adapter-dropdown-list {
          background-color: rgba(30, 30, 30, 0.95) !important;
          border: 1px solid rgba(168, 85, 247, 0.4) !important;
          backdrop-filter: blur(8px) !important;
        }

        .wallet-adapter-dropdown-list-item {
          color: #e9d5ff !important;
          transition: all 0.2s ease !important;
        }

        .wallet-adapter-dropdown-list-item:hover {
          background-color: rgba(147, 51, 234, 0.3) !important;
          color: #fff !important;
        }
      `}</style>
    </header>
  );
};

export default AppBar;
