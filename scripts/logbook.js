const logbookSource = new EventSource("http://localhost:3000/Logbook/events");
const assigneesSource = new EventSource("http://localhost:3000/Assignee/events");

const submitLogbook = document.getElementById("newLogbook")
const logbookDiv = document.getElementById("logbooks")

submitLogbook.addEventListener("click", async (event) => {
  event.preventDefault();
  const data = {
    date: new Date().toISOString().substr(0, 10),
    paragraphs: [],
    headers: [],
    status: []
  };
    try {
      const response = await fetch("http://localhost:3000/Logbook/SendLogbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
        const responseData = await response.json();
        console.log(response.status, responseData);
    } catch (error) {
      console.error(error);
    }
});
assigneesSource.addEventListener("message", async function getAssigne(event) {
  const assignee = await JSON.parse(event.data);
  return assignee
})

logbookSource.addEventListener("message", function getTasks(event) {
  const data = JSON.parse(event.data);
  console.log(data)
  makeLogbookList(data)
})
let previousData = [];

function createLogbookEntryContainer(logbookEntry, index) {
  console.log(logbookEntry)
  const logbookEntryContainer = document.createElement("div");
  const logbookEntryContainerName = document.createElement("p");
  const logbookHeaderAndParagraphs = document.createElement("div");
  const closeLogbookButton = document.createElement("button");

  logbookEntryContainer.addEventListener("click", () => {
    logbookHeaderAndParagraphs.classList.toggle("display");
    closeLogbookButton.classList.toggle("display");
  });

  closeLogbookButton.addEventListener("click", (event) => {
    //STOPS EVENT LISTENERS OF  PARENT ELEMENTS
    event.stopPropagation();
    logbookHeaderAndParagraphs.classList.remove("display");
    closeLogbookButton.classList.remove("display");
  });

  logbookEntryContainer.id = index + previousData.length;
  logbookEntryContainer.className = "LogbookEntryContainer";
  logbookEntryContainerName.textContent = "Logbook: " + logbookEntry.date;
  logbookEntryContainerName.id = index + previousData.length;

  closeLogbookButton.textContent = "Close";
  logbookHeaderAndParagraphs.className = "display-none";
  closeLogbookButton.className = "display-none";

  makeDeleteButton(logbookEntryContainerName, logbookEntry, logbookEntryContainer);
  makeLogbookOpen(logbookEntryContainer, logbookEntry, logbookEntryContainerName, logbookHeaderAndParagraphs);
  makeHeadersAndParagraphs(logbookEntryContainer, logbookEntry, logbookHeaderAndParagraphs, index);

  logbookEntryContainer.appendChild(logbookEntryContainerName); // Add containerName to the container
  logbookEntryContainer.appendChild(closeLogbookButton); // Add closeButton to the container
  logbookDiv.appendChild(logbookEntryContainer);

  return logbookEntryContainer;
}

function makeLogbookList(data) {
  const newData = data.map((logbookEntry, index) => {
    const logbookEntryContainer = createLogbookEntryContainer(logbookEntry, index);
    return logbookEntryContainer;
  });

  previousData = [...previousData, ...newData];
}



function makeHeadersAndParagraphs(logbookEntryContainer, logbookEntry, logbookHeaderAndParagraphs, index) {
  const entryElements = document.createElement("div");
  entryElements.className = "hAndpDiv";
  entryElements.id = "Checkbox " + index;

  logbookEntry.headers.forEach((header, index2) => {
    const hAndpContainer = document.createElement("div");
    const checkbox = document.createElement("input");
    const deleteEntry = document.createElement("button");
    const logbookEntryHeader = document.createElement("h3");
    const logbookEntryParagraph = document.createElement("p");
    const logbookEntryassignee = document.createElement("p");

    hAndpContainer.className = "hAndpContainer";
    logbookEntryHeader.textContent = header;
    logbookEntryParagraph.textContent = logbookEntry.paragraphs[index2];
    logbookEntryassignee.textContent = "Assignee: " + logbookEntry.assignee[index2];
    deleteEntry.textContent = "Delete"
    deleteEntry.value = "Delete"

    //CREATES CHECKBOX STATUS BASED ON SERVER DATA
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";

    checkbox.checked = logbookEntry.status[index2];
    if (checkbox.checked === true) {
      hAndpContainer.id = "Done";
    }
    hAndpContainer.appendChild(checkbox);
    hAndpContainer.appendChild(logbookEntryParagraph);
    hAndpContainer.appendChild(logbookEntryHeader);
    hAndpContainer.appendChild(logbookEntryassignee);

    //UPDATES CHEXBOX ON CLIENT SIDE AND SEND UPDATED CHECKBOXSTATUSARRAY
    checkbox.addEventListener("click", async (event) => {
      if (event.target.checked) {
        hAndpContainer.id = "Done";
      } 
      else {
        hAndpContainer.removeAttribute("id");
      }

      const checkboxes = document.getElementById("Checkbox " + index); // Get the parent div element containing the checkbox
      const checkboxesArray = Array.from(checkboxes.querySelectorAll("input[type='checkbox']")); // Get all checkbox elements within the parent div
      const checkboxStatusArray = checkboxesArray.map((checkbox) => checkbox.checked)

      const data = {
        status: checkboxStatusArray,
        _id: logbookEntry._id
      };
      const response = await fetch("http://localhost:3000/Logbook/UpdateStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      try {
        const data = await response.json();
        console.log(data.status, data);
      } catch (error) {
        console.error(error);
      }
    });

    deleteEntry.addEventListener("click", async () => {
      const response = await fetch("http://localhost:3000/Logbook/EditEntry", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _id: logbookEntry._id,
          index: index2
        })
      });
      try {
        const data = await response.json();
        console.log(data.status, data);
        hAndpContainer.remove()
      } catch (error) {
        console.error(error);
      }
    });
    //APPEND DELETEBUTTON
    hAndpContainer.appendChild(deleteEntry);
    //APPEND CHECKBOX, HEADERS, PARAGRAPHS AND ASSIGNE TO THE ENTRY ELEMENTS CONTAINER
    entryElements.appendChild(hAndpContainer);
  });
  logbookHeaderAndParagraphs.appendChild(entryElements);
  logbookEntryContainer.appendChild(logbookHeaderAndParagraphs);
}


