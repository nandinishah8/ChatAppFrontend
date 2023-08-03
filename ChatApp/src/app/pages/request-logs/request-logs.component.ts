import { Component } from '@angular/core';
import { LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-request-logs',
  templateUrl: './request-logs.component.html',
  styleUrls: ['./request-logs.component.css'],
})
export class RequestLogsComponent {
  [x: string]: any;
  selectedTimeframe: string = 'last5mins';
  customStartTime: string = '';
  customEndTime: string = '';
  startTime!: Date;
  endTime?: Date;
  logs: any[] = [];
  showColumns: any = {
    id: true,
    timestamp: true,
    ip: true,
    username: true,
    requestBody: true,
  };

  constructor(private logsService: LogsService) {}

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs(): void {
    switch (this.selectedTimeframe) {
      case 'last5mins':
        this.getLastLogs(5);
        break;
      case 'last10mins':
        this.getLastLogs(10);
        break;
      case 'last30mins':
        this.getLastLogs(30);
        break;
      default:
        // Custom timeframe
        this.getLogs();
        break;
    }
  }

  getLastLogs(minutes: number): void {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - minutes * 60000);
    this.logsService
      .getLogs(this.formatDate(startTime), this.formatDate(endTime))
      .subscribe(
        (res) => {
          this.logs = res;
        },
        (error) => {
          console.log(error.error);
          this.logs = [];
        }
      );
  }

  getLogs(): void {
    this.logsService.getLogs(this.startTime, this.endTime).subscribe(
      (res) => {
        this.logs = res;
      },
      (error) => {
        console.log(error.error);
        this.logs = [];
      }
    );
  }

  formatDate(date: Date): Date {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());

    return new Date(date);
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  toggleColumn(columnName: string) {
    this.showColumns[columnName] = !this.showColumns[columnName];
  }
}
