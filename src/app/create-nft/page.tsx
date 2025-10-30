'use client'
import React, { useEffect, useState } from 'react';
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
  const [focusMode, setFocusMode] = useState(false);
  
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

  // Keyboard: toggle Focus Mode with "f"
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;
      if (e.key.toLowerCase() === 'f') {
        setFocusMode(prev => !prev);
        if (!focusMode) setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusMode]);

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
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-black"></div>
          <div className="absolute -top-24 -left-16 w-[30rem] h-[30rem] bg-purple-800/25 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 right-0 w-[26rem] h-[26rem] bg-purple-700/20 rounded-full blur-3xl"></div>
        </div>
      
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
          isSidebarOpen={!focusMode && isSidebarOpen}
          onToggleSidebar={() => { setIsSidebarOpen(!isSidebarOpen); if (!isSidebarOpen) setFocusMode(false); }}
          onDownload={handleDownload}
          onMint={handleMintClick}
          isLoading={isLoading}
          isWalletConnected={!!wallet.publicKey}
          signature={signature}
          error={error}
        />

            <div className={`flex-1 flex items-center justify-center ${focusMode ? 'pt-2' : ''}`}>
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
        showHint={!focusMode}
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