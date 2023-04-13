LISTS = ["To-do", "Doing", "Overdue", "Done"]


const source = new EventSource("http://localhost:3000/Tasks/events");
const listsTypeContainer = document.getElementById("lists")
const form = document.getElementById("taskForm")
const expandFormButton = document.getElementById("expandFormButton")

expandFormButton.addEventListener("click", () => {
  form.classList.toggle("show");
  if (expandFormButton.value === "Close form") {
    expandFormButton.value = "Create task";
    expandFormButton.style.backgroundColor = "rgba(75, 133, 225, 1)"
  } else {
    expandFormButton.value = "Close form";
    expandFormButton.style.backgroundColor = "rgba(215, 45, 45, 1)"
  }
});


let lastTaskMessage = null;
source.addEventListener("message", function getTasks(event) {
  const tasks = JSON.parse(event.data);
  tasks.sort((a, b) => {
    if (a.TaskAttributes.Priority === b.TaskAttributes.Priority) {
      // If priority is same, sort by end date
      return new Date(a.TaskAttributes.EndDate) - new Date(b.TaskAttributes.EndDate);
    } else {
      // Sort by priority
      return a.TaskAttributes.Priority - b.TaskAttributes.Priority;
    }
  });
  console.log(tasks)
  const newListsContainer = document.createElement("div");
  newListsContainer.id = "ListsContainer";

  LISTS.forEach((list, index) => {
    const currentDate = new Date();  
    const listType = document.createElement("div");
    const newTaskList = document.createElement("ol");
    listType.id = list;
    newTaskList.id = "TaskList";
    newTaskList.name = list
    newTaskList.textContent = list;
    newTaskList.className = LISTS[index]
    
    tasks.forEach((task) => {
      if (task.TaskAttributes.Status == "Overdue" || (new Date(task.TaskAttributes.EndDate) < currentDate) && task.TaskAttributes.Status !== "Done") {
        task.TaskAttributes.Status = LISTS[2]
      }
      if(task.TaskAttributes.Status == list){
        const newTask = document.createElement("li");
        const newLine = document.createElement("br")
        newTask.textContent = task.TaskName;
        newTask.appendChild(newLine)
        newTask.name = task.TaskName
        newTask.id = task._id
        if((new Date(task.TaskAttributes.EndDate) < currentDate) === false){
          newTask.setAttribute("draggable", true);
          newTask.className = "draggable"
        }
        

        newTaskList.appendChild(newTask); 
        makeDescription(newTask, task)
        makeDeleteButton(task, newTask);
        makeEditButton(task, newTask);
      }
    });
    newListsContainer.appendChild(newTaskList);
  });
  const previousContainer = document.getElementById("ListsContainer");
  if (previousContainer) {
    previousContainer.parentNode.removeChild(previousContainer);
  }
  listsTypeContainer.appendChild(newListsContainer);
  makeDraggable();
  lastTaskMessage = tasks;
});


function makeDraggable(){
  const draggableElements = document.querySelectorAll('[draggable=true]');
  const containers = document.querySelectorAll("#TaskList")
  draggableElements.forEach((element) => {
    element.addEventListener("dragstart", () => {
      element.classList.add("dragging")
    })
    element.addEventListener("dragend", () => {
      element.classList.remove("dragging")
    })
  })
  containers.forEach((container) => {
    container.addEventListener("dragover", (event) => {
      event.preventDefault();
    })
  
    container.addEventListener("drop", async (event) => {
      event.preventDefault();
      const draggable = document.querySelector(".dragging")
      console.log(event.target.className)
      if (event.target === container && event.target.className != "Overdue") {
        container.appendChild(draggable)
        const updatedData = {
          id: draggable.id,
          Status: container.name
        }
        try {
          const response = await fetch("http://localhost:3000/Tasks/UpdateStatus", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
          });
          const responseData = await response.json();
          console.log(responseData.status, responseData);
        } catch (error) {
          console.error(error);
        }
      }
    })
  })
}
  

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get form input values
  const taskName = taskForm.taskName.value;
  const description = taskForm.description.value;
  const assignee = taskForm.assignee.value;
  const priority = taskForm.priority.value;
  const startDate = taskForm.startDate.value;
  const endDate = taskForm.endDate.value;
  const status = taskForm.status.value;

  // Check if any of the form fields are empty
  if (!taskName || !description || !assignee || !priority || !startDate || !endDate || !status) {
    throw new Error("Please fill in all fields.");
  }

  // Check if endDate is before startDate
  if (new Date(endDate) < new Date(startDate)) {
    throw new Error("End date must be after start date.");
  }

  const data = {
    TaskName: taskName,
    TaskAttributes: {
      Description: description,
      Assignee: assignee,
      Priority: priority,
      StartDate: startDate,
      EndDate: endDate,
      Status: status
    }
  };
  try {
    const response = await fetch("http://localhost:3000/Tasks/SendTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    console.log(responseData.status, responseData);
  } catch (error) {
    console.error(error);
  }
});

