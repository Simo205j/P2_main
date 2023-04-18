 function getTasks(tasks) {
    const priorityValues = {
        "Low" : 1,
        "Medium" : 2,
        "High" : 3,
      };
  
    tasks.sort((a, b) => {
      if (new Date(a.TaskAttributes.EndDate) === new Date(b.TaskAttributes.EndDate)) {
        // If priority is the same, sort by end date
        return priorityValues[b.TaskAttributes.Priority] - priorityValues[a.TaskAttributes.Priority];
      } else {
        // Sort by end date
        return new Date(a.TaskAttributes.EndDate) - new Date(b.TaskAttributes.EndDate);
      }
    });
  
    return tasks;
  }
  
  module.exports = getTasks