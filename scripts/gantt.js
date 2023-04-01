const source = new EventSource("http://localhost:3000/events");
const nextMonth = document.getElementById("nextMonth");
const prevMonth = document.getElementById("prevMonth");
const mlSecondsInMonth = 2629743833;
let minCurrentDate = new Date(Math.floor(Date.now() - mlSecondsInMonth/3));
let maxCurrentDate = new Date(Math.floor(Date.now() + mlSecondsInMonth));

const barColors = {
  "Done": "rgba(11, 230, 41, 0.2)", 
  "Doing": "rgba(237, 139, 12, 0.2)", 
  "To do": "rgba(233, 18, 18, 0.2)"
};
const borderColors = {
  "Done": "rgba(11, 230, 41, 0.8)", 
  "Doing": "rgba(237, 139, 12, 0.8)", 
  "To do": "rgba(233, 18, 18, 0.8)"
};
let penis = [];

nextMonth.addEventListener("click", () => {
  const chart = Chart.getChart("myChart");
  const newMin = new Date(Math.floor(chart.config.options.scales.x.min.getTime() + mlSecondsInMonth));
  const newMax = new Date(Math.floor(chart.config.options.scales.x.max.getTime() + mlSecondsInMonth));
  updateTimeChart(chart, newMin, newMax);
});

prevMonth.addEventListener("click", () => {
  const chart = Chart.getChart("myChart");
  const newMin = new Date(Math.floor(chart.config.options.scales.x.min.getTime() - mlSecondsInMonth));
  const newMax = new Date(Math.floor(chart.config.options.scales.x.max.getTime() - mlSecondsInMonth));
  updateTimeChart(chart, newMin, newMax);
});

function formatDate(date) {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return year+ "-" + month + "-" + day;
}

function updateTimeChart(chart, newMin, newMax) {
  console.log(newMin, newMax);
  chart.config.options.scales.x.min = new Date(newMin);
  chart.config.options.scales.x.max = new Date(newMax);
  console.log(chart.config.options.scales.x.min, chart.config.options.scales.x.max)
  chart.update();
}



source.addEventListener("message", function(event) {
  const barColorsTask = []
  const borderColorsTask = []
  const data = JSON.parse(event.data);
  data.forEach((task) => {
    let taskData = {
      x: [task.TaskAttributes.StartDate, task.TaskAttributes.EndDate],
      y: task.TaskName,
      assigne: task.TaskAttributes.Assignee,
      status: task.TaskAttributes.Status,
    };
    barColorsTask.push(barColors[task.TaskAttributes.Status])
    borderColorsTask.push(borderColors[task.TaskAttributes.Status])
    penis.push(taskData);
  });
  // Update chart with the new data
  updateChart(penis, barColorsTask, borderColorsTask);
});


function updateChart(data, barColorsTask, borderColorsTask) {
  // Get chart instance
  const chart = Chart.getChart("myChart");
  chart.config.options.scales.x.min = minCurrentDate
  chart.config.options.scales.x.max = maxCurrentDate
  // Update chart data and redraw
  chart.data.datasets[0].data = data;
  chart.data.datasets[0].backgroundColor = barColorsTask;
  chart.data.datasets[0].borderColor = borderColorsTask;
  chart.update();
}

document.addEventListener('DOMContentLoaded', function() {
  const data = {
    datasets: [{
      label: 'Project Overview',
      data: penis,
      backgroundColor: [
        "rgba(11, 230, 41, 0.2)",
        "rgba(237, 139, 12, 0.2)",
        "rgba(233, 18, 18, 0.2)"
      ],
      borderColor: [
        "rgba(11, 230, 41, 0.8)",
        "rgba(237, 139, 12, 0.8)",
        "rgba(233, 18, 18, 0.8)"
      ],
      borderWidth: 1,
      borderSkipped: false,
      borderRadius: 10,
      barPercentage: 0.95
    }]
  };
  //------------PLUGINS-------------//
  //MAKES DOTTED LINE FOR CURRENT DATE
const todayLine = {
  id : "todayline",
  beforeDatasetsDraw(chart, args, pluginOptions) {
    const {ctx, data, chartArea: { top, bottom, left, right}, scales: {x, y} } = chart;

    ctx.save()
    //TELLS NODE.JS THAT WE WANT TO START DRWING
    ctx.beginPath()
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 26, 104, 1)"
    //COLOR, WHITESPACE
    ctx.setLineDash ([3,6])
    //COORDINATES FOR START AND STOP DRAWING
    //GETPIXELFORVALUE IS A FUNCTION IN CHART.JS THAT IS ABLE TO FIND ELEMENTS SPECIFIC PIXELS
    ctx.moveTo(x.getPixelForValue(new Date()), top);
    ctx.lineTo(x.getPixelForValue(new Date()), bottom)
    ctx.stroke();
    ctx.setLineDash ([])
  } 
}
  const status = {
    id: "status",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const {ctx, data, chartArea: { top, bottom, left, right, width}, scales: {x, y} } = chart;

      ctx.save()
      ctx.font = "bolder 20px sans-serif"
      ctx.fillstyle = "black";
      ctx.textBaseline = "middle";
      data.datasets[0].data.forEach((datapoint, index) => {
        ctx.fillText(datapoint.status, right+10, y.getPixelForValue(index));
    });
    ctx.restore();
  }
}
  //CREATES DISPLAYED NAMES SEEN ON THE LEFT SIDE OF THE CHART
  const assignedTasks = {
    id: "assignedTasks",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const {ctx, data, chartArea: { top, bottom, left, right}, scales: {x, y} } = chart;
      ctx.save()
      ctx.font = "bolder 20px sans-serif"
      ctx.fillstyle = "black";
      ctx.textBaseline = "middle";
      data.datasets[0].data.forEach((penis, index) => {
        ctx.fillText(penis.assigne, 10, y.getPixelForValue(index));
      });
      ctx.restore();
    }
  }
  // CONFIGURATION FOR LAYOUT OF CHART
  const config = {
    type: 'bar',
    data,
    options: {
      responsive: true,
      layout: {
          padding: {
            //CREATES WHITE SPACE ON LEFT AND RIGHT SIDE OF CHART
            left: 100, 
            right: 100
          }
      },
      //DETERMINES WHETER THE Y OR X AXIS DISPLAY OUR TASKS
      indexAxis: "y",
      scales: {
        //CONFIGURATION FOR WHAT IS BEING DISPLAYED ON THE X AXIS
        x: {
          position: "top",
          type: "time",
          time: {
            unit: "day"
          },
          min: minCurrentDate,
          max: maxCurrentDate
        }
      },
      //THESE PLUGINS ARE FROM CHART.JS CONFIGURATION
      plugins: {
        legend: {
          display: false
        }
      }
    },
    //THESE PLUGINS LETS US MANIPULATE/DRAW ADDITIONAL INFORMATION TO THE CHART 
    //SEE PREVIOUSLY DECLARED PLUGINS IN THIS FILE
    plugins: [todayLine, assignedTasks, status]
  };
  //RENDER CHART 
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
});