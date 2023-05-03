global.EventSource = jest.fn()

const mockEventSource = {
  addEventListener: jest.fn(),
  }


global.EventSource.mockImplementation(() => mockEventSource);

const elementMock = { addEventListener: jest.fn() };
jest.spyOn(document, 'getElementById').mockImplementation(() => elementMock);
const elementMockQ = { addEventListener: jest.fn() };
jest.spyOn(document, 'querySelector').mockImplementation(() => elementMockQ);

const { makeDeleteBtnLogbookEntry } = require('../../scripts/logbook')

describe('makeDeleteBtnLogbookEntry', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('adds a delete button to the given logbook entry container', () => {
    // Set up test data
    const logbookEntryContainer = document.createElement('div');
    logbookEntryContainer.id = 'example-id';

    // Call the function being tested
    makeDeleteBtnLogbookEntry(logbookEntryContainer);

    // Check that the delete button was added with the correct properties and behavior
    const deleteBtn = logbookEntryContainer.querySelector('input[type="button"]');
    expect(deleteBtn).not.toBeNull();
    expect(deleteBtn.value).toBe('Delete');

    // Mock the fetch API
    fetchMock.mockResponseOnce(JSON.stringify({}));

    // Click the delete button
    const clickEvent = new MouseEvent('click');
    deleteBtn.dispatchEvent(clickEvent);

    // Check that the correct DELETE request was called
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/Logbook/Delete');
    // Checks that it is the correct DELETE requesting being made
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: 'example-id' }),
    });

    // Check that the logbook entry container was removed
    expect(logbookEntryContainer.parentNode).toBeNull();
  });
});