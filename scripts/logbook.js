const submitLogbook = document.getElementById("newLogbook")
const logbookDiv = document.getElementById("logbooks")

const source = new EventSource("http://localhost:3000/Logbook/events");

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
    status: false
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

let prevData = [];

function makeLogbookList(data){
  const newData = data.slice(prevData.length);

  newData.forEach((logbookEntry, index) => {
    const container = document.createElement("div")
    const containerName = document.createElement("p")
    container.id = index + prevData.length
    containerName.textContent = "Logbook: " + logbookEntry.date
    containerName.id = index + prevData.length
    makeDeleteButton(containerName, logbookEntry, container)
    container.appendChild(containerName)
    makeLogbookOpen(container, logbookEntry, containerName)
    makeHeadersAndParagraphs(container, logbookEntry)
    logbookDiv.appendChild(container)
  })
  prevData = [...prevData, ...newData];
}
function makeHeadersAndParagraphs(container, logbookEntry){
  const hAndpDiv = document.createElement("div");
  hAndpDiv.className = "hAndpDiv"

  logbookEntry.headers.forEach((header, index) => {
    const hAndpContainer = document.createElement("div");
    hAndpContainer.className = "hAndpContainer";

    const checkbox = document.createElement("input")
    
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";    
    checkbox.addEventListener("click", async () => {
      const data = {
        status: checkbox.checked,
        _id: logbookEntry._id
      }
      const response = await fetch("http://localhost:3000/Logbook/UpdateStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"                                  
        },
        body: JSON.stringify(data)
        });
        try{
          const data = await response.json();
          console.log(data.status, data);          
        }
        catch (error) {
          console.error(error);
        }  
      })
    checkbox.checked = logbookEntry.status
    hAndpContainer.appendChild(checkbox);

    const h = document.createElement("h3");
    h.textContent = header;
    hAndpContainer.appendChild(h);

    const p = document.createElement("p");
    p.textContent = logbookEntry.paragraphs[index];
    hAndpContainer.appendChild(p);

    hAndpDiv.appendChild(hAndpContainer);
  });

  container.appendChild(hAndpDiv);
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

function makeLogbookOpen(container, logbookEntry, containerName){
  let form = document.createElement("form");
  form.id = logbookEntry._id;
  let formClose = document.createElement("input");
  let formHeaderLabel = document.createElement("label");
  let formHeader = document.createElement("input");
  let formDescriptionLabel = document.createElement("label");
  let formDescription = document.createElement("input");
  let submitButton = document.createElement("button");
  
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

  
  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const updatedData = {
      paragraphs: formDescription.value,
      headers: formHeader.value,
      _id: logbookEntry._id,
      status: false
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
    } 
    catch (error) {
      console.error(error);
    }
  })

  form.appendChild(formHeaderLabel);
  form.appendChild(formHeader);
  form.appendChild(formDescriptionLabel);
  form.appendChild(formDescription);
  form.appendChild(submitButton);
  container.appendChild(form)

}