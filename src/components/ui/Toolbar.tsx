import { motion } from 'framer-motion';
import {
  Plus, TrendingUp, Settings, BarChart3, Share2,
  PanelRightOpen, Keyboard, Sparkles
} from 'lucide-react';
import { useBoardStore, useActiveBoard } from '../../store/boardStore';
import { analyzeBoard } from '../../lib/scoring';
import { getScoreColor } from '../../lib/scoring';
import { formatRelativeTime } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function Toolbar() {
  const { activeBoardId, addCard, isPanelOpen, togglePanel, setPanelTab } = useBoardStore();
  const board = useActiveBoard();
  const results = board ? analyzeBoard(board) : [];
  const topScore = results[0]?.overallScore;
  const scoreColor = topScore !== undefined ? getScoreColor(topScore) : '#64748B';

  const openAnalysis = () => {
    setPanelTab('analysis');
    if (!isPanelOpen) togglePanel();
  };

  const handleAddCard = () => {
    if (!activeBoardId) return;
    addCard(activeBoardId, {
      position: { x: 300 + Math.random() * 200, y: 300 + Math.random() * 150 },
    });
  };

  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0"
      style={{
        background: 'rgba(8, 12, 20, 0.95)',
        borderBottom: '1px solid rgba(30, 45, 74, 0.5)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Board info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-white text-sm truncate">
            {board?.title || 'No Board Selected'}
          </h2>
          {board && (
            <span className="text-xs text-slate-500">
              · {formatRelativeTime(board.updatedAt)}
            </span>
          )}
        </div>
        {board?.description && (
          <p className="text-xs text-slate-500 truncate mt-0.5">{board.description}</p>
        )}
      </div>

      {/* Intelligence Score Badge */}
      {topScore !== undefined && (
        <motion.button
          onClick={openAnalysis}
          whileHover={{ scale: 1.03 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{
            color: scoreColor,
            background: `${scoreColor}12`,
            border: `1px solid ${scoreColor}30`,
          }}
        >
          <Sparkles size={12} />
          Top score: {topScore}
        </motion.button>
      )}

      {/* Stats */}
      {board && (
        <div className="flex items-center gap-3 text-xs text-slate-500 px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {board.cards.length} cards
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            {board.connections.length} links
          </span>
        </div>
      )}

      {/* Add Card */}
      <motion.button
        onClick={handleAddCard}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
        style={{
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          boxShadow: '0 2px 12px rgba(99, 102, 241, 0.35)',
        }}
      >
        <Plus size={13} />
        Add Card
      </motion.button>

      {/* Analysis panel toggle */}
      <button
        onClick={openAnalysis}
        className={cn(
          'p-2 rounded-xl transition-all',
          isPanelOpen
            ? 'bg-indigo-500/20 text-indigo-400'
            : 'text-slate-400 hover:text-white hover:bg-white/10'
        )}
        title="Open Analysis Panel"
      >
        <BarChart3 size={16} />
      </button>

      {/* Panel toggle */}
      <button
        onClick={togglePanel}
        className={cn(
          'p-2 rounded-xl transition-all',
          isPanelOpen
            ? 'bg-white/10 text-white'
            : 'text-slate-400 hover:text-white hover:bg-white/10'
        )}
        title="Toggle Panel"
      >
        <PanelRightOpen size={16} />
      </button>
    </div>
  );
}
