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
}

export interface CanvasState {
  elements: CanvasElement[];
  currentElement: CanvasElement | null;
  selectedElement: number | null;
  isDrawing: boolean;
  isPanning: boolean;
  panOffset: { x: number; y: number };
  startPanPosition: { x: number; y: number };
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
