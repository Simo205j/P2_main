//TASKS RECIVED FROM SERVER
const source = new EventSource("http://localhost:3000/Tasks/events");
//DOM SELECTORS FOR BUTTONS
const nextMonth = document.getElementById("nextMonth");
const prevMonth = document.getElementById("prevMonth");
const mlSecondsInMonth = 2629743833;
let minCurrentDate = new Date(Math.floor(Date.now() - mlSecondsInMonth / 3));
let maxCurrentDate = new Date(Math.floor(Date.now() + mlSecondsInMonth));
//GLOBAL VARIABLE TO BE ACCESED IN CHART DATA CONFIG
let sortedTasks = null;

//GIVES VALUE BASED ON STATUS TO SORT
const statusValues = {
  Done: 1,
  "To-do": 2,
  Doing: 3,
  Overdue: 4,
};
//ADDING BARCOLORS AND BORDERCOLORS DEPENDING ON STATUS
const barColors = {
  Done: "rgba(11, 230, 41, 0.6)",
  Doing: "rgba(246, 174, 7, 0.6)",
  Overdue: "rgba(215, 45, 45, 0.8)",
  "To-do": "rgba(75, 133, 225, 0.6)",
};
const borderColors = {
  Done: "rgba(11, 230, 41, 0.8)",
  Doing: "rgba(246, 174, 7, 0.8)",
  Overdue: "rgba(215, 45, 45, 1)",
  "To-do": "rgba(75, 133, 225, 0.8)",
};
//NEXT AND PREVIOUS MONTH BUTTONS
document.addEventListener("DOMContentLoaded", function() {
  nextMonth.addEventListener("click", handleNextMonthClick);
});

document.addEventListener("DOMContentLoaded", function() {
  prevMonth.addEventListener("click", handlePrevMonthClick);
});

function handleNextMonthClick() {
    const chart = Chart.getChart("myChart");
    const newMin = new Date(Math.floor(chart.config.options.scales.x.min.getTime() + mlSecondsInMonth));
    const newMax = new Date(Math.floor(chart.config.options.scales.x.max.getTime() + mlSecondsInMonth));
    updateTimeChart(chart, newMin, newMax);
  }
  
function handlePrevMonthClick() {
    const chart = Chart.getChart("myChart");
    const newMin = new Date(Math.floor(chart.config.options.scales.x.min.getTime() - mlSecondsInMonth));
    const newMax = new Date(Math.floor(chart.config.options.scales.x.max.getTime() - mlSecondsInMonth));
    updateTimeChart(chart, newMin, newMax);
  }

//UPDATES X-AXIS ON PREV AND NEXTMONTH BUTTONS
function updateTimeChart(chart, newMin, newMax) {
  chart.config.options.scales.x.min = new Date(newMin);
  chart.config.options.scales.x.max = new Date(newMax);
  chart.update();
}

source.addEventListener("message", async function (event) {
  const data = await JSON.parse(event.data);
  sortData = sortData(data);
  const { barColorsTask, borderColorsTask, sortedTasks } = makeTasksFromData(sortData);

  updateChart(sortedTasks, barColorsTask, borderColorsTask);
});

function sortData(data) {
  data.sort((a, b) => {
    const startDateDiff =
      new Date(a.TaskAttributes.StartDate).getTime() - new Date(b.TaskAttributes.StartDate).getTime();
    if (startDateDiff !== 0) {
      return startDateDiff;
    } else {
      //COMPARES STATUS VALUES
      const statusB = statusValues[a.TaskAttributes.Status];
      const statusA = statusValues[b.TaskAttributes.Status];
      return statusA - statusB;
    }
  });
  return data;
}


function makeTasksFromData(sortData) {
  const barColorsTask = [];
  const borderColorsTask = [];
  sortedTasks = [];

  sortData.forEach((task) => {
    if (
      task.TaskAttributes.Status != "Done" &&
      task.TaskAttributes.Status != "" &&
      task.TaskAttributes.hasOwnProperty("Status")
    ) {
      if (task.TaskAttributes.Status == "Overdue" || new Date(task.TaskAttributes.EndDate) < new Date()) {
        task.TaskAttributes.Status = "Overdue";
      }
      let taskData = {
        x: [task.TaskAttributes.StartDate, task.TaskAttributes.EndDate],
        y: task.TaskName,
        assigne: task.TaskAttributes.Assignee,
        status: task.TaskAttributes.Status,
        label: task.TaskAttributes.Description,
      };
      barColorsTask.push(barColors[task.TaskAttributes.Status]);
      borderColorsTask.push(borderColors[task.TaskAttributes.Status]);
      sortedTasks.push(taskData);
    }
  });
  return (chartdata = {
    barColorsTask,
    borderColorsTask,
    sortedTasks,
  });
}

