import { motion } from 'framer-motion';
import { Plus, Sparkles, GitBranch, BarChart3 } from 'lucide-react';

interface EmptyCanvasStateProps {
  onAddCard: () => void;
}

export function EmptyCanvasState({ onAddCard }: EmptyCanvasStateProps) {
  const features = [
    { icon: <GitBranch size={16} />, text: 'Visual decision trees', color: '#6366F1' },
    { icon: <BarChart3 size={16} />, text: 'Intelligence scoring', color: '#10B981' },
    { icon: <Sparkles size={16} />, text: 'Drag & connect cards', color: '#A78BFA' },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 max-w-md text-center pointer-events-auto"
      >
        {/* Illustration */}
        <div className="relative">
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
            {/* Center node */}
            <rect x="40" y="30" width="40" height="28" rx="8"
              fill="rgba(99,102,241,0.15)" stroke="#6366F1" strokeWidth="1.5" />
            <circle cx="60" cy="44" r="4" fill="#6366F1" />
            <line x1="60" y1="48" x2="60" y2="58" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="3,2" />

            {/* Left option */}
            <rect x="5" y="65" width="40" height="24" rx="7"
              fill="rgba(16,185,129,0.12)" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4,2" />
            <line x1="60" y1="58" x2="25" y2="65" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3,2" />

            {/* Right option */}
            <rect x="75" y="65" width="40" height="24" rx="7"
              fill="rgba(14,165,233,0.12)" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="4,2" />
            <line x1="60" y1="58" x2="95" y2="65" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="3,2" />

            {/* Plus signs in empty nodes */}
            <text x="25" y="79" textAnchor="middle" fill="#10B981" fontSize="14" fontWeight="bold">+</text>
            <text x="95" y="79" textAnchor="middle" fill="#0EA5E9" fontSize="14" fontWeight="bold">+</text>

            {/* Floating sparkles */}
            <circle cx="15" cy="20" r="2" fill="#A78BFA" opacity="0.6" />
            <circle cx="105" cy="15" r="1.5" fill="#6366F1" opacity="0.5" />
            <circle cx="110" cy="55" r="2" fill="#10B981" opacity="0.4" />
          </svg>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            Your canvas awaits
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Add your first decision card to start mapping options, evaluating trade-offs, and surfacing the best path forward.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ color: f.color, background: `${f.color}15`, border: `1px solid ${f.color}25` }}
            >
              <span style={{ color: f.color }}>{f.icon}</span>
              {f.text}
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={onAddCard}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white text-sm"
          style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            boxShadow: '0 4px 24px rgba(99, 102, 241, 0.4)',
          }}
        >
          <Plus size={18} />
          Add First Decision Card
        </motion.button>
      </motion.div>
    </div>
  );
}
