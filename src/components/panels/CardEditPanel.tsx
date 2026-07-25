import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, XCircle, AlertTriangle, DollarSign,
  Link2, Target, Plus, Trash2, X, ChevronDown
} from 'lucide-react';
import { useBoardStore, useActiveBoard } from '../../store/boardStore';
import type { DecisionCard, ProCon } from '../../store/types';
import { generateId, CARD_CATEGORY_COLORS } from '../../lib/utils';
import { MetricBar } from '../ui/MetricBar';

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
  icon: React.ReactNode;
  inverted?: boolean;
}

function Slider({ label, value, onChange, color, icon, inverted }: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span style={{ color }}>{icon}</span>
          <span className="text-xs font-medium text-slate-300">{label}</span>
        </div>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(90deg, ${color} ${value}%, rgba(255,255,255,0.1) ${value}%)`,
          accentColor: color,
        }}
      />
    </div>
  );
}

interface ProConListProps {
  items: ProCon[];
  type: 'pro' | 'con';
  onChange: (items: ProCon[]) => void;
}

function ProConList({ items, type, onChange }: ProConListProps) {
  const color = type === 'pro' ? '#10B981' : '#F43F5E';
  const label = type === 'pro' ? 'Pro' : 'Con';

  const addItem = () => {
    onChange([...items, { id: generateId(), text: '', weight: 3 }]);
  };

  const updateItem = (id: string, updates: Partial<ProCon>) => {
    onChange(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {type === 'pro'
            ? <CheckCircle2 size={12} color={color} />
            : <XCircle size={12} color={color} />
          }
          <span className="text-xs font-semibold" style={{ color }}>{label}s</span>
          <span className="text-xs text-slate-500">({items.length})</span>
        </div>
        <button
          onClick={addItem}
          className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg transition-colors"
          style={{ color, background: `${color}15` }}
        >
          <Plus size={10} />
          Add
        </button>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.id} className="flex gap-1.5 items-center">
            <input
              type="text"
              value={item.text}
              onChange={e => updateItem(item.id, { text: e.target.value })}
              placeholder={`Enter ${label.toLowerCase()}...`}
              className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-white/20 transition-colors"
            />
            <select
              value={item.weight}
              onChange={e => updateItem(item.id, { weight: Number(e.target.value) })}
              className="w-10 text-xs px-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 focus:outline-none appearance-none text-center"
              style={{ accentColor: color }}
            >
              {[1,2,3,4,5].map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <button
              onClick={() => removeItem(item.id)}
              className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardEditPanel() {
  const board = useActiveBoard();
  const { selectedCardId, activeBoardId, updateCard, deleteCard, selectCard, setEditingCard } = useBoardStore();
  const card = board?.cards.find(c => c.id === selectedCardId);

  const [localCard, setLocalCard] = useState<DecisionCard | null>(null);

  useEffect(() => {
    setLocalCard(card ? { ...card } : null);
  }, [selectedCardId]);

  const save = (updates: Partial<DecisionCard>) => {
    if (!activeBoardId || !selectedCardId || !localCard) return;
    const merged = { ...localCard, ...updates };
    setLocalCard(merged);
    updateCard(activeBoardId, selectedCardId, updates);
  };

  const handleDelete = () => {
    if (!activeBoardId || !selectedCardId) return;
    deleteCard(activeBoardId, selectedCardId);
    selectCard(null);
    setEditingCard(null);
  };

  if (!localCard) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-slate-500">Select a card to edit its details</p>
      </div>
    );
  }

  const accentColor = CARD_CATEGORY_COLORS[localCard.category] || '#6366F1';

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
            style={{ color: accentColor, background: `${accentColor}18` }}>
            {localCard.category}
          </span>
          <button onClick={handleDelete} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>

        {/* Category selector */}
        <div className="flex gap-1.5 mb-3">
          {(['root', 'option', 'factor', 'outcome'] as const).map(cat => {
            const catColor = CARD_CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => save({ category: cat })}
                className="flex-1 text-xs py-1 rounded-lg font-medium capitalize transition-all"
                style={{
                  color: localCard.category === cat ? catColor : '#64748B',
                  background: localCard.category === cat ? `${catColor}20` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${localCard.category === cat ? catColor + '40' : 'transparent'}`,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Title</label>
          <input
            type="text"
            value={localCard.title}
            onChange={e => save({ title: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors font-semibold"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Description</label>
          <textarea
            value={localCard.description}
            onChange={e => save({ description: e.target.value })}
            rows={3}
            className="w-full text-xs px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Pros */}
        <ProConList
          items={localCard.pros}
          type="pro"
          onChange={(pros) => save({ pros })}
        />

        {/* Cons */}
        <ProConList
          items={localCard.cons}
          type="con"
          onChange={(cons) => save({ cons })}
        />

        {/* Metrics */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metrics</h4>
          <Slider
            label="Risk Level"
            value={localCard.risk}
            onChange={(risk) => save({ risk })}
            color="#F59E0B"
            icon={<AlertTriangle size={12} />}
            inverted
          />
          <Slider
            label="Cost Impact"
            value={localCard.cost}
            onChange={(cost) => save({ cost })}
            color="#0EA5E9"
            icon={<DollarSign size={12} />}
            inverted
          />
          <Slider
            label="Confidence"
            value={localCard.confidence}
            onChange={(confidence) => save({ confidence })}
            color="#A78BFA"
            icon={<Target size={12} />}
          />
        </div>
      </div>
    </div>
  );
}
