'use client';

import React, { useState } from "react";
import AppBar from "../components/AppBar";
import Link from "next/link";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📘' },
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'create-nft', title: 'Create NFT', icon: '🎨' },
    { id: 'mint-nft', title: 'Mint NFT', icon: '🖼️' },
    { id: 'mint-token', title: 'Launch Token', icon: '🪙' },
    { id: 'wallet', title: 'Wallet Setup', icon: '👛' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' },
    { id: 'faq', title: 'FAQ', icon: '❓' },
  ];

  return (
    <main className="flex min-h-screen flex-col relative overflow-hidden bg-black text-white">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/50 via-black to-cyan-950/50"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0b3b] to-[#ae0bef]"></div>

      <div className="relative z-10">
        <AppBar />

        <div className="container mx-auto px-4 mt-24 mb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              📘 Documentation
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about creating NFTs and launching tokens on Solana
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
              <div
                className="sticky top-24 rounded-2xl p-6 backdrop-blur-xl"
                style={{
                  background: 'rgba(10, 10, 15, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Contents
                </h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        activeSection === section.id
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="mr-2">{section.icon}</span>
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div
                className="rounded-2xl p-8 lg:p-12 backdrop-blur-xl"
                style={{
                  background: 'rgba(10, 10, 15, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {activeSection === 'overview' && <OverviewSection />}
                {activeSection === 'getting-started' && <GettingStartedSection />}
                {activeSection === 'create-nft' && <CreateNFTSection />}
                {activeSection === 'mint-nft' && <MintNFTSection />}
                {activeSection === 'mint-token' && <MintTokenSection />}
                {activeSection === 'wallet' && <WalletSection />}
                {activeSection === 'troubleshooting' && <TroubleshootingSection />}
                {activeSection === 'faq' && <FAQSection />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Section Components
function OverviewSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-white mb-6">📘 Overview</h2>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        Welcome to the NFT Maker - your all-in-one platform for creating, minting, and launching digital assets on the Solana blockchain.
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <FeatureCard
          icon="🎨"
          title="NFT Canvas Creator"
          description="Design unique NFTs with our built-in canvas editor featuring drawing tools, templates, and effects."
        />
        <FeatureCard
          icon="🖼️"
          title="NFT Minting"
          description="Mint your NFTs directly to the Solana blockchain with metadata stored on IPFS."
        />
        <FeatureCard
          icon="🪙"
          title="SPL Token Launcher"
          description="Launch your own SPL tokens with custom supply, decimals, and branding."
        />
        <FeatureCard
          icon="⚡"
          title="Fast & Secure"
          description="Built on Solana for high-speed transactions with low fees and maximum security."
        />
      </div>

      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 my-8">
        <h3 className="text-xl font-semibold text-purple-300 mb-3">🌟 Key Features</h3>
        <ul className="space-y-2 text-gray-300">
          <li>✓ No coding required - intuitive interface for everyone</li>
          <li>✓ IPFS integration for decentralized storage</li>
          <li>✓ Support for major Solana wallets (Phantom, Solflare, etc.)</li>
          <li>✓ Real-time transaction confirmation</li>
          <li>✓ Devnet and Mainnet support</li>
        </ul>
      </div>
    </div>
  );
}

function GettingStartedSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-white mb-6">🚀 Getting Started</h2>
      
      <div className="space-y-8">
        <Step
          number="1"
          title="Install a Solana Wallet"
          description="You'll need a Solana wallet to interact with the platform. We recommend:"
        >
          <ul className="space-y-2 text-gray-300 mt-4">
            <li>
              <strong className="text-white">Phantom</strong> - Most popular, user-friendly
              <br />
              <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline text-sm">
                Download Phantom →
              </a>
            </li>
            <li>
              <strong className="text-white">Solflare</strong> - Advanced features
              <br />
              <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline text-sm">
                Download Solflare →
              </a>
            </li>
          </ul>
        </Step>

        <Step
          number="2"
          title="Get Some SOL"
          description="You'll need SOL for transaction fees (gas). For testing:"
        >
          <div className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <p className="text-cyan-300 font-semibold mb-2">Devnet Faucet (Free Test SOL):</p>
            <code className="text-sm text-gray-300 block bg-black/30 p-2 rounded">
              https://faucet.solana.com/
            </code>
          </div>
        </Step>

        <Step
          number="3"
          title="Connect Your Wallet"
          description="Click the wallet button in the top-right corner and select your wallet."
        />

        <Step
          number="4"
          title="Start Creating!"
          description="Choose what you want to create:"
        >
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Link href="/create-nft" className="block p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-all">
              <div className="text-2xl mb-2">🎨</div>
              <div className="font-semibold text-white">Create NFT</div>
              <div className="text-sm text-gray-400">Design with canvas editor</div>
            </Link>
            <Link href="/mint/token" className="block p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all">
              <div className="text-2xl mb-2">🪙</div>
              <div className="font-semibold text-white">Launch Token</div>
              <div className="text-sm text-gray-400">Create SPL token</div>
            </Link>
          </div>
        </Step>
      </div>
    </div>
  );
}

function CreateNFTSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-white mb-6">🎨 Create NFT</h2>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        Our NFT Canvas Creator provides a powerful yet simple interface to design your unique NFTs.
      </p>

      <h3 className="text-xl font-semibold text-white mt-8 mb-4">Drawing Tools</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <ToolCard icon="✏️" name="Pencil" description="Freehand drawing" />
        <ToolCard icon="📏" name="Line" description="Draw straight lines" />
        <ToolCard icon="▭" name="Rectangle" description="Draw rectangles" />
        <ToolCard icon="⭕" name="Circle" description="Draw circles" />
        <ToolCard icon="🔺" name="Triangle" description="Draw triangles" />
        <ToolCard icon="📝" name="Text" description="Add text elements" />
      </div>

      <h3 className="text-xl font-semibold text-white mt-8 mb-4">Templates & Effects</h3>
      <ul className="space-y-2 text-gray-300">
        <li>🖼️ <strong className="text-white">PFP Template</strong> - Profile picture frame</li>
        <li>🎮 <strong className="text-white">Pixel Art Grid</strong> - Crypto punk style</li>
        <li>✨ <strong className="text-white">Glitter Effect</strong> - Add sparkles</li>
        <li>🌈 <strong className="text-white">Gradient Backgrounds</strong> - Colorful backgrounds</li>
        <li>😊 <strong className="text-white">Emoji Stickers</strong> - Add emoji elements</li>
        <li>🎨 <strong className="text-white">Filters</strong> - Grayscale, invert, neon effects</li>
      </ul>

      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 my-8">
        <h4 className="text-lg font-semibold text-green-300 mb-3">💡 Pro Tips</h4>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>• Use the color picker to customize your drawing colors</li>
          <li>• Adjust stroke width for different line thicknesses</li>
          <li>• Press Ctrl+Z or use undo button to undo mistakes</li>
          <li>• Press &apos;F&apos; key to toggle focus mode</li>
          <li>• Upload images to use as backgrounds or elements</li>
        </ul>
      </div>

      <h3 className="text-xl font-semibold text-white mt-8 mb-4">Canvas Settings</h3>
      <ul className="space-y-2 text-gray-300">
        <li><strong className="text-white">Canvas Size:</strong> Adjust width and height (default: 800x800)</li>
        <li><strong className="text-white">Background:</strong> Choose solid colors or upload images</li>
        <li><strong className="text-white">Export:</strong> Download as PNG or prepare for minting</li>
      </ul>
    </div>
  );
}

function MintNFTSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-white mb-6">🖼️ Mint NFT</h2>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        Once you&apos;ve created or uploaded your NFT artwork, you can mint it on the Solana blockchain.
      </p>

      <h3 className="text-xl font-semibold text-white mt-8 mb-4">Step-by-Step Process</h3>
      
      <div className="space-y-6">
        <ProcessStep
          step="1"
          title="Prepare Your Artwork"
          description="Create your NFT using our canvas editor or upload an existing image."
        />
        
        <ProcessStep
          step="2"
          title="Upload to IPFS"
          description="Your artwork is automatically uploaded to IPFS (decentralized storage) when you click 'Mint'. You'll see a success message once it's uploaded."
        />
        
        <ProcessStep
          step="3"
          title="Add Metadata"
          description="Fill in the required fields:"
        >
          <ul className="space-y-2 text-gray-300 mt-3">
            <li>• <strong className="text-white">NFT Name:</strong> The name of your NFT</li>
            <li>• <strong className="text-white">Description:</strong> What makes your NFT special</li>
          </ul>
        </ProcessStep>
        
        <ProcessStep
          step="4"
          title="Confirm Transaction"
          description="Click 'Mint NFT' and approve the transaction in your wallet. This will:"
        >
          <ul className="space-y-2 text-gray-300 mt-3">
            <li>• Create the NFT mint account on Solana</li>
            <li>• Store metadata on IPFS</li>
            <li>• Transfer the NFT to your wallet</li>
          </ul>
        </ProcessStep>
        
        <ProcessStep
          step="5"
          title="View Your NFT"
          description="Once minted, you'll receive a transaction signature. Click 'View on Solana Explorer' to see your NFT on the blockchain!"
        />
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 my-8">
        <h4 className="text-lg font-semibold text-yellow-300 mb-3">⚠️ Important Notes</h4>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>• Minting requires SOL for transaction fees (~0.01-0.02 SOL)</li>
          <li>• NFT metadata is immutable once minted</li>
          <li>• Make sure you&apos;re on the correct network (Devnet/Mainnet)</li>
          <li>• Seller fee is set to 5.5% by default</li>
        </ul>
      </div>
    </div>
  );
}

function MintTokenSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-white mb-6">🪙 Launch SPL Token</h2>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        Create your own SPL (Solana Program Library) token with custom parameters.
      </p>

      <h3 className="text-xl font-semibold text-white mt-8 mb-4">Token Parameters</h3>
      
      <div className="space-y-4">
        <ParamCard
          name="Token Name"
          description="The full name of your token (e.g., 'My Awesome Token')"
          example="Example: Solana Coin"
        />
        
        <ParamCard
          name="Token Symbol"
          description="Short identifier, typically 3-5 characters (e.g., 'SOL', 'USDC')"
          example="Example: MYCOIN"
        />
        
        <ParamCard
          name="Decimals"
          description="Number of decimal places (0-9). Most tokens use 9 decimals."
          example="Default: 9"
        />
        
        <ParamCard
          name="Initial Supply"
          description="How many tokens to mint initially. Can be adjusted later if you retain mint authority."
          example="Example: 1,000,000"
        />
        
        <ParamCard
          name="Token Image"
          description="Upload a logo or icon for your token (recommended: 512x512px)"
          example="Format: PNG, JPG, or GIF"
        />
      </div>

      <h3 className="text-xl font-semibold text-white mt-8 mb-4">Minting Process</h3>
      
      <ol className="space-y-4 text-gray-300">
        <li>
          <strong className="text-white">1. Upload Token Image</strong>
          <br />
          Your image is uploaded to IPFS and you&apos;ll see a preview with a success message.
        </li>
        <li>
          <strong className="text-white">2. Configure Parameters</strong>
          <br />
          Enter all required token details. The platform validates your input.
        </li>
        <li>
          <strong className="text-white">3. Create Token</strong>
          <br />
          Click &apos;Mint Token&apos; to create the token mint account and initial supply.
        </li>
        <li>
          <strong className="text-white">4. Receive Tokens</strong>
          <br />
          Tokens are automatically sent to your wallet&apos;s associated token account.
        </li>
      </ol>

      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 my-8">
        <h4 className="text-lg font-semibold text-purple-300 mb-3">🎯 Best Practices</h4>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>• Choose a unique and memorable symbol</li>
          <li>• Use 9 decimals for standard tokens</li>
          <li>• Consider your tokenomics before setting initial supply</li>
          <li>• Upload a professional-looking logo</li>
          <li>• Test on Devnet before launching on Mainnet</li>
        </ul>
      </div>
    </div>
  );
}

function WalletSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-white mb-6">👛 Wallet Setup</h2>
      
      <p className="text-gray-300 leading-relaxed mb-6">
        A Solana wallet is required to interact with the blockchain. Here&apos;s how to set one up.
      </p>

      <h3 className="text-xl font-semibold text-white mt-8 mb-4">Recommended Wallets</h3>
      
      <div className="space-y-6">
        <WalletCard
          name="Phantom"
          description="The most popular Solana wallet with a beautiful interface and excellent mobile support."
          features={[
            "Browser extension for Chrome, Firefox, Edge",
            "Mobile app for iOS and Android",
            "Built-in token swaps",
            "NFT gallery"
          ]}
          link="https://phantom.app/"
        />
        
        <WalletCard
          name="Solflare"
          description="Advanced wallet with hardware wallet support and staking features."
          features={[
            "Browser extension and web wallet",
            "Ledger hardware wallet support",
            "Stake SOL directly",
            "Advanced transaction signing"
          ]}
          link="https://solflare.com/"
        />
        
        <WalletCard
          name="Backpack"
          description="Modern multi-chain wallet with social features."
          features={[
            "Chrome extension",
            "Multi-chain support",
            "Clean, modern interface",
            "xNFT support"
          ]}
          link="https://backpack.app/"
        />
      </div>

      <h3 className="text-xl font-semibold text-white mt-8 mb-4">Connecting Your Wallet</h3>
      
      <ol className="space-y-3 text-gray-300">
        <li><strong className="text-white">1.</strong> Install your chosen wallet extension</li>
        <li><strong className="text-white">2.</strong> Create a new wallet or import an existing one</li>
        <li><strong className="text-white">3.</strong> Save your seed phrase securely (never share it!)</li>
        <li><strong className="text-white">4.</strong> Click &quot;Select Wallet&quot; on our platform</li>
        <li><strong className="text-white">5.</strong> Choose your wallet from the list</li>
        <li><strong className="text-white">6.</strong> Approve the connection request</li>
      </ol>

      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 my-8">
        <h4 className="text-lg font-semibold text-red-300 mb-3">🔒 Security Tips</h4>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>• Never share your seed phrase with anyone</li>
          <li>• Always verify transaction details before approving</li>
          <li>• Use hardware wallets for large amounts</li>
          <li>• Enable 2FA where available</li>
          <li>• Be cautious of phishing sites</li>
          <li>• Keep your wallet software updated</li>
        </ul>
      </div>
    </div>
  );
}

function TroubleshootingSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-white mb-6">🔧 Troubleshooting</h2>
      
      <div className="space-y-6">
        <TroubleshootCard
          problem="Wallet Not Connecting"
          solutions={[
            "Refresh the page and try again",
            "Make sure your wallet extension is unlocked",
            "Try disconnecting and reconnecting in wallet settings",
            "Clear browser cache and cookies",
            "Try a different browser"
          ]}
        />
        
        <TroubleshootCard
          problem="Transaction Failed"
          solutions={[
            "Check you have enough SOL for transaction fees",
            "Verify you're on the correct network (Devnet/Mainnet)",
            "Wait a moment and try again (network congestion)",
            "Increase priority fee in wallet settings",
            "Check Solana status: status.solana.com"
          ]}
        />
        
        <TroubleshootCard
          problem="Image Upload Failed"
          solutions={[
            "Check your image file size (max 10MB recommended)",
            "Ensure image format is supported (PNG, JPG, GIF)",
            "Try compressing your image",
            "Check your internet connection",
            "Wait a moment and try uploading again"
          ]}
        />
        
        <TroubleshootCard
          problem="NFT Not Showing in Wallet"
          solutions={[
            "Wait 1-2 minutes for blockchain confirmation",
            "Refresh your wallet",
            "Check the transaction on Solana Explorer",
            "Ensure you're viewing the correct network",
            "Some wallets require manual token/NFT refresh"
          ]}
        />
        
        <TroubleshootCard
          problem="Insufficient SOL Error"
          solutions={[
            "Add more SOL to your wallet",
            "Use Devnet faucet for testing: faucet.solana.com",
            "For Mainnet: purchase SOL on an exchange",
            "Transaction fees typically cost 0.01-0.02 SOL"
          ]}
        />
      </div>

      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6 my-8">
        <h4 className="text-lg font-semibold text-cyan-300 mb-3">📞 Still Need Help?</h4>
        <p className="text-gray-300 text-sm">
          If you&apos;re still experiencing issues, please check:
        </p>
        <ul className="space-y-2 text-gray-300 text-sm mt-3">
          <li>• Solana Status: <a href="https://status.solana.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">status.solana.com</a></li>
          <li>• Browser Console: Press F12 to view error messages</li>
          <li>• Wallet Support: Contact your wallet provider</li>
        </ul>
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-3xl font-bold text-white mb-6">❓ Frequently Asked Questions</h2>
      
      <div className="space-y-6">
        <FAQItem
          question="What is the cost to mint an NFT or token?"
          answer="The cost includes Solana network fees (typically 0.01-0.02 SOL) plus rent for account creation. On Devnet, you can get free test SOL from the faucet."
        />
        
        <FAQItem
          question="Can I update my NFT after minting?"
          answer="No, NFT metadata is immutable once minted. This is by design to ensure authenticity and prevent fraud. Make sure all details are correct before minting."
        />
        
        <FAQItem
          question="What's the difference between Devnet and Mainnet?"
          answer="Devnet is for testing with fake SOL (free from faucet). Mainnet is the real blockchain where transactions have real value. Always test on Devnet first!"
        />
        
        <FAQItem
          question="How do I switch networks?"
          answer="Switch networks in your wallet settings. Make sure your wallet and our platform are on the same network."
        />
        
        <FAQItem
          question="Where are my files stored?"
          answer="Images and metadata are stored on IPFS (InterPlanetary File System), a decentralized storage network. This ensures your files are permanent and censorship-resistant."
        />
        
        <FAQItem
          question="Can I mint multiple NFTs at once?"
          answer="Currently, each NFT must be minted individually. Batch minting features may be added in future updates."
        />
        
        <FAQItem
          question="What happens if I close my browser during minting?"
          answer="If you've already signed the transaction, it will complete on the blockchain. Check Solana Explorer with your wallet address to verify."
        />
        
        <FAQItem
          question="Can I sell my NFTs or tokens?"
          answer="Yes! Once minted, you can list them on NFT marketplaces (Magic Eden, Tensor) or DEXs (Jupiter, Raydium) respectively."
        />
        
        <FAQItem
          question="Why do I need SOL if the platform is free?"
          answer="SOL is required for blockchain transaction fees (gas). These fees go to network validators, not to us. Our platform itself is free to use."
        />
        
        <FAQItem
          question="Is my wallet safe to connect?"
          answer="Yes, we use the official Solana Wallet Adapter. We never have access to your private keys. Always verify you're on the correct URL before connecting."
        />
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg p-6 my-8">
        <h4 className="text-lg font-semibold text-white mb-3">💬 Have More Questions?</h4>
        <p className="text-gray-300 text-sm">
          Can&apos;t find what you&apos;re looking for? Check out these resources:
        </p>
        <ul className="space-y-2 text-gray-300 text-sm mt-3">
          <li>• <a href="https://docs.solana.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Solana Documentation</a></li>
          <li>• <a href="https://docs.metaplex.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Metaplex Documentation</a></li>
          <li>• <a href="https://spl.solana.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">SPL Token Documentation</a></li>
        </ul>
      </div>
    </div>
  );
}