function updateChart(sortedTasks, barColorsTask, borderColorsTask) {
  const chart = Chart.getChart("myChart");
  console.log("REPLACE PENIS WITH CHART REMEMBER REMEMBER");
  //UPDATE THE CHART OBJECT
  chart.config.options.scales.x.min = minCurrentDate;
  chart.config.options.scales.x.max = maxCurrentDate;
  chart.data.datasets[0].data = sortedTasks;
  chart.data.datasets[0].backgroundColor = barColorsTask;
  chart.data.datasets[0].borderColor = borderColorsTask;
  chart.clear();
  chart.update();
}
//CHART DATA AND CONFIG THAT CHART IS INITIALLY BASED ON
document.addEventListener("DOMContentLoaded", function () {
  const data = {
    datasets: [
      {
        label: "Project Overview",
        data: sortedTasks,
        borderWidth: 1,
        borderSkipped: false,
        borderRadius: 10,
        barPercentage: 0.95,
      },
    ],
  };
  // CONFIGURATION FOR LAYOUT OF CHART.
  // CHART IS BASED ON AN OBJECT THAT CAN BE DESTRUCTURED
  const config = {
    type: "bar",
    //DATA FROM THE DATA OBJECT IS ASSIGNED TO THE CONFIG
    data,
    options: {
      responsive: true,
      layout: {
        padding: {
          //CREATES WHITE SPACE ON LEFT AND RIGHT SIDE OF CHART
          left: 30,
          right: 120,
        },
      },
      //DETERMINES WHETER THE Y OR X AXIS DISPLAY OUR TASKS
      indexAxis: "y",
      scales: {
        //CONFIGURATION FOR WHAT IS BEING DISPLAYED ON THE X AXIS
        x: {
          ticks: {
            font: {
              // Update to your desired font size
              size: 20,
            },
          },
          position: "top",
          type: "time",
          time: {
            unit: "day",
          },
          //UPDATES BASED ON CURRENT DATE AND BUTTONS
          min: minCurrentDate,
          max: maxCurrentDate,
        },
        y: {
          ticks: {
            font: {
              // Update to your desired font size
              size: 20,
            },
          },
        },
      },
      //THESE PLUGINS ARE FROM CHART.JS CONFIGURATION
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem, data) => {
              return tooltipItem.raw.label + ", Assignee: " + tooltipItem.raw.assigne;
            },
          },
        },
        legend: {
          display: false,
        },
      },
    },
    //THESE PLUGINS LETS US MANIPULATE/DRAW ADDITIONAL INFORMATION TO THE CHART
    //SEE DECLARED PLUGINS IN THIS FILE
    plugins: [todayLine, statusOfTask],
  };
  //RENDER CHART
  const myChart = new Chart(document.getElementById("myChart"), config);
});
//------------PLUGINS-------------//
//MAKES DOTTED LINE FOR CURRENT DATE
const todayLine = {
  id: "todayline",
  //DRAWS AFTER INITIAL CHART HAS BEEN DRAWN
  afterDatasetsDraw(chart) {
    const {
      ctx,
      chartArea: { top, bottom },
      scales: { x },
    } = chart;
    minCurrentDate = chart.config.options.scales.x.min;
    maxCurrentDate = chart.config.options.scales.x.max;
    if (minCurrentDate < Date.now() && Date.now() < maxCurrentDate) ctx.save();
    //TELLS NODE.JS THAT WE WANT TO START DRWING
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 26, 104, 1)";
    //COLOR, WHITESPACE
    ctx.setLineDash([3, 6]);
    //COORDINATES FOR START AND STOP DRAWING
    //GETPIXELFORVALUE IS A FUNCTION IN CHART.JS THAT IS ABLE TO FIND ELEMENTS SPECIFIC PIXELS
    ctx.moveTo(x.getPixelForValue(new Date()), top);
    ctx.lineTo(x.getPixelForValue(new Date()), bottom);
    ctx.stroke();
  },
};
//CREATES DISPLAYED STATUS ON CHART
const statusOfTask = {
  id: "status",
  afterDatasetsDraw(chart) {
    const {
      ctx,
      data,
      chartArea: { right },
      scales: { y },
    } = chart;
    ctx.save();
    ctx.font = "bolder 20px sans-serif";
    ctx.fillstyle = "black";
    ctx.textBaseline = "middle";
    data.datasets[0].data.forEach((datapoint, index) => {
      ctx.fillText(datapoint.status, right + 10, y.getPixelForValue(index));
    });
    ctx.restore();
  },
};
module.exports = {sortData, makeTasksFromData, updateTimeChart, updateChart, handleNextMonthClick, handlePrevMonthClick};