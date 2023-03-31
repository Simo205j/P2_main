const source = new EventSource("http://localhost:3000/events");
const backlogTable = document.getElementById("backlog")
console.log(backlogTable)

source.addEventListener("message", function(event) 
{
  const tasks = JSON.parse(event.data);

  tasks.sort((a, b) => 
  {
    const endDateDiff = new Date(a.TaskAttributes.EndDate) - new Date(b.TaskAttributes.EndDate);
    if (endDateDiff !== 0) 
    {
      return endDateDiff; 
    } 
    else 
    {
      return b.TaskAttributes.Priority - a.TaskAttributes.Priority;
    }
  });
  console.log(tasks)
  createTasks(tasks);
});
function createTasks(tasks) {
  const table = document.createElement("table");

  // Create table header
  const headerRow = document.createElement("tr");
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
  headerRow.appendChild(taskNameHeader);
  headerRow.appendChild(assigneeHeader);
  headerRow.appendChild(startDateHeader);
  headerRow.appendChild(endDateHeader);
  headerRow.appendChild(statusHeader);
  table.appendChild(headerRow);

  // Create table rows
  tasks.forEach((task, index) => {
    const row = document.createElement("tr");
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
    row.appendChild(taskName);
    row.appendChild(assignee);
    row.appendChild(startDate);
    row.appendChild(endDate);
    row.appendChild(status);
    table.appendChild(row);
  });

  const divContainer = document.createElement("div")
  divContainer.appendChild(table);
  backlogTable.appendChild(divContainer);
}
