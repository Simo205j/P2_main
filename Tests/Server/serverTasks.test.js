const request = require("supertest");
const express = require("express");
const app = express();

const router = require("../../routes/serverTasks");

app.use("/", router);

describe("Test the task management API", () => {
  test("It should add a new task to the database", async () => {
    const response = await request(app).post("/SendTask").send({
      TaskName: "Test",
      TaskAttributes: {
        Description: "A new task added to the database",
        Assignee: "John",
        Priority: "Low",
        StartDate: "2023-05-24",
        EndDate: "2023-07-19",
        Status: "To-do",
      },
      _id: "123",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.TaskName).toBe("Test");
  });

  test("It should update the status of a task", async () => {
    const response = await request(app)
      .patch("/UpdateStatus")
      .send({ id: "123", Status: "Doing" });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("PATCHED TASK");
    expect(response.body.task.id).toBe("123");
    expect(response.body.task.Status).toBe("In Progress");
  });

  test("It should delete a task from the database", async () => {
    const response = await request(app).delete("/Delete").send({
      TaskName: "Test",
      _id: "123",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toContain("Deleted");
  });
});
