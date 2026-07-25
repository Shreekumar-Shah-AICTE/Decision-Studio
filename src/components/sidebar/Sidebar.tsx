import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GitBranch, Folder, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useBoardStore } from '../../store/boardStore';
import { Logo } from '../ui/Logo';
import { formatRelativeTime } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const { boards, activeBoardId, setActiveBoard, createBoard } = useBoardStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const handleCreate = () => {
    if (!newBoardTitle.trim()) return;
    const id = createBoard(newBoardTitle.trim());
    setIsCreating(false);
    setNewBoardTitle('');
  };

  return (
    <div
      className="flex flex-col h-full w-60 flex-shrink-0"
      style={{
        background: 'rgba(8, 12, 20, 0.98)',
        borderRight: '1px solid rgba(30, 45, 74, 0.6)',
      }}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/5">
        <Logo size={28} />
        <p className="text-xs text-slate-500 mt-1.5 ml-1">Decision Intelligence</p>
      </div>

      {/* New board button */}
      <div className="px-3 pt-3 pb-2">
        {isCreating ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <input
              autoFocus
              type="text"
              value={newBoardTitle}
              onChange={e => setNewBoardTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreate();
                if (e.key === 'Escape') setIsCreating(false);
              }}
              placeholder="Board name..."
              className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white/5 border border-indigo-500/40 text-white placeholder-slate-500 focus:outline-none"
            />
            <div className="flex gap-1">
              <button
                onClick={handleCreate}
                className="flex-1 text-xs py-1 rounded-lg font-medium bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 text-xs py-1 rounded-lg font-medium bg-white/5 text-slate-400 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-400 hover:bg-indigo-500/10 transition-colors border border-indigo-500/20 hover:border-indigo-500/40"
          >
            <Plus size={13} />
            New Board
          </button>
        )}
      </div>

      {/* Board list */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="flex items-center gap-2 px-2 py-2 mb-1">
          <Folder size={10} className="text-slate-500" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Boards</span>
          <span className="text-xs text-slate-600 ml-auto">{boards.length}</span>
        </div>

        <div className="space-y-0.5">
          {boards.map((board) => {
            const isActive = board.id === activeBoardId;
            const optionCount = board.cards.filter(c => c.category === 'option').length;

            return (
              <motion.button
                key={board.id}
                onClick={() => setActiveBoard(board.id)}
                whileHover={{ x: 2 }}
                className={cn(
                  'w-full flex flex-col items-start px-3 py-2.5 rounded-xl text-left transition-all group',
                  isActive
                    ? 'bg-indigo-500/12 border border-indigo-500/25'
                    : 'hover:bg-white/5 border border-transparent'
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <GitBranch
                    size={12}
                    className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}
                  />
                  <span
                    className={cn(
                      'text-xs font-semibold flex-1 truncate',
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                    )}
                  >
                    {board.title}
                  </span>
                  {isActive && <ChevronRight size={10} className="text-indigo-400" />}
                </div>
                <div className="flex items-center gap-2 mt-1 ml-5">
                  <span className="text-xs text-slate-600">
                    {board.cards.length} card{board.cards.length !== 1 ? 's' : ''}
                  </span>
                  {optionCount > 0 && (
                    <>
                      <span className="text-slate-700">·</span>
                      <span className="text-xs text-slate-600">{optionCount} option{optionCount !== 1 ? 's' : ''}</span>
                    </>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <div className="text-xs text-slate-600 text-center">
          {boards.reduce((sum, b) => sum + b.cards.length, 0)} cards across {boards.length} board{boards.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
