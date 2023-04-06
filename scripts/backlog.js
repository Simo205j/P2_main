LISTS = ["To do", "Doing", "Overdue", "Done"]
const source = new EventSource("http://localhost:3000/Tasks/events");
const backlogTable = document.getElementById("backlog")
console.log(backlogTable)

const priority = {
  "Low" : 1,
  "Medium" : 2,
  "High" : 3
};

source.addEventListener("message", function(event) 
{
  const tasks = JSON.parse(event.data);

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
  
  console.log(tasks)
  createTasks(tasks);
});
function createTasks(tasks) {
  const table = document.createElement("table");

  // Create table header
  const headerRow = document.createElement("tr");
  const indexHeader = document.createElement("th");
  indexHeader.textContent = "Index";
  const taskNameHeader = document.createElement("th");
  taskNameHeader.textContent = "TaskName";
  const assigneeHeader = document.createElement("th");
  assigneeHeader.textContent = "Assignee";
  const startDateHeader = document.createElement("th");
  startDateHeader.textContent = "Start Date"
  const endDateHeader = document.createElement("th");
  endDateHeader.textContent = "End Date";
  const statusHeader = document.createElement("th");
  statusHeader.textContent = "Status";
  const priorityHeader = document.createElement("th");
  priorityHeader.textContent = "Priority";
  headerRow.appendChild(indexHeader);
  headerRow.appendChild(taskNameHeader);
  headerRow.appendChild(assigneeHeader);
  headerRow.appendChild(startDateHeader);
  headerRow.appendChild(endDateHeader);
  headerRow.appendChild(statusHeader);
  headerRow.appendChild(priorityHeader);
  table.appendChild(headerRow);

  // Create table rows
  tasks.forEach((task, index) => {
    if (task.TaskAttributes.Status !== "Done"){
      const row = document.createElement("tr");
      const taskindex = document.createElement("td");
      taskindex.textContent = index+1;
      const taskName = document.createElement("td");
      taskName.textContent = task.TaskName;
      const assignee = document.createElement("td");
      assignee.textContent = task.TaskAttributes.Assignee;
      const startDate = document.createElement("td");
      startDate.textContent = task.TaskAttributes.StartDate;
      const endDate = document.createElement("td");
      endDate.textContent = task.TaskAttributes.EndDate;
      const status = document.createElement("td");
      status.textContent = task.TaskAttributes.Status;
      const priority = document.createElement("td");
      priority.textContent = task.TaskAttributes.Priority;
      row.className = task.TaskAttributes.Status
      row.appendChild(taskindex);
      row.appendChild(taskName);
      row.appendChild(assignee);
      row.appendChild(startDate);
      row.appendChild(endDate);
      row.appendChild(status);
      row.appendChild(priority);
      table.appendChild(row);
    }
  });

  const divContainer = document.createElement("div")
  divContainer.appendChild(table);
  backlogTable.appendChild(divContainer);
}
