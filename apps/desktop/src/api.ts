import { Scoreboard, CreateScoreboardData, TennisMatch } from './types';

const API_BASE_URL = 'http://localhost:3000';
const API_KEY = 'dev-api-key-12345'; // Same as the default in the guard

export class ApiService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    };
  }

  static async getScoreboards(): Promise<Scoreboard[]> {
    const response = await fetch(`${API_BASE_URL}/scoreboards`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch scoreboards');
    }
    return response.json();
  }

  static async createScoreboard(scoreboardData: CreateScoreboardData): Promise<Scoreboard> {
    const response = await fetch(`${API_BASE_URL}/scoreboards`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(scoreboardData),
    });
    if (!response.ok) {
      throw new Error('Failed to create scoreboard');
    }
    return response.json();
  }

  static async deleteScoreboard(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/scoreboards/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete scoreboard');
    }
    return response.json();
  }

  static async getTennisMatch(scoreboardId: string): Promise<TennisMatch | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/scoreboards/${scoreboardId}/tennis`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No match found for this scoreboard
        }
        throw new Error('Failed to fetch tennis match');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching tennis match:', error);
      return null;
    }
  }

  static async updateTennisMatch(scoreboardId: string, matchData: Partial<TennisMatch>): Promise<TennisMatch> {
    const response = await fetch(`${API_BASE_URL}/scoreboards/${scoreboardId}/tennis`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(matchData),
    });
    if (!response.ok) {
      throw new Error('Failed to update tennis match');
    }
    return response.json();
  }
}
