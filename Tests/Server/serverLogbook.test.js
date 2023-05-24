const request = require('supertest');
const express = require('express');
const router = require('../../routes/serverLogbook');

const app = express();
app.use('/', router);

describe('logbook router', () => {
  const logbookEntry = {
    HeaderArray: ['header 1', 'header 2'],
    ParagraphArray: ['paragraph 1', 'paragraph 2'],
    CheckboxArray: [true, false],
    _id: "123"
  };

  it('should send logbook entry', async () => {
    const res = await request(app).post('/SendLogbook').send(logbookEntry);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual("123");
  });

  it('should get logbook entry', async () => {
    const res = await request(app).get('/GetLogbookEntry?id=123');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({_id: '123'})]));
  });

  it('should delete logbook entry', async () => {
    const res = await request(app).delete('/Delete').send({_id: '123'});
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual("123");
  });
});
