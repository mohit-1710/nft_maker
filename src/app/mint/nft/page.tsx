'use client';

import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useSearchParams } from 'next/navigation';
import AppBar from '../../components/AppBar';
import NftMinter from '../../components/NftMinter';

export default function NftMintPage() {
    const [balance, setBalance] = useState<number>(0);
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const searchParams = useSearchParams();
    const imageUrl = searchParams.get('imageUrl');

    useEffect(() => {
        if (publicKey) {
            connection.getBalance(publicKey).then(setBalance);
        }
    }, [publicKey, connection]);

    return (
       <main className="flex min-h-screen flex-col relative overflow-hidden bg-black text-white">

    {/* Animated gradient background */}
    <div className="fixed inset-0 bg-gradient-to-br from-purple-950/50 via-black to-cyan-950/50"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0b3b] to-[#ae0bef]"></div>

    <div className="relative z-10">
        <AppBar />

        <div className="container mx-auto mt-10 flex flex-col items-center justify-center p-4 mt-24">
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Mint NFT
            </h1>
            
            {publicKey ? (
                <div className="text-lg mb-8 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <p className="mb-2">
                        <span className="text-gray-400">Connected:</span>{" "}
                        <span className="font-mono text-sm">{publicKey.toBase58()}</span>
                    </p>
                    <p>
                        <span className="text-gray-400">Balance:</span>{" "}
                        <span className="text-cyan-400 font-bold">
                            {(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL
                        </span>
                    </p>
                </div>
            ) : (
                <p className="text-lg mb-8 text-gray-300">
                    Please connect your wallet to get started.
                </p>
            )}

            <div className="w-full max-w-2xl">
                <div className="relative">
                    {/* Glow border */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg blur opacity-20"></div>

                    {/* Card */}
                        <NftMinter preloadedImageUrl={imageUrl} />

                </div>
            </div>
        </div>
    </div>

    <style jsx>{`
        @keyframes blob {
            0%, 100% {
                transform: translate(0px, 0px) scale(1);
            }
            33% {
                transform: translate(30px, -50px) scale(1.1);
            }
            66% {
                transform: translate(-20px, 20px) scale(0.9);
            }
        }
        .animate-blob {
            animation: blob 7s infinite;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
        .animation-delay-4000 {
            animation-delay: 4s;
        }
    `}</style>
</main>

    );
}