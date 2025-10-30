'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
    getMinimumBalanceForRentExemptMint,
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction
} from '@solana/spl-token';
import { 
    PublicKey, 
    Transaction, 
    SystemProgram,
    Keypair
} from '@solana/web3.js';
import axios from 'axios';
import Dropzone from './Dropzone';

const TokenMinter = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [decimals, setDecimals] = useState(9);
    const [initialSupply, setInitialSupply] = useState(1000000);
    const [tokenImageUrl, setTokenImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleMint = async () => {
        if (!wallet.publicKey || !tokenImageUrl) {
            setError('Please connect your wallet and upload a token image.');
            return;
        }
        
        if (!wallet.connected) {
            setError('Wallet is not connected. Please connect your wallet.');
            return;
        }
        
        if (!wallet.signTransaction) {
            setError('Wallet does not support transaction signing. Please use a compatible wallet.');
            return;
        }

        // --- ROOT CAUSE FIX: Input Validation ---
        if (!tokenName.trim()) {
            setError('Token Name cannot be empty.');
            return;
        }
        if (!tokenSymbol.trim()) {
            setError('Token Symbol cannot be empty.');
            return;
        }
        // A common standard for token symbols is to be alphanumeric.
        if (!/^[a-zA-Z0-9]+$/.test(tokenSymbol)) {
            setError('Token Symbol can only contain letters and numbers.');
            return;
        }
        
        // Validate decimals
        if (decimals < 0 || decimals > 9) {
            setError('Decimals must be between 0 and 9.');
            return;
        }
        
        // Validate initial supply
        if (initialSupply <= 0) {
            setError('Initial supply must be greater than 0.');
            return;
        }
        
        // Check if the calculated amount would be too large
        const totalAmount = initialSupply * Math.pow(10, decimals);
        if (totalAmount > Number.MAX_SAFE_INTEGER) {
            setError('Initial supply is too large for the selected decimals.');
            return;
        }
        // --- END FIX ---

        setIsLoading(true);
        setError(null);
        setSignature(null);

        try {
            console.log('Starting token minting process...');
            console.log('Token details:', { tokenName, tokenSymbol, decimals, initialSupply });
            console.log('Wallet details:', { 
                connected: wallet.connected, 
                publicKey: wallet.publicKey?.toString(),
                signTransaction: !!wallet.signTransaction 
            });
            
            // Note: For SPL tokens, we don't need metadata upload to IPFS
            // The token will be created without metadata URI
            console.log('Creating SPL token without metadata...');

            console.log('Creating and minting SPL token...');
            
            // Ensure we have the wallet's public key
            if (!wallet.publicKey) {
                throw new Error('Wallet public key is not available. Please reconnect your wallet.');
            }
            
            console.log('Wallet public key:', wallet.publicKey.toString());
            
            // Create a signer adapter for the wallet
            if (!wallet.signTransaction) {
                throw new Error('Wallet does not support transaction signing. Please use a compatible wallet.');
            }
            
            const signer = {
                publicKey: wallet.publicKey,
                signTransaction: async (tx: Transaction) => {
                    console.log('Signing transaction...');
                    if (!wallet.signTransaction) {
                        throw new Error('Wallet does not support transaction signing.');
                    }
                    return await wallet.signTransaction(tx);
                },
                signAllTransactions: async (txs: Transaction[]) => {
                    if (!wallet.signAllTransactions) {
                        throw new Error('Wallet does not support signing multiple transactions');
                    }
                    console.log('Signing multiple transactions...');
                    return await wallet.signAllTransactions(txs);
                }
            };
            
            console.log('Signer adapter created successfully');

            // Helper function to send transactions with wallet adapter
            const sendTransaction = async (transaction: Transaction): Promise<string> => {
                if (!wallet.publicKey) {
                    throw new Error('Wallet not connected or public key not available.');
                }
                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                transaction.recentBlockhash = blockhash;
                transaction.feePayer = wallet.publicKey;
                
                // Sign with wallet adapter
                console.log('Requesting wallet signature...');
                if (!wallet.signTransaction) {
                    throw new Error('Wallet does not support transaction signing.');
                }
                const signed = await wallet.signTransaction(transaction);
                
                // Send transaction
                console.log('Sending transaction...');
                const signature = await connection.sendRawTransaction(signed.serialize(), {
                    skipPreflight: false,
                });
                
                // Confirm transaction
                console.log('Confirming transaction...');
                await connection.confirmTransaction({
                    signature,
                    blockhash,
                    lastValidBlockHeight,
                }, 'confirmed');
                
                return signature;
            };

            // Combine ALL steps into a single transaction!
            console.log('Preparing to create mint, token account, and mint tokens in one transaction...');
            const mintKeypair = Keypair.generate();
            const mintPublicKey = mintKeypair.publicKey;
            
            const rentExemptBalance = await getMinimumBalanceForRentExemptMint(connection);
            const associatedTokenAddress = await getAssociatedTokenAddress(
                mintPublicKey,
                wallet.publicKey,
                false,
                TOKEN_PROGRAM_ID
            );
            const mintAmount = BigInt(initialSupply * Math.pow(10, decimals));
            
            // Get fresh blockhash
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
            
            // Build the complete transaction with all instructions
            const completeTransaction = new Transaction({
                feePayer: wallet.publicKey,
                recentBlockhash: blockhash,
            });
            
            // Step 1: Create mint account
            console.log('Adding mint account creation instructions...');
            completeTransaction.add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintPublicKey,
                    space: MINT_SIZE,
                    lamports: rentExemptBalance,
                    programId: TOKEN_PROGRAM_ID,
                }),
                createInitializeMintInstruction(
                    mintPublicKey,
                    decimals,
                    wallet.publicKey,
                    wallet.publicKey,
                    TOKEN_PROGRAM_ID
                )
            );
            
            // Step 2: Create associated token account (always needed for the mint instruction)
            console.log('Adding token account creation instruction...');
            completeTransaction.add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedTokenAddress,
                    wallet.publicKey,
                    mintPublicKey,
                    TOKEN_PROGRAM_ID
                )
            );
            
            // Step 3: Mint tokens
            console.log('Adding token minting instruction...');
            completeTransaction.add(
                createMintToInstruction(
                    mintPublicKey,
                    associatedTokenAddress,
                    wallet.publicKey,
                    mintAmount,
                    [],
                    TOKEN_PROGRAM_ID
                )
            );
            
            // Sign with mint keypair first (partial sign)
            completeTransaction.partialSign(mintKeypair);
            
            // Sign with wallet adapter
            console.log('Requesting wallet signature for complete transaction...');
            const signedTx = await wallet.signTransaction(completeTransaction);
            
            // Serialize and send
            console.log('Sending complete transaction...');
            const serializedTx = signedTx.serialize();
            const signature = await connection.sendRawTransaction(serializedTx, {
                skipPreflight: false,
                maxRetries: 3,
            });
            
            console.log('Confirming transaction...');
            await connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight,
            }, 'confirmed');
            
            console.log('✅ All operations completed in one transaction!');
            console.log('Mint address:', mintPublicKey.toString());
            console.log('Token account:', associatedTokenAddress.toString());
            console.log('Transaction signature:', signature);

            setSignature(signature.toString());

        } catch (err) {
            console.error('Token minting error:', err);
            
            // More specific error handling
            if (err instanceof Error) {
                if (err.message.includes('User rejected')) {
                    setError('Transaction was cancelled by user.');
                } else if (err.message.includes('Insufficient funds')) {
                    setError('Insufficient SOL balance for transaction fees.');
                } else if (err.message.includes('Network')) {
                    setError('Network error. Please check your connection and try again.');
                } else if (err.message.includes('metadata')) {
                    setError('Failed to upload token metadata. Please check your Pinata configuration.');
                } else if (err.message.includes('already been processed') || err.message.includes('Transaction simulation failed')) {
                    setError('Transaction failed. The blockhash may have expired. Please try again.');
                } else {
                    setError(`Failed to mint token: ${err.message}`);
                }
            } else {
            setError('Failed to mint token. Please check the console for details.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
<div className="bg-gray-900/60 backdrop-blur-md text-gray-100 p-6 rounded-xl border border-gray-700">
    <div className="space-y-6">

        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Token Name</label>
            <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="w-full rounded-lg bg-gray-800/60 backdrop-blur border border-gray-700 px-4 py-3 text-gray-100 focus:border-indigo-500 focus:ring-indigo-500"
            />
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Token Symbol</label>
            <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                className="w-full rounded-lg bg-gray-800/60 backdrop-blur border border-gray-700 px-4 py-3 text-gray-100 focus:border-indigo-500 focus:ring-indigo-500"
            />
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Decimals</label>
            <input
                type="number"
                value={decimals}
                onChange={(e) => setDecimals(Number(e.target.value))}
                className="w-full rounded-lg bg-gray-800/60 backdrop-blur border border-gray-700 px-4 py-3 text-gray-100 focus:border-indigo-500 focus:ring-indigo-500"
            />
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Initial Supply</label>
            <input
                type="number"
                value={initialSupply}
                onChange={(e) => setInitialSupply(Number(e.target.value))}
                className="w-full rounded-lg bg-gray-800/60 backdrop-blur border border-gray-700 px-4 py-3 text-gray-100 focus:border-indigo-500 focus:ring-indigo-500"
            />
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Token Image</label>
            <Dropzone onUpload={setTokenImageUrl} />
            {tokenImageUrl && (
                <p className="text-sm text-gray-400 mt-1">
                    Image uploaded:{" "}
                    <a
                        href={tokenImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                    >
                        {tokenImageUrl}
                    </a>
                </p>
            )}
        </div>

        <button
            onClick={handleMint}
            disabled={isLoading || !wallet.publicKey || !tokenImageUrl}
            className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 disabled:bg-gray-600"
        >
            {isLoading ? "Minting..." : "Mint Token"}
        </button>

        {signature && (
            <div className="mt-2 text-green-400">
                <p>Mint Successful!</p>
                <a
                    href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                >
                    View on Solana Explorer
                </a>
            </div>
        )}

        {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
</div>


    );
};

export default TokenMinter;
