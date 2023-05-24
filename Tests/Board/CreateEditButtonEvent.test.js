
global.TextDecoder = require("text-encoding").TextDecoder;
global.TextEncoder = require("util").TextEncoder;
const { JSDOM } = require("jsdom");

global.EventSource = jest.fn();
const mockEventSource = {
  addEventListener: jest.fn(),
};
global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn(), showModal: jest.fn() };
jest.spyOn(document, "getElementById").mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn(), showModal: jest.fn() };
jest.spyOn(document, "querySelector").mockImplementation(() => elementMockQ);

const { createEditButtonEventListeners } = require("../../scripts/board");

describe("createEditButtonEventListeners", () => {
  let editButton, taskContainer, task, dialog, form, saveButton;

  beforeEach(() => {
    editButton = document.createElement("button");
    taskContainer = document.createElement("div");
    task = {
      TaskName: "Task Test",
      TaskAttributes: {
        Description: "Task description",
        Assignee: "AssigneeName",
        Priority: "High",
        StartDate: "2023-05-01",
        EndDate: "2023-05-10",
        Status: "Doing",
      },
    };
    dialog = document.createElement("dialog");
    form = document.createElement("form");
    saveButton = document.createElement("button");

    dialog.id = "editTaskModal";
    form.taskName = { value: "" };
    form.description = { value: "" };
    form.editAssignee = { value: "" };
    form.priority = { value: "" };
    form.startDate = { value: "" };
    form.endDate = { value: "" };
    form.status = { value: "" };
    saveButton.id = "saveEditButton";

    dialog.appendChild(form);
    dialog.appendChild(saveButton);

    document.body.appendChild(editButton);
    document.body.appendChild(taskContainer);
    document.body.appendChild(dialog);

    createEditButtonEventListeners(editButton, taskContainer, task);
  });

  afterEach(() => {
    editButton.remove();
    taskContainer.remove();
    dialog.remove();
  });

  test("clicking edit button opens dialog and prepopulates form with task data", () => {
    editButton.click();
    expect(dialog.open).toBe(true);
    expect(form.taskName.value).toBe(task.TaskName);
    expect(form.description.value).toBe(task.TaskAttributes.Description);
    expect(form.editAssignee.value).toBe(task.TaskAttributes.Assignee);
    expect(form.priority.value).toBe(task.TaskAttributes.Priority);
    expect(form.startDate.value).toBe(task.TaskAttributes.StartDate);
    expect(form.endDate.value).toBe(task.TaskAttributes.EndDate);
    expect(form.status.value).toBe(task.TaskAttributes.Status);
  });

  test("clicking save button calls saveData function with form and taskContainer arguments", () => {
    const saveData = jest.fn();
    global.saveData = saveData;
    saveButton.click();
    expect(saveData).toHaveBeenCalledWith(form, taskContainer);
  });
});