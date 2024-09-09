import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment} from "../env/environment";

interface Repository {
  id: number;
  name: string;
  description: string;
  pushed_at: string;
  html_url: string;
  languages_url: string;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://api.github.com/users/raphgrt/repos';

  constructor() {}

  async getLastRepositories(perPage: number = 5, sort: string = 'created'): Promise<Repository[]> {
    const url = `${this.apiUrl}?per_page=${perPage}&sort=${sort}`;
    const headers = { 'Authorization': `token ${environment.githubApiKey}` };

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching repositories!', error);
      throw error;
    }
  }

  async getRepositoryLanguages(url: string): Promise<{ [key: string]: number }> {
    const headers = { 'Authorization': `token ${environment.githubApiKey}` };

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching repository languages!', error);
      throw error;
    }
  }
}
