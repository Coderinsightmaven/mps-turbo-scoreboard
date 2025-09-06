import React, { useState } from 'react';
import { CreateCourtData } from '../types';

interface CourtFormProps {
  onSubmit: (courtData: CreateCourtData) => Promise<void>;
  onCancel: () => void;
}

export const CourtForm: React.FC<CourtFormProps> = ({ onSubmit, onCancel }) => {
  const [courtName, setCourtName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courtName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ name: courtName.trim() });
      setCourtName('');
    } catch (error) {
      console.error('Failed to create court:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="court-form">
      <h3>Create New Court</h3>

      <div className="form-group">
        <label htmlFor="name">Court Name:</label>
        <input
          type="text"
          id="name"
          value={courtName}
          onChange={(e) => setCourtName(e.target.value)}
          placeholder="Enter court name"
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting || !courtName.trim()}>
          {isSubmitting ? 'Creating...' : 'Create Court'}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
