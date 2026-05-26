
import React, { useState } from 'react';
import { SpecHeader } from './components/SpecHeader';
import { UploadZone } from './components/UploadZone';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { CalibrationPanel } from './components/CalibrationPanel';
import { DesignAnalysis, AnalysisStatus, ReferenceExample } from './types';
import { RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [analysisData, setAnalysisData] = useState<DesignAnalysis | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Training Data State
  const [references, setReferences] = useState<ReferenceExample[]>([]);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);

  const handleImageSelect = async (base64: string, preview: string) => {
    setStatus('analyzing');
    setPreviewImage(preview);
    setErrorMsg(null);
    setAnalysisData(null);

    try {
      // Pass references to the analysis service via secure backend API proxy
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Image: base64, references })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisData(result);
      setStatus('complete');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || "Analysis failed. Please try a different image or check your connection.");
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setAnalysisData(null);
    setPreviewImage(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#D4D4D4] p-4 sm:p-8 md:p-12 font-sans selection:bg-spec-accent selection:text-white">
      {/* Calibration Slide-over Panel */}
      <CalibrationPanel 
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
        references={references}
        setReferences={setReferences}
      />

      {/* Main Sheet Container */}
      <div className="max-w-6xl mx-auto bg-[#E6E6E6] min-h-[calc(100vh-6rem)] shadow-2xl overflow-hidden relative">
        
        {/* Top Orange Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-spec-accent"></div>

        <div className="p-8 sm:p-12 md:p-16">
          <SpecHeader 
            onOpenCalibration={() => setIsCalibrationOpen(true)}
            calibrationCount={references.length}
          />

          {/* Error State */}
          {status === 'error' && (
             <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
               <p className="text-red-700 font-medium text-sm">{errorMsg}</p>
               <button onClick={handleReset} className="text-xs text-red-600 underline mt-2">Try Again</button>
             </div>
          )}

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Image Area */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="sticky top-8">
                {/* Meta Info Row */}
                <div className="flex justify-between border-b border-gray-300 pb-2 mb-4 text-[10px] text-spec-dim uppercase tracking-wider font-mono">
                  <span>Input Source</span>
                  <span>{status === 'complete' ? 'Processed' : 'Waiting'}</span>
                </div>

                {/* Image Container */}
                <div className="w-full bg-[#CDCDCD] p-8 lg:p-12 relative group">
                  {previewImage ? (
                    <div className="relative shadow-xl">
                      <img 
                        src={previewImage} 
                        alt="Design to analyze" 
                        className="w-full h-auto object-contain block"
                      />
                      {/* Overlay Reset Button if not analyzing */}
                      {status !== 'analyzing' && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                           <button 
                             onClick={handleReset}
                             className="bg-white text-spec-text px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-spec-accent hover:text-white transition-colors flex items-center gap-2"
                           >
                             <RefreshCw size={14} />
                             Analyze New
                           </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <UploadZone onImageSelected={handleImageSelect} isAnalyzing={status === 'analyzing'} />
                  )}
                </div>

                {/* Decorative Specs below image */}
                <div className="mt-8 grid grid-cols-2 gap-4 text-[10px] text-spec-dim font-mono">
                  <div className="border-t border-gray-300 pt-2">
                    <span className="block mb-1">Status</span>
                    <span className={`uppercase font-bold ${status === 'analyzing' ? 'text-spec-accent animate-pulse' : 'text-spec-text'}`}>
                      {status === 'idle' ? 'Ready' : status}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <span className="block mb-1">Model</span>
                    <span className="uppercase text-spec-text">Gemini 2.5 Flash</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 col-span-2">
                     <span className="block mb-1">Calibration Data</span>
                     {references.length > 0 ? (
                       <div className="flex gap-1">
                         {references.slice(0, 5).map(r => (
                           <div key={r.id} className={`w-3 h-3 ${r.type === 'good' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                         ))}
                         {references.length > 5 && <span className="text-xs">+</span>}
                       </div>
                     ) : (
                       <span className="text-gray-400 italic">No Reference Data</span>
                     )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Analysis Data */}
            <div className="lg:col-span-7">
               <div className="flex justify-between border-b border-gray-300 pb-2 mb-4 text-[10px] text-spec-dim uppercase tracking-wider font-mono">
                  <span>Report Data</span>
                  <span>v1.0.0</span>
                </div>

                {status === 'idle' && (
                  <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                    <div className="w-16 h-1 bg-gray-300 mb-4"></div>
                    <p className="text-sm font-mono uppercase tracking-widest text-spec-dim">Awaiting Input Data</p>
                    <p className="text-xs text-spec-dim mt-2 max-w-xs">Upload a graphic design image to generate a comprehensive technical critique.</p>
                  </div>
                )}

                {status === 'analyzing' && (
                  <div className="space-y-8 animate-pulse opacity-50">
                    <div className="h-24 bg-gray-200 w-full"></div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="h-40 bg-gray-200"></div>
                       <div className="h-40 bg-gray-200"></div>
                    </div>
                  </div>
                )}

                {status === 'complete' && analysisData && (
                  <AnalysisDisplay data={analysisData} />
                )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-4 right-8 text-[9px] text-spec-dim font-mono uppercase tracking-widest opacity-50">
           System Ready • 2025
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation-name: fade-in-up;
          animation-duration: 0.5s;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default App;
