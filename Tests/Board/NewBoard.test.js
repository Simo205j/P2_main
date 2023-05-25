global.TextDecoder = require("text-encoding").TextDecoder;
global.TextEncoder = require("util").TextEncoder;
const { JSDOM } = require("jsdom");
global.EventSource = jest.fn();
const mockEventSource = {
  addEventListener: jest.fn(),
};
global.EventSource.mockImplementation(() => mockEventSource);

const {
  sortTasks,
  createFormData,
  createUpdatedData,
  createEditButton,
  createDeleteButton,
  createTaskContainer,
  handleCleanUpLists,
  handleTaskCreation
} = require("../../scripts/board");

// Set up the test suite
describe("handleCleanUpLists", () => {
  // Test the function
  test("removes all task containers from the DOM", () => {
    // Set up a mock task container element
    const taskContainer1 = document.createElement("div");
    taskContainer1.classList.add("taskContainer");
    const taskContainer2 = document.createElement("div");
    taskContainer2.classList.add("taskContainer");

    // Add the mock task container elements to the DOM
    document.body.appendChild(taskContainer1);
    document.body.appendChild(taskContainer2);

    // Call the handleCleanUpLists function
    handleCleanUpLists();

    // Check that both task container elements have been removed from the DOM
    expect(document.querySelectorAll(".taskContainer").length).toEqual(0);
  });
});

//GIVE ALL ELEMENT PROPER
describe("createTaskContainer", () => {
  it("should create a task container with the correct elements and properties", () => {
    const task = {
      _id: 1,
      TaskName: "Finish homework",
      TaskDescription: "Complete all math questions",
    };

    const taskContainer = createTaskContainer(task);
    const taskName = taskContainer.querySelector("h4");
    const descriptionDiv = taskContainer.querySelector(".descriptionDiv");
    const deleteButton = taskContainer.querySelector(".deleteButton")
    const editButton = taskContainer.querySelector(".editButton");

    expect(taskName.textContent).toBe("Finish homework");    
    expect(descriptionDiv).toBeDefined();
    expect(deleteButton).toBeDefined();
    expect(editButton).toBeDefined();
  });
});

describe("createDeleteButton", () => {
  let taskContainer, task, deleteButton;

  //SET elements before each new test
  beforeEach(() => {
    taskContainer = document.createElement("div");
    task = { id: 1, title: "Task 1", description: "Task description 1" };
    deleteButton = createDeleteButton(taskContainer, task);
  });
  
  //Clear current mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns a button element with correct content and class", () => {
    expect(deleteButton).toBeInstanceOf(HTMLButtonElement);
    expect(deleteButton.textContent).toBe("Delete");
    expect(deleteButton.classList).toContain("delete-button");
  });

  test("deleteButton is hidden by default", () => {
    expect(deleteButton.style.display).toBe("none");
  });
})

describe("createEditButton", () => {
  test("returns a button element with correct properties", () => {
    const expectedValue = "Edit Task";
    const expectedTextContent = "Edit";
    const expectedDisplayStyle = "none";
    const result = createEditButton();
    console.log(result)
    expect(result.tagName).toBe("BUTTON");
    expect(result.value).toBe(expectedValue);
    expect(result.textContent).toBe(expectedTextContent);
    expect(result.style.display).toBe(expectedDisplayStyle);
  });
});

describe("sortTasks function", () => {
  test("should sort tasks by end date and priority correctly", () => {
    const tasks = [
      { TaskAttributes: { EndDate: "2023-04-18", Priority: "High" } },
      { TaskAttributes: { EndDate: "2023-04-18", Priority: "Low" } },
      { TaskAttributes: { EndDate: "2023-04-16", Priority: "Medium" } },      
      { TaskAttributes: { EndDate: "2023-04-17", Priority: "Low" } },  
    ];
    const expectedTasks = [      
      { TaskAttributes: { EndDate: "2023-04-16", Priority: "Medium" } },      
      { TaskAttributes: { EndDate: "2023-04-17", Priority: "Low" } },      
      { TaskAttributes: { EndDate: "2023-04-18", Priority: "High" } },  
      { TaskAttributes: { EndDate: "2023-04-18", Priority: "Low" } },  
    ];

    const sortedTasks = sortTasks(tasks);
    expect(sortedTasks).toEqual(expectedTasks);
  });
});

test("createUpdatedData returns expected data with mock form object", () => {
  const mockedContainer = document.createElement("div");
  mockedContainer.id = "123";

  const form = {
    taskName: { value: "Task 1" },
    description: { value: "This is a task" },
    editAssignee: { value: "Jane Doe" },
    priority: { value: "High" },
    startDate: { value: "2022-01-01" },
    endDate: { value: "2022-01-31" },
    status: { value: "Open" },
  };

  const expectedUpdatedData = {
    TaskName: "Task 1",
    TaskAttributes: {
      Description: "This is a task",
      Assignee: "Jane Doe",
      Priority: "High",
      StartDate: "2022-01-01",
      EndDate: "2022-01-31",
      Status: "Open",
    },
    id: "123",
  };

  const updatedData = createUpdatedData(form, mockedContainer);

  expect(updatedData).toEqual(expectedUpdatedData);
});

test("createFormData returns expected data with mock taskForm object", () => {
  const taskForm = {
    taskName: { value: "Task 1" },
    description: { value: "This is a task" },
    assignee: { value: "John Doe" },
    priority: { value: "High" },
    startDate: { value: "2022-01-01" },
    endDate: { value: "2022-01-31" },
    status: { value: "Open" },
  };

  const expectedFormData = {
    TaskName: "Task 1",
    TaskAttributes: {
      Description: "This is a task",
      Assignee: "John Doe",
      Priority: "High",
      StartDate: "2022-01-01",
      EndDate: "2022-01-31",
      Status: "Open",
    },
  };

  const formData = createFormData(taskForm);
  expect(formData).toEqual(expectedFormData);
});

describe("handleTaskCreation", () => {
  test("handleTaskCreation adds task container to target list and makes it draggable if not overdue", () => {
    const targetList = document.createElement("div");
    const task = {
      TaskAttributes: {
        Status: "Done",
      },
    };
    handleTaskCreation(task, targetList);
    expect(targetList.children.length).toBe(1);
  });
  test("handleTaskCreation adds task container to target list and makes it draggable if not overdue", () => {
    const targetList = document.createElement("div");
    const task = {
      TaskAttributes: {
        Status: "Overdue",
      },
    };
    handleTaskCreation(task, targetList);
    expect(targetList.children.length).toBe(1);

    if (task.TaskAttributes.Status === "Overdue") {
      expect(targetList.children[0].classList).not.toContain("draggable");
    }
  });
});

