import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useBoardStore, useActiveBoard } from '../../store/boardStore';
import { DecisionCardNode } from '../cards/DecisionCardNode';
import { CustomEdge } from './CustomEdge';
import { CanvasControls } from './CanvasControls';
import { EmptyCanvasState } from './EmptyCanvasState';
import type { DecisionCard } from '../../store/types';

const nodeTypes = { decisionCard: DecisionCardNode };
const edgeTypes = { custom: CustomEdge };

function CanvasInner() {
  const board = useActiveBoard();
  const { activeBoardId, moveCard, addConnection, deleteConnection, addCard, selectCard } = useBoardStore();
  const { fitView } = useReactFlow();

  const nodes: Node[] = useMemo(() =>
    board?.cards.map(card => ({
      id: card.id,
      type: 'decisionCard',
      position: card.position,
      data: card as unknown as Record<string, unknown>,
      selected: false,
      draggable: true,
    })) || [],
    [board?.cards]
  );

  const edges: Edge[] = useMemo(() =>
    board?.connections.map(conn => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      type: 'custom',
      animated: conn.animated || false,
      data: { label: conn.label, type: conn.type },
    })) || [],
    [board?.connections]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      if (!activeBoardId || !board) return;
      changes.forEach(change => {
        if (change.type === 'position' && change.position && change.id) {
          moveCard(activeBoardId, change.id, change.position);
        }
        if (change.type === 'select' && change.id) {
          if (change.selected) selectCard(change.id);
        }
      });
    },
    [activeBoardId, board, moveCard, selectCard]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      if (!activeBoardId) return;
      changes.forEach(change => {
        if (change.type === 'remove') {
          deleteConnection(activeBoardId, change.id);
        }
      });
    },
    [activeBoardId, deleteConnection]
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (!activeBoardId || !connection.source || !connection.target) return;
      addConnection(activeBoardId, connection.source, connection.target, 'leads-to');
    },
    [activeBoardId, addConnection]
  );

  const onPaneClick = useCallback(() => {
    selectCard(null);
  }, [selectCard]);

  const handleAddCard = useCallback(() => {
    if (!activeBoardId) return;
    addCard(activeBoardId, {
      position: {
        x: 200 + Math.random() * 300,
        y: 200 + Math.random() * 200,
      },
    });
    setTimeout(() => fitView({ duration: 400, padding: 0.2 }), 100);
  }, [activeBoardId, addCard, fitView]);
  

  if (!board) return null;

  return (
    <div className="relative w-full h-full">
      {board.cards.length === 0 && <EmptyCanvasState onAddCard={handleAddCard} />}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.1, duration: 600 }}
        minZoom={0.1}
        maxZoom={3}
        defaultEdgeOptions={{
          type: 'custom',
          animated: false,
          data: { type: 'leads-to' },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1}
          color="rgba(99, 102, 241, 0.12)"
        />
        <MiniMap
          position="bottom-left"
          style={{ bottom: 16, left: 16 }}
          nodeColor={(node) => {
            const card = node.data as unknown as DecisionCard;
            const colors: Record<string, string> = {
              root: '#6366F1',
              option: '#0EA5E9',
              outcome: '#10B981',
              factor: '#F59E0B',
            };
            return colors[card?.category] || '#6366F1';
          }}
          maskColor="rgba(8, 12, 20, 0.6)"
        />

        {/* Canvas Controls */}
        <Panel position="bottom-right">
          <div className="flex flex-col items-end gap-3 mb-4 mr-4">
            <CanvasControls />
          </div>
        </Panel>

        {/* Add card floating button */}
        {board.cards.length > 0 && (
          <Panel position="top-right">
            <div className="mt-4 mr-4">
              <motion.button
                onClick={handleAddCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                }}
              >
                <Plus size={16} />
                Add Card
              </motion.button>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}

export function DecisionCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
