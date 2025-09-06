import { useState, useEffect } from "react";
import { Scoreboard, CreateScoreboardData, TennisMatch } from "./types";
import { ApiService } from "./api";
import { ScoreboardList } from "./components/ScoreboardList";
import { ScoreboardForm } from "./components/ScoreboardForm";
import "./App.css";

type TabType = 'home' | 'scoreboards' | 'matches';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [scoreboards, setScoreboards] = useState<Scoreboard[]>([]);
  const [tennisMatches, setTennisMatches] = useState<Record<string, TennisMatch | null>>({});
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

  const fetchTennisMatches = async () => {
    const matches: Record<string, TennisMatch | null> = {};
    for (const scoreboard of scoreboards) {
      try {
        const match = await ApiService.getTennisMatch(scoreboard.id);
        matches[scoreboard.id] = match;
      } catch (error) {
        console.error(`Failed to fetch match for scoreboard ${scoreboard.id}:`, error);
        matches[scoreboard.id] = null;
      }
    }
    setTennisMatches(matches);
  };

  useEffect(() => {
    fetchScoreboards();
  }, []);

  useEffect(() => {
    if (scoreboards.length > 0) {
      fetchTennisMatches();
    }
  }, [scoreboards]);

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

  const handleScoreUpdate = async (scoreboardId: string, side: 'side1' | 'side2') => {
    const currentMatch = tennisMatches[scoreboardId];
    if (!currentMatch) return;

    try {
      const updatedMatch = { ...currentMatch };

      // Update point score
      const currentScore = side === 'side1' ? currentMatch.side1PointScore : currentMatch.side2PointScore;
      let newScore = currentScore;

      // Tennis scoring logic
      if (currentScore === '0') newScore = '15';
      else if (currentScore === '15') newScore = '30';
      else if (currentScore === '30') newScore = '40';
      else if (currentScore === '40') {
        // Check for deuce or win
        const opponentScore = side === 'side1' ? currentMatch.side2PointScore : currentMatch.side1PointScore;
        if (opponentScore === '40') {
          newScore = 'AD'; // Advantage
        } else if (opponentScore === 'AD') {
          // Opponent had advantage, reset to deuce
          if (side === 'side1') {
            updatedMatch.side1PointScore = '40';
            updatedMatch.side2PointScore = '40';
          } else {
            updatedMatch.side1PointScore = '40';
            updatedMatch.side2PointScore = '40';
          }
          return; // Don't update further
        } else {
          // Win the game
          newScore = '0';
          // Reset opponent score
          if (side === 'side1') {
            updatedMatch.side2PointScore = '0';
          } else {
            updatedMatch.side1PointScore = '0';
          }
        }
      } else if (currentScore === 'AD') {
        // Win the game
        newScore = '0';
        // Reset opponent score
        if (side === 'side1') {
          updatedMatch.side2PointScore = '0';
        } else {
          updatedMatch.side1PointScore = '0';
        }
      }

      // Update the score
      if (side === 'side1') {
        updatedMatch.side1PointScore = newScore;
      } else {
        updatedMatch.side2PointScore = newScore;
      }

      // Update the API
      await ApiService.updateTennisMatch(scoreboardId, updatedMatch);

      // Update local state
      setTennisMatches(prev => ({
        ...prev,
        [scoreboardId]: updatedMatch
      }));

    } catch (error) {
      console.error('Failed to update score:', error);
      setError('Failed to update score');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading">
          <h2>Loading...</h2>
          <p>Please wait while we load the data.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="home-content">
            <div className="welcome-section">
              <h1>🏓 Tennis Scoreboard Management</h1>
              <p>Manage your tennis scoreboards and live match data with ease.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>{scoreboards.length}</h3>
                <p>Total Scoreboards</p>
              </div>
              <div className="stat-card">
                <h3>🏆</h3>
                <p>Active Matches</p>
              </div>
              <div className="stat-card">
                <h3>⚡</h3>
                <p>Real-time Updates</p>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button
                  onClick={() => setActiveTab('scoreboards')}
                  className="action-btn primary"
                >
                  Manage Scoreboards
                </button>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="action-btn secondary"
                >
                  View Live Matches
                </button>
              </div>
            </div>
          </div>
        );

      case 'scoreboards':
        return (
          <div className="scoreboards-content">
            <div className="section-header">
              <div>
                <h2>All Scoreboards ({scoreboards.length})</h2>
                <p>Manage your tennis scoreboards</p>
              </div>
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
        );

      case 'matches':
        return (
          <div className="matches-content">
            <div className="section-header">
              <div>
                <h2>Live Tennis Matches</h2>
                <p>View current match data for all scoreboards</p>
              </div>
            </div>

            <div className="matches-grid">
              {scoreboards.map((scoreboard) => {
                const match = tennisMatches[scoreboard.id];
                return (
                  <div key={scoreboard.id} className="match-card">
                    <div className="match-header">
                      <h3>{scoreboard.name}</h3>
                      {match ? (
                        <span className="match-status live">🔴 LIVE</span>
                      ) : (
                        <span className="match-status">No Active Match</span>
                      )}
                    </div>

                    {match ? (
                      <div className="match-details">
                        <div className="players">
                          <div className="player">
                            <span className="player-name">{match.player1Name || 'Player 1'}</span>
                            <span className="player-score">{match.scoreStringSide1}</span>
                          </div>
                          <div className="vs">VS</div>
                          <div className="player">
                            <span className="player-name">{match.player2Name || 'Player 2'}</span>
                            <span className="player-score">{match.scoreStringSide2}</span>
                          </div>
                        </div>

                        <div className="current-game">
                          <h4>Current Game</h4>
                          <div className="game-score">
                            <div className="point-score">
                              <span>{match.side1PointScore}</span>
                              <span>-</span>
                              <span>{match.side2PointScore}</span>
                            </div>
                            <div className="server-info">
                              {match.server.sideNumber === 1 ? '← Server' : 'Server →'}
                            </div>
                          </div>

                          <div className="score-controls">
                            <button
                              onClick={() => handleScoreUpdate(scoreboard.id, 'side1')}
                              className="score-btn"
                            >
                              +1 {match.player1Name || 'Player 1'}
                            </button>
                            <button
                              onClick={() => handleScoreUpdate(scoreboard.id, 'side2')}
                              className="score-btn"
                            >
                              +1 {match.player2Name || 'Player 2'}
                            </button>
                          </div>
                        </div>

                        <div className="sets">
                          <h4>Sets</h4>
                          <div className="sets-grid">
                            {match.sets.map((set, index) => (
                              <div key={index} className="set">
                                <span className="set-label">Set {index + 1}</span>
                                <span className="set-score">{set.side1Score}-{set.side2Score}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="no-match">
                        <p>No active tennis match on this scoreboard.</p>
                        <p>The match data will appear here when a game is in progress.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>🏓 Tennis Scoreboard</h1>
        </div>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            className={`nav-tab ${activeTab === 'scoreboards' ? 'active' : ''}`}
            onClick={() => setActiveTab('scoreboards')}
          >
            Scoreboards
          </button>
          <button
            className={`nav-tab ${activeTab === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            Live Matches
          </button>
        </div>
      </nav>

      <main className="main-content">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {renderContent()}
      </main>

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
    </div>
  );
}

export default App;