// Helper Components
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function Step({ number, title, description, children }: { number: string; title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
        {children}
      </div>
    </div>
  );
}

function ToolCard({ icon, name, description }: { icon: string; name: string; description: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-white text-sm">{name}</div>
      <div className="text-xs text-gray-400 mt-1">{description}</div>
    </div>
  );
}

function ProcessStep({ step, title, description, children }: { step: string; title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="border-l-2 border-purple-500 pl-6 pb-2">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
          {step}
        </div>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
      </div>
      <p className="text-gray-300">{description}</p>
      {children}
    </div>
  );
}

function ParamCard({ name, description, example }: { name: string; description: string; example: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
      <h4 className="font-semibold text-white mb-2">{name}</h4>
      <p className="text-sm text-gray-300 mb-2">{description}</p>
      <p className="text-xs text-gray-500 italic">{example}</p>
    </div>
  );
}

function WalletCard({ name, description, features, link }: { name: string; description: string; features: string[]; link: string }) {
  return (
    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
      <h4 className="text-xl font-semibold text-white mb-3">{name}</h4>
      <p className="text-gray-300 mb-4">{description}</p>
      <ul className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-gray-400 flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm text-purple-400 hover:text-purple-300 underline"
      >
        Download {name} →
      </a>
    </div>
  );
}

function TroubleshootCard({ problem, solutions }: { problem: string; solutions: string[] }) {
  return (
    <div className="p-6 rounded-lg bg-white/5 border border-white/10">
      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
        <span className="text-red-400 mr-2">⚠️</span>
        {problem}
      </h4>
      <div className="text-sm text-gray-400 mb-2">Try these solutions:</div>
      <ul className="space-y-2">
        {solutions.map((solution, index) => (
          <li key={index} className="text-sm text-gray-300 flex items-start">
            <span className="text-cyan-400 mr-2">•</span>
            {solution}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-white pr-4">{question}</span>
        <span className="text-purple-400 text-xl flex-shrink-0">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-gray-300 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}
