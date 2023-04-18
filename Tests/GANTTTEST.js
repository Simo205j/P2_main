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
  
source.addEventListener("message", async function(event) {
  const barColorsTask = [];
  const borderColorsTask = [];
  const data = await JSON.parse(event.data);
  sortedTasks = []
  //SORTS TASKS BASED ON STARTDATE AND STATUS
  data.sort((a, b) => {
    const startDateDiff = new Date(a.TaskAttributes.StartDate).getTime() - new Date(b.TaskAttributes.StartDate).getTime();
    if (startDateDiff !== 0) {
      return startDateDiff;
    } else {
      //COMPARES STATUS VALUES 
      const statusB = statusValues[a.TaskAttributes.Status];
      const statusA = statusValues[b.TaskAttributes.Status];
      return statusA - statusB;
    }
  });
  //ASSIGNS OVERDUE STATUS IF ENTRY IS OVERDUE AND REMOVES DONE

  
  data.forEach((task) => {
    if (task.TaskAttributes.Status != "Done" && task.TaskAttributes.Status != "" && task.TaskAttributes.hasOwnProperty('Status')){
      if (task.TaskAttributes.Status == "Overdue" || (new Date(task.TaskAttributes.EndDate) < new Date())) {
        task.TaskAttributes.Status = "Overdue";
      }
      let taskData = {
        x: [task.TaskAttributes.StartDate, task.TaskAttributes.EndDate],
        y: task.TaskName,
        assigne: task.TaskAttributes.Assignee,
        status: task.TaskAttributes.Status,
        label: task.TaskAttributes.Description
      };
      barColorsTask.push(barColors[task.TaskAttributes.Status]);
      borderColorsTask.push(borderColors[task.TaskAttributes.Status]);
      sortedTasks.push(taskData);
    }
  });
});