function makeDescription(newTask, task){

  const descriptionDiv = document.createElement("div")
  const newTaskDescription = document.createElement("p")
  const assignee = document.createElement("p")
  const status = document.createElement("p")
  const priority = document.createElement("p")   
  const startDate = document.createElement("p")  
  const endDate = document.createElement("p")

  descriptionDiv.className = "task-details"
  descriptionDiv.style.display = "none"

  newTask.addEventListener("click", () => {
    if (descriptionDiv.style.display === "none"){
      descriptionDiv.style.display = "block"
    }
    else 
    {
      descriptionDiv.style.display = "none"
    }
  })
  

  newTaskDescription.textContent = task.TaskAttributes.Description 
  assignee.textContent = "Assignee: " + task.TaskAttributes.Assignee
  status.textContent = "Status: " + task.TaskAttributes.Status
  priority.textContent = "Priority: " + task.TaskAttributes.Priority
  startDate.textContent = "Status: " + task.TaskAttributes.StartDate
  endDate.textContent = "Priority: " + task.TaskAttributes.EndDate

  descriptionDiv.appendChild(assignee)
  descriptionDiv.appendChild(status)
  descriptionDiv.appendChild(priority)
  descriptionDiv.appendChild(startDate)  
  descriptionDiv.appendChild(endDate)
  newTask.appendChild(descriptionDiv)
}

function makeDeleteButton(task, newTask){
  const deleteButton = document.createElement("button");
  deleteButton.value = "Delete Task";
  deleteButton.textContent = "Delete";
  deleteButton.style.display = "none"

  newTask.addEventListener("mouseover", () => {
    deleteButton.style.display = "inline-block";
  });
  newTask.addEventListener("mouseout", () => {
    deleteButton.style.display = "none";
  });

  deleteButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    newTask.remove()
    const response = await fetch("http://localhost:3000/Tasks/Delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"                                  
      },
      body: JSON.stringify(task)
    });
    try{
      const data = await response.json();
      console.log(data.status, data);
    }
    catch (error) {
      console.error(error);
    }
  });
  newTask.appendChild(deleteButton);
}
function makeEditButton(task, newTask) {
  const editButton = document.createElement("button");
  editButton.value = "Edit Task";
  editButton.textContent = "Edit";
  editButton.classList.add("edit-button"); // Add a CSS class for styling
  editButton.style.display = "none"

  newTask.addEventListener("mouseover", () => {
    editButton.style.display = "inline-block";
  });
  newTask.addEventListener("mouseout", () => {
    editButton.style.display = "none";
  });

  editButton.addEventListener("click", async (event) => {
    event.stopPropagation();
    event.preventDefault();

    const dialog = document.getElementById("editTaskModal");
    console.log(dialog)
    dialog.showModal();
    const form = dialog.querySelector("form");
    form.taskName.value = task.TaskName;
    form.description.value = task.TaskAttributes.Description;
    form.editAssignee.value = task.TaskAttributes.Assignee
    form.priority.value = task.TaskAttributes.Priority;
    form.startDate.value = task.TaskAttributes.StartDate;
    form.endDate.value = task.TaskAttributes.EndDate;
    form.status.value = task.TaskAttributes.Status || ""; // Set empty string if status is undefined

    const saveButton = dialog.querySelector("#saveEditButton");
    saveButton.addEventListener("click", async () => {
      console.log("Penis")
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
        id: newTask.id
      };
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
    });
  });
  editButton.style.visibility = "hidden";
  newTask.addEventListener("mouseover", () => {
    editButton.style.visibility = "visible";
  });
  newTask.addEventListener("mouseout", () => {
    editButton.style.visibility = "hidden";
  });
  newTask.appendChild(editButton);
}
