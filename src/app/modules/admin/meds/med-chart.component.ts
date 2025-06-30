import { Component, OnInit } from '@angular/core';
import { MedService, MedicineStoreCount } from '../../../core/med/med.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

@Component({
  selector: 'app-medicine-chart',
  templateUrl: './medicine-chart.component.html',
})
export class MedicineChartComponent implements OnInit {
  public series: ApexAxisChartSeries = [];
  public chart: ApexChart = {
    type: 'bar',
    height: 350,
  };
  public xaxis: ApexXAxis = {
    categories: [],
  };
  public title: ApexTitleSubtitle = {
    text: 'จำนวนยาที่เก็บในแต่ละ Store',
  };

  constructor(private medService: MedService) {}

  ngOnInit() {
    this.medService.getMedicineCountByStore().subscribe((data: MedicineStoreCount[]) => {
      this.series = [
        {
          name: 'จำนวนยา',
          data: data.map((item) => item.medicineCount),
        },
      ];
      this.xaxis.categories = data.map(
        (item) => `${item.storeName} (${item.building} ชั้น ${item.floor})`
      );
    });
  }
}