function makeDeleteButton(logbooks, logbookEntry, logbookEntryContainer){
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.value = "Delete"
    deleteButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const response = await fetch("http://localhost:3000/Logbook/Delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"                                  
        },
        body: JSON.stringify(logbookEntry)
      });
      try{
        const data = await response.json();
        console.log(data.status, data);
        logbookEntryContainer.remove();
      }
      catch (error) {
        console.error(error);
      }
    });
    logbooks.appendChild(deleteButton);
}
function makeLogbookOpen(logbookEntryContainer, logbookEntry, logbookEntryContainerName, logbookHeaderAndParagraphs) {
  let form = document.createElement("form");
  form.id = logbookEntry._id;

  let formClose = document.createElement("input");
  let formHeaderLabel = document.createElement("label");
  let formHeader = document.createElement("input");
  let formDescriptionLabel = document.createElement("label");
  let formDescription = document.createElement("input");
  let submitButton = document.createElement("button");
  let formAssigneeLabel = document.createElement("label");
  let formAssignee = document.createElement("select");
  let AssigneeButton = document.createElement("button");

  formClose.type = "button"
  formClose.value = "X"
  formHeaderLabel.textContent = "Header: ";
  formHeader.name = "header";
  formHeader.value = "";

  formDescriptionLabel.textContent = "Description: ";
  formDescription.name = "description";
  formDescription.value = "";

  submitButton.type = "submit";
  submitButton.textContent = "Save";

  formAssigneeLabel.textContent = "Assignee: ";
  formAssignee.name = "assignee";
  formAssignee.value = "";

  form.appendChild(formHeaderLabel);
  form.appendChild(formHeader);
  form.appendChild(formDescriptionLabel);
  form.appendChild(formDescription);
  form.appendChild(formAssigneeLabel);
  form.appendChild(formAssignee);
  form.appendChild(submitButton);
  logbookHeaderAndParagraphs.appendChild(form)
  logbookEntryContainer.appendChild(logbookHeaderAndParagraphs)


  //ADD SELECT OPTIONS BASED ON DATABASE
  assigneesSource.addEventListener("message", async function getAssignees(event) {
    const assignees = await JSON.parse(event.data);

    assignees.forEach((assignee) => {
      let option = document.createElement("option");
      option.value = assignee.assigneeName;
      option.text = assignee.assigneeName;
      formAssignee.add(option);
    });
  });
  //SUBMIT NEW LOGBOOKENTRY
  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const updatedData = {
      paragraphs: formDescription.value,
      headers: formHeader.value,
      _id: logbookEntry._id,
      status: false,
      assignee: formAssignee.value
    }
    console.log(updatedData)
    try {
      const response = await fetch("http://localhost:3000/Logbook/UpdatePost", {
        method: "POST",
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
  });
}
