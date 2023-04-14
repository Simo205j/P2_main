const submitLogbook = document.getElementById("newLogbook")
const logbookDiv = document.getElementById("logbooks")

const source = new EventSource("http://localhost:3000/Logbook/events");
const assigneesSource = new EventSource("http://localhost:3000/Assignee/events");

assigneesSource.addEventListener("message", async function getAssigne(event) {
  const assignee = await JSON.parse(event.data);
  return assignee
})

source.addEventListener("message", function getTasks(event) {
  const data = JSON.parse(event.data);
  console.log(data)
  makeLogbookList(data)
})

submitLogbook.addEventListener("click", async (event) => {
  const data = {
    date: new Date().toISOString().substr(0, 10),
    paragraphs: [],
    headers: [],
    status: [],
  };
  console.log(data)
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

async function checkboxEventListener(event, logbookEntry, index, hAndpContainer) {
  if (event.target.checked) {
    hAndpContainer.id = "Done";
  } else {
    hAndpContainer.removeAttribute("id");
  }

  const checkboxes = document.getElementById("Checkbox " + index); // Get the parent div element containing the checkbox
  const checkboxesArray = Array.from(checkboxes.querySelectorAll("input[type='checkbox']")); // Get all checkbox elements within the parent div

  const checkboxStatusArray = checkboxesArray.map((checkbox) => {
    return checkbox.checked; // Retrieve the checked status of each checkbox (true or false)
  });
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
}



let prevData = [];

function makeLogbookList(data){
  const newData = data.slice(prevData.length);

  newData.forEach((logbookEntry, index) => {
    const container = document.createElement("div")
    const containerName = document.createElement("p")
    const logbookHeaderAndParagraphs = document.createElement("div")
    const closeButton = document.createElement("button")

    closeButton.textContent = "Close"
    logbookHeaderAndParagraphs.className = "display-none"
    closeButton.className = "display-none"
    container.id = index + prevData.length
    container.className = "LogbookEntryContainer"
    containerName.textContent = "Logbook: " + logbookEntry.date
    containerName.id = index + prevData.length

    closeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      logbookHeaderAndParagraphs.classList.remove("display");
      logbookHeaderAndParagraphs.classList.add("display-none");
      closeButton.classList.remove("display");
      closeButton.classList.add("display-none");
    });

    container.addEventListener("click", () => {
      logbookHeaderAndParagraphs.className = "display"
      closeButton.className = "display"
    })
    
    logbookHeaderAndParagraphs.appendChild(closeButton)
    makeDeleteButton(containerName, logbookEntry, container)
    container.appendChild(containerName)
    makeLogbookOpen(container, logbookEntry, logbookHeaderAndParagraphs)

    makeLogbookContent(container, logbookEntry, logbookHeaderAndParagraphs, index)
    logbookDiv.appendChild(container)
  })
  prevData = [...prevData, ...newData];
}

function makeLogbookContent(container, logbookEntry, logbookHeaderAndParagraphs, index) {
  const hAndpDiv = document.createElement("div");
  hAndpDiv.className = "hAndpDiv";
  hAndpDiv.id = "Checkbox " + index;

  logbookEntry.headers.forEach((header, index2) => {
    makeLogbookEntry(hAndpDiv, logbookEntry, index, index2);
  });

  logbookHeaderAndParagraphs.appendChild(hAndpDiv);
  container.appendChild(logbookHeaderAndParagraphs);
}

function makeLogbookEntry(hAndpDiv, logbookEntry, index, index2) {
  const hAndpContainer = document.createElement("div");
  const checkbox = document.createElement("input");

  hAndpContainer.className = "hAndpContainer";
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";
  checkbox.checked = logbookEntry.status[index2];

  if (checkbox.checked === true) {
    hAndpContainer.id = "Done";
  }

  checkbox.addEventListener("click", (event) => {
    checkboxEventListener(event, logbookEntry, index, hAndpContainer);
  });
  //CREATES PROPER DOM ELEMENTS FOR EACH LOGBOOK ENTRY
  const h = document.createElement("h3");
  const p = document.createElement("p");
  const assignee = document.createElement("p");

  h.textContent = logbookEntry.headers[index2] || "";
  p.textContent = logbookEntry.paragraphs[index2] || ""; 
  assignee.textContent = "Assignee: " + logbookEntry.assignee[index2];

  hAndpContainer.appendChild(checkbox);
  hAndpDiv.appendChild(hAndpContainer);
  hAndpContainer.appendChild(assignee);
  hAndpContainer.appendChild(p);
  hAndpContainer.appendChild(h);
}


