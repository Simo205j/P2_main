const request = require('supertest');
const express = require('express');
const router = require('../../routes/serverLogbook');

const app = express();
app.use('/', router);

describe('logbook router', () => {
  const logbookEntry = {
    HeaderArray: ['header 1', 'header 2'],
    ParagraphArray: ['paragraph 1', 'paragraph 2'],
    CheckboxArray: [true, false]
  };

  it('should get logbook entry', async () => {
    const res = await request(app).get('/GetLogbookEntry?id=gXCulkZ4NyLGHm3Z');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({_id: 'gXCulkZ4NyLGHm3Z'})]));
  });

  it('should delete logbook entry', async () => {
    const res = await request(app).delete('/Delete').send({_id: 'jj0o7rOuFF1HlKci'});
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual("jj0o7rOuFF1HlKci");
  });

  it('should save logbook entry', async () => {
    const res = await request(app).patch('/SaveLogbookEntry').send(logbookEntry);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({status: 'PATCHED Logbook', data: logbookEntry}));
  });

  it('should send logbook entry', async () => {
    const res = await request(app).post('/SendLogbook').send(logbookEntry);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toBeDefined();
  });

});
