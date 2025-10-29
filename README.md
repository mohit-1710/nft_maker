# Solana Token & NFT Minter

This is a Next.js application that allows users to mint custom SPL tokens and NFTs on the Solana devnet. It features a simple UI, wallet connection, and drag-and-drop image uploads to Pinata for metadata.

## Features

- **Wallet Connection**: Connect with Phantom, Solflare, and other standard wallets.
- **SPL Token Minting**: Create your own fungible SPL token with a name, symbol, decimals, initial supply, and a custom image.
- **NFT Minting**: Mint a non-fungible token (NFT) with a name, description, and image, compliant with the Metaplex Token Metadata standard.
- **Decentralized Storage**: All images and metadata are uploaded to IPFS via Pinata.
- **Built with Modern Tools**: Uses Next.js App Router, TypeScript, and the latest Solana libraries including Umi for Metaplex interactions.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Solana wallet (e.g., Phantom) with some Devnet SOL. You can get some from a [faucet](https://faucet.solana.com/).

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add the following, filling in your own details.

    ```
    NEXT_PUBLIC_DEVNET_RPC=https://api.devnet.solana.com
    NEXT_PUBLIC_ALCHEMY_RPC=<your-alchemy-devnet-url>
    NEXT_PUBLIC_HELIUS_RPC=<your-helius-devnet-url>

    PINATA_API_KEY=<your-pinata-api-key>
    PINATA_API_SECRET=<your-pinata-api-secret>
    ```

    - You can get Pinata API keys from [Pinata.cloud](https://www.pinata.cloud/).
    - The application will use the `NEXT_PUBLIC_DEVNET_RPC` by default. If you have access to custom RPCs like Alchemy or Helius, you can add them for better performance and reliability.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1.  **Connect Your Wallet**: Click the "Select Wallet" button at the top right to connect your Solana wallet. Make sure it's set to the Devnet.
2.  **Select an Action**: Choose whether you want to "Mint SPL Token" or "Mint NFT" using the tabs.

### Minting an SPL Token

1.  Fill in the details for your token:
    - **Token Name**: The full name of your token (e.g., "My Test Token").
    - **Token Symbol**: The abbreviated symbol (e.g., "MTT").
    - **Decimals**: The number of decimal places for your token (9 is standard for SPL tokens).
    - **Initial Supply**: The number of tokens to mint to your wallet upon creation.
2.  **Upload an Image**: Drag and drop an image file for your token's logo.
3.  **Mint**: Click the "Mint Token" button and approve the transaction in your wallet.
4.  **Done**: Once the transaction is confirmed, you will see a success message with a link to the transaction on the Solana Explorer.

### Minting an NFT

1.  Fill in the details for your NFT:
    - **NFT Name**: The name of your NFT.
    - **NFT Description**: A brief description.
2.  **Upload an Image**: Drag and drop the image for your NFT.
3.  **Mint**: Click the "Mint NFT" button and approve the transaction.
4.  **Done**: You'll receive a confirmation with a link to the transaction on the Solana Explorer.

## Project Structure

-   `/src/app/page.tsx`: The main application page containing the UI and logic for switching between minters.
-   `/src/app/components/`: Contains the reusable React components.
    -   `AppBar.tsx`: The top navigation bar with the wallet connect button.
    -   `WalletContextProvider.tsx`: Sets up the Solana wallet context.
    -   `Dropzone.tsx`: The component for file uploads.
    -   `TokenMinter.tsx`: The form and logic for minting SPL tokens.
    -   `NftMinter.tsx`: The form and logic for minting NFTs.
-   `/src/app/api/`: Contains the backend API routes for uploading files to Pinata.
    -   `upload/route.ts`: Handles image file uploads.
    -   `uploadJson/route.ts`: Handles JSON metadata uploads.
-   `/src/app/utils/`: Contains utility functions.
    -   `connection.ts`: Basic setup for RPC endpoint management.

## Out of Scope

This project is a functional prototype and does not include:
-   User authentication or databases.
-   Token/NFT listing, trading, or burning.
-   Mainnet deployment configurations.
-   Advanced UI/UX or mobile responsiveness.
-   Automatic RPC fallback (requires manual change in `.env.local`).