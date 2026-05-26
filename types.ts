
export interface AnalysisSection {
  notes: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface DesignAnalysis {
  overall_summary: string;
  legibility: AnalysisSection;
  typography: AnalysisSection;
  layout_and_hierarchy: AnalysisSection;
  balance_contrast_color: AnalysisSection;
  style_and_story: AnalysisSection;
  harmony: AnalysisSection;
  modernity_and_trends: AnalysisSection;
  actionable_suggestions: string[];
}

export type AnalysisStatus = 'idle' | 'analyzing' | 'complete' | 'error';

export interface ReferenceExample {
  id: string;
  base64: string;
  preview: string;
  type: 'good' | 'bad';
  notes?: string;
}
