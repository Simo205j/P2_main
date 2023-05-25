const assigneesSource = new EventSource("http://localhost:3000/Assignee/events");
const assigneeDeleteButton = document.getElementById("deleteAssigneeButton")
const assigneeFormButton = document.getElementById("assigneeButton");
const assigneebox = document.getElementById("assignee");
const assigneeForm = document.getElementById("assigneeForm");


assigneeForm.addEventListener("click", () => {
  assigneeForm.value = ""
})
assigneeForm.addEventListener("keypress", (event) => {
  if(event.key === "Enter") {
    addNewAssignee(event)
  }

})
assigneeFormButton.addEventListener("click", addNewAssignee);
async function addNewAssignee(event) {

  event.preventDefault();
  const data = {
    assigneeName: assigneeForm.value,
  };
  if(assigneeForm.value != "" && assigneeForm.value != "Please Enter Some Name"){
    assigneeForm.value = ""
    try {
      const response = await fetch("http://localhost:3000/Assignee/SendAssignee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const assigneeresponseData = await response.json();
      console.log(assigneeresponseData.status, assigneeresponseData);
    } catch (error) {
      console.error(error);
    }
  }
  else {
    assigneeForm.value = "Please Enter Some Name"
  }
}

assigneeDeleteButton.addEventListener("click", (event) => { 
  const findThis = document.getElementById("deleteAssignee")
  const deleteThis = document.querySelector(`option[value="${findThis.value}"]`)
  console.log(deleteThis)
  deleteAssignee(event, deleteThis)
})

async function deleteAssignee(event, deleteThis)
{
  event.preventDefault()
  const data = {
    _id: deleteThis.value,
    name: deleteThis.label
  }
  console.log(data)
  const response = await fetch("http://localhost:3000/Assignee/Delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  try {
    const data = await response.json()
    console.log(data)
  }
  catch(err){
    console.error(err)
  }
}

let lastAssigneeMessage = null;
assigneesSource.addEventListener("message", function getAssignees(event) {
  if (event.target === assigneesSource && !assigneebox) {
    const assignees = JSON.parse(event.data);
    if (assignees === lastAssigneeMessage) {
      return;
    }
    makeAssigneeSelect(assignees);
  }
});

function makeAssigneeSelect(assignees) {
  if (document.querySelector('select[id="assignee"]')) {
    document.querySelector('select[id="assignee"]').remove();
    document.querySelector('select[id="editAssignee"]').remove();
    document.querySelector('select[id="deleteAssignee"]').remove();
    
  }
  const insertAfterThisEdit = document.querySelector("label[for='editAssignee']");
  const insertAfterThis = document.querySelector("label[for='assignee']");
  const insertAfterThisDelete = document.getElementById("assigneeButton")
  const selectAssigneeEdit = document.createElement("select");
  const selectAssigneeLabel = document.createElement("label");
  const selectAssignee = document.createElement("select");
  const deleteSelect = document.createElement("select")

  selectAssigneeLabel.textContent = "Assignee";
  selectAssignee.id = "assignee";
  selectAssignee.required = true;
  selectAssignee.name = "assignee";

  selectAssigneeEdit.id = "editAssignee";
  selectAssigneeEdit.required = true;
  selectAssigneeEdit.id = "editAssignee";

  deleteSelect.id = "deleteAssignee"

  assignees.forEach((assign) => {
    const checkAttribute = assign.hasOwnProperty("assigneeName");
    if (checkAttribute) {
      const deleteOption = document.createElement("option")
      const optionEdit = document.createElement("option");
      const option = document.createElement("option");

      deleteOption.textContent = assign.assigneeName;
      deleteOption.label = assign.assigneeName;
      deleteOption.value = assign._id
      optionEdit.textContent = assign.assigneeName;
      optionEdit.value = assign.assigneeName;
      option.textContent = assign.assigneeName;
      option.value = assign.assigneeName;
      selectAssignee.appendChild(option);
      selectAssigneeEdit.appendChild(optionEdit);
      deleteSelect.appendChild(deleteOption)

    } else {
      selectAssignee.remove();
      selectAssigneeLabel.remove();
      selectAssigneeEdit.remove();
      return;
    }
  });

  insertAfterThis.insertAdjacentElement("afterend", selectAssignee);
  insertAfterThisEdit.insertAdjacentElement("afterend", selectAssigneeEdit);
  insertAfterThisDelete.insertAdjacentElement("afterend", deleteSelect)
  lastAssigneeMessage = assignees;
}
module.exports = { addNewAssignee, makeAssigneeSelect };
