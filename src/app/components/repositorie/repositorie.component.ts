// src/app/components/repositorie/repositorie.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-repositorie',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './repositorie.component.html',
  styleUrls: ['./repositorie.component.scss']
})
export class RepositorieComponent implements OnInit {
  repositories: any[] = [];

  constructor(private githubService: GithubService) {}

  ngOnInit() {
    this.loadRepositories();
  }

  private async loadRepositories() {
    try {
      this.repositories = await this.githubService.getLastRepositories();
      await this.setChartData();
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  private async setChartData() {
    for (const repo of this.repositories) {
      const languageCounts: { [key: string]: number } = {};
      const langUrl = repo.languages_url;
      try {
        const response = await this.githubService.getRepositoryLanguages(langUrl);
        for (const [language, count] of Object.entries(response)) {
          languageCounts[language] = (languageCounts[language] || 0) + (count as number);
        }
        repo.chartData = {
          labels: Object.keys(languageCounts),
          datasets: [{
            data: Object.values(languageCounts),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ],
            hoverBackgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ]
          }]
        };
        repo.chartOptions = {
          responsive: true,
          maintainAspectRatio: false
        };
      } catch (error) {
        console.error('Error fetching languages for repo:', error);
      }
    }
  }
}
