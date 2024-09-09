import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-repositorie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repositorie.component.html',
  styleUrls: ['./repositorie.component.scss']
})
export class RepositorieComponent implements OnInit {
  repositories: any[] = [];
  mostUsedLanguage: string = '';
  languageImages: { [key: string]: string } = {
    'Web': 'assets/web.svg',
    'Object': 'assets/object.svg',
    'Beautiful': 'assets/beautiful.svg',
    'Other': 'assets/other.svg'
  };
  languageImage: string = '';
  page: number = 1;
  rows: number = 5;

  constructor(private githubService: GithubService) {}

  ngOnInit() {
    this.loadRepositories();
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

  private async loadRepositories() {
    try {
      this.repositories = await this.githubService.getLastRepositories();
      console.log('Repositories:', this.repositories); // Log repositories to console
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
        const response = await this.githubService.getRepositoryLanguages(langUrl);
        for (const [language, count] of Object.entries(response)) {
          languageCounts[language] = (languageCounts[language] || 0) + (count as number);
        }
      } catch (error) {
        console.error('Error fetching languages for repo:', error);
      }
    }

    this.mostUsedLanguage = Object.keys(languageCounts).reduce((a, b) => languageCounts[a] > languageCounts[b] ? a : b, '');
    this.languageImage = this.languageImages[this.getCategorie(this.mostUsedLanguage)] || 'assets/other.svg';
  }

  onPage(event: any) {
    this.page = event.page + 1;
  }
}
