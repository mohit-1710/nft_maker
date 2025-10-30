import React from "react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Subtle purple gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-20 w-[38rem] h-[38rem] bg-purple-800/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-56 right-0 w-[34rem] h-[34rem] bg-purple-700/15 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-purple-900/40 border border-purple-500/40 text-purple-200">
          Built for Solana • Ultra-fast, gas-optimized
        </span>

        <h1 className="mt-6 text-5xl md:text-7xl font-extrabold leading-tight">
          nft<span className="text-purple-400">maker</span>
        </h1>
        <p className="mt-3 text-lg md:text-xl text-gray-300">
          Where wild ideas mint into reality. Design, generate, and launch NFTs — and tokens — on Solana in minutes.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-900/30 border border-purple-400/30 transition" onClick={() => (window.location.href = "/create-nft")}>Start Creating</button>
          <button className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition" onClick={() => (window.location.href = "/mint/token")}>Mint Token</button>
        </div>

        <p className="mt-8 text-sm text-gray-400">No code. Own your art. Instant IPFS uploads and devnet/mainnet support.</p>

        {/* Stats Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{
            label: 'NFTs Minted', value: '128,472'
          },{
            label: 'Creators', value: '12,934'
          },{
            label: 'Avg. Mint Time', value: '14s'
          },{
            label: 'Fees Saved', value: '83%'
          }].map((s, i) => (
            <div key={i} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-5 text-left">
              <div className="text-2xl font-extrabold text-white">{s.value}</div>
              <div className="text-xs mt-1 text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          <div className="rounded-2xl p-5 bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/20 -rotate-1 hover:rotate-0 transition">
            <h3 className="text-white font-semibold mb-2">Canvas-first Designer</h3>
            <p className="text-gray-400 text-sm">Draw, add shapes, drag images, and export seamlessly — optimized for fast mint flows.</p>
          </div>
          <div className="rounded-2xl p-5 bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/20 rotate-1 hover:rotate-0 transition">
            <h3 className="text-white font-semibold mb-2">One-click Minting</h3>
            <p className="text-gray-400 text-sm">Auto-pin to IPFS, prepare metadata, and mint on Solana in a single step.</p>
          </div>
          <div className="rounded-2xl p-5 bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/20 -rotate-1 hover:rotate-0 transition">
            <h3 className="text-white font-semibold mb-2">Token Launch Ready</h3>
            <p className="text-gray-400 text-sm">Mint SPL tokens, set supply, and go live with a consistent creator UX.</p>
          </div>
        </div>

        {/* Large tilted highlight cards */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl p-7 bg-white/5 border border-white/10 shadow-xl -rotate-1 hover:rotate-0 transition will-change-transform">
            <div className="text-4xl font-extrabold text-white">99.99% Uptime</div>
            <p className="mt-2 text-gray-400">Global edge uploads and resilient IPFS pinning for uninterrupted launches.</p>
            <div className="mt-4 flex gap-3">
              <span className="px-3 py-1 rounded-full text-xs bg-purple-900/30 border border-purple-500/30 text-purple-200">Edge Caching</span>
              <span className="px-3 py-1 rounded-full text-xs bg-purple-900/30 border border-purple-500/30 text-purple-200">CDN</span>
            </div>
          </div>
          <div className="rounded-3xl p-7 bg-gradient-to-r from-purple-900/30 to-purple-700/20 border border-purple-500/30 shadow-xl rotate-1 hover:rotate-0 transition will-change-transform">
            <div className="text-4xl font-extrabold text-white"><span className="text-purple-300">0.000</span> SOL Avg. Fee</div>
            <p className="mt-2 text-gray-300">Ultra-efficient transactions with batch mints and fee optimizations.</p>
            <div className="mt-4 flex gap-3">
              <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/20 text-white/90">Batching</span>
              <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/20 text-white/90">Compression</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
