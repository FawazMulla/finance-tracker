// Simple Chart Library - Lightweight alternative to Chart.js
// Use this if you don't want to load Chart.js from CDN

export class SimpleChart {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = config;
    this.data = config.data;
    this.options = config.options || {};
    
    this.resize();
    this.render();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    switch (this.config.type) {
      case 'line':
        this.renderLineChart();
        break;
      case 'bar':
        this.renderBarChart();
        break;
      case 'doughnut':
        this.renderDoughnutChart();
        break;
    }
  }

  renderLineChart() {
    const { labels, datasets } = this.data;
    const dataset = datasets[0];
    const padding = 40;
    const width = this.canvas.clientWidth - padding * 2;
    const height = this.canvas.clientHeight - padding * 2;

    if (!dataset.data.length) return;

    const maxValue = Math.max(...dataset.data);
    const minValue = Math.min(...dataset.data, 0);
    const range = maxValue - minValue || 1;

    // Draw grid
    this.ctx.strokeStyle = '#e2e8f0';
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(padding + width, y);
      this.ctx.stroke();
    }

    // Draw line
    this.ctx.strokeStyle = dataset.borderColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    dataset.data.forEach((value, index) => {
      const x = padding + (width / (dataset.data.length - 1)) * index;
      const y = padding + height - ((value - minValue) / range) * height;
      
      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });

    this.ctx.stroke();

    // Draw points
    this.ctx.fillStyle = dataset.borderColor;
    dataset.data.forEach((value, index) => {
      const x = padding + (width / (dataset.data.length - 1)) * index;
      const y = padding + height - ((value - minValue) / range) * height;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  renderBarChart() {
    const { labels, datasets } = this.data;
    const padding = 40;
    const width = this.canvas.clientWidth - padding * 2;
    const height = this.canvas.clientHeight - padding * 2;

    const maxValue = Math.max(...datasets.flatMap(d => d.data.map(Math.abs)));
    const barWidth = width / labels.length * 0.8;
    const barSpacing = width / labels.length * 0.2;

    datasets.forEach((dataset, datasetIndex) => {
      this.ctx.fillStyle = dataset.backgroundColor;
      
      dataset.data.forEach((value, index) => {
        const barHeight = Math.abs(value) / maxValue * height * 0.8;
        const x = padding + index * (barWidth + barSpacing) + datasetIndex * (barWidth / datasets.length);
        const y = value >= 0 ? 
          padding + height * 0.5 - barHeight : 
          padding + height * 0.5;
        
        this.ctx.fillRect(x, y, barWidth / datasets.length, barHeight);
      });
    });
  }

  renderDoughnutChart() {
    const { datasets } = this.data;
    const dataset = datasets[0];
    const centerX = this.canvas.clientWidth / 2;
    const centerY = this.canvas.clientHeight / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const innerRadius = radius * 0.6;

    const total = dataset.data.reduce((sum, value) => sum + value, 0);
    let currentAngle = -Math.PI / 2;

    dataset.data.forEach((value, index) => {
      const sliceAngle = (value / total) * Math.PI * 2;
      
      this.ctx.fillStyle = dataset.backgroundColor[index];
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      this.ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      this.ctx.closePath();
      this.ctx.fill();
      
      currentAngle += sliceAngle;
    });
  }

  update() {
    this.render();
  }
}

// Usage example:
// const chart = new SimpleChart(canvas, {
//   type: 'line',
//   data: {
//     labels: ['Jan', 'Feb', 'Mar'],
//     datasets: [{
//       data: [10, 20, 15],
//       borderColor: '#6366f1',
//       backgroundColor: '#6366f1'
//     }]
//   }
// });