import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board, DecisionCard, Connection } from './types';
import { DEMO_BOARD } from '../data/mockBoards';
import { generateId } from '../lib/utils';

interface BoardState {
  boards: Board[];
  activeBoardId: string | null;
  selectedCardId: string | null;
  editingCardId: string | null;
  isPanelOpen: boolean;
  panelTab: 'card' | 'analysis' | 'board';
  connectingFrom: string | null;

  // Board actions
  setActiveBoard: (id: string) => void;
  createBoard: (title?: string) => string;
  updateBoard: (id: string, updates: Partial<Omit<Board, 'id'>>) => void;
  deleteBoard: (id: string) => void;

  // Card actions
  addCard: (boardId: string, partial?: Partial<DecisionCard>) => string;
  updateCard: (boardId: string, cardId: string, updates: Partial<DecisionCard>) => void;
  deleteCard: (boardId: string, cardId: string) => void;
  moveCard: (boardId: string, cardId: string, position: { x: number; y: number }) => void;

  // Connection actions
  addConnection: (boardId: string, source: string, target: string, type?: Connection['type']) => void;
  deleteConnection: (boardId: string, connectionId: string) => void;

  // UI actions
  selectCard: (id: string | null) => void;
  setEditingCard: (id: string | null) => void;
  togglePanel: () => void;
  setPanelTab: (tab: 'card' | 'analysis' | 'board') => void;
  setConnectingFrom: (id: string | null) => void;
}

const defaultCard = (): Omit<DecisionCard, 'id' | 'position'> => ({
  title: 'New Decision Option',
  description: 'Describe this option or factor...',
  category: 'option',
  pros: [{ id: generateId(), text: 'Enter a pro...', weight: 3 }],
  cons: [{ id: generateId(), text: 'Enter a con...', weight: 3 }],
  risk: 50,
  cost: 50,
  dependencies: [],
  confidence: 70,
  tags: [],
});

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: [DEMO_BOARD],
      activeBoardId: DEMO_BOARD.id,
      selectedCardId: null,
      editingCardId: null,
      isPanelOpen: false,
      panelTab: 'analysis',
      connectingFrom: null,

      setActiveBoard: (id) => set({ activeBoardId: id, selectedCardId: null, editingCardId: null }),

      createBoard: (title) => {
        const id = generateId();
        const board: Board = {
          id,
          title: title || 'New Decision Board',
          description: '',
          cards: [],
          connections: [],
          tags: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set(state => ({ boards: [...state.boards, board], activeBoardId: id }));
        return id;
      },

      updateBoard: (id, updates) => set(state => ({
        boards: state.boards.map(b =>
          b.id === id ? { ...b, ...updates, updatedAt: Date.now() } : b
        ),
      })),

      deleteBoard: (id) => {
        const { boards, activeBoardId } = get();
        const remaining = boards.filter(b => b.id !== id);
        set({
          boards: remaining,
          activeBoardId: remaining.length
            ? (activeBoardId === id ? remaining[0].id : activeBoardId)
            : null,
        });
      },

      addCard: (boardId, partial) => {
        const id = generateId();
        const board = get().boards.find(b => b.id === boardId);
        const offset = board ? board.cards.length * 30 : 0;
        const card: DecisionCard = {
          ...defaultCard(),
          ...partial,
          id,
          position: partial?.position || { x: 200 + offset, y: 200 + offset },
        };
        set(state => ({
          boards: state.boards.map(b =>
            b.id === boardId
              ? { ...b, cards: [...b.cards, card], updatedAt: Date.now() }
              : b
          ),
          selectedCardId: id,
          editingCardId: id,
          isPanelOpen: true,
          panelTab: 'card',
        }));
        return id;
      },

      updateCard: (boardId, cardId, updates) => set(state => ({
        boards: state.boards.map(b =>
          b.id === boardId
            ? {
                ...b,
                updatedAt: Date.now(),
                cards: b.cards.map(c => c.id === cardId ? { ...c, ...updates } : c),
              }
            : b
        ),
      })),

      deleteCard: (boardId, cardId) => set(state => ({
        boards: state.boards.map(b =>
          b.id === boardId
            ? {
                ...b,
                updatedAt: Date.now(),
                cards: b.cards.filter(c => c.id !== cardId),
                connections: b.connections.filter(
                  conn => conn.source !== cardId && conn.target !== cardId
                ),
              }
            : b
        ),
        selectedCardId: state.selectedCardId === cardId ? null : state.selectedCardId,
        editingCardId: state.editingCardId === cardId ? null : state.editingCardId,
      })),

      moveCard: (boardId, cardId, position) => set(state => ({
        boards: state.boards.map(b =>
          b.id === boardId
            ? {
                ...b,
                updatedAt: Date.now(),
                cards: b.cards.map(c => c.id === cardId ? { ...c, position } : c),
              }
            : b
        ),
      })),

      addConnection: (boardId, source, target, type = 'leads-to') => {
        const board = get().boards.find(b => b.id === boardId);
        if (!board) return;
        const exists = board.connections.some(
          c => c.source === source && c.target === target
        );
        if (exists || source === target) return;

        const conn: Connection = {
          id: generateId(),
          source,
          target,
          type,
          animated: type === 'leads-to',
        };
        set(state => ({
          boards: state.boards.map(b =>
            b.id === boardId
              ? { ...b, connections: [...b.connections, conn], updatedAt: Date.now() }
              : b
          ),
        }));
      },

      deleteConnection: (boardId, connectionId) => set(state => ({
        boards: state.boards.map(b =>
          b.id === boardId
            ? {
                ...b,
                updatedAt: Date.now(),
                connections: b.connections.filter(c => c.id !== connectionId),
              }
            : b
        ),
      })),

      selectCard: (id) => set({
        selectedCardId: id,
        isPanelOpen: !!id,
        panelTab: id ? 'card' : 'analysis',
      }),

      setEditingCard: (id) => set({
        editingCardId: id,
        isPanelOpen: !!id,
        panelTab: 'card',
      }),

      togglePanel: () => set(state => ({ isPanelOpen: !state.isPanelOpen })),
      setPanelTab: (tab) => set({ panelTab: tab }),
      setConnectingFrom: (id) => set({ connectingFrom: id }),
    }),
    {
      name: 'decision-studio-boards',
      version: 1,
    }
  )
);

export const useActiveBoard = () => {
  const { boards, activeBoardId } = useBoardStore();
  return boards.find(b => b.id === activeBoardId) || null;
};
