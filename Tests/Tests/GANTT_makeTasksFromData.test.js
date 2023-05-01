global.EventSource = jest.fn(() => ({
  addEventListener: jest.fn(),
}));
const { makeTasksFromData } = require('../../scripts/gantt');


const data = [
  {
    TaskName: "Task 1",
    TaskAttributes: {
      StartDate: "2022-01-01",
      EndDate: "2022-01-10",
      Assignee: "John",
      Status: "Doing",
      Description: "This is Task 1",
    },
  },
  {
    TaskName: "Task 2",
    TaskAttributes: {
      StartDate: "2022-01-05",
      EndDate: "2022-01-15",
      Assignee: "Jane",
      Status: "To-do",
      Description: "This is Task 2",
    },
  },
];

describe("makeTasksFromDat", () => {
  test("should return three arrays with valid RGBA color values and valid task attributes in sortedTasks array", () => {
    const result = makeTasksFromData(data);

    expect(result).toHaveProperty("barColorsTask");
    expect(result).toHaveProperty("borderColorsTask");
    expect(result).toHaveProperty("sortedTasks");

    expect(Array.isArray(result.barColorsTask)).toBeTruthy();
    expect(Array.isArray(result.borderColorsTask)).toBeTruthy();
    expect(Array.isArray(result.sortedTasks)).toBeTruthy();

    expect(result.sortedTasks.length).toEqual(data.length);

    result.sortedTasks.forEach((task) => {
      expect(task).toHaveProperty("x");
      expect(task).toHaveProperty("y");
      expect(task).toHaveProperty("assigne");
      expect(task).toHaveProperty("status");
      expect(task).toHaveProperty("label");
    });
  });
});
