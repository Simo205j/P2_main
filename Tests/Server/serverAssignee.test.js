const request = require('supertest');
const express = require('express');
const router = require('../../routes/serverAssignee');

const app = express();
app.use('/', router);

describe('POST /SendAssignee', () => {
  test('should return a 200 status code and the new AssigneeName', async () => {
    const newAssignee = { assigneeName: 'John',
                          _id: "123" };
    const response = await request(app)
      .post('/SendAssignee')
      .send(newAssignee);

    expect(response.status).toBe(200);
    expect(response.body.AssigneeName).toBe('John');
  });

  test('should delete assigne', async () => {
    const response = await request(app).delete("/Delete").send({
      assigneeName: 'John',
      _id: "123"
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toContain("Deleted");
  })
});

