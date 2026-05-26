
import React from 'react';
import { ScanEye, Activity, Settings2 } from 'lucide-react';

interface SpecHeaderProps {
  onOpenCalibration?: () => void;
  calibrationCount?: number;
}

export const SpecHeader: React.FC<SpecHeaderProps> = ({ onOpenCalibration, calibrationCount = 0 }) => {
  return (
    <div className="border-b border-gray-300 pb-6 mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-medium tracking-tight text-spec-text mb-2">Specs</h1>
          <div className="flex items-center gap-2 text-spec-dim text-sm font-mono uppercase tracking-wider flex-wrap">
            <span>DA-01</span>
            <span className="w-1 h-1 bg-spec-accent rounded-full"></span>
            <span>Design Analyzer</span>
            <span className="w-px h-3 bg-gray-400 mx-1"></span>
            <span className="normal-case tracking-normal text-xs opacity-60">by Mahesh Ravi</span>
          </div>
        </div>
        <div className="text-right max-w-xs hidden sm:block">
          <p className="text-[10px] leading-tight text-spec-dim text-justify">
            Demanding unparalleled technical skill, expert critics meticulously assemble and calibrate each feedback point, ensuring seamless functionality for precise design improvement, showcasing artisanal dedication and expertise.
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-8 border-t border-gray-300 pt-2">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-spec-text"></div>
           <span className="text-xs font-semibold uppercase tracking-widest">Analysis Module</span>
        </div>
        <div className="flex items-center gap-6">
           {onOpenCalibration && (
             <button 
               onClick={onOpenCalibration}
               className="flex items-center gap-2 text-spec-dim hover:text-spec-accent transition-colors group"
             >
                <Settings2 size={16} />
                <span className="text-[10px] uppercase font-bold tracking-widest">
                  Calibration {calibrationCount > 0 && `(${calibrationCount})`}
                </span>
             </button>
           )}
           <div className="flex items-center gap-2 text-spec-accent">
             <Activity size={16} />
             <span className="text-[10px] uppercase font-bold tracking-widest">Online</span>
           </div>
        </div>
      </div>
    </div>
  );
};
