import React from 'react';
import { Court } from '../types';

interface CourtListProps {
  courts: Court[];
  onDelete: (id: string) => Promise<void>;
  isDeleting: string | null;
}

export const CourtList: React.FC<CourtListProps> = ({ courts, onDelete, isDeleting }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#4CAF50';
      case 'occupied':
        return '#FF9800';
      case 'maintenance':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

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
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(court.status) }}
                >
                  {court.status}
                </span>
              </div>

              <div className="court-details">
                <p><strong>Location:</strong> {court.location || 'Not specified'}</p>
                <p><strong>Type:</strong> {court.type}</p>
                <p><strong>Capacity:</strong> {court.capacity || 'Not specified'}</p>
                <p><strong>Created:</strong> {formatDate(court.createdAt)}</p>
                <p><strong>Updated:</strong> {formatDate(court.updatedAt)}</p>
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
