import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnInit, ViewChild  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import medRoutes from '../meds/med.routes';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ChartComponent } from 'ng-apexcharts';
import { MedService, MedicineStoreCount } from '../../../core/med/med.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [RouterOutlet,NgApexchartsModule],
})
export class DashboardsComponent implements OnInit {
   @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  /**
     * Constructor
     */
    constructor(private medService: MedService) {}
  ngOnInit(): void {
    this.medService.getMedicineCountByStore().subscribe((data: MedicineStoreCount[]) => {
      const seriesData = data.map(item => item.medicineCount);
      const categoryLabels = data.map(
        item => `${item.storeName} (${item.building} ชั้น ${item.floor})`
      );

      this.chartOptions = {
        series: [
          {
            name: 'จำนวนยา',
            data: seriesData,
          },
        ],
        chart: {
          type: 'bar',
          height: 350,
        },
        xaxis: {
          categories: categoryLabels,
        },
      };
    });
  }
    //constructor(){}
  //   public chartOptions = {
  //   series: [{
  //     name: "ยอดขาย",
  //     data: [10, 41, 35, 51, 49]
  //   }],
  //   chart: {
  //     type: "bar",
  //     height: 550
  //   },
  //   xaxis: {
  //     categories: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."]
  //   }
  // };

}

