import { useState, useRef, useCallback, useEffect } from 'react';
import { CanvasElement, CanvasState, CanvasSettings, HistoryState } from '@/types/canvas';
import { getMousePos, isPointInElement, createCanvasElement, updateCanvasElement } from '@/utils/canvasUtils';

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [canvasState, setCanvasState] = useState<CanvasState>({
    elements: [],
    currentElement: null,
    selectedElement: null,
    isDrawing: false,
    isPanning: false,
    panOffset: { x: 0, y: 0 },
    startPanPosition: { x: 0, y: 0 }
  });

  const [settings, setSettings] = useState<CanvasSettings>({
    tool: 'pencil',
    color: '#000000',
    brushSize: 5,
    fontSize: 24,
    backgroundColor: '#ffffff',
    canvasWidth: 800,
    canvasHeight: 800,
    tempWidth: 800,
    tempHeight: 800
  });

  const [history, setHistory] = useState<HistoryState>({
    history: [],
    historyStep: -1
  });

  const [text, setText] = useState('');

  const saveState = useCallback(() => {
    const newHistory = history.history.slice(0, history.historyStep + 1);
    newHistory.push(JSON.stringify(canvasState.elements));
    setHistory({
      history: newHistory,
      historyStep: newHistory.length - 1
    });
  }, [canvasState.elements, history.history, history.historyStep]);

  // Auto-apply canvas dimensions when they change
  useEffect(() => {
    if (settings.tempWidth !== settings.canvasWidth || settings.tempHeight !== settings.canvasHeight) {
      setSettings(prev => ({
        ...prev,
        canvasWidth: prev.tempWidth,
        canvasHeight: prev.tempHeight
      }));
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(0, 0, settings.tempWidth, settings.tempHeight);
      const initialState = canvas.toDataURL();
      setHistory({
        history: [initialState],
        historyStep: 0
      });
    }
  }, [settings.tempWidth, settings.tempHeight, settings.canvasWidth, settings.canvasHeight, settings.backgroundColor]);

  const changeBackground = useCallback((newColor: string) => {
    setSettings(prev => ({ ...prev, backgroundColor: newColor }));
    saveState();
  }, [saveState]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = getMousePos(e, canvas, canvasState.panOffset);

    if (settings.tool === 'hand') {
      setCanvasState(prev => ({
        ...prev,
        isPanning: true,
        startPanPosition: { x: e.clientX - prev.panOffset.x, y: e.clientY - prev.panOffset.y }
      }));
      return;
    }

    if (settings.tool === 'selection') {
      const clickedElement = canvasState.elements.find(el => isPointInElement(pos, el));
      setCanvasState(prev => ({
        ...prev,
        selectedElement: clickedElement?.id || null
      }));
      return;
    }

    if (settings.tool === 'eraser') {
      const elementToErase = canvasState.elements.find(el => isPointInElement(pos, el));
      if (elementToErase) {
        setCanvasState(prev => ({
          ...prev,
          elements: prev.elements.filter(el => el.id !== elementToErase.id)
        }));
      }
      return;
    }

    const newElement = createCanvasElement(settings.tool, pos, settings.color, settings.brushSize);
    
    setCanvasState(prev => ({
      ...prev,
      isDrawing: true,
      currentElement: newElement
    }));
  }, [settings, canvasState.panOffset, canvasState.elements]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (canvasState.isPanning) {
      setCanvasState(prev => ({
        ...prev,
        panOffset: {
          x: e.clientX - prev.startPanPosition.x,
          y: e.clientY - prev.startPanPosition.y
        }
      }));
      return;
    }

    if (!canvasState.isDrawing || !canvasState.currentElement) return;

    const pos = getMousePos(e, canvas, canvasState.panOffset);
    const updatedElement = updateCanvasElement(canvasState.currentElement, pos, settings.tool);
    
    setCanvasState(prev => ({
      ...prev,
      currentElement: updatedElement
    }));
  }, [canvasState.isPanning, canvasState.isDrawing, canvasState.currentElement, canvasState.panOffset, settings.tool]);

  const handleMouseUp = useCallback(() => {
    if (canvasState.isPanning) {
      setCanvasState(prev => ({ ...prev, isPanning: false }));
      return;
    }

    if (canvasState.isDrawing && canvasState.currentElement) {
      setCanvasState(prev => ({
        ...prev,
        elements: [...prev.elements, prev.currentElement!],
        currentElement: null,
        isDrawing: false
      }));
    }
  }, [canvasState.isPanning, canvasState.isDrawing, canvasState.currentElement]);

  const undo = useCallback(() => {
    if (history.historyStep > 0) {
      const newStep = history.historyStep - 1;
      setHistory(prev => ({ ...prev, historyStep: newStep }));
      setCanvasState(prev => ({
        ...prev,
        elements: JSON.parse(history.history[newStep])
      }));
    }
  }, [history.historyStep, history.history]);

  const redo = useCallback(() => {
    if (history.historyStep < history.history.length - 1) {
      const newStep = history.historyStep + 1;
      setHistory(prev => ({ ...prev, historyStep: newStep }));
      setCanvasState(prev => ({
        ...prev,
        elements: JSON.parse(history.history[newStep])
      }));
    }
  }, [history.historyStep, history.history]);

  const clearCanvas = useCallback(() => {
    setCanvasState(prev => ({ ...prev, elements: [] }));
    saveState();
  }, [saveState]);

  const updateSettings = useCallback((newSettings: Partial<CanvasSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
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
  };
};
