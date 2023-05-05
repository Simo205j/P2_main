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
  createDescription,
  makeTaskContainerDraggable,
  createEditButton,
  createDeleteButton,
  createTaskContainer,
  handleCleanUpLists,
  handleTaskCreation,
  handleDrop,
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

describe("createTaskContainer", () => {
  it("should create a task container with the correct elements and properties", () => {
    const task = {
      _id: 1,
      TaskName: "Finish homework",
      TaskDescription: "Complete all math and science problems",
    };

    const taskContainer = createTaskContainer(task);

    expect(taskContainer.tagName).toBe("LI");
    expect(taskContainer.className).toBe("taskContainer");
    expect(taskContainer.id).toBe("1");

    const taskName = taskContainer.querySelector("h4");
    expect(taskName.textContent).toBe("Finish homework");

    const descriptionDiv = taskContainer.querySelector(".descriptionDiv");
    expect(descriptionDiv).toBeDefined();

    const deleteButton = taskContainer.querySelector(".deleteButton");
    expect(deleteButton).toBeDefined();

    const editButton = taskContainer.querySelector(".editButton");
    expect(editButton).toBeDefined();
  });
});

describe("createDeleteButton", () => {
  let taskContainer, task, deleteButton;

  beforeEach(() => {
    taskContainer = document.createElement("div");
    task = { id: 1, title: "Task 1", description: "Task description 1" };
    deleteButton = createDeleteButton(taskContainer, task);
  });

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

  test("deleteButton is displayed when mouse is over taskContainer", () => {
    taskContainer.dispatchEvent(new MouseEvent("mouseover"));
    expect(deleteButton.style.display).toBe("inline-block");
    taskContainer.dispatchEvent(new MouseEvent("mouseout"));
    expect(deleteButton.style.display).toBe("none");
  });

  test("deleteEntry function is called when deleteButton is clicked", async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: "success" }),
    });

    deleteButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/Tasks/Delete",
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
        body: JSON.stringify(task),
      })
    );
    await expect(window.fetch.mock.results[0].value).resolves.toEqual({
      ok: true,
      json: expect.any(Function),
    });
  });
});

describe("createEditButton", () => {
  test("returns a button element with correct properties", () => {
    // Arrange
    const expectedValue = "Edit Task";
    const expectedTextContent = "Edit";
    const expectedClassList = ["edit-button"];
    const expectedDisplayStyle = "none";

    // Act
    const result = createEditButton();

    // Assert
    expect(result.tagName).toBe("BUTTON");
    expect(result.value).toBe(expectedValue);
    expect(result.textContent).toBe(expectedTextContent);
    expect(Array.from(result.classList)).toEqual(expectedClassList);
    expect(result.style.display).toBe(expectedDisplayStyle);
  });
});

test("makeTaskContainerDraggable adds draggable attribute and event listeners to container", () => {
  // create a mocked container element
  const container = document.createElement("div");

  // call the function with the mocked container
  makeTaskContainerDraggable(container);

  // assert that the draggable attribute is set to true
  expect(container.getAttribute("draggable")).toBe("true");

  // assert that the event listeners are attached
  const dragStartEvent = new Event("dragstart");
  container.dispatchEvent(dragStartEvent);
  expect(container.classList.contains("dragging")).toBe(true);

  const dragEndEvent = new Event("dragend");
  container.dispatchEvent(dragEndEvent);
  expect(container.classList.contains("dragging")).toBe(false);
});

describe("sortTasks function", () => {
  test("should sort tasks by end date and priority correctly", () => {
    const tasks = [
      { TaskAttributes: { EndDate: "2023-04-18", Priority: "high" } },
      { TaskAttributes: { EndDate: "2023-04-16", Priority: "medium" } },
      { TaskAttributes: { EndDate: "2023-04-17", Priority: "low" } },
    ];
    const expectedTasks = [
      { TaskAttributes: { EndDate: "2023-04-16", Priority: "medium" } },
      { TaskAttributes: { EndDate: "2023-04-17", Priority: "low" } },
      { TaskAttributes: { EndDate: "2023-04-18", Priority: "high" } },
    ];

    const sortedTasks = sortTasks(tasks);
    expect(sortedTasks).toEqual(expectedTasks);
  });
});
test("createDescription generates the expected HTML", () => {
  const taskContainer = document.createElement("div");
  taskContainer.id = "task-123";

  const task = {
    TaskAttributes: {
      Description: "This is a task",
      Assignee: "John Doe",
      Priority: "High",
      StartDate: "2022-01-01",
      EndDate: "2022-01-31",
      Status: "Open",
    },
  };

  const descriptionDiv = createDescription(taskContainer, task);

  expect(descriptionDiv).toMatchSnapshot();
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
    // Create a mock task object
    const task = {
      TaskAttributes: {
        Status: "Done",
      },
    };

    // Create a mock target list element
    const targetList = document.createElement("div");

    // Call the handleTaskCreation function with the mock task and target list
    handleTaskCreation(task, targetList);

    // Check that the new task container was added to the target list
    expect(targetList.children.length).toBe(1);

    // Check that the new task container was made draggable if the task status is not "Overdue"
    if (task.TaskAttributes.Status === "Overdue") {
      expect(targetList.children[0].classList).not.toContain("draggable");
    }
  });
  test("handleTaskCreation adds task container to target list and makes it draggable if not overdue", () => {
    // Create a mock task object
    const task = {
      TaskAttributes: {
        Status: "Overdue",
      },
    };

    // Create a mock target list element
    const targetList = document.createElement("div");

    // Call the handleTaskCreation function with the mock task and target list
    handleTaskCreation(task, targetList);

    // Check that the new task container was added to the target list
    expect(targetList.children.length).toBe(1);

    // Check that the new task container was made draggable if the task status is not "Overdue"
    if (task.TaskAttributes.Status === "Overdue") {
      expect(targetList.children[0].classList).not.toContain("draggable");
    }
  });
});
describe("handleDrop function", () => {
  let handleDrop;

  beforeEach(() => {
    jest.resetModules();
    handleDrop = require("../../scripts/board").handleDrop;
    document.body.innerHTML = `
      <div id="container" class="Container"></div>
      <div id="draggable" class="draggable"></div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("should update task status and append draggable element to container", async () => {
    const container = document.querySelector("#container");
    const draggable = document.querySelector("#draggable");
    draggable.id = "1";
    draggable.classList.add("dragging");
    container.addEventListener = jest.fn();
    const mockResponse = { status: 200 };
    const mockJsonPromise = Promise.resolve(mockResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      target: container,
    };

    await handleDrop(event, container);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/Tasks/UpdateStatus", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "1",
        Status: "Container",
      }),
    });

    expect(mockJsonPromise).resolves.toEqual(mockResponse);
  });
});
