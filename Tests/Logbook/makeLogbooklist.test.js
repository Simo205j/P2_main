global.EventSource = jest.fn()

const mockEventSource = {
  addEventListener: jest.fn(),
  }


global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn()};
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn()};
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);

const { makeLogbookList } = require('../../scripts/logbook');

describe('makeLogbookList', () => {
    let logbookListDiv;
  
    beforeEach(() => {
      // Create a new logbookListDiv before each test
      logbookListDiv = document.createElement('div');
      document.body.appendChild(logbookListDiv);
    });
  
    afterEach(() => {
      // Remove the logbookListDiv after each test
      document.body.removeChild(logbookListDiv);
      logbookListDiv = null;
    });
  
    it('should create a new div element with a p element as a child with the date text and the id of the logbook entry, and append a delete button input element', () => {
      const logbookEntry = { _id: '12345', date: '2023-05-03T00:00:00.000Z' };
      makeLogbookList(logbookEntry, logbookListDiv);
      expect(logbookListDiv.children.length).toBe(1);
    const logbookEntryDiv = logbookListDiv.children[0];
    expect(logbookEntryDiv.tagName).toBe('DIV');
    expect(logbookEntryDiv.children.length).toBe(2);
    const logbookEntryDate = logbookEntryDiv.children[0];
    expect(logbookEntryDate.tagName).toBe('P');
    expect(logbookEntryDate.textContent).toBe('Logbook: 2023-05-03T00:00:00.000Z');
    const deleteBtn = logbookEntryDiv.children[1];
    expect(deleteBtn.tagName).toBe('INPUT');
    expect(deleteBtn.type).toBe('button');
    expect(deleteBtn.value).toBe('Delete');
  });
});
