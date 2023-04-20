const getTasks = require("../Tested functions/board_sorting");

describe("getTasks function", () => {
  it("should sort tasks by end date and priority correctly", () => {
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

    const sortedTasks = getTasks(tasks);
    expect(sortedTasks).toEqual(expectedTasks);
  });
});
