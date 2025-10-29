'use client';

import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import AppBar from './components/AppBar';
import TokenMinter from './components/TokenMinter';
import NftMinter from './components/NftMinter';

export default function Home() {
    const [balance, setBalance] = useState<number>(0);
    const [activeView, setActiveView] = useState('token');
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    useEffect(() => {
        if (publicKey) {
            connection.getBalance(publicKey).then(setBalance);
        }
    }, [publicKey, connection]);

    return (
        <main className="flex min-h-screen flex-col">
            <AppBar />
            <div className="container mx-auto mt-10 flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-4">Solana Token & NFT Minter</h1>
                
                {publicKey ? (
                    <div className="text-lg mb-8">
                        <p>Connected: {publicKey.toBase58()}</p>
                        <p>Balance: {(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL</p>
                    </div>
                ) : (
                    <p className="text-lg mb-8">Please connect your wallet to get started.</p>
                )}

                <div className="w-full max-w-2xl">
                    <div className="flex justify-center mb-4 border-b">
                        <button 
                            onClick={() => setActiveView('token')}
                            className={`py-2 px-4 text-lg font-medium ${activeView === 'token' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                        >
                            Mint SPL Token
                        </button>
                        <button 
                            onClick={() => setActiveView('nft')}
                            className={`py-2 px-4 text-lg font-medium ${activeView === 'nft' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                        >
                            Mint NFT
                        </button>
                    </div>

                    <div className="p-4 bg-white shadow-md rounded-lg">
                        {activeView === 'token' && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Mint a new SPL Token</h2>
                                <TokenMinter />
                            </div>
                        )}
                        {activeView === 'nft' && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Mint a new NFT</h2>
                                <NftMinter />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
