import { Court, CreateCourtData } from './types';

const API_BASE_URL = 'http://localhost:3000';

export class ApiService {
  static async getCourts(): Promise<Court[]> {
    const response = await fetch(`${API_BASE_URL}/courts`);
    if (!response.ok) {
      throw new Error('Failed to fetch courts');
    }
    return response.json();
  }

  static async createCourt(courtData: CreateCourtData): Promise<Court> {
    const response = await fetch(`${API_BASE_URL}/courts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    });
    if (!response.ok) {
      throw new Error('Failed to delete court');
    }
    return response.json();
  }
}
