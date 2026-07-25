import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Copy, Calendar, GitBranch, BarChart3, Link2 } from 'lucide-react';
import { useBoardStore, useActiveBoard } from '../../store/boardStore';
import { formatRelativeTime, formatDate } from '../../lib/utils';

export function BoardSettingsPanel() {
  const board = useActiveBoard();
  const { updateBoard, deleteBoard, setActiveBoard, boards, createBoard } = useBoardStore();
  const [title, setTitle] = useState(board?.title || '');
  const [desc, setDesc] = useState(board?.description || '');

  useEffect(() => {
    setTitle(board?.title || '');
    setDesc(board?.description || '');
  }, [board?.id]);

  if (!board) return null;

  const stats = [
    { icon: <GitBranch size={12} />, label: 'Cards', value: board.cards.length, color: '#6366F1' },
    { icon: <Link2 size={12} />, label: 'Connections', value: board.connections.length, color: '#0EA5E9' },
    { icon: <BarChart3 size={12} />, label: 'Options', value: board.cards.filter(c => c.category === 'option').length, color: '#10B981' },
    { icon: <Calendar size={12} />, label: 'Updated', value: formatRelativeTime(board.updatedAt), color: '#F59E0B' },
  ];

  return (
    <div className="flex flex-col gap-5 p-4 overflow-y-auto">
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Board Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={() => updateBoard(board.id, { title })}
          className="w-full text-sm px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors font-semibold"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Description</label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          onBlur={() => updateBoard(board.id, { description: desc })}
          rows={3}
          className="w-full text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors resize-none leading-relaxed"
        />
      </div>

      {/* Stats */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Board Stats</h4>
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-1.5 mb-1" style={{ color: stat.color }}>
                {stat.icon}
                <span className="text-xs text-slate-400">{stat.label}</span>
              </div>
              <span className="font-bold text-white text-sm">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Created */}
      <div className="text-xs text-slate-500 flex items-center gap-2">
        <Calendar size={10} />
        Created {formatDate(board.createdAt)}
      </div>

      {/* Danger zone */}
      <div className="rounded-xl p-3 mt-2"
        style={{ background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
        <h4 className="text-xs font-semibold text-rose-400 mb-2">Danger Zone</h4>
        <button
          onClick={() => {
            if (boards.length > 1) {
              const others = boards.filter(b => b.id !== board.id);
              deleteBoard(board.id);
              setActiveBoard(others[0].id);
            }
          }}
          disabled={boards.length <= 1}
          className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 size={12} />
          Delete this board
        </button>
      </div>
    </div>
  );
}
