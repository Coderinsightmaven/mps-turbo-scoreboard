import { useState, useEffect } from "react";
import { Court, CreateCourtData } from "./types";
import { ApiService } from "./api";
import { CourtList } from "./components/CourtList";
import { CourtForm } from "./components/CourtForm";
import "./App.css";

function App() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCourts = async () => {
    try {
      setError(null);
      const data = await ApiService.getCourts();
      setCourts(data);
    } catch (err) {
      setError('Failed to fetch courts. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const handleCreateCourt = async (courtData: CreateCourtData) => {
    try {
      await ApiService.createCourt(courtData);
      await fetchCourts(); // Refresh the list
      setShowForm(false);
    } catch (err) {
      setError('Failed to create court');
    }
  };

  const handleDeleteCourt = async (id: string) => {
    try {
      setDeletingId(id);
      await ApiService.deleteCourt(id);
      await fetchCourts(); // Refresh the list
    } catch (err) {
      setError('Failed to delete court');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="container">
        <h1>Court Management System</h1>
        <p>Loading courts...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Court Management System</h1>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="courts-section">
        <div className="section-header">
          <h2>All Courts ({courts.length})</h2>
          <button
            onClick={() => setShowForm(true)}
            className="create-btn"
          >
            Add New Court
          </button>
        </div>

        <CourtList
          courts={courts}
          onDelete={handleDeleteCourt}
          isDeleting={deletingId}
        />
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <CourtForm
              onSubmit={handleCreateCourt}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
