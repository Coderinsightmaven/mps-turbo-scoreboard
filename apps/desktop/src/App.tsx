import { useState, useEffect } from "react";
import { Scoreboard, CreateScoreboardData } from "./types";
import { ApiService } from "./api";
import { ScoreboardList } from "./components/ScoreboardList";
import { ScoreboardForm } from "./components/ScoreboardForm";
import "./App.css";

function App() {
  const [scoreboards, setScoreboards] = useState<Scoreboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchScoreboards = async () => {
    try {
      setError(null);
      const data = await ApiService.getScoreboards();
      setScoreboards(data);
    } catch (err) {
      setError('Failed to fetch scoreboards. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScoreboards();
  }, []);

  const handleCreateScoreboard = async (scoreboardData: CreateScoreboardData) => {
    try {
      await ApiService.createScoreboard(scoreboardData);
      await fetchScoreboards(); // Refresh the list
      setShowForm(false);
    } catch (err) {
      setError('Failed to create scoreboard');
    }
  };

  const handleDeleteScoreboard = async (id: string) => {
    try {
      setDeletingId(id);
      await ApiService.deleteScoreboard(id);
      await fetchScoreboards(); // Refresh the list
    } catch (err) {
      setError('Failed to delete scoreboard');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="container">
        <h1>Scoreboard Management System</h1>
        <p>Loading scoreboards...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Scoreboard Management System</h1>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="scoreboards-section">
        <div className="section-header">
          <h2>All Scoreboards ({scoreboards.length})</h2>
          <button
            onClick={() => setShowForm(true)}
            className="create-btn"
          >
            Add New Scoreboard
          </button>
        </div>

        <ScoreboardList
          scoreboards={scoreboards}
          onDelete={handleDeleteScoreboard}
          isDeleting={deletingId}
        />
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <ScoreboardForm
              onSubmit={handleCreateScoreboard}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
