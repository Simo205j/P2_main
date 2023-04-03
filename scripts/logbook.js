const submitLogbook = document.getElementById("newLogbook")
const logbookDiv = document.getElementById("logbooks")

const source = new EventSource("http://localhost:3000/events/Logbooks");

source.addEventListener("message", function getTasks(event) {
  const data = JSON.parse(event.data);
  makeLogbookList(data)
})

submitLogbook.addEventListener("click", async (event) => {
  const data = {
    date: new Date().toISOString().substr(0, 10),
    paragraphs: [],
    headers: []
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
  const hAndpDiv = document.createElement("div")

  let pArray = []
  let hArray = []
  logbookEntry.headers.forEach((headers, index) => {
    const header = document.createElement("h3")
    header.textContent = headers
    hArray.push(headers)
  })

  logbookEntry.paragraphs.forEach((paragraphs, index) => {
    const paragraph = document.createElement("p")
    paragraph.textContent = paragraphs
    pArray.push(paragraph)
  })
  console.log(pArray, hArray)
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
  let formHeaderLabel = document.createElement("label");
  let formHeader = document.createElement("input");
  let formDescriptionLabel = document.createElement("label");
  let formDescription = document.createElement("input");
  let submitButton = document.createElement("button");
  
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
      _id: logbookEntry._id
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