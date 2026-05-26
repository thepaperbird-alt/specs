import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (base64: string, preview: string) => void;
  isAnalyzing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Extract base64 data only (remove data:image/jpeg;base64, prefix) for API
        const base64Data = result.split(',')[1];
        onImageSelected(base64Data, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onImageSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`
        relative w-full aspect-[4/3] sm:aspect-square bg-[#CDCDCD] 
        flex flex-col items-center justify-center text-center
        transition-all duration-200 ease-in-out
        ${dragActive ? 'bg-[#c0c0c0] ring-2 ring-spec-accent' : ''}
        ${isAnalyzing ? 'cursor-wait opacity-80' : 'cursor-pointer hover:bg-[#c4c4c4]'}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        onChange={handleChange}
        accept="image/*"
        disabled={isAnalyzing}
      />
      
      <div className="pointer-events-none p-6">
        {isAnalyzing ? (
          <div className="flex flex-col items-center gap-4">
             <Loader2 className="w-12 h-12 text-spec-text animate-spin" />
             <div className="flex flex-col gap-1">
                <span className="text-sm uppercase font-bold tracking-widest text-spec-text">Processing</span>
                <span className="text-[10px] text-spec-dim uppercase tracking-wider">Analyzing Visual Data...</span>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 group-hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 border-2 border-spec-dim rounded-full flex items-center justify-center">
               <Upload className="w-6 h-6 text-spec-dim" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-lg font-medium text-spec-text">Upload Design</span>
              <span className="text-xs text-spec-dim font-mono uppercase">Drag & Drop or Click</span>
            </div>
          </div>
        )}
      </div>

      {/* Decorative corner markers to match "Spec" aesthetic */}
      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-spec-text opacity-50"></div>
      <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-spec-text opacity-50"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-spec-text opacity-50"></div>
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-spec-text opacity-50"></div>
    </div>
  );
};
