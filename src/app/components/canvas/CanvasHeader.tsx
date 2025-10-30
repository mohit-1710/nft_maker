'use client';
import React from 'react';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface CanvasHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onDownload: () => void;
  onMint: () => void;
  isLoading: boolean;
  isWalletConnected: boolean;
  signature?: string | null;
  error?: string | null;
}

export const CanvasHeader: React.FC<CanvasHeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  onDownload,
  onMint,
  isLoading,
  isWalletConnected,
  signature,
  error
}) => {
  return (
    <>
      <button
        onClick={onToggleSidebar}
        className={`fixed top-1/2 -translate-y-1/2 bg-gray-800/50 rounded-full text-white hover:bg-gray-700/50 transition-all duration-300 z-30 ${
          isSidebarOpen ? 'left-80' : 'left-0'
        }`}
      >
        {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
        </div>
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-all text-sm"
          >
            <Download size={16} /> PNG
          </button>
          <button
            onClick={onMint}
            disabled={isLoading || !isWalletConnected}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition-all disabled:opacity-50 text-sm"
          >
            {isLoading ? 'Minting...' : 'Mint NFT'}
          </button>
        </div>
      </div>

      {signature && (
        <div className="mt-2 text-green-400 text-xs text-center">
          <p>
            Mint Successful!{' '}
            <a
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              View on Explorer
            </a>
          </p>
        </div>
      )}
      {error && <p className="text-red-400 mt-2 text-xs text-center">{error}</p>}
    </>
  );
};
