'use client';

import { useState, useEffect } from 'react';
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
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Show success message when image is uploaded
    useEffect(() => {
        if (tokenImageUrl && !showSuccessMessage) {
            setShowSuccessMessage(true);
            // Auto-hide success message after 5 seconds
            const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [tokenImageUrl, showSuccessMessage]);

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
<div
  className="rounded-3xl p-8 backdrop-blur-xl"
  style={{
    background: 'rgba(10, 10, 15, 0.95)',
    boxShadow:
      '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  }}
>
  {/* Header */}
  <div className="flex justify-between items-start mb-6">
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Mint SPL Token</h1>
      <p className="text-sm text-gray-400">
        Launch your SPL token on Solana with custom supply and metadata
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

  {/* Success Message for Uploaded Image */}
  {showSuccessMessage && tokenImageUrl && (
    <div
      className="rounded-lg p-4 mb-6 border border-green-500/30 animate-fadeIn"
      style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.15) 100%)',
        boxShadow: '0 4px 20px rgba(34, 197, 94, 0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-green-400 font-semibold mb-1">
            🪙 Token Image Uploaded!
          </h3>
          <p className="text-gray-300 text-sm">
            Your token image has been successfully uploaded to IPFS. Now configure your token details and mint it on the Solana blockchain!
          </p>
        </div>
        <button
          onClick={() => setShowSuccessMessage(false)}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )}

  <div className="space-y-6">
    {/* Token Name */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Token Name
      </label>
      <input
        type="text"
        value={tokenName}
        onChange={(e) => setTokenName(e.target.value)}
        placeholder="Enter token name"
        className="w-full rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        style={{
          background: '#1a1a24',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      />
    </div>

    {/* Token Symbol */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Token Symbol
      </label>
      <input
        type="text"
        value={tokenSymbol}
        onChange={(e) => setTokenSymbol(e.target.value)}
        placeholder="Enter token symbol"
        className="w-full rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        style={{
          background: '#1a1a24',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      />
    </div>

    {/* Decimals */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Decimals
      </label>
      <input
        type="number"
        value={decimals}
        onChange={(e) => setDecimals(Number(e.target.value))}
        placeholder="9"
        className="w-full rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        style={{
          background: '#1a1a24',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      />
    </div>

    {/* Initial Supply */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Initial Supply
      </label>
      <input
        type="number"
        value={initialSupply}
        onChange={(e) => setInitialSupply(Number(e.target.value))}
        placeholder="Enter initial supply"
        className="w-full rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        style={{
          background: '#1a1a24',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      />
    </div>

    {/* Token Image */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Token Image
      </label>
      
      {tokenImageUrl ? (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border border-green-500/30" style={{ background: '#1a1a24' }}>
            <img
              src={tokenImageUrl}
              alt="Token Preview"
              className="w-full h-64 object-contain"
            />
            <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
              ✓ Uploaded
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Token image ready!{' '}
              <a
                href={tokenImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                View on IPFS
              </a>
            </p>
            <button
              onClick={() => {
                setTokenImageUrl(null);
                setShowSuccessMessage(false);
              }}
              className="text-sm text-red-400 hover:text-red-300 underline"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <Dropzone onUpload={setTokenImageUrl} />
      )}
    </div>

    {/* Mint Button */}
    <button
      onClick={handleMint}
      disabled={isLoading || !wallet.publicKey || !tokenImageUrl}
      className="w-full rounded-lg px-5 py-3 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
      style={{
        background:
          isLoading || !wallet.publicKey || !tokenImageUrl
            ? '#4b5563'
            : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        boxShadow:
          isLoading || !wallet.publicKey || !tokenImageUrl
            ? 'none'
            : '0 4px 20px rgba(139, 92, 246, 0.4)',
      }}
    >
      {isLoading ? 'Minting...' : 'Mint Token'}
    </button>

    {/* Success Message */}
    {signature && (
      <div
        className="rounded-lg p-4 border border-green-500/20"
        style={{ background: 'rgba(34, 197, 94, 0.1)' }}
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
        style={{ background: 'rgba(239, 68, 68, 0.1)' }}
      >
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )}
  </div>
</div>


    );
};

export default TokenMinter;
