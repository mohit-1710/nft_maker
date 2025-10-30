'use client'
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Sidebar } from '@/app/components/canvas/Sidebar';
import { BottomToolbar } from '@/app/components/canvas/BottomToolbar';
import { Canvas } from '@/app/components/canvas/Canvas';
import { MintModal } from '@/app/components/canvas/MintModal';
import { CanvasHeader } from '@/app/components/canvas/CanvasHeader';
import { useCanvas } from '@/hooks/useCanvas';
import { useNFTMint } from '@/hooks/useNFTMint';

export default function NFTCanvasEditor() {
  const wallet = useWallet();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const {
    canvasRef,
    canvasState,
    settings,
    history,
    text,
    setText,
    saveState,
    changeBackground,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    undo,
    redo,
    clearCanvas,
    updateSettings
  } = useCanvas();

  const {
    isLoading,
    signature,
    error,
    showModal,
    setShowModal,
    handleMintClick,
    confirmMint,
    downloadImage,
    uploadImage
  } = useNFTMint();

  // Template and effect handlers
  const addNFTTemplate = (template: string) => {
    console.log('addNFTTemplate called with:', template);
  };
  
  const applyGradientBackground = () => {
    console.log('applyGradientBackground called');
  };
  
  const addGlitterEffect = () => {
    console.log('addGlitterEffect called');
  };
  
  const addEmojiSticker = (emoji: string) => {
    console.log('addEmojiSticker called with:', emoji);
  };
  
  const applyFilter = (filterType: string) => {
    console.log('applyFilter called with:', filterType);
  };

  // Handlers for canvas operations
  const handleDownload = () => {
    downloadImage(settings.canvasWidth, settings.canvasHeight, settings.backgroundColor, canvasState.elements);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadImage(e, settings.canvasWidth, settings.canvasHeight, (element) => {
      // Add element to canvas state
      // This would need to be implemented in the useCanvas hook
    }, saveState);
  };

  const handleConfirmMint = () => {
    confirmMint(canvasRef);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-950/50 via-black to-cyan-950/50"></div>
        <div className="fixed inset-0 opacity-30">
            <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        <div className="fixed inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")` }}></div>
      
      <Sidebar
        isOpen={isSidebarOpen}
        settings={settings}
        onSettingsChange={updateSettings}
        onBackgroundChange={changeBackground}
        onUploadImage={handleUploadImage}
        onAddNFTTemplate={addNFTTemplate}
        onApplyGradientBackground={applyGradientBackground}
        onAddGlitterEffect={addGlitterEffect}
        onAddEmojiSticker={addEmojiSticker}
        onApplyFilter={applyFilter}
      />

      <main className="relative z-10 p-4 flex flex-col h-screen">
        <CanvasHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onDownload={handleDownload}
          onMint={handleMintClick}
          isLoading={isLoading}
          isWalletConnected={!!wallet.publicKey}
          signature={signature}
          error={error}
        />

            <div className="flex-1 flex items-center justify-center">
          <Canvas
            canvasRef={canvasRef}
            canvasState={canvasState}
            settings={settings}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onUndo={undo}
            onRedo={redo}
            onClear={clearCanvas}
            canUndo={history.historyStep > 0}
            canRedo={history.historyStep < history.history.length - 1}
          />
        </div>
      </main>

      <BottomToolbar
        tool={settings.tool}
        onToolChange={(tool) => updateSettings({ tool })}
      />

      <MintModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmMint}
        isLoading={isLoading}
      />
    </div>
  );
}