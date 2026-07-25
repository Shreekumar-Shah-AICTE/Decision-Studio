import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Award, AlertCircle, ChevronRight, Lightbulb } from 'lucide-react';
import { useActiveBoard } from '../../store/boardStore';
import { analyzeBoard, getBoardInsight, getScoreColor, getRecommendationLabel } from '../../lib/scoring';
import { ScoreRing } from '../ui/ScoreRing';
import { MetricBar } from '../ui/MetricBar';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip as ReTooltip,
} from 'recharts';

const recColors = {
  strong: '#10B981',
  moderate: '#F59E0B',
  weak: '#F97316',
  avoid: '#F43F5E',
};

export function AnalysisPanel() {
  const board = useActiveBoard();
  const results = board ? analyzeBoard(board) : [];
  const insight = getBoardInsight(results);

  if (!board) return null;

  // Radar data for top 3 options
  const top3 = results.slice(0, 3);

  const radarDimensions = ['Pros', 'Conf.', 'Net', 'Risk↓', 'Cost↓'];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={14} className="text-indigo-400" />
          <h3 className="font-bold text-white text-sm">Decision Intelligence</h3>
        </div>
        <p className="text-xs text-slate-400">AI-powered analysis of all options</p>
      </div>

      {results.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-3">
            <Lightbulb size={20} className="text-indigo-400" />
          </div>
          <p className="text-sm text-slate-400">Add decision option cards to see intelligence analysis appear here.</p>
        </div>
      ) : (
        <>
          {/* Insight banner */}
          <div className="mx-4 mt-4 p-3 rounded-xl" style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}>
            <div className="flex items-start gap-2">
              <Lightbulb size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-300 leading-relaxed">{insight}</p>
            </div>
          </div>

          {/* Option rankings */}
          <div className="p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Option Rankings</h4>
            {results.map((result, idx) => (
              <motion.div
                key={result.cardId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="rounded-xl p-3"
                style={{
                  background: idx === 0
                    ? `${recColors[result.recommendation]}10`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${idx === 0 ? recColors[result.recommendation] + '30' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      background: idx === 0 ? `${recColors[result.recommendation]}20` : 'rgba(255,255,255,0.06)',
                      color: idx === 0 ? recColors[result.recommendation] : '#64748B',
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-white truncate">{result.title}</span>
                      {idx === 0 && <Award size={10} color={recColors[result.recommendation]} />}
                    </div>
                    <span
                      className="text-xs font-medium px-1.5 py-0.5 rounded-md"
                      style={{
                        color: recColors[result.recommendation],
                        background: `${recColors[result.recommendation]}15`,
                      }}
                    >
                      {getRecommendationLabel(result.recommendation)}
                    </span>
                  </div>
                  <ScoreRing score={result.overallScore} size={44} strokeWidth={4} />
                </div>

                {/* Score breakdown */}
                <div className="mt-2.5 space-y-1.5">
                  <MetricBar label="Pros strength" value={result.prosScore} color="#10B981" compact />
                  <MetricBar label="Confidence" value={result.confidenceBonus + 50} color="#A78BFA" compact />
                </div>

                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{result.reasoning}</p>
              </motion.div>
            ))}
          </div>

          {/* Radar comparison */}
          {top3.length >= 2 && (
            <div className="px-4 pb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Score Comparison</h4>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="space-y-2">
                  {top3.map((r, i) => (
                    <div key={r.cardId} className="flex items-center gap-2">
                      <div
                        className="flex-1 h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${r.overallScore}%`,
                            background: recColors[r.recommendation],
                            transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-20 truncate">{r.title}</span>
                      <span className="text-xs font-bold w-8 text-right tabular-nums"
                        style={{ color: recColors[r.recommendation] }}>
                        {r.overallScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
