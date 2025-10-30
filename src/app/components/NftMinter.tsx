'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata, createNft } from '@metaplex-foundation/mpl-token-metadata';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import axios from 'axios';
import Dropzone from './Dropzone';

const NftMinter = ({ preloadedImageUrl }: { preloadedImageUrl?: string | null }) => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [nftName, setNftName] = useState('');
    const [nftDescription, setNftDescription] = useState('');
    const [nftImageUrl, setNftImageUrl] = useState<string | null>(preloadedImageUrl || null);
    const [isLoading, setIsLoading] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleMint = async () => {
        if (!wallet.publicKey || !nftImageUrl) {
            setError('Please connect your wallet and upload an NFT image.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSignature(null);

        try {
            // 1. Upload metadata to IPFS
            const metadata = {
                name: nftName,
                description: nftDescription,
                image: nftImageUrl,
            };
            const { data } = await axios.post('/api/uploadJson', metadata);
            const metadataUrl = data.url;

            // 2. Mint NFT using Umi
            const umi = createUmi(connection.rpcEndpoint)
                .use(mplTokenMetadata())
                .use(walletAdapterIdentity(wallet));

            const mint = generateSigner(umi);

            const { signature } = await createNft(umi, {
                mint,
                name: nftName,
                uri: metadataUrl,
                sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
            }).sendAndConfirm(umi);

            setSignature(signature.toString());

        } catch (err) {
            console.error(err);
            setError('Failed to mint NFT. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
     <div
  className="rounded-3xl p-8 backdrop-blur-xl"
  style={{
    background: 'rgba(10, 10, 15, 0.95)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  }}
>
  {/* Header */}
  <div className="flex justify-between items-start mb-6">
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Mint NFT</h1>
      <p className="text-sm text-gray-400">
        Create your unique NFT on Solana with custom metadata and artwork
      </p>
    </div>
    <div
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        background: 'rgba(139, 92, 246, 0.2)',
        color: '#a78bfa',
        border: '1px solid rgba(139, 92, 246, 0.3)',
      }}
    >
      Solana
    </div>
  </div>

  <div className="space-y-6">
    {/* NFT Name */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">NFT Name</label>
      <input
        type="text"
        value={nftName}
        onChange={(e) => setNftName(e.target.value)}
        placeholder="Enter NFT name"
        className="w-full rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        style={{
          background: '#1a1a24',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      />
    </div>

    {/* NFT Description */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">NFT Description</label>
      <input
        type="text"
        value={nftDescription}
        onChange={(e) => setNftDescription(e.target.value)}
        placeholder="Enter NFT description"
        className="w-full rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        style={{
          background: '#1a1a24',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      />
    </div>

    {/* NFT Image */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">NFT Image</label>
      <Dropzone onUpload={setNftImageUrl} />

      {nftImageUrl && (
        <p className="text-sm text-gray-400 mt-2">
          Image uploaded:{' '}
          <a
            href={nftImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            {nftImageUrl}
          </a>
        </p>
      )}
    </div>

    {/* Mint Button */}
    <button
      onClick={handleMint}
      disabled={isLoading || !wallet.publicKey || !nftImageUrl}
      className="w-full rounded-lg px-5 py-3 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
      style={{
        background:
          isLoading || !wallet.publicKey || !nftImageUrl
            ? '#4b5563'
            : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        boxShadow:
          isLoading || !wallet.publicKey || !nftImageUrl
            ? 'none'
            : '0 4px 20px rgba(139, 92, 246, 0.4)',
      }}
    >
      {isLoading ? 'Minting...' : 'Mint NFT'}
    </button>

    {/* Success Message */}
    {signature && (
      <div
        className="rounded-lg p-4 border border-green-500/20"
        style={{
          background: 'rgba(34, 197, 94, 0.1)',
        }}
      >
        <p className="text-green-400 font-medium mb-2">Mint Successful!</p>
        <a
          href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 text-sm underline"
        >
          View on Solana Explorer
        </a>
      </div>
    )}

    {/* Error Message */}
    {error && (
      <div
        className="rounded-lg p-4 border border-red-500/20"
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
        }}
      >
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )}
  </div>
</div>

    );
};

export default NftMinter;
