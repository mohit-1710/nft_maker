export interface CanvasElement {
  id: number;
  tool: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  src?: string;
  width?: number;
  height?: number;
  text?: string;
}

export interface CanvasState {
  elements: CanvasElement[];
  currentElement: CanvasElement | null;
  selectedElement: number | null;
  isDrawing: boolean;
  isPanning: boolean;
  panOffset: { x: number; y: number };
  startPanPosition: { x: number; y: number };
  isDragging: boolean;
  isResizing: boolean;
  resizeHandle: string | null;
  dragStart: { x: number; y: number };
  elementStart: { x1: number; y1: number; x2: number; y2: number } | null;
}

export interface CanvasSettings {
  tool: string;
  color: string;
  brushSize: number;
  fontSize: number;
  backgroundColor: string;
  canvasWidth: number;
  canvasHeight: number;
  tempWidth: number;
  tempHeight: number;
}

export interface Tool {
  id: string;
  icon: any;
  label: string;
  key: string;
}

export interface HistoryState {
  history: string[];
  historyStep: number;
}
