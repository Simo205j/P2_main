function sortTasks(tasks){
  tasks.sort((a, b) => {
    const endDateDiff = new Date(a.TaskAttributes.EndDate).getTime() - new Date(b.TaskAttributes.EndDate).getTime();
    if (endDateDiff !== 0) {
      return endDateDiff;
    } else {
      const priorityB = priority[a.TaskAttributes.Priority];
      const priorityA = priority[b.TaskAttributes.Priority];
      return priorityA - priorityB;
    }
  });
  return tasks
}

module.exports = sortTasks