import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize2, LayoutGrid } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ControlButtonProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}

function ControlButton({ onClick, title, children, active }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150',
        'text-slate-400 hover:text-white',
        active
          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
          : 'hover:bg-white/10'
      )}
    >
      {children}
    </button>
  );
}

export function CanvasControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div
      className="flex flex-col gap-1 p-1.5 rounded-xl"
      style={{
        background: 'rgba(14, 20, 32, 0.9)',
        border: '1px solid rgba(30, 45, 74, 0.8)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <ControlButton onClick={() => zoomIn({ duration: 200 })} title="Zoom In">
        <ZoomIn size={14} />
      </ControlButton>
      <ControlButton onClick={() => zoomOut({ duration: 200 })} title="Zoom Out">
        <ZoomOut size={14} />
      </ControlButton>
      <div className="w-full h-px bg-white/10" />
      <ControlButton onClick={() => fitView({ duration: 400, padding: 0.1 })} title="Fit View">
        <Maximize2 size={14} />
      </ControlButton>
      <ControlButton onClick={() => fitView({ duration: 400 })} title="Reset Layout">
        <LayoutGrid size={14} />
      </ControlButton>
    </div>
  );
}
