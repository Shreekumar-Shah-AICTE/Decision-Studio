import { memo, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, DollarSign, Link2, Target, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { DecisionCard } from '../../store/types';
import { useBoardStore, useActiveBoard } from '../../store/boardStore';
import { analyzeCard, getScoreColor, getRecommendationLabel } from '../../lib/scoring';
import { CARD_CATEGORY_COLORS } from '../../lib/utils';
import { MetricBar } from '../ui/MetricBar';
import { ScoreRing } from '../ui/ScoreRing';

type DecisionCardNodeData = DecisionCard;

export const DecisionCardNode = memo(({ data, selected }: NodeProps) => {
  const card = data as unknown as DecisionCardNodeData;
  const { activeBoardId, selectedCardId, updateCard, deleteCard, selectCard, setEditingCard } = useBoardStore();
  const analysis = analyzeCard(card);
  const accentColor = CARD_CATEGORY_COLORS[card.category] || '#6366F1';
  const scoreColor = getScoreColor(analysis.overallScore);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    selectCard(card.id);
    setEditingCard(card.id);
  }, [card.id, selectCard, setEditingCard]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeBoardId) deleteCard(activeBoardId, card.id);
  }, [activeBoardId, card.id, deleteCard]);

  const handleToggleCollapse = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeBoardId) updateCard(activeBoardId, card.id, { collapsed: !card.collapsed });
  }, [activeBoardId, card.id, card.collapsed, updateCard]);

  const isSelected = selectedCardId === card.id || selected;

  const categoryLabels: Record<string, string> = {
    root: 'Decision',
    option: 'Option',
    outcome: 'Outcome',
    factor: 'Factor',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative"
      style={{ width: card.category === 'root' ? 320 : 280 }}
    >
      {/* Glow when selected */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 0 2px ${accentColor}, 0 0 32px ${accentColor}40`,
            zIndex: -1,
          }}
        />
      )}

      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(14, 20, 32, 0.95)',
          border: `1px solid ${isSelected ? accentColor : 'rgba(30, 45, 74, 0.8)'}`,
          backdropFilter: 'blur(16px)',
          transition: 'border-color 0.2s',
        }}
      >
        {/* Category accent bar */}
        <div
          className="h-0.5 w-full"
          style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
        />

        {/* Header */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
                  style={{
                    color: accentColor,
                    background: `${accentColor}18`,
                  }}
                >
                  {categoryLabels[card.category] || card.category}
                </span>
                {card.category === 'option' && (
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{ color: scoreColor, background: `${scoreColor}15` }}
                  >
                    {getRecommendationLabel(analysis.recommendation)}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-white leading-tight text-sm">
                {card.title}
              </h3>
            </div>
            {/* Score ring */}
            {card.category === 'option' && (
              <div className="flex-shrink-0">
                <ScoreRing score={analysis.overallScore} size={48} strokeWidth={4} />
              </div>
            )}
            {card.category !== 'option' && (
              <div className="flex gap-1">
                <button
                  onClick={handleToggleCollapse}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors text-slate-400"
                >
                  {card.collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                </button>
                <button
                  onClick={handleEdit}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-indigo-400"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-rose-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>

          {!card.collapsed && card.description && (
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
              {card.description}
            </p>
          )}
        </div>

        {!card.collapsed && (
          <>
            {/* Pros & Cons */}
            {(card.pros.length > 0 || card.cons.length > 0) && (
              <div className="px-4 py-2 grid grid-cols-2 gap-2 border-t border-white/5">
                {/* Pros */}
                <div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <CheckCircle2 size={10} color="#10B981" />
                    <span className="text-xs font-semibold text-emerald-400">Pros</span>
                    <span className="text-xs text-slate-500 ml-auto">{card.pros.length}</span>
                  </div>
                  <div className="space-y-0.5">
                    {card.pros.slice(0, 3).map(pro => (
                      <div key={pro.id} className="flex items-start gap-1">
                        <div
                          className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: '#10B981' }}
                        />
                        <span className="text-xs text-slate-300 leading-relaxed line-clamp-1">{pro.text}</span>
                      </div>
                    ))}
                    {card.pros.length > 3 && (
                      <span className="text-xs text-slate-500">+{card.pros.length - 3} more</span>
                    )}
                  </div>
                </div>
                {/* Cons */}
                <div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <XCircle size={10} color="#F43F5E" />
                    <span className="text-xs font-semibold text-rose-400">Cons</span>
                    <span className="text-xs text-slate-500 ml-auto">{card.cons.length}</span>
                  </div>
                  <div className="space-y-0.5">
                    {card.cons.slice(0, 3).map(con => (
                      <div key={con.id} className="flex items-start gap-1">
                        <div
                          className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: '#F43F5E' }}
                        />
                        <span className="text-xs text-slate-300 leading-relaxed line-clamp-1">{con.text}</span>
                      </div>
                    ))}
                    {card.cons.length > 3 && (
                      <span className="text-xs text-slate-500">+{card.cons.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className="px-4 py-2.5 space-y-2 border-t border-white/5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <MetricBar
                  label="Risk"
                  value={card.risk}
                  color="#F59E0B"
                  icon={<AlertTriangle size={9} />}
                  inverted
                  compact
                />
                <MetricBar
                  label="Cost"
                  value={card.cost}
                  color="#0EA5E9"
                  icon={<DollarSign size={9} />}
                  inverted
                  compact
                />
              </div>
              <MetricBar
                label="Confidence"
                value={card.confidence}
                color="#A78BFA"
                icon={<Target size={9} />}
                compact
              />
            </div>

            {/* Dependencies & Actions */}
            <div className="px-4 pb-3 pt-1 flex items-center justify-between border-t border-white/5">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Link2 size={10} />
                <span className="text-xs">{card.dependencies.length} dep{card.dependencies.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    color: accentColor,
                    background: `${accentColor}15`,
                    border: `1px solid ${accentColor}30`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${accentColor}25`)}
                  onMouseLeave={e => (e.currentTarget.style.background = `${accentColor}15`)}
                >
                  <Pencil size={10} />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 rounded-lg hover:bg-rose-500/20 transition-colors text-slate-500 hover:text-rose-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ top: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ bottom: -6 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ right: -6 }}
      />
    </motion.div>
  );
});

DecisionCardNode.displayName = 'DecisionCardNode';
