LISTS = ["To do", "Doing", "Overdue", "Done"];
const source = new EventSource("http://localhost:3000/Tasks/events");
const backlogTable = document.getElementById("backlog");
const priority = {
  Low: 1,
  Medium: 2,
  High: 3,
};

source.addEventListener("message", function (event) {
  const tasks = JSON.parse(event.data);
  const sortedTasks = sortTasks(tasks);
  createTasks(sortedTasks);
});

function sortTasks(tasks) {
  const undoneTasks = tasks.filter((task) => task.TaskAttributes.Status !== "Done");
  undoneTasks.sort((a, b) => {
    const endDateDiff = new Date(a.TaskAttributes.EndDate).getTime() - new Date(b.TaskAttributes.EndDate).getTime();
    if (endDateDiff !== 0) {
      return endDateDiff;
    } else {
      const priorityB = priority[a.TaskAttributes.Priority];
      const priorityA = priority[b.TaskAttributes.Priority];
      return priorityA - priorityB;
    }
  });
  return undoneTasks;
}

function createTasks(tasks) {
  const table = makeTableHeader();
  let tableIndex = 0;

  tasks.forEach((task, index) => {
    if (new Date(task.TaskAttributes.EndDate) < new Date()) {
      task.TaskAttributes.Status = "Overdue";
    }
    tableIndex++;
    makeTableRow(table, tableIndex, task);
  });

  //REMOVE PREVIOUS TABLE
  if (document.getElementById("divContainer")) {
    deleteTable = document.getElementById("divContainer");
    deleteTable.remove();
  }
  const divContainer = document.createElement("div");
  divContainer.id = "divContainer";

  divContainer.appendChild(table);
  if(backlogTable){
    backlogTable.appendChild(divContainer);
  }
}

function makeTableHeader() {
  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  const indexHeader = document.createElement("th");
  const taskNameHeader = document.createElement("th");
  const assigneeHeader = document.createElement("th");
  const startDateHeader = document.createElement("th");
  const endDateHeader = document.createElement("th");
  const statusHeader = document.createElement("th");
  const priorityHeader = document.createElement("th");

  table.id = "BacklogTable";
  indexHeader.textContent = "Index";
  taskNameHeader.textContent = "TaskName";
  assigneeHeader.textContent = "Assignee";
  startDateHeader.textContent = "Start Date";
  endDateHeader.textContent = "End Date";
  statusHeader.textContent = "Status";
  priorityHeader.textContent = "Priority";

  headerRow.appendChild(indexHeader);
  headerRow.appendChild(taskNameHeader);
  headerRow.appendChild(assigneeHeader);
  headerRow.appendChild(startDateHeader);
  headerRow.appendChild(endDateHeader);
  headerRow.appendChild(statusHeader);
  headerRow.appendChild(priorityHeader);
  table.appendChild(headerRow);
  return table;
}

function makeTableRow(table, tableIndex, task) {
  const row = document.createElement("tr");
  const taskindex = document.createElement("td");
  const taskName = document.createElement("td");
  const assignee = document.createElement("td");
  const startDate = document.createElement("td");
  const endDate = document.createElement("td");
  const status = document.createElement("td");
  const priority = document.createElement("td");

  taskindex.textContent = tableIndex;
  taskName.textContent = task.TaskName;
  assignee.textContent = task.TaskAttributes.Assignee;
  startDate.textContent = task.TaskAttributes.StartDate;
  endDate.textContent = task.TaskAttributes.EndDate;
  status.textContent = task.TaskAttributes.Status;
  priority.textContent = task.TaskAttributes.Priority;
  row.className = task.TaskAttributes.Status;

  row.appendChild(taskindex);
  row.appendChild(taskName);
  row.appendChild(assignee);
  row.appendChild(startDate);
  row.appendChild(endDate);
  row.appendChild(status);
  row.appendChild(priority);
  table.appendChild(row);
}
module.exports = {sortTasks, makeTableHeader, makeTableRow, createTasks}