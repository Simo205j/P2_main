const submitLogbook = document.getElementById("newLogbookBtn")
const logbookListDiv = document.getElementById("logbookList")
const displayLogbookContainerDiv = document.querySelector('div[class="showLogbookEntry Container"]')
const submitLogbookHAndPEntry = document.querySelector('input[type="Submit"]')
const logbookEntryHAndPDiv = document.querySelector('div[id="LogbookEntryHAndP"]') 
const formLogbookEntryHAndP = document.querySelector("form");

const logbookSource = new EventSource("http://localhost:3000/Logbook/events");


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

let logbookCheckboxArray = []
let logbookHeaderArray = []
let logbookParagraphArray = []

submitLogbookHAndPEntry.addEventListener("click", (event) => {
  event.preventDefault()
  const tempContainer = document.querySelector('div[id="temp"]')
  const insertBeforeThis = tempContainer.querySelector('input[value="Save logbook"]')
  const div = document.createElement("div")
  const checkbox = document.createElement("input")
  const header = document.createElement("h3")
  const paragraph = document.createElement("p")

  checkbox.type = "checkbox"
  tempBoxEventlistener(checkbox, 0)
  header.textContent = formLogbookEntryHAndP.formHeader.value
  paragraph.textContent = formLogbookEntryHAndP.formParagraph.value
  
  logbookCheckboxArray.push(checkbox.checked)
  logbookHeaderArray.push("" + formLogbookEntryHAndP.formHeader.value)
  logbookParagraphArray.push("" + formLogbookEntryHAndP.formParagraph.value)
  div.appendChild(checkbox)
  div.appendChild(header)
  div.appendChild(paragraph)
  tempContainer.insertBefore(div,insertBeforeThis)
})
//ADD NEW LOGBOOKENTRY


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
      logbookHeaderArray = []
      logbookParagraphArray = []
      logbookCheckboxArray = []
      if(data[0].hasOwnProperty("HeaderArray")){
        data[0].HeaderArray.forEach((hAndPArray, index) => {
          logbookCheckboxArray.push(data[0].CheckboxArray[index])
          logbookHeaderArray.push(data[0].HeaderArray[index])
          logbookParagraphArray.push(data[0].ParagraphArray[index])
        }) 
      }
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
        const tempContainerDiv = document.createElement("div")
        const tempCheckbox = document.createElement("input")
        const tempHeader = document.createElement("h3")
        const tempParagraph = document.createElement("p")

        tempCheckbox.type = "checkbox"

        tempBoxEventlistener(tempCheckbox, index)
  
        if(data[0].CheckboxArray[index] === true){
          tempCheckbox.checked = true
        }
        maketing(tempHeader, tempParagraph, data, index)

        tempContainerDiv.appendChild(tempCheckbox)
        tempContainerDiv.appendChild(tempHeader)
        tempContainerDiv.appendChild(tempParagraph)

        tempDiv.appendChild(tempContainerDiv)
    })

  }
  makeLogbookConainerSaveBtn(logbookEntryContainer, tempDiv)
  displayLogbookContainerDiv.appendChild(tempDiv)
}

function maketing(tempHeader, tempParagraph, data, index){
  tempHeader.textContent = data[0].HeaderArray[index]

  tempHeader.addEventListener("click", () => {
    const tempHeaderInput = document.createElement("textarea")
    tempHeaderInput.value = tempHeader.textContent
    tempHeader.replaceWith(tempHeaderInput)

    tempHeaderInput.addEventListener("keypress", (event) => {
      if(event.key == "Enter")
      {
      tempHeader.textContent = tempHeaderInput.value
      tempHeaderInput.replaceWith(tempHeader)
      logbookHeaderArray[index] = tempHeader.textContent
      }
    })
    tempHeaderInput.addEventListener("dblclick", (event) => {
      tempHeader.textContent = tempHeaderInput.value
      tempHeaderInput.replaceWith(tempHeader)
      logbookHeaderArray[index] = tempHeader.textContent
    })
  })
  tempParagraph.textContent = data[0].ParagraphArray[index]
  tempParagraph.addEventListener("click", () => {

    const tempParagraphInput = document.createElement("textarea")
    tempParagraphInput.value = tempParagraph.textContent
    tempParagraph.replaceWith(tempParagraphInput)


    tempParagraphInput.addEventListener("keypress", (event) => {
      if(event.key == "Enter")
      {
      tempParagraph.textContent = tempParagraphInput.value
      tempParagraphInput.replaceWith(tempParagraph)
      logbookParagraphArray[index] = tempParagraph.textContent
      }
    })
    tempParagraphInput.addEventListener("dblclick", (event) => {
      tempParagraph.textContent = tempParagraphInput.value
      tempParagraphInput.replaceWith(tempParagraph)
      logbookParagraphArray[index] = tempParagraph.textContent
    })
  })
}
function tempBoxEventlistener(tempCheckbox, index){
  tempCheckbox.addEventListener("click", (event) => {
    event.stopPropagation()
    console.log(tempCheckbox.checked)
    logbookCheckboxArray[index] = tempCheckbox.checked 

  })
}
function makeLogbookConainerSaveBtn(logbookEntryContainer, tempDiv){
  const saveEntries = document.createElement("input")
  saveEntries.type = "button"
  saveEntries.value = "Save logbook"

  saveEntries.addEventListener("click", async (event) => {
    event.preventDefault()
    const logbookData = 
    {
      _id:logbookEntryContainer.id,
      HeaderArray: logbookHeaderArray,
      ParagraphArray: logbookParagraphArray,
      CheckboxArray: logbookCheckboxArray
    }
    console.log(logbookData)
    const response = await fetch("http://localhost:3000/Logbook/SaveLogbookEntry", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"                                  
      },
      body: JSON.stringify(logbookData)
    });
    try{
      const data = await response.json();
      console.log(data);
    }
    catch (error) {
      console.error(error);
      console.log(data)
    }
  })
  tempDiv.appendChild(saveEntries)
}

