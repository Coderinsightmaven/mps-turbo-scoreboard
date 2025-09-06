import React from 'react';
import { Court } from '../types';

interface CourtListProps {
  courts: Court[];
  onDelete: (id: string) => Promise<void>;
  isDeleting: string | null;
}

export const CourtList: React.FC<CourtListProps> = ({ courts, onDelete, isDeleting }) => {

  return (
    <div className="courts-list">
      <h3>Courts</h3>
      {courts.length === 0 ? (
        <p>No courts found.</p>
      ) : (
        <div className="courts-grid">
          {courts.map((court) => (
            <div key={court.id} className="court-card">
              <div className="court-header">
                <h4>{court.name}</h4>
              </div>

              <div className="court-actions">
                <button
                  onClick={() => onDelete(court.id)}
                  disabled={isDeleting === court.id}
                  className="delete-btn"
                >
                  {isDeleting === court.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
