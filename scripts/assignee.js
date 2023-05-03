const assigneesSource = new EventSource("http://localhost:3000/Assignee/events");

const assigneeFormButton = document.getElementById("assigneeButton");
const assigneebox = document.getElementById("assignee");

assigneeFormButton.addEventListener("click", addNewAssignee);
async function addNewAssignee(event){
  const assigneeForm = document.getElementById("assigneeForm");  
  event.preventDefault();
  const data = {
    assigneeName: assigneeForm.value,
  }
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
  } 
  catch (error) {
    console.error(error);
  }
};


let lastAssigneeMessage = null;
assigneesSource.addEventListener("message", function getAssignees(event) {
  if (event.target === assigneesSource && !assigneebox) {
    const assignees = JSON.parse(event.data);
    if (assignees === lastAssigneeMessage) {
      return;
    }
    makeAssigneeSelect(assignees)
  }
});

function makeAssigneeSelect(assignees){
  if(document.querySelector('select[id="assignee"]')) {
    document.querySelector('select[id="assignee"]').remove()
  }
  const insertAfterThisEdit = document.querySelector("label[for='editAssignee']");
  const insertAfterThis = document.querySelector("label[for='assignee']");
  const selectAssigneeEdit = document.createElement("select");
  const selectAssigneeLabel = document.createElement("label");
  const selectAssignee = document.createElement("select");

  selectAssigneeLabel.textContent = "Assignee";
  selectAssignee.id = "assignee";
  selectAssignee.required = true;
  selectAssignee.name = "assignee";

  selectAssigneeEdit.id = "editAssignee";
  selectAssigneeEdit.required = true;
  selectAssigneeEdit.id = "editAssignee";

  assignees.forEach((assign) => {
    checkAttribute = assign.hasOwnProperty("assigneeName");
    if (checkAttribute) {
      const optionEdit = document.createElement("option");
      const option = document.createElement("option");
      optionEdit.textContent = assign.assigneeName;
      optionEdit.value = assign.assigneeName;
      option.textContent = assign.assigneeName;
      option.value = assign.assigneeName;
      selectAssignee.appendChild(option);
      selectAssigneeEdit.appendChild(optionEdit);
    } 
    else {
      selectAssignee.remove();
      selectAssigneeLabel.remove();
      selectAssigneeEdit.remove();
      return;
    }
  });

  insertAfterThis.insertAdjacentElement("afterend", selectAssignee);
  insertAfterThisEdit.insertAdjacentElement("afterend", selectAssigneeEdit);
  lastAssigneeMessage = assignees;
}
module.exports = { addNewAssignee, makeAssigneeSelect };
