const request = require('supertest');
const express = require('express');
const router = require('../../routes/serverAssignee');

const app = express();
app.use('/', router);

/*describe('GET /events', () => {
    test('should return a 200 status code and SSE headers', async () => {
        const response = await request(app).get('/events');
      
        expect(response.status).toBe(200);
        expect(response.header['content-type']).toBe('text/event-stream');
        expect(response.header['connection']).toBe('keep-alive');
        expect(response.header['cache-control']).toBe('no-cache');
      }, 10000); // Increase timeout to 10 seconds
      
});
*/
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
});
