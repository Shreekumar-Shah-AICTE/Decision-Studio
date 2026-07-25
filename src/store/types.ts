export interface ProCon {
  id: string;
  text: string;
  weight: number; // 1-5
}

export interface DecisionCard {
  id: string;
  title: string;
  description: string;
  category: 'option' | 'root' | 'outcome' | 'factor';
  pros: ProCon[];
  cons: ProCon[];
  risk: number;        // 0-100
  cost: number;        // 0-100
  dependencies: string[];
  confidence: number;  // 0-100
  color?: string;
  position: { x: number; y: number };
  selected?: boolean;
  collapsed?: boolean;
  tags: string[];
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: 'supports' | 'blocks' | 'depends' | 'leads-to';
  animated?: boolean;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  cards: DecisionCard[];
  connections: Connection[];
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface AnalysisResult {
  cardId: string;
  title: string;
  overallScore: number;
  prosScore: number;
  consScore: number;
  riskPenalty: number;
  costPenalty: number;
  confidenceBonus: number;
  recommendation: 'strong' | 'moderate' | 'weak' | 'avoid';
  reasoning: string;
}
