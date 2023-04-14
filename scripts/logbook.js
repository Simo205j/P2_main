const submitLogbook = document.getElementById("newLogbookBtn")
const logbookListDiv = document.getElementById("logbookList")

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
  
  //MAKE EVENTLISTENER TO REQUEST INDIVIDUAL LOGBOOK DATA
  logbookListDiv.appendChild(logbookEntryContainer)
}

function makeDeleteBtnLogbookEntry(logbookEntryContainer){
  const logbookEntryDeleteBtn = document.createElement("input")
  logbookEntryDeleteBtn.type = "button"
  logbookEntryDeleteBtn.value = "Delete Logbook"
  console.log(logbookEntryContainer.id)
  logbookEntryDeleteBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:3000/Logbook/Delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"                                  
      },
      body: JSON.stringify({_id: logbookEntryContainer.id})
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
  logbookEntryContainer.appendChild(logbookEntryDeleteBtn)
}
//MAKE THE INITIAL LIST OF LOGBOOKENTRIES
//DELETE LOGBOOKENTRY

//MAKE POP UP FOR PRESSED LOGBOOKENTRY
//++++++//
//ADD HEADERS AND DESCRIPTION
//DELETE LOGBOOKENTRY INDIVIDUAL HEADERS AND DESCRIPTIONS





//SAVE HEADERS AND DESCRIPTIONS FOR LOGBOOKENTRY