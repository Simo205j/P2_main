const logbookSource = new EventSource("http://localhost:3000/Logbook/events");

const submitLogbook = document.getElementById("newLogbookBtn")
const logbookListDiv = document.getElementById("logbookList")
const closeLogbookBtn = document.getElementById("closeLogbookForm")
const displayLogbookList = document.querySelector('div[class="logbookContainer Container"]')
const displayLogbookContainerDiv = document.querySelector('div[class="showLogbookEntry Container"]')
const submitLogbookHAndPEntry = document.querySelector('input[type="Submit"]')
const logbookEntryHAndPDiv = document.querySelector('div[id="LogbookEntryHAndP"]') 
const formLogbookEntryHAndP = document.querySelector("form");

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
    fetch("http://localhost:3000/Logbook/SendLogbook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({date: new Date().toISOString().substr(0, 10)})
    });
  } 
  catch (error) {
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
  const headerDiv = document.createElement("div")
  const checkbox = document.createElement("input")
  const header = document.createElement("h3")
  const paragraph = document.createElement("p")
  const tempDeleteBtn = document.createElement("input")

  tempDeleteBtn.value = "Delete"
  tempDeleteBtn.type = "button"
  checkbox.type = "checkbox"
  div.className = "index"

  tempBoxEventlistener(checkbox, div.id)
  deleteBtnTempContainer(tempDeleteBtn, div)

  header.textContent = formLogbookEntryHAndP.formHeader.value
  paragraph.textContent = formLogbookEntryHAndP.formParagraph.value
  
  makeNewEdit(header, paragraph)

  logbookCheckboxArray.push(checkbox.checked)
  logbookHeaderArray.push("" + formLogbookEntryHAndP.formHeader.value)
  logbookParagraphArray.push("" + formLogbookEntryHAndP.formParagraph.value)
  headerDiv.appendChild(checkbox)
  headerDiv.appendChild(header)
  headerDiv.appendChild(tempDeleteBtn)
  div.appendChild(headerDiv)
  div.appendChild(paragraph)

  tempContainer.insertBefore(div, insertBeforeThis)
  fixContainerIndexes()
})
//ADD NEW LOGBOOKENTRY

function makeNewEdit(Header, Paragraph)
{
  Header.addEventListener("click", () => {
    const HeaderInput = document.createElement("textarea")
    HeaderInput.value = Header.textContent
    Header.replaceWith(HeaderInput)

    HeaderInput.addEventListener("keypress", (event) => {
      if(event.key == "Enter")
      {
      Header.textContent = HeaderInput.value
      tempHeaderInput.replaceWith(tempHeader)
      }
    })
    HeaderInput.addEventListener("dblclick", (event) => {
      Header.textContent = HeaderInput.value
      HeaderInput.replaceWith(Header)
    })
  })

  Paragraph.addEventListener("click", () => {

    const ParagraphInput = document.createElement("textarea")
    ParagraphInput.value = Paragraph.textContent
    Paragraph.replaceWith(ParagraphInput)


    ParagraphInput.addEventListener("keypress", (event) => {
      if(event.key == "Enter")
      {
      Paragraph.textContent = ParagraphInput.value
      ParagraphInput.replaceWith(Paragraph)
      }
    })
    ParagraphInput.addEventListener("dblclick", (event) => {
      Paragraph.textContent = ParagraphInput.value
      ParagraphInput.replaceWith(Paragraph)
    })
  })
}

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
  logbookEntryDeleteBtn.value = "Delete"
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
      displayLogbookList.id = "hidden"
      closeLogbookBtn.addEventListener("click", () => {
        displayLogbookContainerDiv.id = "hidden"
        displayLogbookList.id = "show"
      })
      console.log(displayLogbookContainerDiv, logbookEntryContainer)
    }
    catch (error) {
      console.error(error);
    }
  })
}
function fixContainerIndexes(){
  const indexDivs = document.querySelectorAll('div[class="index"]')
  indexDivs.forEach((div, index) => {
    div.id = index
  })
}
function makeLogbookContainerDivContent(data, logbookEntryContainer){
  if(document.getElementById("temp")){
    lastTemp = document.getElementById("temp")
    lastTemp.remove()
  }
  const tempDiv = document.createElement("div")
  tempDiv.className = data[0]._id
  const tempLogbookDate = document.createElement("h2")

  tempDiv.id = "temp"
  tempLogbookDate.textContent = ""+ data[0].date

  tempDiv.appendChild(tempLogbookDate)

    if(data[0].hasOwnProperty('HeaderArray')){
      data[0].HeaderArray.forEach((header, index) => {
        const tempContainerDiv = document.createElement("div")
        const tempHeaderContainer = document.createElement("div")
        const tempCheckbox = document.createElement("input")
        const tempHeader = document.createElement("h3")
        const tempDeleteBtn = document.createElement("input")
        const tempParagraph = document.createElement("p")

        tempContainerDiv.className = "index"
        tempContainerDiv.id = index
        tempDeleteBtn.type = "button"
        tempDeleteBtn.value = "Delete"
        tempCheckbox.type = "checkbox"

        tempBoxEventlistener(tempCheckbox, tempContainerDiv.id)
        deleteBtnTempContainer(tempDeleteBtn, tempContainerDiv)
  
        if(data[0].CheckboxArray[index] === true){
          tempCheckbox.checked = true
        }
        makeEditAble(tempHeader, tempParagraph, data, index)

        tempHeaderContainer.appendChild(tempCheckbox)
        tempHeaderContainer.appendChild(tempHeader)
        tempHeaderContainer.appendChild(tempDeleteBtn)
        tempContainerDiv.appendChild(tempHeaderContainer)
        tempContainerDiv.appendChild(tempParagraph)
        tempDiv.appendChild(tempContainerDiv)
    })

  }
  makeLogbookConainerSaveBtn(logbookEntryContainer, tempDiv)
  displayLogbookContainerDiv.appendChild(tempDiv)
}
function deleteBtnTempContainer(tempDeleteBtn, container){
  tempDeleteBtn.addEventListener("click", async (event) => {
    event.preventDefault()
    const index = container.id
    console.log(index)
    logbookCheckboxArray.splice(index, 1)
    logbookHeaderArray.splice(index, 1)
    logbookParagraphArray.splice(index, 1)
    container.remove();
    fixContainerIndexes()
  })
}

function makeEditAble(tempHeader, tempParagraph, data, index){
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
    }
  })
  tempDiv.appendChild(saveEntries)
}

