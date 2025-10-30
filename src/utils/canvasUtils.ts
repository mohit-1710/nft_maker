import { CanvasElement } from '@/types/canvas';

export const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement, panOffset: { x: number; y: number }) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left - panOffset.x,
    y: e.clientY - rect.top - panOffset.y
  };
};

export const isPointInElement = (point: { x: number; y: number }, element: CanvasElement) => {
  const { x1, y1, x2, y2 } = element;
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  
  return point.x >= minX - 10 && point.x <= maxX + 10 && 
         point.y >= minY - 10 && point.y <= maxY + 10;
};

const HANDLE_SIZE = 8;

export const getResizeHandles = (element: CanvasElement) => {
  const minX = Math.min(element.x1, element.x2);
  const maxX = Math.max(element.x1, element.x2);
  const minY = Math.min(element.y1, element.y2);
  const maxY = Math.max(element.y1, element.y2);
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  return {
    nw: { x: minX, y: minY, cursor: 'nw-resize' },
    n: { x: midX, y: minY, cursor: 'n-resize' },
    ne: { x: maxX, y: minY, cursor: 'ne-resize' },
    e: { x: maxX, y: midY, cursor: 'e-resize' },
    se: { x: maxX, y: maxY, cursor: 'se-resize' },
    s: { x: midX, y: maxY, cursor: 's-resize' },
    sw: { x: minX, y: maxY, cursor: 'sw-resize' },
    w: { x: minX, y: midY, cursor: 'w-resize' },
  };
};

export const getResizeHandle = (point: { x: number; y: number }, element: CanvasElement): string | null => {
  const handles = getResizeHandles(element);
  
  for (const [name, handle] of Object.entries(handles)) {
    const dx = point.x - handle.x;
    const dy = point.y - handle.y;
    if (Math.sqrt(dx * dx + dy * dy) <= HANDLE_SIZE) {
      return name;
    }
  }
  
  return null;
};

export const drawResizeHandles = (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
  const handles = getResizeHandles(element);
  
  ctx.fillStyle = '#3b82f6';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  
  Object.values(handles).forEach(handle => {
    ctx.fillRect(handle.x - HANDLE_SIZE / 2, handle.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
    ctx.strokeRect(handle.x - HANDLE_SIZE / 2, handle.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
  });
};

export const drawElement = (ctx: CanvasRenderingContext2D, element: CanvasElement, selectedElement: number | null) => {
  ctx.strokeStyle = element.color;
  ctx.lineWidth = element.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const { x1, y1, x2, y2 } = element;

  switch (element.tool) {
    case 'rectangle':
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      break;
    case 'ellipse':
      const radiusX = Math.abs(x2 - x1) / 2;
      const radiusY = Math.abs(y2 - y1) / 2;
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    case 'diamond':
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      ctx.beginPath();
      ctx.moveTo(midX, y1);
      ctx.lineTo(x2, midY);
      ctx.lineTo(midX, y2);
      ctx.lineTo(x1, midY);
      ctx.closePath();
      ctx.stroke();
      break;
    case 'line':
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      break;
    case 'arrow':
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLength = 15;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
      break;
    case 'draw':
      if (element.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(element.points[0].x, element.points[0].y);
        element.points.forEach((point: { x: number; y: number }) => ctx.lineTo(point.x, point.y));
        ctx.stroke();
      }
      break;
    case 'image':
      if (element.src) {
        const img = new Image();
        img.src = element.src;
        ctx.drawImage(img, x1, y1, x2 - x1, y2 - y1);
      }
      break;
    case 'text':
      if (element.text) {
        ctx.fillStyle = element.color;
        ctx.font = `${Math.abs(y2 - y1) || 48}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.text, (x1 + x2) / 2, (y1 + y2) / 2);
      }
      break;
    default:
      break;
  }

  if (selectedElement === element.id) {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const padding = 5;
    ctx.strokeRect(
      Math.min(x1, x2) - padding,
      Math.min(y1, y2) - padding,
      Math.abs(x2 - x1) + padding * 2,
      Math.abs(y2 - y1) + padding * 2
    );
    ctx.setLineDash([]);
    
    // Draw resize handles
    drawResizeHandles(ctx, element);
  }
};

export const createCanvasElement = (
  tool: string,
  pos: { x: number; y: number },
  color: string,
  brushSize: number
): CanvasElement => ({
  id: Date.now(),
  tool,
  x1: pos.x,
  y1: pos.y,
  x2: pos.x,
  y2: pos.y,
  points: tool === 'draw' ? [pos] : [],
  color,
  strokeWidth: brushSize,
});

export const updateCanvasElement = (
  element: CanvasElement,
  pos: { x: number; y: number },
  tool: string
): CanvasElement => {
  if (tool === 'draw') {
    return {
      ...element,
      points: [...element.points, pos]
    };
  } else {
    return {
      ...element,
      x2: pos.x,
      y2: pos.y
    };
  }
};
