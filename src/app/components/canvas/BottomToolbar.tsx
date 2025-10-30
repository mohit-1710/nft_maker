'use client';
import React, { useEffect } from 'react';
import { Hand, MousePointer2, Square, Circle, Type, Eraser, Pencil, ImageIcon, MoreHorizontal, Minus, Diamond, ArrowRight, Lock } from 'lucide-react';
import { Tool } from '@/types/canvas';
import styles from './BottomToolbar.module.css';

interface BottomToolbarProps {
  tool: string;
  onToolChange: (tool: string) => void;
}

const tools: Tool[] = [
  { id: 'hand', icon: Hand, label: 'Hand', key: 'H' },
  { id: 'selection', icon: MousePointer2, label: 'Selection', key: '1' },
  { id: 'rectangle', icon: Square, label: 'Rectangle', key: '2' },
  { id: 'diamond', icon: Diamond, label: 'Diamond', key: '3' },
  { id: 'ellipse', icon: Circle, label: 'Ellipse', key: '4' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow', key: '5' },
  { id: 'line', icon: Minus, label: 'Line', key: '6' },
  { id: 'draw', icon: Pencil, label: 'Draw', key: '7' },
  { id: 'text', icon: Type, label: 'Text', key: '8' },
  { id: 'image', icon: ImageIcon, label: 'Image', key: '9' },
  { id: 'eraser', icon: Eraser, label: 'Eraser', key: '0' },
];

export const BottomToolbar: React.FC<BottomToolbarProps> = ({ tool, onToolChange }) => {
  const [showShortcutFeedback, setShowShortcutFeedback] = React.useState<string | null>(null);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key;
      const toolToSelect = tools.find(t => t.key === key);
      
      if (toolToSelect) {
        e.preventDefault();
        onToolChange(toolToSelect.id);
        
        // Show visual feedback
        setShowShortcutFeedback(toolToSelect.label);
        setTimeout(() => setShowShortcutFeedback(null), 1000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onToolChange]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10">
      {/* Keyboard shortcut feedback */}
      {showShortcutFeedback && (
        <div className={`mb-3 text-center ${styles.shortcutFeedback}`}>
          <span className="text-sm text-purple-400 bg-purple-900/20 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/30">
            ✓ {showShortcutFeedback} selected
          </span>
        </div>
      )}
      
      {/* Hint text */}
      <div className={`mb-3 text-center ${styles.hintText}`}>
        <span className="text-xs text-gray-400 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
          Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">1-0</kbd> to select tools
        </span>
      </div>
      
      {/* Main toolbar */}
      <div className={`${styles.toolbar} bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl`}>
        <div className="flex items-center px-4 py-2">
          {/* Lock tool */}
          <button
            className={`${styles.toolButton} p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50`}
            title="Keep selected tool active after drawing"
          >
            <Lock size={18} />
          </button>
          
          {/* Divider */}
          <div className={`w-px h-6 ${styles.divider} mx-2`}></div>
          
          {/* Hand tool */}
          <button
            onClick={() => onToolChange('hand')}
            className={`${styles.toolButton} p-3 rounded-lg ${
              tool === 'hand' 
                ? 'text-white bg-gray-700/50' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            }`}
            title="Hand tool (H)"
          >
            <Hand size={18} />
          </button>
          
          {/* Divider */}
          <div className={`w-px h-6 ${styles.divider} mx-2`}></div>
          
          {/* Main tools */}
          {tools.slice(1).map((t) => {
            const Icon = t.icon;
            const isActive = tool === t.id;
            
            return (
              <button
                key={t.id}
                onClick={() => onToolChange(t.id)}
                className={`${styles.toolButton} relative p-3 rounded-lg group mx-1 ${
                  isActive 
                    ? `${styles.activeTool} text-white` 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
                title={`${t.label} (${t.key})`}
              >
                <Icon size={18} />
                {/* Keyboard shortcut indicator */}
                <span className={`${styles.keyboardShortcut} absolute -top-1 -right-1`}>
                  {t.key}
                </span>
              </button>
            );
          })}
          
          {/* Divider */}
          <div className={`w-px h-6 ${styles.divider} mx-2`}></div>
          
          {/* More tools */}
          <button
            className={`${styles.toolButton} p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50`}
            title="More tools"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
