import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Pencil, Layout } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';
import { AnalysisPanel } from './AnalysisPanel';
import { CardEditPanel } from './CardEditPanel';
import { BoardSettingsPanel } from './BoardSettingsPanel';
import { cn } from '../../lib/utils';

const TABS = [
  { id: 'analysis' as const, label: 'Analysis', icon: TrendingUp },
  { id: 'card' as const, label: 'Card', icon: Pencil },
  { id: 'board' as const, label: 'Board', icon: Layout },
];

export function RightPanel() {
  const { isPanelOpen, panelTab, setPanelTab, togglePanel, selectedCardId } = useBoardStore();

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <motion.div
          key="right-panel"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex flex-col h-full w-80 flex-shrink-0"
          style={{
            background: 'rgba(8, 12, 20, 0.95)',
            borderLeft: '1px solid rgba(30, 45, 74, 0.6)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid rgba(30, 45, 74, 0.6)' }}
          >
            {/* Tabs */}
            <div className="flex gap-1">
              {TABS.map(({ id, label, icon: Icon }) => {
                const isActive = panelTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setPanelTab(id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    )}
                  >
                    <Icon size={12} />
                    {label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={togglePanel}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {panelTab === 'analysis' && <AnalysisPanel />}
            {panelTab === 'card' && <CardEditPanel />}
            {panelTab === 'board' && <BoardSettingsPanel />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
