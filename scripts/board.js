const eventSource = new EventSource("http://localhost:3000/Tasks/events");
const listDOMContainer = document.querySelector("#ListsContainer");
const priorityValues = {
  Low: 1,
  Medium: 2,
  High: 3,
};

eventSource.addEventListener("message", handleServerSentEvent);
//HANDLES TASK SUBMITS AND ENSURE CORRECT DISPLAYMENT OF LISTS AND EXPANDED FORM
document.addEventListener("DOMContentLoaded", handleExpand);


function handleExpand() {
  const expandFormButton = document.getElementById("expandFormButton");
  const taskForm = document.getElementById("taskForm");
  const assigneeButton = document.getElementById("AssigneeFormButton")
  const showAssigneeDiv = document.getElementById("AssigneesDiv")
  const assigneeShow = document.getElementById("Assignees");

  expandFormButton.addEventListener("click", () => {
    taskForm.classList.toggle("show");
    if (expandFormButton.value === "Close form") {
      expandFormButton.value = "Create task";
      expandFormButton.style.backgroundColor = "rgba(75, 133, 225, 1)";
      listDOMContainer.style.display = "flex"; // show list container
      assigneeButton.style.display = "block"
    } else {
      expandFormButton.value = "Close form";
      expandFormButton.style.backgroundColor = "rgba(215, 45, 45, 1)";
      listDOMContainer.style.display = "none"; // hide list containe
      assigneeButton.style.display = "none"
    }
  }); 
  assigneeButton.addEventListener("click", () => {
      if (assigneeButton.value === "Close") {
        assigneeButton.value = "Edit Assignee";
        assigneeButton.style.backgroundColor = "rgba(75, 133, 225, 1)";
        listDOMContainer.style.display = "flex"; // show list container
        expandFormButton.style.display  = "block"
        showAssigneeDiv.className = "hide"
      } else {
        assigneeButton.value = "Close";
        assigneeButton.style.backgroundColor = "rgba(215, 45, 45, 1)";
        listDOMContainer.style.display = "none"; // hide list containe
        expandFormButton.style.display = "none"
        showAssigneeDiv.className = "reveal" 
      }
    });
    
  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    //TASKOBJECT FROM FORM VALUES
    const formData = createFormData(taskForm);
    try {
      const response = await fetch("http://localhost:3000/Tasks/SendTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      console.log(responseData);
      // Clear form fields
      taskForm.reset();
      // Hide form and display task list
      expandFormButton.value = "Create task";
      expandFormButton.style.backgroundColor = "rgba(75, 133, 225, 1)";
      taskForm.classList.remove("show");
      listDOMContainer.style.display = "flex"; // show list container
    } catch (error) {
      console.error(error);
    }
  });
  //HANDLES CORRECT DISPLAYMENT OF LISTS AND FORM
  
}

//HANDLE DRAG AND DROP FOR LISTS
document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll("#ListsContainer ol");
  containers.forEach((container) => {
    container.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    container.addEventListener("drop", (event) => handleDrop(event, container));
  });
  
});

let haveRecievedBefore = false;
function handleServerSentEvent(event) {
  const tasks = JSON.parse(event.data);
  //1. ASSIGN OVERDUE STATUS TO TASKS WITH A ENDDATE THAT IS OVERDUE
  tasks.forEach((task) => {
    if (Date.parse(task.TaskAttributes.EndDate) < Date.now() && task.TaskAttributes.Status !== "Done") {
      task.TaskAttributes.Status = "Overdue";
    }
  });
  //2. SORTS RECIEVED TASKS
  const sortedTasks = sortTasks(tasks);

  //3. REMOVES PREVIOUS TASK ELEMENTS UPON NEW DATA
  if (haveRecievedBefore == true) {
    handleCleanUpLists();
  }
  haveRecievedBefore = true;
  //4. CREATES NEW TASK ELEMENTS AND FINDS IT LIST
  sortedTasks.forEach((task) => {
    if ("Status" in task.TaskAttributes) {
      const targetList = listDOMContainer.querySelector(`.${task.TaskAttributes.Status}`);
      handleTaskCreation(task, targetList);
    }
  });
}
function handleTaskCreation(task, targetList) {
  const newTaskContainer = createTaskContainer(task);
  targetList.appendChild(newTaskContainer);
  if (task.TaskAttributes.Status != "Overdue") {
    makeTaskContainerDraggable(newTaskContainer);
  }
}
//RETURNS SORTED TASKS BASED ON ENDDATE AND PRIORITY
function sortTasks(tasks) {
  tasks.sort((a, b) => {
    if (new Date(a.TaskAttributes.EndDate) == new Date(b.TaskAttributes.EndDate)) {
      return priorityValues[b.TaskAttributes.Priority] - priorityValues[a.TaskAttributes.Priority];
    } else {
      return new Date(a.TaskAttributes.EndDate) - new Date(b.TaskAttributes.EndDate);
    }
  });
  return tasks;
}
//REMOVES DOM TASK ELEMNTS UPON RECIEVING NEW DATA
function handleCleanUpLists() {
  const currentDOMTasks = document.querySelectorAll(".taskContainer");
  currentDOMTasks.forEach((task) => {
    task.remove();
  });
}
//Creates and appends new task to its list

