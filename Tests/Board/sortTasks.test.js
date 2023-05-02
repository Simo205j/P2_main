global.EventSource = jest.fn()
const mockEventSource = {
  addEventListener: jest.fn(),
  }
global.EventSource.mockImplementation(() => mockEventSource);

const { sortTasks } = require('../../scripts/board');

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
