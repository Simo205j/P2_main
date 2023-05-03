const logbookSource = new EventSource("http://localhost:3000/Logbook/events");

const submitLogbook = document.getElementById("newLogbookBtn");
const logbookListDiv = document.getElementById("logbookList");
const closeLogbookBtn = document.getElementById("closeLogbookForm");
const displayLogbookList = document.querySelector('div[class="logbookContainer Container"]');
const displayLogbookContainerDiv = document.querySelector('div[class="showLogbookEntry Container"]');
const submitLogbookHAndPEntry = document.querySelector('input[type="Submit"]');
const logbookEntryHAndPDiv = document.querySelector('div[id="LogbookEntryHAndP"]');
const formLogbookEntryHAndP = document.querySelector("form");

logbookSource.addEventListener("message", (event) => {
  const logbooks = JSON.parse(event.data);
  console.log(logbooks);
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
    makeLogbookList(logbookEntry);
  });
});

submitLogbook.addEventListener("click", async (event) => {
  try {
    fetch("http://localhost:3000/Logbook/SendLogbook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date: new Date().toISOString().substr(0, 10) }),
    });
  } catch (error) {
    console.error(error);
  }
});

submitLogbookHAndPEntry.addEventListener("click", (event) => {
  event.preventDefault();

  const logbookEntry = createLogbookEntry(
    formLogbookEntryHAndP.formHeader.value,
    formLogbookEntryHAndP.formParagraph.value
  );
  const tempContainer = document.querySelector('div[id="temp"]');
  const insertBeforeThis = tempContainer.querySelector('input[value="Save logbook"]');
  tempContainer.insertBefore(logbookEntry, insertBeforeThis);
  fixContainerIndexes();
});

function createLogbookEntry(headerText, paragraphText) {
  const div = document.createElement("div");
  div.className = "index";

  const headerDiv = document.createElement("div");
  const checkbox = createCheckbox();
  const header = createHeader(headerText);
  const paragraph = createParagraph(paragraphText);
  const deleteBtn = createDeleteButton(div);

  tempBoxEventlistener(checkbox, div.id);
  makeEditable(header);
  makeEditable(paragraph)

  headerDiv.appendChild(checkbox);
  headerDiv.appendChild(header);
  headerDiv.appendChild(deleteBtn);
  div.appendChild(headerDiv);
  div.appendChild(paragraph);

  logbookCheckboxArray.push(checkbox.checked);
  logbookHeaderArray.push(headerText);
  logbookParagraphArray.push(paragraphText);

  return div;
}

function createCheckbox() {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  return checkbox;
}

function createHeader(text) {
  const header = document.createElement("h3");
  header.textContent = text;
  return header;
}

function createParagraph(text) {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  return paragraph;
}

function createDeleteButton(container) {
  const deleteBtn = document.createElement("input");
  deleteBtn.value = "Delete";
  deleteBtn.type = "button";
  deleteBtn.addEventListener("click", () => {
    container.remove();
    fixContainerIndexes();
  });
  return deleteBtn;
}

//ADD NEW LOGBOOKENTRY
function tempBoxEventlistener(tempCheckbox, index) {
  tempCheckbox.addEventListener("click", (event) => {
    event.stopPropagation();
    logbookCheckboxArray[index] = tempCheckbox.checked;
  });
}
function deleteBtnTempContainer(tempDeleteBtn, container) {
  tempDeleteBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const index = container.id;
    console.log(index);
    logbookCheckboxArray.splice(index, 1);
    logbookHeaderArray.splice(index, 1);
    logbookParagraphArray.splice(index, 1);
    container.remove();
    fixContainerIndexes();
  });
}

function makeEditable(element) {
  element.addEventListener("click", () => {
    createTextArea(element);
  });
}

function createTextArea(element) {
  const textarea = document.createElement("textarea");
  textarea.value = element.textContent;
  element.replaceWith(textarea);

  textarea.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
      element.textContent = textarea.value;
      textarea.replaceWith(element);
    }
  });
  textarea.addEventListener("dblclick", (event) => {
    element.textContent = textarea.value;
    textarea.replaceWith(element);
  });
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

function makeDeleteBtnLogbookEntry(logbookEntryContainer) {
  const logbookEntryDeleteBtn = document.createElement("input");
  logbookEntryDeleteBtn.type = "button";
  logbookEntryDeleteBtn.value = "Delete";
  logbookEntryDeleteBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const response = await fetch("http://localhost:3000/Logbook/Delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: logbookEntryContainer.id }),
    });
    try {
      const data = await response.json();
      console.log(data);
      logbookEntryContainer.remove();
    } catch (error) {
      console.error(error);
    }
  });
  logbookEntryContainer.appendChild(logbookEntryDeleteBtn);
}

let logbookCheckboxArray = [];
let logbookHeaderArray = [];
let logbookParagraphArray = [];

