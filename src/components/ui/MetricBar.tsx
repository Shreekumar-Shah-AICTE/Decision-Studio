import { cn } from '../../lib/utils';

interface MetricBarProps {
  label: string;
  value: number;
  max?: number;
  color: string;
  icon?: React.ReactNode;
  inverted?: boolean; // higher is worse
  compact?: boolean;
}

export function MetricBar({ label, value, max = 100, color, icon, inverted = false, compact = false }: MetricBarProps) {
  const pct = (value / max) * 100;

  return (
    <div className={cn('flex flex-col gap-1', compact ? 'gap-0.5' : 'gap-1.5')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon && <span style={{ color, opacity: 0.9 }}>{icon}</span>}
          <span className={cn('font-medium text-slate-300', compact ? 'text-xs' : 'text-xs')}>{label}</span>
        </div>
        <span className={cn('font-bold tabular-nums', compact ? 'text-xs' : 'text-sm')} style={{ color }}>
          {value}
          {max === 100 ? '%' : ''}
        </span>
      </div>
      <div
        className="rounded-full overflow-hidden"
        style={{ height: compact ? 3 : 5, background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: inverted
              ? `linear-gradient(90deg, ${color}90, ${color})`
              : `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 6px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}
