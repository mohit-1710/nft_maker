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
    updateSettings,
    addElement,
    addElements
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
    const centerX = settings.canvasWidth / 2;
    const centerY = settings.canvasHeight / 2;
    
    if (template === 'pfp') {
      // Add a circular frame for profile picture
      const circleElement: any = {
        id: Date.now(),
        tool: 'ellipse',
        x1: centerX - 150,
        y1: centerY - 150,
        x2: centerX + 150,
        y2: centerY + 150,
        points: [],
        color: settings.color,
        strokeWidth: 8
      };
      addElement(circleElement);
    } else if (template === 'crypto-punk') {
      // Add a pixel art grid
      const gridElements: any[] = [];
      const gridSize = 20;
      const cellSize = 15;
      const startX = centerX - (gridSize * cellSize) / 2;
      const startY = centerY - (gridSize * cellSize) / 2;
      const baseId = Date.now();
      
      for (let i = 0; i <= gridSize; i++) {
        // Vertical lines
        gridElements.push({
          id: baseId + i * 100,
          tool: 'line',
          x1: startX + i * cellSize,
          y1: startY,
          x2: startX + i * cellSize,
          y2: startY + gridSize * cellSize,
          points: [],
          color: '#888888',
          strokeWidth: 1
        });
        // Horizontal lines
        gridElements.push({
          id: baseId + i * 100 + 50,
          tool: 'line',
          x1: startX,
          y1: startY + i * cellSize,
          x2: startX + gridSize * cellSize,
          y2: startY + i * cellSize,
          points: [],
          color: '#888888',
          strokeWidth: 1
        });
      }
      addElements(gridElements);
    }
  };
  
  const applyGradientBackground = () => {
    // Create a gradient effect using multiple rectangles
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
    const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
    const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
    
    changeBackground(randomColor1);
  };
  
  const addGlitterEffect = () => {
    // Add random sparkle elements
    const sparkles: any[] = [];
    const sparkleCount = 30;
    const baseId = Date.now();
    
    for (let i = 0; i < sparkleCount; i++) {
      const x = Math.random() * settings.canvasWidth;
      const y = Math.random() * settings.canvasHeight;
      const size = Math.random() * 4 + 2;
      
      sparkles.push({
        id: baseId + i * 100, // Better spacing between IDs
        tool: 'ellipse',
        x1: x - size,
        y1: y - size,
        x2: x + size,
        y2: y + size,
        points: [],
        color: ['#FFD700', '#FFF', '#FFFF00', '#FFA500'][Math.floor(Math.random() * 4)],
        strokeWidth: 1
      });
    }
    addElements(sparkles);
  };
  
  const addEmojiSticker = (emoji: string) => {
    // Add emoji as text element at center
    const centerX = settings.canvasWidth / 2;
    const centerY = settings.canvasHeight / 2;
    
    const textElement: any = {
      id: Date.now(),
      tool: 'text',
      x1: centerX - 40,
      y1: centerY,
      x2: centerX + 40,
      y2: centerY + 40,
      points: [],
      color: settings.color,
      strokeWidth: 0,
      text: emoji
    };
    addElement(textElement);
  };
  
  const applyFilter = (filterType: string) => {
    // Apply visual filter by adjusting background or adding overlay
    if (filterType === 'grayscale') {
      changeBackground('#808080');
    } else if (filterType === 'invert') {
      // Toggle between light and dark
      const isDark = settings.backgroundColor === '#000000' || settings.backgroundColor === '#ffffff';
      changeBackground(settings.backgroundColor === '#000000' ? '#ffffff' : '#000000');
    } else if (filterType === 'neon') {
      changeBackground('#0a0a0a');
      updateSettings({ color: '#00ff00' });
    }
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
      addElement(element);
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

      <main className="relative z-10 p-4 flex flex-col h-screen pb-28">
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
        showHint={!focusMode}
        onImageUpload={handleUploadImage}
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