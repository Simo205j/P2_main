global.EventSource = jest.fn()
const mockEventSource = {
  addEventListener: jest.fn(),
  }
global.EventSource.mockImplementation(() => mockEventSource);

const { updateTimeChart, updateChart } = require('../../scripts/gantt');

describe('updateTimeChart', () => {
    let chart;
  
    beforeEach(() => {
      // Set up a mock Chart.js chart
      chart = {
        config: {
          options: {
            scales: {
              x: {
                min: null,
                max: null
              }
            }
          }
        },
        update: jest.fn()
      };
    });
  
    test('updates the chart with the new minimum and maximum dates', () => {
      const newMin = '2022-01-01';
      const newMax = '2022-12-31';
  
      updateTimeChart(chart, newMin, newMax);
  
      expect(chart.config.options.scales.x.min).toEqual(new Date(newMin));
      console.log(new Date(newMin),(new Date(newMax)));
      expect(chart.config.options.scales.x.max).toEqual(new Date(newMax));
      expect(chart.update).toHaveBeenCalled();
    });
  });

  describe('updateChart', () => {
    const sortedTasks = [10, 20, 30];
    const barColorsTask = ['red', 'blue', 'green'];
    const borderColorsTask = ['darkred', 'darkblue', 'darkgreen'];
  
    beforeEach(() => {
      // Mock the Chart.js chart object
      window.Chart = {
        getChart: jest.fn().mockReturnValue({
          config: {
            options: {
              scales: {
                x: {
                  min: null,
                  max: null
                }
              }
            }
          },
          data: {
            datasets: [
              {
                data: [],
                backgroundColor: [],
                borderColor: []
              }
            ]
          },
          clear: jest.fn(),
          update: jest.fn()
        })
      };
    });
  
    test('updates the chart object with the provided data and options', () => { 
    const mlSecondsInMonth = 2629743833;
    let minCurrentDate = new Date(Math.floor(Date.now() - mlSecondsInMonth / 3));
    let maxCurrentDate = new Date(Math.floor(Date.now() + mlSecondsInMonth));
  
      updateChart(sortedTasks, barColorsTask, borderColorsTask, minCurrentDate, maxCurrentDate);
  
      const chart = Chart.getChart('myChart');
      expect(chart.config.options.scales.x.min.getTime()).toBeCloseTo(((minCurrentDate)).getTime(), -250000); 
      expect(chart.config.options.scales.x.max.getTime()).toBeCloseTo(((maxCurrentDate)).getTime(), -250000);
      expect(chart.data.datasets[0].data).toEqual(sortedTasks);
      expect(chart.data.datasets[0].backgroundColor).toEqual(barColorsTask);
      expect(chart.data.datasets[0].borderColor).toEqual(borderColorsTask);
      expect(chart.clear).toHaveBeenCalled();
      expect(chart.update).toHaveBeenCalled();
    });
  });