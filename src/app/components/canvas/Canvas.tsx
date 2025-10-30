'use client';
import React, { useEffect } from 'react';
import { Undo, Redo, Trash2 } from 'lucide-react';
import { CanvasState, CanvasSettings } from '@/types/canvas';
import { drawElement } from '@/utils/canvasUtils';

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasState: CanvasState;
  settings: CanvasSettings;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  canvasState,
  settings,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo
}) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvasState.panOffset.x, canvasState.panOffset.y);

    // Draw all elements
    canvasState.elements.forEach(el => drawElement(ctx, el, canvasState.selectedElement));
    
    // Draw current element being drawn
    if (canvasState.currentElement) {
      drawElement(ctx, canvasState.currentElement, canvasState.selectedElement);
    }

    ctx.restore();
  }, [canvasState, settings, canvasRef]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={settings.canvasWidth}
        height={settings.canvasHeight}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className={`border-2 border-gray-700 rounded-lg shadow-2xl max-w-full max-h-full`}
        style={{ 
          aspectRatio: `${settings.canvasWidth} / ${settings.canvasHeight}`,
          cursor: canvasState.isPanning ? 'grabbing' 
                  : canvasState.isDragging ? 'move' 
                  : canvasState.isResizing ? `${canvasState.resizeHandle}-resize`
                  : settings.tool === 'hand' ? 'grab'
                  : settings.tool === 'selection' ? 'default'
                  : 'crosshair'
        }}
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-30 rounded-lg text-gray-300"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-30 rounded-lg text-gray-300"
          title="Redo"
        >
          <Redo size={18} />
        </button>
        <button
          onClick={onClear}
          className="p-2 bg-red-900/50 hover:bg-red-800/50 rounded-lg text-red-300"
          title="Clear"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
