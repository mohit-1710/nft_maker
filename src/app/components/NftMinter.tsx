'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata, createNft } from '@metaplex-foundation/mpl-token-metadata';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import axios from 'axios';
import Dropzone from './Dropzone';

const NftMinter = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [nftName, setNftName] = useState('');
    const [nftDescription, setNftDescription] = useState('');
    const [nftImageUrl, setNftImageUrl] = useState<string | null>(null);
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
        <div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">NFT Name</label>
                <input
                    type="text"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">NFT Description</label>
                <input
                    type="text"
                    value={nftDescription}
                    onChange={(e) => setNftDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">NFT Image</label>
                <Dropzone onUpload={setNftImageUrl} />
                {nftImageUrl && <p className="mt-2 text-sm text-gray-500">Image uploaded: <a href={nftImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">{nftImageUrl}</a></p>}
            </div>
            <button
                onClick={handleMint}
                disabled={isLoading || !wallet.publicKey || !nftImageUrl}
                className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
                {isLoading ? 'Minting...' : 'Mint NFT'}
            </button>
            {signature && (
                <div className="mt-4 text-green-500">
                    <p>Mint Successful!</p>
                    <a
                        href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        View on Solana Explorer
                    </a>
                </div>
            )}
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
};

export default NftMinter;
