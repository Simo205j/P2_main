LISTS = ["To do", "Doing", "Done"]


const source = new EventSource("http://localhost:3000/events");
const listsTypeContainer = document.getElementById("lists")

source.addEventListener("message", function getTasks(event) {
  const tasks = JSON.parse(event.data);
  console.log(tasks)
  const newListsContainer = document.createElement("div");
  newListsContainer.id = "ListsContainer";

  LISTS.forEach((list) => {
      const listType = document.createElement("div");
      listType.id = list;
      const newTaskList = document.createElement("ol");
      newTaskList.id = "TaskList";
      newTaskList.name = list
      newTaskList.textContent = list;

      tasks.forEach((task) => {
        if(task.TaskAttributes.Status == list){
          const newTask = document.createElement("li");
          newTask.textContent = task.TaskName;
          newTask.name = task.TaskName
          newTask.id = task._id
          newTask.setAttribute("draggable", true);
          newTaskList.appendChild(newTask); 
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
});

function makeDraggable(){
  const draggableElements = document.querySelectorAll('[draggable=true]');
  const containers = document.querySelectorAll("#TaskList")
  console.log(draggableElements, containers)
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
      if (event.target === container) {
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
    const data = {
      TaskName: taskForm.taskName.value,
      TaskAttributes : {
          Description: taskForm.description.value,
          Assignee: taskForm.assignee.value,
          Priority: taskForm.priority.value,
          StartDate: taskForm.startDate.value,
          EndDate: taskForm.endDate.value,
          Status: taskForm.status.value
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

function makeDeleteButton(task, newTask){
  const deleteButton = document.createElement("button");
  deleteButton.value = "Delete Task";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:3000/api/Task/", {
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

  editButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const dialog = document.getElementById("editTaskModal");
    dialog.showModal();
    const form = dialog.querySelector("form");
    form.taskName.value = task.TaskName;
    form.description.value = task.TaskAttributes.Description;
    form.assignee.value = task.TaskAttributes.Assignee;
    form.priority.value = task.TaskAttributes.Priority;
    form.startDate.value = task.TaskAttributes.StartDate;
    form.endDate.value = task.TaskAttributes.EndDate;
    form.status.value = task.TaskAttributes.Status;

    const saveButton = dialog.querySelector("#saveEditButton");
    saveButton.addEventListener("click", async () => {
      const updatedData = {
        TaskName: form.taskName.value,
        TaskAttributes: {
          Description: form.description.value,
          Assignee: form.assignee.value,
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
          }
        );
        const responseData = await response.json();
        console.log(responseData.status, responseData);
      } catch (error) {
        console.error(error);
      }
    });
  });
  newTask.appendChild(editButton);
}
