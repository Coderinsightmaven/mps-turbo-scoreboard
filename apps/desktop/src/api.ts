import { Court, CreateCourtData } from './types';

const API_BASE_URL = 'http://localhost:3000';
const API_KEY = 'dev-api-key-12345'; // Same as the default in the guard

export class ApiService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    };
  }

  static async getCourts(): Promise<Court[]> {
    const response = await fetch(`${API_BASE_URL}/courts`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch courts');
    }
    return response.json();
  }

  static async createCourt(courtData: CreateCourtData): Promise<Court> {
    const response = await fetch(`${API_BASE_URL}/courts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(courtData),
    });
    if (!response.ok) {
      throw new Error('Failed to create court');
    }
    return response.json();
  }

  static async deleteCourt(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/courts/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete court');
    }
    return response.json();
  }
}
