import React from 'react';
import { Scoreboard } from '../types';

interface ScoreboardListProps {
  scoreboards: Scoreboard[];
  onDelete: (id: string) => Promise<void>;
  isDeleting: string | null;
}

export const ScoreboardList: React.FC<ScoreboardListProps> = ({ scoreboards, onDelete, isDeleting }) => {

  return (
    <div className="scoreboards-list">
      <h3>Scoreboards</h3>
      {scoreboards.length === 0 ? (
        <p>No scoreboards found.</p>
      ) : (
        <div className="scoreboards-grid">
          {scoreboards.map((scoreboard) => (
            <div key={scoreboard.id} className="scoreboard-card">
              <div className="scoreboard-header">
                <h4>{scoreboard.name}</h4>
              </div>

              <div className="scoreboard-actions">
                <button
                  onClick={() => onDelete(scoreboard.id)}
                  disabled={isDeleting === scoreboard.id}
                  className="delete-btn"
                >
                  {isDeleting === scoreboard.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
