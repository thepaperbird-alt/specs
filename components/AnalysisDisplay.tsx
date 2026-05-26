
import React from 'react';
import { DesignAnalysis, AnalysisSection } from '../types';
import { AlertCircle, CheckCircle, HelpCircle, Info } from 'lucide-react';

interface AnalysisDisplayProps {
  data: DesignAnalysis;
}

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  let colorClass = "bg-gray-300 text-gray-600";
  if (priority === 'high') colorClass = "bg-spec-accent text-white";
  if (priority === 'medium') colorClass = "bg-gray-800 text-white";

  return (
    <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm ${colorClass}`}>
      {priority} Priority
    </span>
  );
};

const SectionRow: React.FC<{ title: string; data: AnalysisSection; delay?: number }> = ({ title, data, delay = 0 }) => (
  <div 
    className="group border-t border-gray-300 py-4 opacity-0 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
  >
    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
         <div className="w-1 h-1 bg-spec-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <h3 className="text-sm font-bold text-spec-text uppercase tracking-wide">{title}</h3>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-spec-dim font-mono hidden sm:inline-block uppercase">Analysis</span>
        <PriorityBadge priority={data.priority} />
      </div>
    </div>
    
    <div className="pl-0 sm:pl-3">
      <ul className="space-y-1">
        {data.notes.map((note, idx) => (
          <li key={idx} className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
             <span className="text-gray-300 mt-1.5 text-[6px]">•</span>
             <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ data }) => {
  return (
    <div className="w-full">
      {/* Summary Section - Highlighted */}
      <div className="bg-gray-100 p-6 mb-8 border-l-2 border-spec-accent">
        <h2 className="text-xs font-bold uppercase tracking-widest text-spec-dim mb-2">Executive Summary</h2>
        <p className="text-lg text-spec-text font-light leading-relaxed">
          {data.overall_summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
        {/* Left Column */}
        <div>
          <SectionRow title="Legibility" data={data.legibility} delay={100} />
          <SectionRow title="Typography" data={data.typography} delay={200} />
          <SectionRow title="Layout & Hierarchy" data={data.layout_and_hierarchy} delay={300} />
          <SectionRow title="Balance & Color" data={data.balance_contrast_color} delay={400} />
        </div>

        {/* Right Column */}
        <div>
          <SectionRow title="Style & Story" data={data.style_and_story} delay={500} />
          <SectionRow title="Visual Harmony" data={data.harmony} delay={600} />
          <SectionRow title="Modernity" data={data.modernity_and_trends} delay={700} />
        </div>
      </div>

      {/* Actionable Suggestions - Footer Style */}
      <div className="mt-12 pt-8 border-t-2 border-spec-text">
         <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-spec-text"></div>
            <h2 className="text-xl font-medium tracking-tight">Actionable Protocol</h2>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {data.actionable_suggestions.map((suggestion, idx) => (
              <div 
                key={idx} 
                className="bg-white p-4 border border-gray-200 hover:border-spec-accent transition-colors duration-200"
              >
                 <span className="text-[10px] font-mono text-spec-dim uppercase mb-2 block">Step {String(idx + 1).padStart(2, '0')}</span>
                 <p className="text-sm text-gray-800 leading-snug">{suggestion}</p>
              </div>
            ))}
         </div>

         {/* Disclaimer Footer */}
         <div className="border-t border-gray-300 pt-6 text-center">
            <p className="text-[10px] text-spec-dim flex items-center justify-center gap-2">
              <Info size={12} className="text-spec-accent" />
              Disclaimer: This is only a technical critique and it might not cover all intentional creative design choices.
            </p>
         </div>
      </div>
    </div>
  );
};