function makeLogbookEntryClickable(logbookEntryContainer) {
  logbookEntryContainer.addEventListener("click", async (event) => {
    event.preventDefault();
    const logbookId = logbookEntryContainer.id;
    const response = await fetch(`http://localhost:3000/Logbook/GetLogbookEntry?id=${logbookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    try {
      const data = await response.json();

      resetLogbookData(data);
      makeLogbookContainerDivContent(data, logbookEntryContainer);

      displayLogbookContainerDiv.id = "show";
      displayLogbookList.id = "hidden";
      closeLogbookBtn.addEventListener("click", () => {
        displayLogbookContainerDiv.id = "hidden";
        displayLogbookList.id = "show";
      });
    } catch (error) {
      console.error(error);
    }
  });
}
function resetLogbookData(data) {
  logbookHeaderArray = [];
  logbookParagraphArray = [];
  logbookCheckboxArray = [];

  if (data[0].hasOwnProperty("HeaderArray")) {
    data[0].HeaderArray.forEach((hAndPArray, index) => {
      logbookCheckboxArray.push(data[0].CheckboxArray[index]);
      logbookHeaderArray.push(data[0].HeaderArray[index]);
      logbookParagraphArray.push(data[0].ParagraphArray[index]);
    });
  }
}
function fixContainerIndexes() {
  const indexDivs = document.querySelectorAll('div[class="index"]');
  indexDivs.forEach((div, index) => {
    div.id = index;
  });
}
function makeLogbookContainerDivContent(data, logbookEntryContainer) {
  if (document.getElementById("temp")) {
    lastTemp = document.getElementById("temp");
    lastTemp.remove();
  }

  const tempDiv = document.createElement("div");
  const tempLogbookDate = document.createElement("h2");

  tempDiv.className = data[0]._id;
  tempDiv.id = "temp";
  tempLogbookDate.textContent = "" + data[0].date;

  tempDiv.appendChild(tempLogbookDate);

  if (data[0].hasOwnProperty("HeaderArray")) {
    data[0].HeaderArray.forEach((header, index) => {
      const tempContainerDiv = document.createElement("div");
      const tempHeaderContainer = document.createElement("div");
      const tempCheckbox = document.createElement("input");
      const tempHeader = document.createElement("h3");
      const tempDeleteBtn = document.createElement("input");
      const tempParagraph = document.createElement("p");

      tempContainerDiv.className = "index";
      tempContainerDiv.id = index;
      tempDeleteBtn.type = "button";
      tempDeleteBtn.value = "Delete";
      tempCheckbox.type = "checkbox";

      tempBoxEventlistener(tempCheckbox, tempContainerDiv.id);
      deleteBtnTempContainer(tempDeleteBtn, tempContainerDiv);

      if (data[0].CheckboxArray[index] === true) {
        tempCheckbox.checked = true;
      }
      makeEditAble(tempHeader, tempParagraph, data, index);

      tempHeaderContainer.appendChild(tempCheckbox);
      tempHeaderContainer.appendChild(tempHeader);
      tempHeaderContainer.appendChild(tempDeleteBtn);
      tempContainerDiv.appendChild(tempHeaderContainer);
      tempContainerDiv.appendChild(tempParagraph);
      tempDiv.appendChild(tempContainerDiv);
    });
  }
  makeLogbookContainerSaveBtn(logbookEntryContainer, tempDiv);
  displayLogbookContainerDiv.appendChild(tempDiv);
}

function makeEditAble(tempHeader, tempParagraph, data, index) {
  tempHeader.textContent = data[0].HeaderArray[index];

  tempHeader.addEventListener("click", () => {
    const tempHeaderInput = document.createElement("textarea");
    tempHeaderInput.value = tempHeader.textContent;
    tempHeader.replaceWith(tempHeaderInput);

    tempHeaderInput.addEventListener("keypress", (event) => {
      if (event.key == "Enter") {
        tempHeader.textContent = tempHeaderInput.value;
        tempHeaderInput.replaceWith(tempHeader);
        logbookHeaderArray[index] = tempHeader.textContent;
      }
    });
    tempHeaderInput.addEventListener("dblclick", (event) => {
      tempHeader.textContent = tempHeaderInput.value;
      tempHeaderInput.replaceWith(tempHeader);
      logbookHeaderArray[index] = tempHeader.textContent;
    });
  });
  
  tempParagraph.textContent = data[0].ParagraphArray[index];
  tempParagraph.addEventListener("click", () => {
    const tempParagraphInput = document.createElement("textarea");
    tempParagraphInput.value = tempParagraph.textContent;
    tempParagraph.replaceWith(tempParagraphInput);

    tempParagraphInput.addEventListener("keypress", (event) => {
      if (event.key == "Enter") {
        tempParagraph.textContent = tempParagraphInput.value;
        tempParagraphInput.replaceWith(tempParagraph);
        logbookParagraphArray[index] = tempParagraph.textContent;
      }
    });
    tempParagraphInput.addEventListener("dblclick", (event) => {
      tempParagraph.textContent = tempParagraphInput.value;
      tempParagraphInput.replaceWith(tempParagraph);
      logbookParagraphArray[index] = tempParagraph.textContent;
    });
  });
}

function makeLogbookContainerSaveBtn(logbookEntryContainer, tempDiv) {
  const saveEntries = document.createElement("input");
  saveEntries.type = "button";
  saveEntries.value = "Save logbook";

  saveEntries.addEventListener("click", async (event) => {
    event.preventDefault();
    const logbookData = {
      _id: logbookEntryContainer.id,
      HeaderArray: logbookHeaderArray,
      ParagraphArray: logbookParagraphArray,
      CheckboxArray: logbookCheckboxArray,
    };
    console.log(logbookData);
    const response = await fetch("http://localhost:3000/Logbook/SaveLogbookEntry", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logbookData),
    });
    try {
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  });
  tempDiv.appendChild(saveEntries);
}
module.exports = {createLogbookEntry, makeDeleteBtnLogbookEntry, resetLogbookData, 
  makeLogbookContainerDivContent, fixContainerIndexes, makeEditable, makeLogbookContainerSaveBtn, createCheckbox,
  createHeader, createParagraph, createDeleteButton, makeLogbookList};