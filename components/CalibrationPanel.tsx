
import React, { useRef } from 'react';
import { ReferenceExample } from '../types';
import { X, Plus, ThumbsUp, ThumbsDown, Database } from 'lucide-react';

interface CalibrationPanelProps {
  references: ReferenceExample[];
  setReferences: React.Dispatch<React.SetStateAction<ReferenceExample[]>>;
  isOpen: boolean;
  onClose: () => void;
}

export const CalibrationPanel: React.FC<CalibrationPanelProps> = ({ 
  references, 
  setReferences, 
  isOpen,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'good' | 'bad') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        const base64 = result.split(',')[1];
        
        const newRef: ReferenceExample = {
          id: Date.now().toString(),
          base64,
          preview: result,
          type,
          notes: ''
        };
        
        setReferences(prev => [...prev, newRef]);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeReference = (id: string) => {
    setReferences(prev => prev.filter(r => r.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm transition-all">
      <div className="w-full max-w-md bg-[#F2F2F2] h-full shadow-2xl border-l border-gray-300 flex flex-col animate-fade-in-right">
        {/* Header */}
        <div className="p-6 border-b border-gray-300 bg-[#E6E6E6] flex justify-between items-center">
           <div>
             <h2 className="text-xl font-medium text-spec-text tracking-tight flex items-center gap-2">
               <Database size={20} className="text-spec-accent" />
               Calibration
             </h2>
             <p className="text-[10px] uppercase tracking-wider text-spec-dim mt-1">Train Model Standards</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-300 rounded-full transition-colors">
             <X size={20} className="text-spec-text" />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Upload examples of designs you consider "Good" or "Bad". The analyzer will use these as a baseline to understand your specific taste and standards.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Add Good Button */}
              <label className="cursor-pointer group relative">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'good')}
                />
                <div className="border-2 border-dashed border-green-300 bg-green-50/50 hover:bg-green-50 hover:border-green-500 transition-all p-4 flex flex-col items-center justify-center gap-2 h-24 rounded-lg">
                   <ThumbsUp size={20} className="text-green-600" />
                   <span className="text-[10px] font-bold uppercase tracking-wide text-green-800">Add Good Ref</span>
                </div>
              </label>

              {/* Add Bad Button */}
              <label className="cursor-pointer group relative">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'bad')}
                />
                <div className="border-2 border-dashed border-red-300 bg-red-50/50 hover:bg-red-50 hover:border-red-500 transition-all p-4 flex flex-col items-center justify-center gap-2 h-24 rounded-lg">
                   <ThumbsDown size={20} className="text-red-600" />
                   <span className="text-[10px] font-bold uppercase tracking-wide text-red-800">Add Bad Ref</span>
                </div>
              </label>
            </div>

            {/* List */}
            <div className="space-y-4">
               {references.length === 0 && (
                 <div className="text-center py-8 border border-gray-300 border-dashed rounded text-gray-400 text-xs italic">
                   No reference data loaded.
                 </div>
               )}

               {references.map((ref) => (
                 <div key={ref.id} className="bg-white p-3 border border-gray-200 flex gap-3 group relative">
                    <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                      <img src={ref.preview} alt="ref" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between mb-1">
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${ref.type === 'good' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                             {ref.type} Example
                          </span>
                       </div>
                       <input 
                         type="text" 
                         placeholder="Optional notes (e.g. 'Bad contrast')"
                         className="w-full text-xs border-b border-gray-200 focus:border-spec-accent outline-none py-1 text-gray-600 bg-transparent placeholder:text-gray-300"
                         value={ref.notes}
                         onChange={(e) => {
                           const newNotes = e.target.value;
                           setReferences(prev => prev.map(p => p.id === ref.id ? {...p, notes: newNotes} : p));
                         }}
                       />
                    </div>
                    <button 
                      onClick={() => removeReference(ref.id)}
                      className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                 </div>
               ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-[#E6E6E6] border-t border-gray-300 text-[10px] text-spec-dim font-mono flex justify-between">
           <span>Datasets: {references.length}</span>
           <span>Status: {references.length > 0 ? 'Active' : 'Standby'}</span>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};
