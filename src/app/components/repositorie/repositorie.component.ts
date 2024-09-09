import { GithubService} from "../../services/github/github.component";
import { Component, OnInit } from '@angular/core';
import {DataViewModule} from "primeng/dataview";

@Component({
  selector: 'app-repositorie',
  standalone: true,
  imports: [DataViewModule], // Importez DataViewModule ici
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
  page: number = 1;
  rows: number = 5; // Nombre de repositories par page

  constructor(private githubService: GithubService) {}

  ngOnInit() {
    this.loadRepositories();
  }

  private getCategorie(language: string): string {
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
    this.languageImage = this.languageImages[this.getCategorie(this.mostUsedLanguage)] || 'assets/other.png';
  }

  onPage(event: any) {
    this.page = event.page + 1;
  }
}
