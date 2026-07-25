import { memo } from 'react';
import { type EdgeProps, getBezierPath, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';
import { CONNECTION_TYPE_COLORS } from '../../lib/utils';

interface CustomEdgeData {
  label?: string;
  type?: string;
}

export const CustomEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  animated,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as CustomEdgeData | undefined;
  const connType = (edgeData?.type as string) || 'leads-to';
  const color = CONNECTION_TYPE_COLORS[connType] || '#6366F1';
  const label = edgeData?.label;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: selected ? 2.5 : 1.8,
          filter: `drop-shadow(0 0 ${selected ? 8 : 4}px ${color}60)`,
          strokeDasharray: animated ? '8,4' : undefined,
          animation: animated ? 'dash 1.5s linear infinite' : undefined,
        }}
        markerEnd={`url(#arrow-${connType})`}
      />
      <defs>
        <marker
          id={`arrow-${connType}`}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L8,3 z" fill={color} opacity="0.8" />
        </marker>
        <style>{`
          @keyframes dash {
            to { stroke-dashoffset: -24; }
          }
        `}</style>
      </defs>
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nopan"
          >
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                color,
                background: `${color}18`,
                border: `1px solid ${color}30`,
                backdropFilter: 'blur(8px)',
              }}
            >
              {label}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';
