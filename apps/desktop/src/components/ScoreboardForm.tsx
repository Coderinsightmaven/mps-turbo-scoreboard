import React, { useState } from 'react';
import { CreateScoreboardData } from '../types';

interface ScoreboardFormProps {
  onSubmit: (scoreboardData: CreateScoreboardData) => Promise<void>;
  onCancel: () => void;
}

export const ScoreboardForm: React.FC<ScoreboardFormProps> = ({ onSubmit, onCancel }) => {
  const [scoreboardName, setScoreboardName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreboardName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ name: scoreboardName.trim() });
      setScoreboardName('');
    } catch (error) {
      console.error('Failed to create scoreboard:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="scoreboard-form">
      <h3>Create New Scoreboard</h3>

      <div className="form-group">
        <label htmlFor="name">Scoreboard Name:</label>
        <input
          type="text"
          id="name"
          value={scoreboardName}
          onChange={(e) => setScoreboardName(e.target.value)}
          placeholder="Enter scoreboard name"
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting || !scoreboardName.trim()}>
          {isSubmitting ? 'Creating...' : 'Create Scoreboard'}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
