const request = require("supertest");
const express = require("express");
const app = express();

const router = require("../../routes/serverTasks");

app.use("/", router);

describe("Test the task management API", () => {
  test("It should add a new task to the database", async () => {
    const response = await request(app).post("/SendTask").send({
      TaskName: "New Task",
      TaskAttributes: {
        Status: "Pending",
        Description: "A new task added to the database",
      },
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.TaskName).toBe("New Task");
  });

  test("It should update the status of a task", async () => {
    const response = await request(app)
      .patch("/UpdateStatus")
      .send({ id: "123", Status: "In Progress" });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("PATCHED TASK");
    expect(response.body.task.id).toBe("123");
    expect(response.body.task.Status).toBe("In Progress");
  });

  test("It should update the name and attributes of a task", async () => {
    const response = await request(app).patch("/Edit").send({
      id: "123",
      TaskName: "Updated Task",
      TaskAttributes: { Status: "Completed", Description: "An updated task" },
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.Updated).toBeDefined();
  });

  test("It should delete a task from the database", async () => {
    const response = await request(app).delete("/Delete").send({
      TaskName: "New Task",
      _id: "123",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toContain("Deleted");
  });
});
