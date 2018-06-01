import _ from 'lodash';
import axios from 'axios';
import Chart from 'chart.js';
import { Components } from 'formiojs';

const BaseComponent = Components.components['base'];

export default class ChartComponent extends BaseComponent {
  static schema(...extend) {
    return BaseComponent.schema({
      type: 'chart',
      attrs: [],
      content: '',
      input: false,
      persistent: false,
      chartType: 'bar',
      chartData: [
        {
          label: 'Legend',
          data: {
            values: [{
              label: 'Label',
              value: '50'
            }],
            json: '',
            url: '',
            resource: '',
            custom: ''
          },
          dataSrc: 'values',
          valueProperty: '',
          labelProperty: '',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ],
      chartOptions: {
        scales: {
          yAxes: [{
            ticks: {
                beginAtZero:true
            }
          }]
        }
      }
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Chart',
      group: 'advanced',
      icon: 'fa fa-bar-chart',
      weight: 90,
      documentation: 'http://help.form.io/userguide/#html-element-component',
      schema: ChartComponent.schema()
    };
  }

  constructor(component, options, data) {
    super(component, options, data);
    this.chartjs = {
      type: this.component.chartType,
      labels: [],
      data: {},
      options: this.component.chartOptions
    };
  }

  elementInfo() {
    const info = super.elementInfo();
    info.type = 'chart';
    if (this.component.customClass) {
      info.attr.class += ` ${this.component.customClass}`;
    }
    return info;
  }

  refreshChart() {
    
    const ctx = this.element.querySelector('canvas.chartjs-canvas').getContext('2d');
    this.chartjs.data.datasets = [];
    let promises = [];
    if (Array.isArray(this.component.chartData)) {
      this.component.chartData.forEach((item) => {
        promises.push(this.loadDataSet(item));
      });
    }
    axios.all(promises).then((results) => {
      
      results.forEach((result) => {
        this.chartjs.data.datasets.push(result.dataset);
        if (result.labels) {
          this.chartjs.data.labels = result.labels;
        }
      });
      return new Chart(ctx, this.chartjs);
    });
  }

  loadDataSet(item) {
    const dataset = {
      label: item.label,
      data: [],
      backgroundColor: item.backgroundColor,
      borderColor: item.borderColor,
      borderWidth: item.borderWidth
    };
    let labels = [];

    return new Promise((resolve, reject) => {
      if (item.dataSrc === 'values' && Array.isArray(item.data.values)) {
        item.data.values.forEach((value) => {
          dataset.data.push(value.value);
          labels.push(value.label);
        });
        resolve({ dataset, labels });
      } else if (item.dataSrc === 'url' && item.data.url) {
        axios.get(item.data.url).then((response) => {
          console.log(response);
          if (Array.isArray(response.data)) {
            response.data.forEach((value) =>{
              dataset.data.push(value[item.valueProperty]);
              labels.push(value[item.labelProperty]);
            });
          }
          resolve({ dataset, labels });
        }).catch((error) => reject(error));
      } else {
        resolve({ dataset, labels });
      }
    });
  }

  get defaultSchema() {
    return ChartComponent.schema();
  }

  build() {
    this.element = this.ce('div', {
      id: this.id,
      class: this.component.className
    });
    this.element.component = this;
    _.each(this.component.attrs, (attr) => {
      if (attr.attr) {
        this.element.setAttribute(attr.attr, attr.value);
      }
    });

    this.element.innerHTML = `<canvas class="chartjs-canvas"></canvas>`;
    
    this.refreshChart();

    if (this.component.refreshOnChange) {
      this.on('change', () => this.refreshChart());
    }
  }
}