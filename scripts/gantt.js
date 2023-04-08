const source = new EventSource("http://localhost:3000/Tasks/events");
const nextMonth = document.getElementById("nextMonth");
const prevMonth = document.getElementById("prevMonth");
const csvButton = document.getElementById("csv");
const mlSecondsInMonth = 2629743833;
let minCurrentDate = new Date(Math.floor(Date.now() - mlSecondsInMonth/3));
let maxCurrentDate = new Date(Math.floor(Date.now() + mlSecondsInMonth));

const status = {
  "Done" : 1,
  "To-do" : 2,
  "Doing" : 3,
  "Overdue" : 4
};

const barColors = {
  "Done": "rgba(11, 230, 41, 0.6)", 
  "Doing": "rgba(246, 174, 7, 0.6)", 
  "Overdue" : "rgba(215, 45, 45, 0.8)",
  "To-do": "rgba(75, 133, 225, 0.6)"
};
const borderColors = {
  "Done": "rgba(11, 230, 41, 0.8)", 
  "Doing": "rgba(246, 174, 7, 0.8)", 
  "Overdue" : "rgba(215, 45, 45, 1)",
  "To-do": "rgba(75, 133, 225, 0.8)"
};
let penis = [];

nextMonth.addEventListener("click", () => {
  const chart = Chart.getChart("myChart");
  const newMin = new Date(Math.floor(chart.config.options.scales.x.min.getTime() - mlSecondsInMonth));
  const newMax = new Date(Math.floor(chart.config.options.scales.x.max.getTime() - mlSecondsInMonth));
  updateTimeChart(chart, newMin, newMax);
});

prevMonth.addEventListener("click", () => {
  const chart = Chart.getChart("myChart");
  const newMin = new Date(Math.floor(chart.config.options.scales.x.min.getTime() + mlSecondsInMonth));
  const newMax = new Date(Math.floor(chart.config.options.scales.x.max.getTime() + mlSecondsInMonth));
  updateTimeChart(chart, newMin, newMax);
});

function formatDate(date) {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return year+ "-" + month + "-" + day;
}

function updateTimeChart(chart, newMin, newMax) {
  chart.config.options.scales.x.min = new Date(newMin);
  chart.config.options.scales.x.max = new Date(newMax);
  chart.update();
}
function downloadTasksAsCsv(tasks) {
  let csv = 'TaskName,StartDate,EndDate,Description\n'; // CSV header
  tasks.forEach((task) => {
    let taskName = task.TaskName;
    let startDate = task.TaskAttributes.startDate;
    let endDate = task.TaskAttributes.endDate;
    let description = task.TaskAttributes.Description;
    csv += `"${taskName}","${startDate}","${endDate}","${description}"\n`; // Add task data as CSV row
  });

  let blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  let url = URL.createObjectURL(blob);

  let link = document.createElement('a');
  link.href = url;
  link.download = 'tasks.csv';
  link.style.display = 'none'; // Hide the link element

  // Trigger the download
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
}


source.addEventListener("message", async function(event) {
  const barColorsTask = []
  const borderColorsTask = []
  const data = await JSON.parse(event.data);

  data.sort((a, b) => {
    const startDateDiff = new Date(a.TaskAttributes.StartDate).getTime() - new Date(b.TaskAttributes.StartDate).getTime();
    if (startDateDiff !== 0) {
      return startDateDiff;
    } else {
      const statusB = status[a.TaskAttributes.Status];
      const statusA = status[b.TaskAttributes.Status];
      return statusA - statusB;
    }
  });
  csvButton.addEventListener("click", () => downloadTasksAsCsv(data))
  console.log(data)
  
  data.forEach((task) => {
    if (task.TaskAttributes.Status == "Overdue" || (new Date(task.TaskAttributes.EndDate) < new Date())) {
      task.TaskAttributes.Status = "Overdue"
    }
    if (task.TaskAttributes.Status != "Done" && task.TaskAttributes.Status != "" && task.TaskAttributes.hasOwnProperty('Status')){
      let taskData = {
        x: [task.TaskAttributes.StartDate, task.TaskAttributes.EndDate],
        y: task.TaskName,
        assigne: task.TaskAttributes.Assignee,
        status: task.TaskAttributes.Status,
        label: task.TaskAttributes.Description // Add the label property
      };
      barColorsTask.push(barColors[task.TaskAttributes.Status])
      borderColorsTask.push(borderColors[task.TaskAttributes.Status])
      penis.push(taskData);
    }
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
    labels: [],
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
    minCurrentDate = chart.config.options.scales.x.min 
    maxCurrentDate = chart.config.options.scales.x.max 
    if (minCurrentDate < Date.now() && Date.now() < maxCurrentDate)
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
          ticks: {
              font: {
                size: 20 // Update to your desired font size
              },
            },
          position: "top",
          type: "time",
          time: {
            unit: "day"
          },
          min: minCurrentDate,
          max: maxCurrentDate
        },
        y: {
          ticks: {
              font: {
                size: 20 // Update to your desired font size
              },
            },
        }
      },
      //THESE PLUGINS ARE FROM CHART.JS CONFIGURATION
      plugins: {
        tooltip: {
          callbacks: {
            label: ((tooltipItem, data) => {
              return tooltipItem.raw.label + ", Assignee: " + tooltipItem.raw.assigne
            })
          }
        },
        legend: {
          display: false
        }
      }
    },
    //THESE PLUGINS LETS US MANIPULATE/DRAW ADDITIONAL INFORMATION TO THE CHART 
    //SEE PREVIOUSLY DECLARED PLUGINS IN THIS FILE
    plugins: [todayLine, status]
  };
  //RENDER CHART 
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
});

function downloadTasksAsCsv(tasks) {
  let csv = 'TaskName,TaskAttributes,StartDate,EndDate\n'; // CSV header
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let taskAttributes = JSON.stringify(task.TaskAttributes); // Convert task attributes object to string
    let startDate = task.TaskAttributes.StartDate;
    let endDate = task.TaskAttributes.EndDate;
    csv += `"${task.TaskName}","${taskAttributes}","${startDate}","${endDate}"\n`; // Add task data as CSV row
  }

  let blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  let url = URL.createObjectURL(blob);

  let link = document.createElement('a');
  link.href = url;
  link.download = 'tasks.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
