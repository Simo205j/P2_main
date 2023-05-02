global.EventSource = jest.fn()
const mockEventSource = {
  addEventListener: jest.fn(),
  }
global.EventSource.mockImplementation(() => mockEventSource);

const { sortData } = require('../../scripts/gantt');

describe("sortData", () => {
  const customStatusValues = {
    "Done": 1,
    "To-do": 2,
    "Doing": 3,
    "Overdue": 4,
  };
  const tasks = [
    { TaskAttributes: { StartDate: "2023-04-18", Status: "Done" } },
    { TaskAttributes: { StartDate: "2023-04-17", Status: "Doing" } },
    { TaskAttributes: { StartDate: "2023-04-18", Status: "To-do" } },
    { TaskAttributes: { StartDate: "2023-04-19", Status: "Overdue" } },
  ];

  test("should sort tasks correctly based on start date and status", () => {
    const sortedTasks = sortData(tasks);
    for (let i = 0; i < sortedTasks.length - 1; i++) {
      const startDateDiff =
        new Date(sortedTasks[i].TaskAttributes.StartDate).getTime() -
        new Date(sortedTasks[i + 1].TaskAttributes.StartDate).getTime();
      expect(startDateDiff).toBeLessThanOrEqual(0);
    }

    for (let i = 0; i < sortedTasks.length - 1; i++) {
      if (sortedTasks[i].TaskAttributes.StartDate === sortedTasks[i + 1].TaskAttributes.StartDate) {
        const statusA = customStatusValues[sortedTasks[i].TaskAttributes.Status];
        const statusB = customStatusValues[sortedTasks[i + 1].TaskAttributes.Status];
        expect(statusA).toBeGreaterThanOrEqual(statusB);
      }
    }
  });
});
