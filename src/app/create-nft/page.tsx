'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Download, Square, Circle, Type, Eraser, Undo, Redo, Trash2, Upload, Pencil, Sparkles, Star } from 'lucide-react';

export default function NFTCanvasEditor() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state after a brief delay to ensure canvas is ready
    setTimeout(() => {
      const initialState = canvas.toDataURL();
      setHistory([initialState]);
      setHistoryStep(0);
    }, 0);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = history[newStep];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = history[newStep];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const changeBackground = (newColor) => {
    setBackgroundColor(newColor);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = newColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
    saveState();
  };

  const applyGradientBackground = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#f093fb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const addPixelArtGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    
    for (let i = 0; i <= canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    
    for (let i = 0; i <= canvas.height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    saveState();
  };

  const addNFTTemplate = (template) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (template === 'pfp') {
      ctx.strokeStyle = color;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 300, 0, Math.PI * 2);
      ctx.stroke();
    } else if (template === 'crypto-punk') {
      const pixelSize = 80;
      ctx.fillStyle = '#e0e0e0';
      for (let x = 0; x < canvas.width; x += pixelSize) {
        for (let y = 0; y < canvas.height; y += pixelSize) {
          if ((x + y) % (pixelSize * 2) === 0) {
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }
    } else if (template === 'bored-ape') {
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 20;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    }
    saveState();
  };

  const addGlitterEffect = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 3 + 1;
      
      ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 70%)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    saveState();
  };

  const addEmojiSticker = (emoji) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.font = '60px Arial';
    ctx.fillText(emoji, canvas.width / 2 - 30, canvas.height / 2);
    saveState();
  };

  const applyFilter = (filterType) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    if (filterType === 'grayscale') {
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
    } else if (filterType === 'invert') {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
    } else if (filterType === 'neon') {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.5);
        data[i + 1] = Math.min(255, data[i + 1] * 1.2);
        data[i + 2] = Math.min(255, data[i + 2] * 1.8);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    saveState();
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');

    setIsDrawing(true);

    if (tool === 'pencil') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
    } else if (tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = backgroundColor;
      ctx.lineWidth = brushSize * 2;
      ctx.lineCap = 'round';
    } else if (tool === 'spray') {
      sprayPaint(x, y, ctx);
    } else if (tool === 'rectangle') {
      ctx.fillStyle = color;
      ctx.fillRect(x - 50, y - 50, 100, 100);
      saveState();
      setIsDrawing(false);
    } else if (tool === 'circle') {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      ctx.fill();
      saveState();
      setIsDrawing(false);
    } else if (tool === 'star') {
      drawStar(ctx, x, y, 5, 50, 25);
      saveState();
      setIsDrawing(false);
    } else if (tool === 'text') {
      if (text) {
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(text, x, y);
        saveState();
      }
      setIsDrawing(false);
    }
  };

  const sprayPaint = (x, y, ctx) => {
    const density = 20;
    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * brushSize * 2;
      const offsetY = (Math.random() - 0.5) * brushSize * 2;
      ctx.fillStyle = color;
      ctx.fillRect(x + offsetX, y + offsetY, 2, 2);
    }
  };

  const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (tool !== 'pencil' && tool !== 'eraser' && tool !== 'spray') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');

    if (tool === 'spray') {
      sprayPaint(x, y, ctx);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing && (tool === 'pencil' || tool === 'eraser' || tool === 'spray')) {
      saveState();
    }
    setIsDrawing(false);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'my-nft.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width / 2) - (img.width / 2) * scale;
          const y = (canvas.height / 2) - (img.height / 2) * scale;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          saveState();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const basicTools = [
    { name: 'pencil', icon: Pencil, label: 'Pencil' },
    { name: 'eraser', icon: Eraser, label: 'Eraser' },
    { name: 'spray', icon: Sparkles, label: 'Spray' },
    { name: 'rectangle', icon: Square, label: 'Rectangle' },
    { name: 'circle', icon: Circle, label: 'Circle' },
    { name: 'star', icon: Star, label: 'Star' },
    { name: 'text', icon: Type, label: 'Text' },
  ];

  const colorPresets = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B195', '#C06C84'
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

        <div className="fixed inset-0 bg-gradient-to-br from-purple-950/50 via-black to-cyan-950/50"></div>
            
            {/* Animated mesh gradient */}
            <div className="fixed inset-0 opacity-30">
                <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Hexagonal pattern overlay */}
            <div className="fixed inset-0 opacity-5" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
            }}></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              NFT Canvas Studio
            </h1>
            <p className="text-gray-400">Professional NFT Creation Tool for Solana</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-2xl">
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Drawing Tools</h2>
                <div className="space-y-2">
                  {basicTools.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setTool(t.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                        tool === t.name
                          ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white shadow-lg'
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <t.icon size={18} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-2xl">
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Colors</h2>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-12 rounded-lg cursor-pointer bg-gray-800 border border-gray-700 mb-3"
                />
                <div className="grid grid-cols-5 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setColor(preset)}
                      className="w-full h-10 rounded-lg border-2 border-gray-700 hover:border-white transition-all"
                      style={{ backgroundColor: preset }}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-2xl">
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Settings</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-300 text-sm mb-1 block">
                      Brush Size: {brushSize}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                  </div>

                  {tool === 'text' && (
                    <>
                      <div>
                        <label className="text-gray-300 text-sm mb-1 block">Text</label>
                        <input
                          type="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Enter text..."
                          className="w-full px-3 py-2 rounded-lg bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm mb-1 block">
                          Font Size: {fontSize}px
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="72"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="w-full accent-purple-600"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-gray-300 text-sm mb-1 block">Background</label>
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => changeBackground(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-2xl">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-200">Canvas (800x800)</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={undo}
                      disabled={historyStep <= 0}
                      className="p-2 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-gray-300 transition-all border border-gray-700"
                      title="Undo"
                    >
                      <Undo size={18} />
                    </button>
                    <button
                      onClick={redo}
                      disabled={historyStep >= history.length - 1}
                      className="p-2 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-gray-300 transition-all border border-gray-700"
                      title="Redo"
                    >
                      <Redo size={18} />
                    </button>
                    <button
                      onClick={clearCanvas}
                      className="p-2 bg-red-900/50 hover:bg-red-800/50 rounded-lg text-red-300 transition-all border border-red-700"
                      title="Clear Canvas"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-center bg-gray-800/30 rounded-lg p-4">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={800}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="border-2 border-gray-700 rounded-lg cursor-crosshair shadow-2xl"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-2xl">
                <h2 className="text-lg font-semibold text-gray-200 mb-3">NFT Templates</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => addNFTTemplate('pfp')}
                    className="w-full px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all text-sm"
                  >
                    PFP Circle Frame
                  </button>
                  <button
                    onClick={() => addNFTTemplate('crypto-punk')}
                    className="w-full px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all text-sm"
                  >
                    Pixel Art Grid
                  </button>
                  <button
                    onClick={() => addNFTTemplate('bored-ape')}
                    className="w-full px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all text-sm"
                  >
                    Classic Border
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-2xl">
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Effects</h2>
                <div className="space-y-2">
                  <button
                    onClick={applyGradientBackground}
                    className="w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all text-sm"
                  >
                    Gradient BG
                  </button>
                  <button
                    onClick={addGlitterEffect}
                    className="w-full px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg transition-all text-sm"
                  >
                    Add Glitter
                  </button>
                  <button
                    onClick={addPixelArtGrid}
                    className="w-full px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all text-sm"
                  >
                    Pixel Grid
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-2xl">
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Filters</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => applyFilter('grayscale')}
                    className="w-full px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all text-sm"
                  >
                    Grayscale
                  </button>
                  <button
                    onClick={() => applyFilter('invert')}
                    className="w-full px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all text-sm"
                  >
                    Invert Colors
                  </button>
                  <button
                    onClick={() => applyFilter('neon')}
                    className="w-full px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all text-sm"
                  >
                    Neon Boost
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-2xl">
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Emoji Stickers</h2>
                <div className="grid grid-cols-4 gap-2">
                  {['🚀', '💎', '🔥', '⭐', '💰', '👑', '🌈', '⚡'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addEmojiSticker(emoji)}
                      className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all text-2xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-2xl">
                <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-all text-gray-300 border border-gray-700">
                  <Upload size={18} />
                  <span className="text-sm">Import Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gray-900/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-2xl">
            <button
              onClick={downloadImage}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg text-white font-semibold transition-all shadow-lg"
            >
              <Download size={20} />
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}