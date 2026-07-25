import type { DecisionCard, AnalysisResult, Board } from '../store/types';

/**
 * Decision Intelligence Scoring Engine
 * Deterministic, transparent scoring for objective decision comparison.
 */

function weightedProScore(pros: DecisionCard['pros']): number {
  if (!pros.length) return 0;
  const total = pros.reduce((sum, p) => sum + p.weight, 0);
  const max = pros.length * 5;
  return (total / max) * 100;
}

function weightedConScore(cons: DecisionCard['cons']): number {
  if (!cons.length) return 0;
  const total = cons.reduce((sum, c) => sum + c.weight, 0);
  const max = cons.length * 5;
  return (total / max) * 100;
}

export function analyzeCard(card: DecisionCard): AnalysisResult {
  const prosScore = weightedProScore(card.pros);
  const consScore = weightedConScore(card.cons);

  // Net benefit from pros/cons (pros add, cons subtract)
  const prosCount = card.pros.length;
  const consCount = card.cons.length;
  const proWeight = prosCount / Math.max(prosCount + consCount, 1);
  const netBenefit = (prosScore * proWeight) - (consScore * (1 - proWeight));
  const normalizedBenefit = Math.max(0, Math.min(100, 50 + netBenefit * 0.5));

  // Risk penalty: high risk reduces score
  const riskPenalty = card.risk * 0.25;

  // Cost penalty: high cost reduces score
  const costPenalty = card.cost * 0.15;

  // Confidence bonus: low confidence reduces final score
  const confidenceMultiplier = card.confidence / 100;
  const confidenceBonus = (card.confidence - 50) * 0.1;

  // Dependency penalty: more dependencies = more risk
  const depPenalty = card.dependencies.length * 3;

  const rawScore =
    normalizedBenefit
    - riskPenalty
    - costPenalty
    + confidenceBonus
    - depPenalty;

  const overallScore = Math.round(
    Math.max(0, Math.min(100, rawScore * confidenceMultiplier * 1.1))
  );

  let recommendation: AnalysisResult['recommendation'];
  let reasoning: string;

  if (overallScore >= 70) {
    recommendation = 'strong';
    reasoning = `Strong candidate. High confidence (${card.confidence}%), favorable pros-to-cons ratio, and manageable risk.`;
  } else if (overallScore >= 50) {
    recommendation = 'moderate';
    reasoning = `Viable option but with trade-offs. ${card.risk > 60 ? 'Risk level is elevated. ' : ''}${card.cost > 60 ? 'Cost impact is significant. ' : ''}Consider mitigations before proceeding.`;
  } else if (overallScore >= 30) {
    recommendation = 'weak';
    reasoning = `Weak option given current context. ${card.cons.length > card.pros.length ? 'Cons outweigh pros. ' : ''}${card.confidence < 60 ? 'Low confidence adds uncertainty. ' : ''}Needs significant revision.`;
  } else {
    recommendation = 'avoid';
    reasoning = `Not recommended. Combined risk, cost, and cons create too much downside. Explore alternatives first.`;
  }

  return {
    cardId: card.id,
    title: card.title,
    overallScore,
    prosScore: Math.round(prosScore),
    consScore: Math.round(consScore),
    riskPenalty: Math.round(riskPenalty),
    costPenalty: Math.round(costPenalty),
    confidenceBonus: Math.round(confidenceBonus),
    recommendation,
    reasoning,
  };
}

export function analyzeBoard(board: Board): AnalysisResult[] {
  const optionCards = board.cards.filter(c => c.category === 'option');
  return optionCards
    .map(analyzeCard)
    .sort((a, b) => b.overallScore - a.overallScore);
}

export function getBoardInsight(results: AnalysisResult[]): string {
  if (!results.length) return 'Add decision options to see intelligence analysis.';
  const top = results[0];
  const second = results[1];

  if (top.recommendation === 'strong') {
    if (second && top.overallScore - second.overallScore > 20) {
      return `"${top.title}" is the clear winner with a ${top.overallScore} intelligence score — ${top.overallScore - second.overallScore} points ahead of the next best option.`;
    }
    return `"${top.title}" leads with a strong ${top.overallScore} score. ${second ? `"${second.title}" is close at ${second.overallScore} — worth evaluating both.` : ''}`;
  }
  if (top.recommendation === 'moderate') {
    return `No strongly dominant option yet. "${top.title}" leads at ${top.overallScore} but all options carry meaningful trade-offs. Consider refining confidence scores.`;
  }
  return `All options currently score below 50. Consider adding more pros, reducing dependencies, or revising your risk assessments.`;
}

export function getScoreColor(score: number): string {
  if (score >= 70) return '#10B981';
  if (score >= 50) return '#F59E0B';
  if (score >= 30) return '#F97316';
  return '#F43F5E';
}

export function getRecommendationLabel(rec: AnalysisResult['recommendation']): string {
  switch (rec) {
    case 'strong': return 'Recommended';
    case 'moderate': return 'Consider';
    case 'weak': return 'Weak';
    case 'avoid': return 'Avoid';
  }
}
