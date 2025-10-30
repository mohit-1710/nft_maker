import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

export const useNFTMint = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const wallet = useWallet();

  const handleMintClick = () => {
    if (!wallet.publicKey) {
      setError('Please connect your wallet.');
      return;
    }
    setShowModal(true);
  };

  const confirmMint = async (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    setShowModal(false);
    setIsLoading(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not found");

      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "nft.png", { type: "image/png" });

      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post("/api/upload", formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      
      if (!res.data.ipfsHash) {
        throw new Error(res.data.error || 'Failed to upload image to IPFS');
      }
      
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${res.data.ipfsHash}`;

      // Redirect to the mint page with the image URL
      window.location.href = `/mint/nft?imageUrl=${encodeURIComponent(imageUrl)}`;

    } catch (err: any) {
      console.error('Mint error:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while minting');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (canvasWidth: number, canvasHeight: number, backgroundColor: string, elements: any[]) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.fillStyle = backgroundColor;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Import drawElement function here to avoid circular dependency
    import('@/utils/canvasUtils').then(({ drawElement }) => {
      elements.forEach(el => drawElement(tempCtx, el, null));
      
      const link = document.createElement('a');
      link.download = 'my-nft.png';
      link.href = tempCanvas.toDataURL();
      link.click();
    });
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>, canvasWidth: number, canvasHeight: number, onAddElement: (element: any) => void, onSaveState: () => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const newImageElement = {
            id: Date.now(),
            tool: 'image',
            x1: (canvasWidth / 2) - (img.width / 2),
            y1: (canvasHeight / 2) - (img.height / 2),
            x2: (canvasWidth / 2) + (img.width / 2),
            y2: (canvasHeight / 2) + (img.height / 2),
            src: event.target?.result as string,
            width: img.width,
            height: img.height,
            color: '#000000',
            strokeWidth: 1,
            points: []
          };
          onAddElement(newImageElement);
          onSaveState();
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    isLoading,
    signature,
    error,
    showModal,
    setShowModal,
    handleMintClick,
    confirmMint,
    downloadImage,
    uploadImage
  };
};
