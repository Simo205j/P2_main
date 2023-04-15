const submitLogbook = document.getElementById("newLogbookBtn")
const logbookListDiv = document.getElementById("logbookList")
const displayLogbookContainerDiv = document.querySelector('div[class="showLogbookEntry Container"]')
const submitLogbookHAndPEntry = document.querySelector('input[type="Submit"]')
const logbookEntryHAndPDiv = document.querySelector('div[id="LogbookEntryHAndP"]') 
const formLogbookEntryHAndP = document.querySelector("form");


const logbookSource = new EventSource("http://localhost:3000/Logbook/events");
const assigneesSource = new EventSource("http://localhost:3000/Assignee/events");


assigneesSource.addEventListener("message", async function getAssigne(event) {
  const assignee = await JSON.parse(event.data);
  console.log(assignee)
})


logbookSource.addEventListener("message", (event) => {
  const logbooks = JSON.parse(event.data);
  console.log(logbooks)

  logbooks.sort((a, b) => {
    const startDateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (startDateDiff !== 0) {
      return startDateDiff;
    }
  });

  while (logbookListDiv.firstChild) {
    logbookListDiv.removeChild(logbookListDiv.firstChild);
  }

  logbooks.forEach((logbookEntry) => {
    makeLogbookList(logbookEntry)
  })
})


let logbookHeaderArray = []
let logbookParagraphArray = []

submitLogbookHAndPEntry.addEventListener("click", (event) => {
  event.preventDefault()
  const hAndpDiv = document.createElement("div")
  hAndpDiv.className = "hAndpDiv"
  const header = document.createElement("h3")
  const paragraph = document.createElement("p")

  header.textContent = formLogbookEntryHAndP.formHeader.value
  paragraph.textContent = formLogbookEntryHAndP.formParagraph.value

  logbookHeaderArray.push("" + formLogbookEntryHAndP.formHeader.value)
  logbookParagraphArray.push("" + formLogbookEntryHAndP.formParagraph.value)
  hAndpDiv.appendChild(header)
  hAndpDiv.appendChild(paragraph)

  logbookEntryHAndPDiv.appendChild(hAndpDiv)
})
//ADD NEW LOGBOOKENTRY
submitLogbook.addEventListener("click", async (event) => {
    try {
      const response = await fetch("http://localhost:3000/Logbook/SendLogbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({date: new Date().toISOString().substr(0, 10)})
      });
        const responseData = await response.json();
        console.log(response.status, responseData);
    } catch (error) {
      console.error(error);
    }
});

function makeLogbookList(logbookEntry){
  const logbookEntryContainer = document.createElement("div")
  const logbookEntryDate = document.createElement("p")

  logbookEntryContainer.id = logbookEntry._id
  logbookEntryDate.textContent = "Logbook: " + logbookEntry.date

  logbookEntryContainer.appendChild(logbookEntryDate)
  makeDeleteBtnLogbookEntry(logbookEntryContainer)
  makeLogbookEntryClickable(logbookEntryContainer)
  //MAKE EVENTLISTENER TO REQUEST INDIVIDUAL LOGBOOK DATA
  logbookListDiv.appendChild(logbookEntryContainer)
}

function makeLogbookEntryClickable(logbookEntryContainer){
  logbookEntryContainer.addEventListener("click", async (event) => {
    event.preventDefault();
    const logbookId = logbookEntryContainer.id;
    const response = await fetch(`http://localhost:3000/Logbook/GetLogbookEntry?id=${logbookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"                                  
      }
    });
    try{
      const data = await response.json();
      console.log(data);
      makeLogbookContainerDivContent(data, logbookEntryContainer)
      displayLogbookContainerDiv.id = "show"
    }
    catch (error) {
      console.error(error);
    }
  })
}
function makeLogbookContainerDivContent(data, logbookEntryContainer){
  if(document.getElementById("temp")){
    lastTemp = document.getElementById("temp")
    console.log(lastTemp)
    lastTemp.remove()
  }
  
  const tempDiv = document.createElement("div")
  const tempLogbookDate = document.createElement("h2")

  tempDiv.id = "temp"
  console.log(data[0])
  tempLogbookDate.textContent = ""+ data[0].date

  tempDiv.appendChild(tempLogbookDate)

    if(data[0].hasOwnProperty('HeaderArray')){
      data[0].HeaderArray.forEach((header, index) => {
        const tempHeader= document.createElement("h2")
        const tempParagraph = document.createElement("p")


        tempHeader.textContent = data[0].HeaderArray[index]
        tempParagraph.textContent = data[0].ParagraphArray[index]
        tempDiv.appendChild(tempHeader)
        tempDiv.appendChild(tempParagraph)
    })
  }
  makeLogbookConainerSaveBtn(logbookEntryContainer, tempDiv)
  displayLogbookContainerDiv.appendChild(tempDiv)
}

function makeLogbookConainerSaveBtn(logbookEntryContainer, tempDiv){
  const saveEntries = document.createElement("input")
  saveEntries.type = "button"
  saveEntries.value = "Save logbook"

  saveEntries.addEventListener("click", async (event) => {
    event.preventDefault()
    const data = 
    {
      _id:logbookEntryContainer.id,
      HeaderArray: logbookHeaderArray,
      ParagraphArray: logbookParagraphArray
    }
    const response = await fetch("http://localhost:3000/Logbook/SaveLogbookEntry", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"                                  
      },
      body: JSON.stringify(data)
    });
    try{
      const data = await response.json();
      console.log(data);
    }
    catch (error) {
      console.error(error);
    }
  })
  tempDiv.appendChild(saveEntries)
}

function makeDeleteBtnLogbookEntry(logbookEntryContainer){
  const logbookEntryDeleteBtn = document.createElement("input")
  logbookEntryDeleteBtn.type = "button"
  logbookEntryDeleteBtn.value = "Delete Logbook"
  logbookEntryDeleteBtn.addEventListener("click", async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const response = await fetch("http://localhost:3000/Logbook/Delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"                                  
      },
      body: JSON.stringify({_id: logbookEntryContainer.id})
    });
    try{
      const data = await response.json();
      console.log(data);
      logbookEntryContainer.remove();
    }
    catch (error) {
      console.error(error);
    }
  });
  logbookEntryContainer.appendChild(logbookEntryDeleteBtn)
}