//CREATES AND RETURNS TASK DOM ELEMENT WITH DELETE EDIT AND DRAG&DROP CAPABILITIES
function createTaskContainer(task) {
  const listElement = document.createElement("li");
  const taskName = document.createElement("h4");

  taskName.textContent = task.TaskName;
  listElement.className = "taskContainer";
  listElement.id = task._id;
  listElement.appendChild(taskName);

  const descriptionDiv = createDescription(listElement, task);
  const deleteButton = createDeleteButton(listElement, task);
  const editButton = createEditButton();
  createEditButtonEventListeners(editButton, listElement, task);

  listElement.appendChild(descriptionDiv);
  listElement.appendChild(deleteButton);
  listElement.appendChild(editButton);

  return listElement;
}
//CREATES AND RETURNS DELETE BUTTON WITH DELETE CAPABILITIES
function createDeleteButton(taskContainer, task) {
  const deleteButton = document.createElement("button");
  deleteButton.value = "Delete Task";
  deleteButton.textContent = "Delete";
  deleteButton.style.display = "none";
  deleteButton.className = "delete-button";

  taskContainer.addEventListener("mouseover", () => {
    deleteButton.style.display = "inline-block";
  });
  taskContainer.addEventListener("mouseout", () => {
    deleteButton.style.display = "none";
  });

  deleteButton.addEventListener("click", (event) => {
    deleteEntry(event, taskContainer, task);
  });
  return deleteButton;
}
async function deleteEntry(event, taskContainer, task) {
  event.preventDefault();
  event.stopPropagation();
  taskContainer.remove();
  const response = await fetch("http://localhost:3000/Tasks/Delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  try {
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
//RETURNS EDIT BUTTON WHICH OPENS FORM FOR UPDATING TASKATTRIBUTES
function createEditButton() {
  const editButton = document.createElement("button");

  editButton.value = "Edit Task";
  editButton.textContent = "Edit";
  editButton.classList.add("edit-button");
  editButton.style.display = "none";
  return editButton;
}
function createEditButtonEventListeners(editButton, taskContainer, task) {
  editButton.addEventListener("click", async (event) => {
    const dialog = document.getElementById("editTaskModal");
    const form = dialog.querySelector("form");
    const saveButton = dialog.querySelector("#saveEditButton");
    event.stopPropagation();
    event.preventDefault();
    dialog.showModal();

    form.taskName.value = task.TaskName;
    form.description.value = task.TaskAttributes.Description;
    form.editAssignee.value = task.TaskAttributes.Assignee;
    form.priority.value = task.TaskAttributes.Priority;
    form.startDate.value = task.TaskAttributes.StartDate;
    form.endDate.value = task.TaskAttributes.EndDate;
    form.status.value = task.TaskAttributes.Status;
    
    
    saveButton.addEventListener("click", () => {
      saveData(form, taskContainer);
    });

    dialog.addEventListener('click', (event) => {
      console.log(event.target)

      //SOMEHOW THIS CONDITION IS CORRECT LOGICALLY IT SHOULD BE !== 
      if (event.target.id == 'editTaskModal') {
          dialog.close();
      }
    })
  });
  taskContainer.addEventListener("mouseover", () => {
    editButton.style.display = "inline-block";
  });
  taskContainer.addEventListener("mouseout", () => {
    editButton.style.display = "none";
  });
}
async function saveData(form, taskContainer) {
  if (
    form.taskName.value &&
    form.description.value &&
    form.editAssignee.value &&
    form.priority.value &&
    form.startDate.value &&
    form.endDate.value &&
    form.status.value
  ){
  const updatedData = createUpdatedData(form, taskContainer);
  try {
    const response = await fetch(`http://localhost:3000/Tasks/Edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    const responseData = await response.json();
    console.log(responseData.status, responseData);
  } catch (error) {
    console.error(error);
  }
}
}
//CREATES AND RETURNS DESCRIPTION DIV FOR EACH TASK CREATED BASED ON TASK ATTRIBUTES
function createDescription(taskContainer, task) {
  const descriptionDiv = document.createElement("div");
  descriptionDiv.className = "task-details";
  descriptionDiv.style.display = "none";

  //Creates label and paragraph for each task attribute and appends to it taskDescription
  for (const attribute in task.TaskAttributes) {
    const attributeContainer = document.createElement("div");
    const label = document.createElement("label");
    const value = document.createElement("p");
    attributeContainer.className = "labelAndAttribute";
    label.textContent = attribute + ": ";
    value.textContent = task.TaskAttributes[attribute];
    attributeContainer.appendChild(label);
    attributeContainer.appendChild(value);
    descriptionDiv.appendChild(attributeContainer);
  }

  taskContainer.addEventListener("click", () => {
    if (descriptionDiv.style.display === "none") {
      descriptionDiv.style.display = "block";
    } else {
      descriptionDiv.style.display = "none";
    }
  });
  return descriptionDiv;
}

//UPDATES TASK STATUS UPON TASK BEING DROPPED ON CONTAINER
const handleDrop = async (event, container) => {
  event.preventDefault();
  event.stopPropagation();
  const draggable = document.querySelector(".dragging");
  if (draggable !== null && event.target === container && event.target.className !== "Overdue") {
    container.appendChild(draggable);
    const updatedData = {
      id: draggable.id,
      Status: container.className,
    };
    console.log(updatedData);
    try {
      const response = await fetch("http://localhost:3000/Tasks/UpdateStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const responseData = await response.json();
      console.log(responseData.status, responseData);
    } catch (error) {
      console.error(error);
    }
  }
};
//MAKES ALL TASKS EXCEPT OVERDUE DRAGGABLE
function makeTaskContainerDraggable(newTaskContainer) {
  newTaskContainer.setAttribute("draggable", true);
  newTaskContainer.addEventListener("dragstart", () => {
    newTaskContainer.classList.add("dragging");
  });
  newTaskContainer.addEventListener("dragend", () => {
    newTaskContainer.classList.remove("dragging");
  });
}
//RETURNS FORM DATA IN ACCORDANCE TO THE TASK OBJECT
function createFormData(taskForm) {
  const taskName = taskForm.taskName.value;
  const description = taskForm.description.value;
  const assignee = taskForm.assignee.value;
  const priority = taskForm.priority.value;
  const startDate = taskForm.startDate.value;
  const endDate = taskForm.endDate.value;
  const status = taskForm.status.value;

  const data = {
    TaskName: taskName,
    TaskAttributes: {
      Description: description,
      Assignee: assignee,
      Priority: priority,
      StartDate: startDate,
      EndDate: endDate,
      Status: status,
    },
  };
  return data;
}
function createUpdatedData(form, taskContainer) {
  const updatedData = {
    TaskName: form.taskName.value,
    TaskAttributes: {
      Description: form.description.value,
      Assignee: form.editAssignee.value,
      Priority: form.priority.value,
      StartDate: form.startDate.value,
      EndDate: form.endDate.value,
      Status: form.status.value,
    },
    id: taskContainer.id,
  };
  console.log(updatedData);
  return updatedData;
}
module.exports = {
  sortTasks,
  createFormData,
  createUpdatedData,
  createDescription,
  makeTaskContainerDraggable,
  createEditButtonEventListeners,
  createEditButton,
  createDeleteButton,
  createTaskContainer,
  handleCleanUpLists,
  handleTaskCreation,
  handleDrop,
};
