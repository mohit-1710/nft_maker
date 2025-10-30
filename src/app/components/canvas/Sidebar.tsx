'use client';
import React, { useState, useEffect } from 'react';
import { Upload, Palette, Settings, Image, Sparkles, Filter, Smile } from 'lucide-react';
import { CanvasSettings } from '@/types/canvas';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  settings: CanvasSettings;
  onSettingsChange: (settings: Partial<CanvasSettings>) => void;
  onBackgroundChange: (color: string) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddNFTTemplate: (template: string) => void;
  onApplyGradientBackground: () => void;
  onAddGlitterEffect: () => void;
  onAddEmojiSticker: (emoji: string) => void;
  onApplyFilter: (filterType: string) => void;
}

const colorPresets = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B195', '#C06C84'
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  settings,
  onSettingsChange,
  onBackgroundChange,
  onUploadImage,
  onAddNFTTemplate,
  onApplyGradientBackground,
  onAddGlitterEffect,
  onAddEmojiSticker,
  onApplyFilter
}) => {
  const [showAutoApply, setShowAutoApply] = useState(false);

  // Auto-apply canvas dimensions when they change
  useEffect(() => {
    if (settings.tempWidth !== settings.canvasWidth || settings.tempHeight !== settings.canvasHeight) {
      const timer = setTimeout(() => {
        onSettingsChange({
          canvasWidth: settings.tempWidth,
          canvasHeight: settings.tempHeight
        });
        setShowAutoApply(true);
        setTimeout(() => setShowAutoApply(false), 2000);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timer);
    }
  }, [settings.tempWidth, settings.tempHeight, settings.canvasWidth, settings.canvasHeight, onSettingsChange]);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <div className={styles.sidebarContent}>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Palette size={24} />
          Customize
        </h2>
        
        {/* Upload Image */}
        <div className={styles.section}>
          <label className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 rounded-xl cursor-pointer transition-all text-white border border-purple-500/30 hover:border-purple-500/50">
            <Upload size={20} />
            <span className="font-medium">Upload Image</span>
            <input type="file" accept="image/*" onChange={onUploadImage} className="hidden" />
          </label>
        </div>
        
        {/* Colors */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Palette size={18} />
            Colors
          </h3>
          <input 
            type="color" 
            value={settings.color} 
            onChange={(e) => onSettingsChange({ color: e.target.value })} 
            className={styles.colorInput}
          />
          <div className={styles.colorPresets}>
            {colorPresets.map((preset) => (
              <button 
                key={preset} 
                onClick={() => onSettingsChange({ color: preset })} 
                className={styles.colorPreset}
                style={{ backgroundColor: preset }}
                title={preset}
              />
            ))}
          </div>
        </div>

        {/* Canvas Dimensions */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Image size={18} />
            Canvas Dimensions
          </h3>
          <div className={styles.inputGroup}>
            <input 
              type="number" 
              value={settings.tempWidth} 
              onChange={(e) => onSettingsChange({ tempWidth: Number(e.target.value) })} 
              placeholder="Width" 
              className={styles.dimensionInput}
              min="100"
              max="2000"
            />
            <input 
              type="number" 
              value={settings.tempHeight} 
              onChange={(e) => onSettingsChange({ tempHeight: Number(e.target.value) })} 
              placeholder="Height" 
              className={styles.dimensionInput}
              min="100"
              max="2000"
            />
          </div>
          <div className={`${styles.autoApplyIndicator} ${showAutoApply ? styles.visible : ''}`}>
            ✓ Auto-applied
          </div>
        </div>

        {/* Settings */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Settings size={18} />
            Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block font-medium">
                Brush Size: {settings.brushSize}px
              </label>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={settings.brushSize} 
                onChange={(e) => onSettingsChange({ brushSize: Number(e.target.value) })} 
                className={styles.rangeInput}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block font-medium">
                Font Size: {settings.fontSize}px
              </label>
              <input 
                type="range" 
                min="12" 
                max="72" 
                value={settings.fontSize} 
                onChange={(e) => onSettingsChange({ fontSize: Number(e.target.value) })} 
                className={styles.rangeInput}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block font-medium">Background</label>
              <input 
                type="color" 
                value={settings.backgroundColor} 
                onChange={(e) => onBackgroundChange(e.target.value)} 
                className={styles.colorInput}
              />
            </div>
          </div>
        </div>
        
        {/* Templates & Effects */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Sparkles size={18} />
            Templates & Effects
          </h3>
          <div className="space-y-2">
            <button 
              onClick={() => onAddNFTTemplate('pfp')} 
              className={styles.button}
            >
              PFP Circle Frame
            </button>
            <button 
              onClick={() => onAddNFTTemplate('crypto-punk')} 
              className={styles.button}
            >
              Pixel Art Grid
            </button>
            <button 
              onClick={onApplyGradientBackground} 
              className={`${styles.button} ${styles.gradientButton}`}
            >
              Gradient BG
            </button>
            <button 
              onClick={onAddGlitterEffect} 
              className={`${styles.button} ${styles.gradientButton}`}
            >
              Add Glitter
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Filter size={18} />
            Filters
          </h3>
          <div className="space-y-2">
            <button 
              onClick={() => onApplyFilter('grayscale')} 
              className={styles.button}
            >
              Grayscale
            </button>
            <button 
              onClick={() => onApplyFilter('invert')} 
              className={styles.button}
            >
              Invert Colors
            </button>
            <button 
              onClick={() => onApplyFilter('neon')} 
              className={styles.button}
            >
              Neon Boost
            </button>
          </div>
        </div>

        {/* Stickers */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Smile size={18} />
            Stickers
          </h3>
          <div className={styles.emojiGrid}>
            {['🚀', '💎', '🔥', '⭐', '💰', '👑', '🌈', '⚡'].map((emoji) => (
              <button 
                key={emoji} 
                onClick={() => onAddEmojiSticker(emoji)} 
                className={styles.emojiButton}
                title={`Add ${emoji} sticker`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
