import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [RouterOutlet,NgApexchartsModule],
})
export class DashboardsComponent {
  /**
     * Constructor
     */
    constructor(){}
    public chartOptions = {
    series: [{
      name: "ยอดขาย",
      data: [10, 41, 35, 51, 49]
    }],
    chart: {
      type: "bar",
      height: 350
    },
    xaxis: {
      categories: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."]
    }
  };
}

