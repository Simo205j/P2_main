const assigneesSource = new EventSource("http://localhost:3000/events/Assignee");
const assigneeForm = document.getElementById("assigneeForm")
const assigneeFormButton = document.getElementById("assigneeButton")



assigneeFormButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const data = {
      assigneeName: assigneeForm.value
    };
    try {
      const response = await fetch("http://localhost:3000/SendAssignee", {
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
  });
  let lastAssigneeMessage = null;
  
    assigneesSource.addEventListener("message", function getAssignees(event) {
      const assigneebox = document.getElementById("assignee")
      if (event.target === assigneesSource && !assigneebox) {
        const assignees = JSON.parse(event.data);
      if (assignees === lastAssigneeMessage) {
        return;
      }
     /* if (document.getElementById("assignee")) {
        document.getElementById("assignee").remove();
      }
      */
      const insertAfterThis = document.querySelector("label[for='assignee']");
  
      const selectAssigneeLabel = document.createElement("label");
      const selectAssignee = document.createElement("select");
      
      assignees.forEach((assign) => {
          checkAttribute = assign.hasOwnProperty('assigneeName')
          console.log(assign.TaskName)
          console.log(checkAttribute)
          console.log(assign.assigneeName)
          if (checkAttribute){
            const option = document.createElement("option");
            option.textContent = assign.assigneeName;
            option.value = assign.assigneeName;
            console.log(option)
            selectAssignee.appendChild(option)   
          }
          else {
            selectAssignee.remove()
            selectAssigneeLabel.remove()
            return;
          } 
      });
  
      selectAssigneeLabel.textContent = "Assignee";
      selectAssignee.id = "assignee";
      selectAssignee.required = true;
      selectAssignee.name = "assignee";
  
      insertAfterThis.insertAdjacentElement("afterend", selectAssignee);
      lastAssigneeMessage = assignees;
      }
    else {
  
      return
    }
  })