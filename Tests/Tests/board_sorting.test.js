global.EventSource = jest.fn(() => ({
  addEventListener: jest.fn(),
}));
const { sortTasks } = require('../../scripts/board');

describe("sortTasks function", () => {
  it("should sort tasks by end date and priority correctly", () => {
    const taskForm = {
      addEventListener: jest.fn(),
      taskName: { value: "task name" },
      description: { value: "task description" },
      assignee: { value: "assignee name" },
      priority: { value: "high" },
      startDate: { value: "2023-04-26" },
      endDate: { value: "2023-04-27" },
      status: { value: "in progress" },
    };
    
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
