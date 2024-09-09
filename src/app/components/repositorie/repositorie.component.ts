import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from '../../env/environment';
import { DataViewModule } from 'primeng/dataview';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repositorie',
  standalone: true,
  imports: [DataViewModule, CommonModule],
  templateUrl: './repositorie.component.html',
  styleUrls: ['./repositorie.component.scss']
})
export class RepositorieComponent implements OnInit {
  repositories: any[] = [];
  mostUsedLanguage: string = '';
  languageImages: { [key: string]: string } = {
    'Web': 'assets/web.png',
    'Object': 'assets/object.png',
    'Beautiful': 'assets/beautiful.png',
    'Other': 'assets/other.png'
  };
  languageImage: string = '';

  ngOnInit() {
    this.getLastRepositories();
  }

  public getCategorie(language: string): string {
    const webLanguage = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'PHP', 'Ruby'];
    const objectLanguage = ['Java', 'C++', 'C#', 'Python', 'Swift', 'Kotlin'];
    const beautifulLanguage = ['Python', 'Ruby', 'Haskell'];

    if (webLanguage.includes(language)) return 'Web';
    if (objectLanguage.includes(language)) return 'Object';
    if (beautifulLanguage.includes(language)) return 'Beautiful';
    return 'Other';
  }

  private async getLastRepositories() {
    const url = `https://api.github.com/users/raphgrt/repos?per_page=5&sort=created`;
    const headers = { 'Authorization': `token ${environment.githubApiKey}` };

    try {
      const response = await axios.get(url, { headers });
      this.repositories = response.data;
      await this.setMostUsedLanguage();
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  private async setMostUsedLanguage() {
    const languageCounts: { [key: string]: number } = {};

    for (const repo of this.repositories) {
      const langUrl = repo.languages_url;
      try {
        const response = await axios.get(langUrl, { headers: { 'Authorization': `token ${environment.githubApiKey}` } });
        for (const [language, count] of Object.entries(response.data)) {
          languageCounts[language] = (languageCounts[language] || 0) + (count as number);
        }
      } catch (error) {
        console.error('Error fetching languages for repo:', error);
      }
    }

    this.mostUsedLanguage = Object.keys(languageCounts).reduce((a, b) => languageCounts[a] > languageCounts[b] ? a : b, '');
    this.languageImage = this.languageImages[this.getCategorie(this.mostUsedLanguage)] || 'assets/other.png';
  }
}