function makeLogbookOpen(container, logbookEntry, logbookHeaderAndParagraphs){
  let form = document.createElement("form");
  form.id = logbookEntry._id;
  let formClose = document.createElement("input");
  let formHeaderLabel = document.createElement("label");
  let formHeader = document.createElement("input");
  let formDescriptionLabel = document.createElement("label");
  let formDescription = document.createElement("input");
  let submitButton = document.createElement("button");
  let formAssigneeLabel = document.createElement("label"); // New label element for assignee
  let formAssignee = document.createElement("select"); // Changed from input to select element for assignee
  
  formClose.type = "button"
  formClose.value = "X"
  formHeaderLabel.textContent = "Header: ";
  formHeader.name = "header"
  
  formDescriptionLabel.textContent = "Description: ";
  formDescription.name = "description";
  formDescription.value = "";
  
  submitButton.type = "submit";
  submitButton.textContent = "Save";

  formAssigneeLabel.textContent = "Assignee: "; // Set label text for assignee
  formAssignee.name = "assignee"; // Set name for assignee select
  formAssignee.id = "selectAssignees"

  assigneesSource.addEventListener("message", async function getAssignees(event) {
    const assignees = await JSON.parse(event.data);
    assignees.forEach((assignee) => {
      let option = document.createElement("option");
      option.value = assignee.assigneeName;
      option.text = assignee.assigneeName;
      formAssignee.add(option);
    });
  });

  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const updatedData = {
      paragraphs: formDescription.value,
      headers: formHeader.value,
      _id: logbookEntry._id,
      status: false,
      assignee: formAssignee.value // Add selected assignee value to updatedData
    }
  
    try {
      console.log("FISSE")
      const response = await fetch("http://localhost:3000/Logbook/UpdatePost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      });
      const responseData = await response.json();
      console.log(responseData.status, responseData);

      const logbookChild = logbookHeaderAndParagraphs.querySelector('div[class="hAndpDiv"]')
      console.log(logbookChild.childElementCount)
      const hAndpContainer = document.createElement('div');
      const p = document.createElement('p');
      const h2 = document.createElement('h3');
      const checkbox = document.createElement('input');

      hAndpContainer.className = 'hAndpContainer';
      h2.textContent = formHeader.value;
      p.textContent = formDescription.value;
      checkbox.type = 'checkbox';

      checkbox.addEventListener('click', (event) => {
        checkboxEventListener(event, logbookEntry, logbookChild.childElementCount+1, hAndpContainer)
      });
      hAndpContainer.appendChild(checkbox);
      hAndpContainer.appendChild(h2);
      hAndpContainer.appendChild(p);
      hAndpContainer.appendChild(assignee)
      
      logbookChild.appendChild(hAndpContainer);
    } 
    catch (error) {
      console.error(error);
    }
  });
  
  form.appendChild(formHeaderLabel);
  form.appendChild(formHeader);
  form.appendChild(formDescriptionLabel);
  form.appendChild(formDescription);
  form.appendChild(formAssigneeLabel); 
  form.appendChild(formAssignee);
  form.appendChild(submitButton);
  logbookHeaderAndParagraphs.appendChild(form)
  container.appendChild(logbookHeaderAndParagraphs)
}

function makeDeleteButton(logbooks, logbookEntry, container){
  const deleteButton = document.createElement("button");
  deleteButton.value = "Delete Logbook";
  deleteButton.textContent = "Delete";  
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
      container.remove();
    }
    catch (error) {
      console.error(error);
    }
  });
  logbooks.appendChild(deleteButton);
}