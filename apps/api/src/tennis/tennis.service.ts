import { Injectable, OnModuleInit } from '@nestjs/common';
import { TennisMatch, CreateTennisMatchData } from './tennis.interface';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class TennisService implements OnModuleInit {
  private matches: TennisMatch[] = [];
  private readonly dataFile = path.join(process.cwd(), 'data', 'tennis-matches-data.json');

  async onModuleInit() {
    await this.loadMatchesFromFile();
  }

  private async loadMatchesFromFile() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf-8');
      this.matches = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, initialize with empty array
      this.matches = [];
      await this.saveMatchesToFile();
    }
  }

  private async saveMatchesToFile() {
    try {
      await fs.writeFile(this.dataFile, JSON.stringify(this.matches, null, 2));
    } catch (error) {
      console.error('Failed to save matches to file:', error);
    }
  }

  async findAll(): Promise<TennisMatch[]> {
    return this.matches;
  }

  async findOne(id: string): Promise<TennisMatch | undefined> {
    return this.matches.find(match => match.id === id);
  }

  async create(matchData: CreateTennisMatchData): Promise<TennisMatch> {
    const newMatch: TennisMatch = {
      ...matchData,
      id: (this.matches.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.matches.push(newMatch);
    await this.saveMatchesToFile();
    return newMatch;
  }

  async update(id: string, matchData: CreateTennisMatchData): Promise<TennisMatch | null> {
    const index = this.matches.findIndex(match => match.id === id);
    if (index !== -1) {
      this.matches[index] = {
        ...this.matches[index],
        ...matchData,
        updatedAt: new Date(),
      };
      await this.saveMatchesToFile();
      return this.matches[index];
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.matches.findIndex(match => match.id === id);
    if (index !== -1) {
      this.matches.splice(index, 1);
      await this.saveMatchesToFile();
      return true;
    }
    return false;
  }

  async getCurrentMatch(): Promise<TennisMatch | undefined> {
    // Return the most recently updated match
    return this.matches
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  }
}
