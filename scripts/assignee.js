const assigneesSource = new EventSource("http://localhost:3000/Assignee/events");
const assigneeForm = document.getElementById("assigneeForm")
const assigneeFormButton = document.getElementById("assigneeButton")

assigneeFormButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const data = {
      assigneeName: assigneeForm.value
    };
    try {
      const response = await fetch("http://localhost:3000/Assignee/SendAssignee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const assigneeresponseData = await response.json();
      console.log(assigneeresponseData.status, assigneeresponseData);
    } catch (error) {
      console.error(error);
    }
    location.href = "/Board"
  });
  let lastAssigneeMessage = null;
  
    assigneesSource.addEventListener("message", function getAssignees(event) {
      const assigneebox = document.getElementById("assignee")
      if (event.target === assigneesSource && !assigneebox) {
        const assignees = JSON.parse(event.data);
      if (assignees === lastAssigneeMessage) {
        return;
      }
      const insertAfterThisEdit = document.querySelector("label[for='editAssignee']");
      const insertAfterThis = document.querySelector("label[for='assignee']");
      const selectAssigneeLabelEdit = document.createElement("label");
      const selectAssigneeEdit = document.createElement("select");
      const selectAssigneeLabel = document.createElement("label");
      const selectAssignee = document.createElement("select");
      
      assignees.forEach((assign) => {
          checkAttribute = assign.hasOwnProperty('assigneeName')
          if (checkAttribute){
            const optionEdit = document.createElement("option");
            const option = document.createElement("option");
            optionEdit.textContent = assign.assigneeName;
            optionEdit.value = assign.assigneeName
            option.textContent = assign.assigneeName;
            option.value = assign.assigneeName
            selectAssignee.appendChild(option) 
            selectAssigneeEdit.appendChild(optionEdit)   
          }
          else {
            selectAssignee.remove()
            selectAssigneeLabel.remove()
            selectAssigneeEdit.remove()
            return;
          } 
      });
  
      selectAssigneeLabel.textContent = "Assignee";
      selectAssignee.id = "assignee";
      selectAssignee.required = true;
      selectAssignee.name = "assignee";

      selectAssigneeEdit.id = "editAssignee";
      selectAssigneeEdit.required = true;
      selectAssigneeEdit.id = "editAssignee";
  
      insertAfterThis.insertAdjacentElement("afterend", selectAssignee);
      insertAfterThisEdit.insertAdjacentElement("afterend", selectAssigneeEdit)
      lastAssigneeMessage = assignees;
      }
    else {
  
      return
    }
  })