import { Connection } from '@solana/web3.js';

const RPC_ENDPOINTS = [
    process.env.NEXT_PUBLIC_DEVNET_RPC,
    process.env.NEXT_PUBLIC_ALCHEMY_RPC,
    process.env.NEXT_PUBLIC_HELIUS_RPC
].filter(Boolean) as string[];

let currentRpcIndex = 0;

export const getFallbackConnection = () => {
    const endpoint = RPC_ENDPOINTS[currentRpcIndex];
    return new Connection(endpoint, 'confirmed');
};

export const rotateRpcEndpoint = () => {
    currentRpcIndex = (currentRpcIndex + 1) % RPC_ENDPOINTS.length;
    console.log(`Rotated to new RPC endpoint: ${RPC_ENDPOINTS[currentRpcIndex]}`);
};

// We can't easily implement a full-fledged RPC fallback with umi and wallet-adapter's context providers.
// The providers are initialized once. A proper implementation would require a custom provider
// that manages the connection state and re-initializes umi/connection on failure, which is complex.

// For the scope of this project, we will stick to the primary RPC endpoint provided
// in the WalletContextProvider. The logic above is a starting point for a more advanced implementation.
// The user can manually switch the primary endpoint in the .env.local file.
