import { motion } from 'framer-motion';
import { Sidebar } from './components/sidebar/Sidebar';
import { Toolbar } from './components/ui/Toolbar';
import { DecisionCanvas } from './components/canvas/DecisionCanvas';
import { RightPanel } from './components/panels/RightPanel';
import { useBoardStore } from './store/boardStore';

function App() {
  const { activeBoardId } = useBoardStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        {activeBoardId && <Toolbar />}

        {/* Canvas + Right Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 relative canvas-dot-grid overflow-hidden">
            {!activeBoardId ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-slate-400 mb-4">Select or create a board to begin</p>
                </motion.div>
              </div>
            ) : (
              <DecisionCanvas />
            )}
          </div>

          {/* Right panel */}
          <RightPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
